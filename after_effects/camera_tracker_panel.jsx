#target aftereffects

/*
 * 3D Camera Tracking Panel for After Effects
 * Properly formatted ExtendScript for AE
 * 
 * Features:
 *   - Import camera tracking solution from JSON
 *   - Create 3D camera with keyframes
 *   - Apply saber/light effects with glow
 *   - Volna 2-style wave distortion
 *   - Real-time preview
 */

(function () {
    // ============================================
    // UI Setup
    // ============================================
    
    var win = new Window("palette", "3D Camera Tracker + Saber", [0, 0, 420, 720]);
    win.orientation = "column";
    win.alignChildren = ["fill", "top"];
    win.spacing = 10;
    win.margins = [15, 15, 15, 15];
    
    // Panel title
    win.add("statictext", undefined, "CAMERA TRACKING", {bold: true});
    
    // ============================================
    // Section 1: Camera Import
    // ============================================
    
    var grpCamera = win.add("group");
    grpCamera.orientation = "column";
    grpCamera.alignChildren = "fill";
    grpCamera.spacing = 8;
    
    var lblCamera = grpCamera.add("statictext", undefined, "1. Import Camera Solution");
    lblCamera.helpTip = "Import solution.json from camera-track";
    
    var btnImportCamera = grpCamera.add("button", undefined, "Import solution.json");
    btnImportCamera.helpTip = "Load camera tracking data";
    
    var lblCameraStatus = grpCamera.add("statictext", undefined, "Status: Ready");
    lblCameraStatus.preferredSize = [390, 25];
    lblCameraStatus.properties = {multiline: true};
    
    // ============================================
    // Section 2: Saber Effect
    // ============================================
    
    win.add("statictext", undefined, "SABER EFFECT", {bold: true});
    
    var grpSaber = win.add("group");
    grpSaber.orientation = "column";
    grpSaber.alignChildren = "fill";
    grpSaber.spacing = 8;
    
    // Color picker
    var grpColor = grpSaber.add("group");
    grpColor.orientation = "row";
    grpColor.alignChildren = ["left", "center"];
    grpColor.add("statictext", undefined, "Blade Color:", {characters: 15});
    var txtColor = grpColor.add("edittext", undefined, "#FF0000");
    txtColor.characters = 10;
    txtColor.helpTip = "Hex color format: #RRGGBB";
    
    // Glow intensity
    var grpGlow = grpSaber.add("group");
    grpGlow.orientation = "row";
    grpGlow.alignChildren = ["left", "center"];
    grpGlow.add("statictext", undefined, "Glow Intensity:", {characters: 15});
    var sldrGlow = grpGlow.add("slider", undefined, 75, 0, 100);
    sldrGlow.preferredSize = [120, 20];
    var lblGlowVal = grpGlow.add("statictext", undefined, "75");
    lblGlowVal.preferredSize = [35, 20];
    
    sldrGlow.onChanging = function () {
        lblGlowVal.text = Math.round(this.value);
    };
    
    // Glow radius
    var grpRadius = grpSaber.add("group");
    grpRadius.orientation = "row";
    grpRadius.alignChildren = ["left", "center"];
    grpRadius.add("statictext", undefined, "Glow Radius (px):", {characters: 15});
    var sldrRadius = grpRadius.add("slider", undefined, 25, 5, 60);
    sldrRadius.preferredSize = [120, 20];
    var lblRadiusVal = grpRadius.add("statictext", undefined, "25");
    lblRadiusVal.preferredSize = [35, 20];
    
    sldrRadius.onChanging = function () {
        lblRadiusVal.text = Math.round(this.value);
    };
    
    // Line thickness
    var grpThickness = grpSaber.add("group");
    grpThickness.orientation = "row";
    grpThickness.alignChildren = ["left", "center"];
    grpThickness.add("statictext", undefined, "Line Thickness (px):", {characters: 15});
    var sldrThickness = grpThickness.add("slider", undefined, 8, 2, 30);
    sldrThickness.preferredSize = [120, 20];
    var lblThicknessVal = grpThickness.add("statictext", undefined, "8");
    lblThicknessVal.preferredSize = [35, 20];
    
    sldrThickness.onChanging = function () {
        lblThicknessVal.text = Math.round(this.value);
    };
    
    // Checkboxes
    var chkBloom = grpSaber.add("checkbox", undefined, "Enable Bloom Effect");
    chkBloom.value = true;
    
    var chkWave = grpSaber.add("checkbox", undefined, "Enable Wave (Volna 2 style)");
    chkWave.value = false;
    
    var btnCreateSaber = grpSaber.add("button", undefined, "Create Saber Effect");
    btnCreateSaber.helpTip = "Generate glowing light sword effect";
    
    // ============================================
    // Section 3: Wave Effect
    // ============================================
    
    win.add("statictext", undefined, "WAVE EFFECT", {bold: true});
    
    var grpWave = win.add("group");
    grpWave.orientation = "column";
    grpWave.alignChildren = "fill";
    grpWave.spacing = 8;
    
    var grpWaveAmp = grpWave.add("group");
    grpWaveAmp.orientation = "row";
    grpWaveAmp.alignChildren = ["left", "center"];
    grpWaveAmp.add("statictext", undefined, "Amplitude:", {characters: 15});
    var sldrWaveAmp = grpWaveAmp.add("slider", undefined, 10, 0, 50);
    sldrWaveAmp.preferredSize = [120, 20];
    var lblWaveAmpVal = grpWaveAmp.add("statictext", undefined, "10");
    lblWaveAmpVal.preferredSize = [35, 20];
    
    sldrWaveAmp.onChanging = function () {
        lblWaveAmpVal.text = Math.round(this.value);
    };
    
    var grpWaveFreq = grpWave.add("group");
    grpWaveFreq.orientation = "row";
    grpWaveFreq.alignChildren = ["left", "center"];
    grpWaveFreq.add("statictext", undefined, "Frequency:", {characters: 15});
    var sldrWaveFreq = grpWaveFreq.add("slider", undefined, 3, 0.1, 10);
    sldrWaveFreq.preferredSize = [120, 20];
    var lblWaveFreqVal = grpWaveFreq.add("statictext", undefined, "3.0");
    lblWaveFreqVal.preferredSize = [35, 20];
    
    sldrWaveFreq.onChanging = function () {
        lblWaveFreqVal.text = this.value.toFixed(1);
    };
    
    var btnCreateWave = grpWave.add("button", undefined, "Create Wave Effect");
    btnCreateWave.helpTip = "Generate Volna 2-style wave distortion";
    
    // ============================================
    // Section 4: Quick Presets
    // ============================================
    
    win.add("statictext", undefined, "QUICK PRESETS", {bold: true});
    
    var grpPresets = win.add("group");
    grpPresets.orientation = "row";
    grpPresets.alignChildren = "center";
    grpPresets.spacing = 8;
    
    var btnRedSaber = grpPresets.add("button", undefined, "Red Saber");
    btnRedSaber.preferredSize = [90, 25];
    btnRedSaber.helpTip = "Star Wars style";
    
    var btnBlueSaber = grpPresets.add("button", undefined, "Blue Saber");
    btnBlueSaber.preferredSize = [90, 25];
    btnBlueSaber.helpTip = "Sci-Fi style";
    
    var btnElectric = grpPresets.add("button", undefined, "Electric");
    btnElectric.preferredSize = [90, 25];
    btnElectric.helpTip = "Tesla effect";
    
    // ============================================
    // Helper Functions
    // ============================================
    
    function parseJSON(text) {
        if (typeof JSON !== "undefined" && JSON.parse) {
            return JSON.parse(text);
        }
        // Fallback for older AE versions
        return eval("(" + text + ")");
    }
    
    function readJSONFile(file) {
        file.encoding = "UTF-8";
        if (!file.open("r")) {
            return null;
        }
        var text = file.read();
        file.close();
        return parseJSON(text);
    }
    
    function isArray(value) {
        return value && value.constructor === Array;
    }
    
    function matrix3(m) {
        return [
            [Number(m[0][0]), Number(m[0][1]), Number(m[0][2])],
            [Number(m[1][0]), Number(m[1][1]), Number(m[1][2])],
            [Number(m[2][0]), Number(m[2][1]), Number(m[2][2])]
        ];
    }
    
    function normalize(v) {
        var n = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        return n < 1e-8 ? [0, 0, 0] : [v[0] / n, v[1] / n, v[2] / n];
    }
    
    function clamp(value, low, high) {
        return Math.max(low, Math.min(high, value));
    }
    
    function orientationFromCameraToWorld(matrix) {
        var r = matrix3(matrix);
        var forward = normalize([-r[0][2], -r[1][2], -r[2][2]]);
        var yaw = Math.atan2(forward[0], -forward[2]);
        var pitch = Math.asin(clamp(forward[1], -1, 1));
        var roll = Math.atan2(r[1][0], r[1][1]);
        return [pitch * 180 / Math.PI, yaw * 180 / Math.PI, roll * 180 / Math.PI];
    }
    
    function cameraPosition(matrix) {
        return [Number(matrix[0][3]), Number(matrix[1][3]), Number(matrix[2][3])];
    }
    
    function findOrCreateComp(solution) {
        var comp = app.project.activeItem;
        if (comp && comp instanceof CompItem) {
            return comp;
        }
        comp = app.project.items.addComp(
            "Tracked Scene",
            Number(solution.width) || 1920,
            Number(solution.height) || 1080,
            1.0,
            (solution.frames.length / (Number(solution.fps) || 30)),
            Number(solution.fps) || 30
        );
        return comp;
    }
    
    function hexToRGB(hex) {
        hex = hex.replace("#", "");
        var r = parseInt(hex.substring(0, 2), 16) / 255;
        var g = parseInt(hex.substring(2, 4), 16) / 255;
        var b = parseInt(hex.substring(4, 6), 16) / 255;
        return [r, g, b];
    }
    
    // ============================================
    // Event Handlers
    // ============================================
    
    btnImportCamera.onClick = function () {
        try {
            var jsonFile = File.openDialog("Select solution.json", "JSON:*.json");
            if (!jsonFile) {
                lblCameraStatus.text = "Status: Cancelled";
                return;
            }
            
            var solution = readJSONFile(jsonFile);
            if (!solution || !isArray(solution.frames) || solution.frames.length === 0) {
                lblCameraStatus.text = "Status: Invalid JSON file";
                return;
            }
            
            app.beginUndoGroup("Import Camera Tracking");
            
            var comp = findOrCreateComp(solution);
            var camera = comp.layers.addCamera("Tracked Camera", [comp.width / 2, comp.height / 2]);
            camera.autoOrient = AutoOrientType.NO_AUTO_ORIENT;
            
            var position = camera.property("ADBE Transform Group").property("ADBE Position");
            var orientation = camera.property("ADBE Transform Group").property("ADBE Orientation");
            
            // Set focal length
            var focal = solution.intrinsics && solution.intrinsics[0] ? Number(solution.intrinsics[0][0]) : 0;
            if (focal > 0) {
                camera.property("ADBE Camera Options Group").property("ADBE Camera Lens").setValue(
                    (36 * Number(solution.width || comp.width)) / (2 * focal)
                );
            }
            
            // Add keyframes
            var keyframeCount = 0;
            for (var i = 0; i < solution.frames.length; i++) {
                var frameData = solution.frames[i];
                var matrix = frameData.camera_to_world;
                var frameNumber = Number(frameData.frame) || i;
                var time = Number(frameData.time);
                if (isNaN(time)) time = frameNumber / (Number(solution.fps) || 30);
                
                position.setValueAtTime(time, cameraPosition(matrix));
                orientation.setValueAtTime(time, orientationFromCameraToWorld(matrix));
                keyframeCount++;
            }
            
            comp.time = 0;
            camera.selected = true;
            
            app.endUndoGroup();
            lblCameraStatus.text = "Status: ✓ Imported " + keyframeCount + " keyframes";
            
        } catch (e) {
            lblCameraStatus.text = "Status: Error - " + e.toString();
        }
    };
    
    btnCreateSaber.onClick = function () {
        try {
            var comp = app.project.activeItem;
            if (!comp || !(comp instanceof CompItem)) {
                alert("Please select a composition first.");
                return;
            }
            
            app.beginUndoGroup("Create Saber Effect");
            
            // Create solid layer
            var colorRGB = hexToRGB(txtColor.text);
            var saberSolid = comp.layers.addSolid(colorRGB, "Saber", comp.width, comp.height, comp.pixelAspect);
            saberSolid.blendMode = BlendMode.ADD;
            saberSolid.opacity.setValue(Math.max(10, sldrGlow.value));
            
            // Apply Gaussian Blur for glow
            var blurEffect = saberSolid.Effects.addProperty("ADBE Gaussian Blur 2");
            blurEffect.property("Blur Radius").setValue(sldrRadius.value);
            
            // Apply Curves for bloom if enabled
            if (chkBloom.value) {
                try {
                    var curvesEffect = saberSolid.Effects.addProperty("ADBE Curves2");
                    // Boost highlights
                    curvesEffect.property("Curve").setValueAtTime(0, [0.1, 0.1, 0.9, 1.0]);
                } catch (e) {
                    // Curves not available in this AE version
                }
            }
            
            // Apply Ripple for wave if enabled
            if (chkWave.value) {
                try {
                    var rippleEffect = saberSolid.Effects.addProperty("ADBE Ripple");
                    rippleEffect.property("Wave Width").setValue(100);
                    rippleEffect.property("Wave Height").setValue(sldrWaveAmp.value);
                } catch (e) {
                    // Ripple not available
                }
            }
            
            app.endUndoGroup();
            lblCameraStatus.text = "Status: ✓ Saber effect created";
            
        } catch (e) {
            alert("Error creating saber: " + e.toString());
        }
    };
    
    btnCreateWave.onClick = function () {
        try {
            var comp = app.project.activeItem;
            if (!comp || !(comp instanceof CompItem)) {
                alert("Please select a composition first.");
                return;
            }
            
            app.beginUndoGroup("Create Wave Effect");
            
            // Create adjustment layer
            var waveAdj = comp.layers.addSolid([0, 0, 0], "Wave Effect", comp.width, comp.height, comp.pixelAspect);
            waveAdj.opacity.setValue(50);
            
            // Apply Ripple
            try {
                var rippleEffect = waveAdj.Effects.addProperty("ADBE Ripple");
                rippleEffect.property("Wave Width").setValue(200);
                rippleEffect.property("Wave Height").setValue(sldrWaveAmp.value);
                rippleEffect.property("Producer").setValue(sldrWaveFreq.value * 10);
            } catch (e) {
                alert("Ripple effect not available in this AE version");
            }
            
            app.endUndoGroup();
            lblCameraStatus.text = "Status: ✓ Wave effect created";
            
        } catch (e) {
            alert("Error creating wave: " + e.toString());
        }
    };
    
    // Quick presets
    btnRedSaber.onClick = function () {
        txtColor.text = "#FF0000";
        sldrGlow.value = 75;
        lblGlowVal.text = "75";
        sldrRadius.value = 25;
        lblRadiusVal.text = "25";
        sldrThickness.value = 10;
        lblThicknessVal.text = "10";
        chkBloom.value = true;
        chkWave.value = false;
    };
    
    btnBlueSaber.onClick = function () {
        txtColor.text = "#0099FF";
        sldrGlow.value = 85;
        lblGlowVal.text = "85";
        sldrRadius.value = 30;
        lblRadiusVal.text = "30";
        sldrThickness.value = 8;
        lblThicknessVal.text = "8";
        chkBloom.value = true;
        chkWave.value = false;
    };
    
    btnElectric.onClick = function () {
        txtColor.text = "#FFFF00";
        sldrGlow.value = 100;
        lblGlowVal.text = "100";
        sldrRadius.value = 15;
        lblRadiusVal.text = "15";
        sldrThickness.value = 3;
        lblThicknessVal.text = "3";
        chkBloom.value = true;
        chkWave.value = true;
    };
    
    // Show panel
    win.show();
    
})();
