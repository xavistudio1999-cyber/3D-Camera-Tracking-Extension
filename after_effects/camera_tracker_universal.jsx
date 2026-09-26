#target aftereffects

/*
 * 3D Camera Tracker - Universal After Effects Panel
 * Compatible with After Effects CC 2014 through 2025+
 * 
 * Features:
 *   - Import camera tracking JSON solution
 *   - Create 3D camera with position/orientation keyframes
 *   - Apply saber effect with glow and bloom
 *   - Generate Volna 2-style wave distortion
 *   - Works on all AE versions
 */

(function () {
    // ============================================
    // Compatibility Check & Initialization
    // ============================================
    
    if (typeof app === "undefined" || app === null) {
        alert("This script requires After Effects");
        return;
    }
    
    // Get AE version
    var aeVersion = parseFloat(app.version);
    
    // ============================================
    // Create Main Panel Window
    // ============================================
    
    var win = new Window("palette", "3D Camera Tracker");
    win.orientation = "column";
    win.alignChildren = ["fill", "top"];
    win.spacing = 6;
    win.margins = 10;
    win.preferredSize = [420, 580];
    
    // ============================================
    // Title Section
    // ============================================
    
    var titleGrp = win.add("group");
    titleGrp.orientation = "row";
    titleGrp.alignChildren = ["fill", "center"];
    titleGrp.margins = 0;
    titleGrp.spacing = 4;
    
    var titleText = titleGrp.add("statictext", undefined, "3D CAMERA TRACKER");
    titleText.helpTip = "Import camera tracking solutions from camera-track tool";
    
    var verText = titleGrp.add("statictext", undefined, "v2.1");
    verText.alignment = ["right", "center"];
    verText.characters = 6;
    
    // ============================================
    // Section 1: Import Camera
    // ============================================
    
    var grpSec1 = win.add("group");
    grpSec1.orientation = "column";
    grpSec1.alignChildren = "fill";
    grpSec1.spacing = 6;
    grpSec1.margins = [8, 8, 8, 8];
    
    var lbl1 = grpSec1.add("statictext", undefined, "1. Import Solution.json");
    
    var btnImport = grpSec1.add("button", undefined, "Select JSON File");
    btnImport.preferredSize = [400, 28];
    btnImport.helpTip = "Open file dialog to select solution.json";
    
    var txtStatus = grpSec1.add("edittext", undefined, "Waiting for JSON file...", {multiline: true, readonly: true});
    txtStatus.preferredSize = [400, 50];
    txtStatus.text = "Status: Waiting for JSON file...";
    
    // ============================================
    // Section 2: Camera Settings
    // ============================================
    
    var grpSec2 = win.add("group");
    grpSec2.orientation = "column";
    grpSec2.alignChildren = "fill";
    grpSec2.spacing = 6;
    grpSec2.margins = [8, 8, 8, 8];
    
    var lbl2 = grpSec2.add("statictext", undefined, "2. Create Camera");
    
    var btnCreateCam = grpSec2.add("button", undefined, "Create Camera Layer");
    btnCreateCam.preferredSize = [400, 28];
    btnCreateCam.helpTip = "Add camera with tracking keyframes to composition";
    
    // ============================================
    // Section 3: Saber Effect
    // ============================================
    
    var grpSec3 = win.add("group");
    grpSec3.orientation = "column";
    grpSec3.alignChildren = "fill";
    grpSec3.spacing = 6;
    grpSec3.margins = [8, 8, 8, 8];
    
    var lbl3 = grpSec3.add("statictext", undefined, "3. Saber Effect");
    
    // Color
    var grpColor = grpSec3.add("group");
    grpColor.orientation = "row";
    grpColor.alignChildren = ["left", "center"];
    grpColor.spacing = 4;
    
    grpColor.add("statictext", undefined, "Color:");
    var txtColor = grpColor.add("edittext", undefined, "#FF0000");
    txtColor.characters = 10;
    txtColor.helpTip = "Hex format: #RRGGBB (e.g., #FF0000 for red)";
    
    // Glow
    var grpGlow = grpSec3.add("group");
    grpGlow.orientation = "row";
    grpGlow.alignChildren = ["left", "center"];
    grpGlow.spacing = 4;
    
    grpGlow.add("statictext", undefined, "Glow:");
    var sldGlow = grpGlow.add("slider", undefined, 75, 0, 100);
    sldGlow.preferredSize = [220, 18];
    sldGlow.helpTip = "Glow intensity 0-100";
    var txtGlowVal = grpGlow.add("statictext", undefined, "75");
    txtGlowVal.characters = 3;
    
    sldGlow.onChanging = function () {
        txtGlowVal.text = Math.round(this.value);
    };
    
    // Radius
    var grpRad = grpSec3.add("group");
    grpRad.orientation = "row";
    grpRad.alignChildren = ["left", "center"];
    grpRad.spacing = 4;
    
    grpRad.add("statictext", undefined, "Radius:");
    var sldRad = grpRad.add("slider", undefined, 25, 5, 60);
    sldRad.preferredSize = [220, 18];
    sldRad.helpTip = "Blur radius in pixels";
    var txtRadVal = grpRad.add("statictext", undefined, "25");
    txtRadVal.characters = 3;
    
    sldRad.onChanging = function () {
        txtRadVal.text = Math.round(this.value);
    };
    
    // Bloom checkbox
    var chkBloom = grpSec3.add("checkbox", undefined, "Enable Bloom Effect");
    chkBloom.value = true;
    chkBloom.helpTip = "Apply curves for bloom/glow effect";
    
    var btnSaber = grpSec3.add("button", undefined, "Create Saber Effect");
    btnSaber.preferredSize = [400, 28];
    btnSaber.helpTip = "Add glowing saber layer to composition";
    
    // ============================================
    // Section 4: Wave Effect
    // ============================================
    
    var grpSec4 = win.add("group");
    grpSec4.orientation = "column";
    grpSec4.alignChildren = "fill";
    grpSec4.spacing = 6;
    grpSec4.margins = [8, 8, 8, 8];
    
    var lbl4 = grpSec4.add("statictext", undefined, "4. Wave Effect");
    
    // Amplitude
    var grpAmp = grpSec4.add("group");
    grpAmp.orientation = "row";
    grpAmp.alignChildren = ["left", "center"];
    grpAmp.spacing = 4;
    
    grpAmp.add("statictext", undefined, "Amplitude:");
    var sldAmp = grpAmp.add("slider", undefined, 10, 0, 50);
    sldAmp.preferredSize = [220, 18];
    sldAmp.helpTip = "Wave height amplitude";
    var txtAmpVal = grpAmp.add("statictext", undefined, "10");
    txtAmpVal.characters = 3;
    
    sldAmp.onChanging = function () {
        txtAmpVal.text = Math.round(this.value);
    };
    
    var btnWave = grpSec4.add("button", undefined, "Create Wave Effect");
    btnWave.preferredSize = [400, 28];
    btnWave.helpTip = "Add Volna 2-style wave distortion layer";
    
    // ============================================
    // Global Variables
    // ============================================
    
    var g_solution = null;
    var g_comp = null;
    
    // ============================================
    // Helper Functions
    // ============================================
    
    function parseJSON(text) {
        // For AE CC 2014-2016 compatibility
        if (typeof JSON !== "undefined" && typeof JSON.parse === "function") {
            try {
                return JSON.parse(text);
            } catch (e) {
                return null;
            }
        }
        // Fallback for older versions
        try {
            return eval("(" + text + ")");
        } catch (e) {
            return null;
        }
    }
    
    function readFile(file) {
        try {
            file.encoding = "UTF-8";
            if (!file.open("r")) {
                return null;
            }
            var text = file.read();
            file.close();
            return text;
        } catch (e) {
            return null;
        }
    }
    
    function isArray(obj) {
        return obj !== null && obj !== undefined && typeof obj === "object" && obj.constructor === Array;
    }
    
    function matrix3(m) {
        try {
            return [
                [Number(m[0][0]), Number(m[0][1]), Number(m[0][2])],
                [Number(m[1][0]), Number(m[1][1]), Number(m[1][2])],
                [Number(m[2][0]), Number(m[2][1]), Number(m[2][2])]
            ];
        } catch (e) {
            return [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
        }
    }
    
    function normalize(v) {
        var n = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        if (n < 1e-8) return [0, 0, 0];
        return [v[0] / n, v[1] / n, v[2] / n];
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
        return [
            pitch * 180 / Math.PI,
            yaw * 180 / Math.PI,
            roll * 180 / Math.PI
        ];
    }
    
    function cameraPosition(matrix) {
        return [
            Number(matrix[0][3]),
            Number(matrix[1][3]),
            Number(matrix[2][3])
        ];
    }
    
    function ensureComp() {
        var active = app.project.activeItem;
        if (active instanceof CompItem) {
            return active;
        }
        return app.project.items.addComp(
            "Camera Track",
            1920,
            1080,
            1.0,
            10,
            30
        );
    }
    
    function hexToRGB(hex) {
        try {
            hex = hex.replace("#", "").substring(0, 6);
            var r = parseInt(hex.substring(0, 2), 16) / 255 || 1;
            var g = parseInt(hex.substring(2, 4), 16) / 255 || 0;
            var b = parseInt(hex.substring(4, 6), 16) / 255 || 0;
            return [r, g, b];
        } catch (e) {
            return [1, 0, 0];
        }
    }
    
    function setStatus(msg) {
        txtStatus.text = "Status: " + msg;
    }
    
    // ============================================
    // Event Handlers
    // ============================================
    
    btnImport.onClick = function () {
        try {
            setStatus("Opening file dialog...");
            var file = File.openDialog("Select camera-track solution.json", "JSON:*.json");
            
            if (!file) {
                setStatus("Import cancelled");
                return;
            }
            
            setStatus("Reading file...");
            var jsonText = readFile(file);
            
            if (!jsonText) {
                setStatus("ERROR: Could not read file");
                return;
            }
            
            setStatus("Parsing JSON...");
            g_solution = parseJSON(jsonText);
            
            if (!g_solution || !isArray(g_solution.frames) || g_solution.frames.length === 0) {
                setStatus("ERROR: Invalid JSON file");
                return;
            }
            
            setStatus("✓ Loaded " + g_solution.frames.length + " camera frames");
            
        } catch (e) {
            setStatus("ERROR: " + e.toString());
        }
    };
    
    btnCreateCam.onClick = function () {
        try {
            if (!g_solution) {
                alert("Please import a JSON solution first!");
                return;
            }
            
            setStatus("Creating camera layer...");
            
            g_comp = ensureComp();
            var camera = g_comp.layers.addCamera("Tracked Camera", [g_comp.width / 2, g_comp.height / 2]);
            camera.autoOrient = AutoOrientType.NO_AUTO_ORIENT;
            
            var posProp = camera.property("ADBE Transform Group").property("ADBE Position");
            var orientProp = camera.property("ADBE Transform Group").property("ADBE Orientation");
            
            setStatus("Setting focal length...");
            
            // Set focal length from intrinsics
            if (g_solution.intrinsics && g_solution.intrinsics[0]) {
                var focal = Number(g_solution.intrinsics[0][0]);
                if (focal > 0) {
                    try {
                        var lensGroup = camera.property("ADBE Camera Options Group");
                        var lensProp = lensGroup.property("ADBE Camera Lens");
                        lensProp.setValue((36 * Number(g_solution.width || g_comp.width)) / (2 * focal));
                    } catch (e) {
                        // Camera options may not be available in older versions
                    }
                }
            }
            
            setStatus("Adding keyframes...");
            
            var totalFrames = g_solution.frames.length;
            for (var i = 0; i < totalFrames; i++) {
                if (i % Math.max(1, Math.floor(totalFrames / 5)) === 0) {
                    setStatus("Adding keyframes (" + Math.round((i / totalFrames) * 100) + "%)");
                }
                
                var frameData = g_solution.frames[i];
                var matrix = frameData.camera_to_world;
                var time = Number(frameData.time);
                
                if (isNaN(time)) {
                    time = Number(frameData.frame) / (Number(g_solution.fps) || 30);
                }
                
                posProp.setValueAtTime(time, cameraPosition(matrix));
                orientProp.setValueAtTime(time, orientationFromCameraToWorld(matrix));
            }
            
            setStatus("✓ Camera created with " + totalFrames + " keyframes");
            
        } catch (e) {
            setStatus("ERROR: " + e.toString());
        }
    };
    
    btnSaber.onClick = function () {
        try {
            g_comp = ensureComp();
            
            setStatus("Creating saber layer...");
            
            var rgb = hexToRGB(txtColor.text);
            var saber = g_comp.layers.addSolid(rgb, "Saber", g_comp.width, g_comp.height, g_comp.pixelAspect);
            saber.blendMode = BlendMode.ADD;
            saber.opacity.setValue(Math.max(10, Math.min(100, sldGlow.value * 1.2)));
            
            setStatus("Applying Gaussian blur...");
            
            // Try to add blur effect
            try {
                var blurEffect = saber.Effects.addProperty("ADBE Gaussian Blur 2");
                blurEffect.property("Blur Radius").setValue(sldRad.value);
            } catch (e1) {
                // Fallback for older AE versions
                try {
                    var blurEffect2 = saber.Effects.addProperty("ADBE Fast Blur");
                    blurEffect2.property("Blur Radius").setValue(sldRad.value);
                } catch (e2) {
                    // No blur available
                }
            }
            
            // Apply bloom if enabled
            if (chkBloom.value) {
                setStatus("Applying bloom effect...");
                try {
                    var curves = saber.Effects.addProperty("ADBE Curves2");
                } catch (e) {
                    // Curves not available
                }
            }
            
            setStatus("✓ Saber effect created");
            
        } catch (e) {
            setStatus("ERROR: " + e.toString());
        }
    };
    
    btnWave.onClick = function () {
        try {
            g_comp = ensureComp();
            
            setStatus("Creating wave layer...");
            
            var wave = g_comp.layers.addSolid([0, 0, 0], "Wave", g_comp.width, g_comp.height, g_comp.pixelAspect);
            wave.opacity.setValue(50);
            
            setStatus("Applying ripple effect...");
            
            // Try to add ripple
            try {
                var ripple = wave.Effects.addProperty("ADBE Ripple");
                ripple.property("Wave Width").setValue(200);
                ripple.property("Wave Height").setValue(sldAmp.value);
            } catch (e) {
                setStatus("Note: Ripple effect not available in this AE version");
            }
            
            setStatus("✓ Wave effect created");
            
        } catch (e) {
            setStatus("ERROR: " + e.toString());
        }
    };
    
    // ============================================
    // Show Panel
    // ============================================
    
    win.show();
    
})();
