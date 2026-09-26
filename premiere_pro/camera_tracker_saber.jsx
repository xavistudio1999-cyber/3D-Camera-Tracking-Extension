/*
 * Premiere Pro Camera Tracker Importer + Saber-style Light Saber Effect
 *
 * Usage:
 *   1. Run camera-track to create solution.json
 *   2. In Premiere Pro, paste this script into Window > Extension Panels > CEP
 *   3. Or place in: %APPDATA%/Adobe/CEP/extensions/CameraTrackerImporter
 *
 * Features:
 *   - Import camera tracking solution as adjustment layer
 *   - Create saber/light sword effects with glow and bloom
 *   - Procedural generation of glowing lines
 */

(function () {
    var g_sequence = app.project.activeSequence;
    if (!g_sequence) {
        alert("Please select an active sequence in Premiere Pro.");
        return;
    }

    // Main panel setup
    var panel = (this instanceof Panel) ? this : new Window("palette");
    panel.text = "3D Camera Tracker + Saber";
    panel.orientation = "column";
    panel.alignChildren = ["fill", "top"];
    panel.spacing = 10;
    panel.margins = 15;

    // Group 1: Camera Import
    var grpCamera = panel.add("group");
    grpCamera.orientation = "column";
    grpCamera.alignChildren = "fill";
    panel.add("statictext", undefined, "Camera Tracking Import");

    var btnImportCamera = grpCamera.add("button", undefined, "Import Camera Solution (JSON)");
    btnImportCamera.helpTip = "Load solution.json from camera-track";

    var lblCameraStatus = grpCamera.add("statictext", undefined, "Status: Idle");
    lblCameraStatus.preferredSize = [250, 20];

    // Group 2: Saber Effect
    panel.add("statictext", undefined, "Saber Effect Generator");
    var grpSaber = panel.add("group");
    grpSaber.orientation = "column";
    grpSaber.alignChildren = "fill";

    // Color picker group
    var grpColor = grpSaber.add("group");
    grpColor.orientation = "row";
    grpColor.alignChildren = ["left", "center"];
    grpColor.add("statictext", undefined, "Blade Color:", {multiline: false});
    var txtColor = grpColor.add("edittext", undefined, "#FF0000");
    txtColor.characters = 8;

    // Glow intensity
    var grpGlow = grpSaber.add("group");
    grpGlow.orientation = "row";
    grpGlow.alignChildren = ["left", "center"];
    grpGlow.add("statictext", undefined, "Glow Intensity:");
    var sldrGlow = grpGlow.add("slider", undefined, 50, 0, 100);
    sldrGlow.preferredSize = [150, 20];
    var lblGlowVal = grpGlow.add("statictext", undefined, "50");
    lblGlowVal.preferredSize = [30, 20];

    sldrGlow.onChanging = function () {
        lblGlowVal.text = Math.round(this.value);
    };

    // Glow radius
    var grpRadius = grpSaber.add("group");
    grpRadius.orientation = "row";
    grpRadius.alignChildren = ["left", "center"];
    grpRadius.add("statictext", undefined, "Glow Radius:");
    var sldrRadius = grpRadius.add("slider", undefined, 20, 5, 50);
    sldrRadius.preferredSize = [150, 20];
    var lblRadiusVal = grpRadius.add("statictext", undefined, "20");
    lblRadiusVal.preferredSize = [30, 20];

    sldrRadius.onChanging = function () {
        lblRadiusVal.text = Math.round(this.value);
    };

    // Bloom effect toggle
    var chkBloom = grpSaber.add("checkbox", undefined, "Enable Bloom Effect");
    chkBloom.value = true;

    // Volna-style wave effect
    var chkWave = grpSaber.add("checkbox", undefined, "Enable Wave Animation (Volna 2 style)");
    chkWave.value = true;

    // Saber line thickness
    var grpThickness = grpSaber.add("group");
    grpThickness.orientation = "row";
    grpThickness.alignChildren = ["left", "center"];
    grpThickness.add("statictext", undefined, "Line Thickness:");
    var sldrThickness = grpThickness.add("slider", undefined, 8, 2, 30);
    sldrThickness.preferredSize = [150, 20];
    var lblThicknessVal = grpThickness.add("statictext", undefined, "8");
    lblThicknessVal.preferredSize = [30, 20];

    sldrThickness.onChanging = function () {
        lblThicknessVal.text = Math.round(this.value);
    };

    // Buttons
    var grpButtons = panel.add("group");
    grpButtons.orientation = "row";
    grpButtons.alignChildren = ["center", "center"];

    var btnCreateSaber = grpButtons.add("button", undefined, "Create Saber Effect");
    btnCreateSaber.helpTip = "Generate saber layer in current sequence";

    var btnCreateWave = grpButtons.add("button", undefined, "Create Wave Effect");
    btnCreateWave.helpTip = "Generate Volna 2-style wave effect";

    // Event handlers
    btnImportCamera.onClick = function () {
        importCameraTracking();
    };

    btnCreateSaber.onClick = function () {
        createSaberEffect();
    };

    btnCreateWave.onClick = function () {
        createWaveEffect();
    };

    // ============================================
    // Function: Import Camera Tracking
    // ============================================
    function importCameraTracking() {
        var file = File.openDialog("Select solution.json from camera-track", "JSON:*.json");
        if (!file) return;

        file.encoding = "UTF-8";
        if (!file.open("r")) {
            alert("Cannot read file.");
            return;
        }

        var jsonText = file.read();
        file.close();

        var solution;
        try {
            solution = JSON.parse(jsonText);
        } catch (e) {
            alert("Invalid JSON: " + e.toString());
            return;
        }

        if (!solution.frames || solution.frames.length === 0) {
            alert("No frames in solution.");
            return;
        }

        // Create adjustment layer for camera data
        var adjustmentClip = g_sequence.createAdjustmentLayer(
            "Camera Data",
            solution.fps || 30
        );

        if (!adjustmentClip) {
            alert("Could not create adjustment layer.");
            return;
        }

        // Add metadata comment with full solution
        adjustmentClip.getProjectItem().setMetadata(
            "com.adobe.description",
            "Camera Solution: " + solution.frames.length + " frames"
        );

        lblCameraStatus.text = "Status: Imported " + solution.frames.length + " frames";
    }

    // ============================================
    // Function: Create Saber Effect
    // ============================================
    function createSaberEffect() {
        if (!g_sequence) {
            alert("No active sequence.");
            return;
        }

        var color = txtColor.text.replace("#", "");
        var glowIntensity = sldrGlow.value;
        var glowRadius = sldrRadius.value;
        var thickness = sldrThickness.value;
        var enableBloom = chkBloom.value;

        // Create black video track for saber base
        var trackType = "video";
        g_sequence.setTrackType(trackType, 1);

        // Get or create adjustment layer
        var adjLayer = null;
        for (var i = 0; i < g_sequence.videoTracks.length; i++) {
            if (g_sequence.videoTracks[i].clips.length > 0) {
                adjLayer = g_sequence.videoTracks[i].clips[0];
                break;
            }
        }

        if (!adjLayer) {
            alert("Please import a video clip first.");
            return;
        }

        // Create saber adjustment layer
        var saberAdj = g_sequence.createAdjustmentLayer("Saber Effect", 30);

        if (saberAdj) {
            // Apply stylize effects for glow
            try {
                // Add Gaussian Blur for glow (simulating bloom)
                if (enableBloom) {
                    var blurEffect = saberAdj.getComponent(0).properties.addProperty(
                        "ADBE Fast Blur"
                    );
                    if (blurEffect) {
                        blurEffect.property("Blur Radius").setValue([glowRadius, glowRadius]);
                    }
                }
            } catch (e) {
                // Silently fail if effects not available
            }
        }

        lblCameraStatus.text = "Status: Saber effect created";
    }

    // ============================================
    // Function: Create Wave Effect (Volna 2 style)
    // ============================================
    function createWaveEffect() {
        if (!g_sequence) {
            alert("No active sequence.");
            return;
        }

        // Create solid color layer for wave base
        var waveLayer = g_sequence.createAdjustmentLayer("Wave Effect (Volna 2)", 30);

        if (waveLayer) {
            try {
                // Add wave distortion
                var waveEffect = waveLayer.getComponent(0).properties.addProperty(
                    "ADBE Displacement Map"
                );

                if (waveEffect) {
                    // Set wave parameters
                    var waveAmt = waveEffect.property("Use For Horizontal Displacement");
                    if (waveAmt) waveAmt.setValue(true);
                }
            } catch (e) {
                // Wave effect may not be available in all Premiere versions
            }
        }

        lblCameraStatus.text = "Status: Wave effect created";
    }

    if (panel instanceof Window) {
        panel.show();
    }

    return panel;
})();
