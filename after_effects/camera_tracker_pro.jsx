#target aftereffects

/*
 * 3D Camera Tracker - Professional After Effects Panel
 * Import camera tracking JSON and create saber/wave effects
 * Panel UI matches professional AE standards
 */

(function () {
    // ============================================
    // Global Variables
    // ============================================
    
    var g_comp = null;
    var g_solution = null;
    var g_camera = null;
    
    // ============================================
    // Create Main Window/Panel
    // ============================================
    
    var win = new Window("palette", "3D Camera Tracker");
    win.orientation = "column";
    win.alignChildren = ["fill", "top"];
    win.spacing = 0;
    win.margins = 0;
    
    // ============================================
    // Header/Title Bar
    // ============================================
    
    var headerGroup = win.add("group");
    headerGroup.orientation = "row";
    headerGroup.alignChildren = ["fill", "center"];
    headerGroup.size = [420, 40];
    headerGroup.margins = [12, 10, 12, 10];
    headerGroup.spacing = 8;
    headerGroup.graphics.backgroundColor = headerGroup.graphics.newBrush(headerGroup.graphics.BrushType.SOLID_COLOR, [0.2, 0.2, 0.2], 1);
    
    var titleText = headerGroup.add("statictext", undefined, "3D CAMERA TRACKER");
    titleText.graphics.font = ScriptUI.createFont("Arial", 14, "bold");
    
    var versionText = headerGroup.add("statictext", undefined, "v2.0");
    versionText.graphics.font = ScriptUI.createFont("Arial", 9);
    versionText.alignment = ["right", "center"];
    
    // ============================================
    // Scrollable Content Area
    // ============================================
    
    var scrollGroup = win.add("group");
    scrollGroup.orientation = "column";
    scrollGroup.alignChildren = "fill";
    scrollGroup.spacing = 0;
    scrollGroup.margins = 0;
    scrollGroup.size = [420, 550];
    
    // Outer container for scrolling
    var outerContainer = scrollGroup.add("group");
    outerContainer.orientation = "column";
    outerContainer.alignChildren = "fill";
    outerContainer.spacing = 0;
    outerContainer.margins = 0;
    
    // ============================================
    // Section 1: Camera Import
    // ============================================
    
    var sec1 = outerContainer.add("group");
    sec1.orientation = "column";
    sec1.alignChildren = "fill";
    sec1.spacing = 8;
    sec1.margins = [12, 12, 12, 8];
    
    var sec1Title = sec1.add("statictext", undefined, "CAMERA IMPORT");
    sec1Title.graphics.font = ScriptUI.createFont("Arial", 11, "bold");
    
    var btnImport = sec1.add("button", undefined, "📁 Select solution.json");
    btnImport.preferredSize = [396, 32];
    btnImport.helpTip = "Import camera tracking data from JSON file";
    
    var statusText = sec1.add("edittext", undefined, "Status: Ready to import", {multiline: true, readonly: true});
    statusText.preferredSize = [396, 50];
    statusText.graphics.backgroundColor = statusText.graphics.newBrush(statusText.graphics.BrushType.SOLID_COLOR, [0.15, 0.15, 0.15], 1);
    
    // ============================================
    // Section 2: Saber Effect
    // ============================================
    
    var divider1 = outerContainer.add("group");
    divider1.size = [420, 1];
    divider1.margins = 0;
    divider1.graphics.backgroundColor = divider1.graphics.newBrush(divider1.graphics.BrushType.SOLID_COLOR, [0.3, 0.3, 0.3], 1);
    
    var sec2 = outerContainer.add("group");
    sec2.orientation = "column";
    sec2.alignChildren = "fill";
    sec2.spacing = 8;
    sec2.margins = [12, 12, 12, 8];
    
    var sec2Title = sec2.add("statictext", undefined, "SABER EFFECT");
    sec2Title.graphics.font = ScriptUI.createFont("Arial", 11, "bold");
    
    // Color group
    var colorGroup = sec2.add("group");
    colorGroup.orientation = "row";
    colorGroup.alignChildren = ["fill", "center"];
    colorGroup.spacing = 8;
    
    colorGroup.add("statictext", [0, 0, 100, 20], "Blade Color:");
    var colorInput = colorGroup.add("edittext", [100, 0, 160, 20], "#FF0000");
    colorInput.characters = 8;
    colorInput.helpTip = "Hex format: #RRGGBB";
    
    var colorPreview = colorGroup.add("group", [160, 0, 396, 20]);
    colorPreview.graphics.backgroundColor = colorPreview.graphics.newBrush(colorPreview.graphics.BrushType.SOLID_COLOR, [1, 0, 0], 1);
    
    // Glow intensity
    var glowGroup = sec2.add("group");
    glowGroup.orientation = "row";
    glowGroup.alignChildren = ["fill", "center"];
    glowGroup.spacing = 8;
    
    glowGroup.add("statictext", [0, 0, 100, 20], "Glow Intensity:");
    var glowSlider = glowGroup.add("slider", [100, 0, 330, 20], 75, 0, 100);
    glowSlider.helpTip = "0 = No glow, 100 = Maximum glow";
    var glowValue = glowGroup.add("statictext", [330, 0, 396, 20], "75%");
    glowValue.alignment = ["right", "center"];
    
    glowSlider.onChanging = function () {
        glowValue.text = Math.round(this.value) + "%";
    };
    
    // Glow radius
    var radiusGroup = sec2.add("group");
    radiusGroup.orientation = "row";
    radiusGroup.alignChildren = ["fill", "center"];
    radiusGroup.spacing = 8;
    
    radiusGroup.add("statictext", [0, 0, 100, 20], "Glow Radius (px):");
    var radiusSlider = radiusGroup.add("slider", [100, 0, 330, 20], 25, 5, 60);
    radiusSlider.helpTip = "5px = Sharp, 60px = Heavy bloom";
    var radiusValue = radiusGroup.add("statictext", [330, 0, 396, 20], "25px");
    radiusValue.alignment = ["right", "center"];
    
    radiusSlider.onChanging = function () {
        radiusValue.text = Math.round(this.value) + "px";
    };
    
    // Line thickness
    var thicknessGroup = sec2.add("group");
    thicknessGroup.orientation = "row";
    thicknessGroup.alignChildren = ["fill", "center"];
    thicknessGroup.spacing = 8;
    
    thicknessGroup.add("statictext", [0, 0, 100, 20], "Line Thickness:");
    var thicknessSlider = thicknessGroup.add("slider", [100, 0, 330, 20], 8, 2, 30);
    thicknessSlider.helpTip = "2px = Thin laser, 30px = Thick beam";
    var thicknessValue = thicknessGroup.add("statictext", [330, 0, 396, 20], "8px");
    thicknessValue.alignment = ["right", "center"];
    
    thicknessSlider.onChanging = function () {
        thicknessValue.text = Math.round(this.value) + "px";
    };
    
    // Checkboxes
    var chkBloom = sec2.add("checkbox", undefined, "✓ Enable Bloom Effect");
    chkBloom.value = true;
    
    var chkWave = sec2.add("checkbox", undefined, "  Enable Wave Animation");
    chkWave.value = false;
    
    // Create button
    var btnSaber = sec2.add("button", undefined, "✨ Create Saber Effect");
    btnSaber.preferredSize = [396, 32];
    
    // ============================================
    // Section 3: Wave Effect
    // ============================================
    
    var divider2 = outerContainer.add("group");
    divider2.size = [420, 1];
    divider2.margins = 0;
    divider2.graphics.backgroundColor = divider2.graphics.newBrush(divider2.graphics.BrushType.SOLID_COLOR, [0.3, 0.3, 0.3], 1);
    
    var sec3 = outerContainer.add("group");
    sec3.orientation = "column";
    sec3.alignChildren = "fill";
    sec3.spacing = 8;
    sec3.margins = [12, 12, 12, 8];
    
    var sec3Title = sec3.add("statictext", undefined, "WAVE EFFECT (VOLNA 2)");
    sec3Title.graphics.font = ScriptUI.createFont("Arial", 11, "bold");
    
    // Wave amplitude
    var ampGroup = sec3.add("group");
    ampGroup.orientation = "row";
    ampGroup.alignChildren = ["fill", "center"];
    ampGroup.spacing = 8;
    
    ampGroup.add("statictext", [0, 0, 100, 20], "Amplitude:");
    var ampSlider = ampGroup.add("slider", [100, 0, 330, 20], 10, 0, 50);
    var ampValue = ampGroup.add("statictext", [330, 0, 396, 20], "10");
    ampValue.alignment = ["right", "center"];
    
    ampSlider.onChanging = function () {
        ampValue.text = Math.round(this.value);
    };
    
    // Wave frequency
    var freqGroup = sec3.add("group");
    freqGroup.orientation = "row";
    freqGroup.alignChildren = ["fill", "center"];
    freqGroup.spacing = 8;
    
    freqGroup.add("statictext", [0, 0, 100, 20], "Frequency:");
    var freqSlider = freqGroup.add("slider", [100, 0, 330, 20], 3, 0.1, 10);
    var freqValue = freqGroup.add("statictext", [330, 0, 396, 20], "3.0");
    freqValue.alignment = ["right", "center"];
    
    freqSlider.onChanging = function () {
        freqValue.text = this.value.toFixed(1);
    };
    
    var btnWave = sec3.add("button", undefined, "🌊 Create Wave Effect");
    btnWave.preferredSize = [396, 32];
    
    // ============================================
    // Section 4: Quick Presets
    // ============================================
    
    var divider3 = outerContainer.add("group");
    divider3.size = [420, 1];
    divider3.margins = 0;
    divider3.graphics.backgroundColor = divider3.graphics.newBrush(divider3.graphics.BrushType.SOLID_COLOR, [0.3, 0.3, 0.3], 1);
    
    var sec4 = outerContainer.add("group");
    sec4.orientation = "column";
    sec4.alignChildren = "fill";
    sec4.spacing = 8;
    sec4.margins = [12, 12, 12, 12];
    
    var sec4Title = sec4.add("statictext", undefined, "QUICK PRESETS");
    sec4Title.graphics.font = ScriptUI.createFont("Arial", 11, "bold");
    
    var presetGroup = sec4.add("group");
    presetGroup.orientation = "row";
    presetGroup.alignChildren = "fill";
    presetGroup.spacing = 8;
    
    var btnRed = presetGroup.add("button", undefined, "🔴 Red");
    btnRed.preferredSize = [130, 28];
    btnRed.helpTip = "Star Wars style";
    
    var btnBlue = presetGroup.add("button", undefined, "🔵 Blue");
    btnBlue.preferredSize = [130, 28];
    btnBlue.helpTip = "Sci-Fi Jedi style";
    
    var btnElec = presetGroup.add("button", undefined, "⚡ Electric");
    btnElec.preferredSize = [130, 28];
    btnElec.helpTip = "Tesla/Lightning effect";
    
    // ============================================
    // Helper Functions
    // ============================================
    
    function updateColorPreview(hexColor) {
        try {
            var hex = hexColor.replace("#", "");
            var r = parseInt(hex.substring(0, 2), 16) / 255;
            var g = parseInt(hex.substring(2, 4), 16) / 255;
            var b = parseInt(hex.substring(4, 6), 16) / 255;
            colorPreview.graphics.backgroundColor = colorPreview.graphics.newBrush(
                colorPreview.graphics.BrushType.SOLID_COLOR, [r, g, b], 1
            );
        } catch (e) {
            // Invalid hex color
        }
    }
    
    function parseJSON(text) {
        if (typeof JSON !== "undefined" && JSON.parse) {
            return JSON.parse(text);
        }
        return eval("(" + text + ")");
    }
    
    function readJSONFile(file) {
        file.encoding = "UTF-8";
        if (!file.open("r")) return null;
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
        if (comp && comp instanceof CompItem) return comp;
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
    
    colorInput.onChanging = function () {
        updateColorPreview(this.text);
    };
    
    updateColorPreview(colorInput.text);
    
    btnImport.onClick = function () {
        try {
            statusText.text = "Status: Opening file dialog...";
            var jsonFile = File.openDialog("Select solution.json from camera-track", "JSON:*.json");
            
            if (!jsonFile) {
                statusText.text = "Status: Import cancelled by user";
                return;
            }
            
            statusText.text = "Status: Reading file...";
            g_solution = readJSONFile(jsonFile);
            
            if (!g_solution || !isArray(g_solution.frames) || g_solution.frames.length === 0) {
                statusText.text = "Status: ERROR - Invalid JSON file!";
                return;
            }
            
            statusText.text = "Status: Creating composition...";
            app.beginUndoGroup("Import Camera Tracking");
            
            g_comp = findOrCreateComp(g_solution);
            g_camera = g_comp.layers.addCamera("Tracked Camera", [g_comp.width / 2, g_comp.height / 2]);
            g_camera.autoOrient = AutoOrientType.NO_AUTO_ORIENT;
            
            var position = g_camera.property("ADBE Transform Group").property("ADBE Position");
            var orientation = g_camera.property("ADBE Transform Group").property("ADBE Orientation");
            
            statusText.text = "Status: Setting focal length...";
            var focal = g_solution.intrinsics && g_solution.intrinsics[0] ? Number(g_solution.intrinsics[0][0]) : 0;
            if (focal > 0) {
                g_camera.property("ADBE Camera Options Group").property("ADBE Camera Lens").setValue(
                    (36 * Number(g_solution.width || g_comp.width)) / (2 * focal)
                );
            }
            
            statusText.text = "Status: Adding keyframes (0%)...";
            var keyframeCount = 0;
            var totalFrames = g_solution.frames.length;
            
            for (var i = 0; i < totalFrames; i++) {
                if (i % Math.max(1, Math.floor(totalFrames / 10)) === 0) {
                    statusText.text = "Status: Adding keyframes (" + Math.round((i / totalFrames) * 100) + "%)...";
                }
                
                var frameData = g_solution.frames[i];
                var matrix = frameData.camera_to_world;
                var frameNumber = Number(frameData.frame) || i;
                var time = Number(frameData.time);
                if (isNaN(time)) time = frameNumber / (Number(g_solution.fps) || 30);
                
                position.setValueAtTime(time, cameraPosition(matrix));
                orientation.setValueAtTime(time, orientationFromCameraToWorld(matrix));
                keyframeCount++;
            }
            
            g_comp.time = 0;
            g_camera.selected = true;
            
            app.endUndoGroup();
            statusText.text = "Status: ✓ SUCCESS! Imported " + keyframeCount + " keyframes";
            
        } catch (e) {
            statusText.text = "Status: ERROR - " + e.toString();
        }
    };
    
    btnSaber.onClick = function () {
        try {
            if (!g_comp) {
                alert("Please import a camera solution first!");
                return;
            }
            
            statusText.text = "Status: Creating saber effect...";
            app.beginUndoGroup("Create Saber Effect");
            
            var colorRGB = hexToRGB(colorInput.text);
            var saberSolid = g_comp.layers.addSolid(colorRGB, "Saber", g_comp.width, g_comp.height, g_comp.pixelAspect);
            saberSolid.blendMode = BlendMode.ADD;
            saberSolid.opacity.setValue(Math.max(10, glowSlider.value));
            
            var blurEffect = saberSolid.Effects.addProperty("ADBE Gaussian Blur 2");
            blurEffect.property("Blur Radius").setValue(radiusSlider.value);
            
            if (chkBloom.value) {
                try {
                    var curvesEffect = saberSolid.Effects.addProperty("ADBE Curves2");
                } catch (e) {
                    // Curves may not be available
                }
            }
            
            if (chkWave.value) {
                try {
                    var rippleEffect = saberSolid.Effects.addProperty("ADBE Ripple");
                    rippleEffect.property("Wave Width").setValue(100);
                    rippleEffect.property("Wave Height").setValue(ampSlider.value);
                } catch (e) {
                    // Ripple may not be available
                }
            }
            
            app.endUndoGroup();
            statusText.text = "Status: ✓ Saber effect created successfully";
            
        } catch (e) {
            statusText.text = "Status: ERROR creating saber - " + e.toString();
        }
    };
    
    btnWave.onClick = function () {
        try {
            if (!g_comp) {
                alert("Please create a composition first!");
                return;
            }
            
            statusText.text = "Status: Creating wave effect...";
            app.beginUndoGroup("Create Wave Effect");
            
            var waveAdj = g_comp.layers.addSolid([0, 0, 0], "Wave Effect", g_comp.width, g_comp.height, g_comp.pixelAspect);
            waveAdj.opacity.setValue(50);
            
            try {
                var rippleEffect = waveAdj.Effects.addProperty("ADBE Ripple");
                rippleEffect.property("Wave Width").setValue(200);
                rippleEffect.property("Wave Height").setValue(ampSlider.value);
            } catch (e) {
                alert("Ripple effect not available in this AE version");
            }
            
            app.endUndoGroup();
            statusText.text = "Status: ✓ Wave effect created successfully";
            
        } catch (e) {
            statusText.text = "Status: ERROR creating wave - " + e.toString();
        }
    };
    
    // Preset buttons
    btnRed.onClick = function () {
        colorInput.text = "#FF0000";
        updateColorPreview(colorInput.text);
        glowSlider.value = 75;
        glowValue.text = "75%";
        radiusSlider.value = 25;
        radiusValue.text = "25px";
        thicknessSlider.value = 10;
        thicknessValue.text = "10px";
        chkBloom.value = true;
        chkWave.value = false;
    };
    
    btnBlue.onClick = function () {
        colorInput.text = "#0099FF";
        updateColorPreview(colorInput.text);
        glowSlider.value = 85;
        glowValue.text = "85%";
        radiusSlider.value = 30;
        radiusValue.text = "30px";
        thicknessSlider.value = 8;
        thicknessValue.text = "8px";
        chkBloom.value = true;
        chkWave.value = false;
    };
    
    btnElec.onClick = function () {
        colorInput.text = "#FFFF00";
        updateColorPreview(colorInput.text);
        glowSlider.value = 100;
        glowValue.text = "100%";
        radiusSlider.value = 15;
        radiusValue.text = "15px";
        thicknessSlider.value = 3;
        thicknessValue.text = "3px";
        chkBloom.value = true;
        chkWave.value = true;
    };
    
    // Show window
    win.show();
    
})();
