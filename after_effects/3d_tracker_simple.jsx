#target aftereffects

/*
 * 3D Camera Tracker - Simplified One-Click Panel
 * Universal for After Effects CC 2014 - 2025+
 * 
 * Features:
 *   - One-click 3D Camera creation with auto-keyframes
 *   - Auto checkpoint creation
 *   - Add Solid layer
 *   - Add Null Object
 *   - Clean, minimal UI
 */

(function () {
    if (typeof app === "undefined" || app === null) {
        alert("This script requires After Effects");
        return;
    }
    
    // ============================================
    // Create Main Panel
    // ============================================
    
    var win = new Window("palette", "3D Tracker");
    win.orientation = "column";
    win.alignChildren = ["fill", "top"];
    win.spacing = 8;
    win.margins = 12;
    win.preferredSize = [380, 280];
    
    // ============================================
    // Title
    // ============================================
    
    var titleGrp = win.add("group");
    titleGrp.orientation = "row";
    titleGrp.alignChildren = ["center", "center"];
    titleGrp.spacing = 4;
    titleGrp.margins = 0;
    
    var titleText = titleGrp.add("statictext", undefined, "3D CAMERA TRACKER");
    titleText.graphics.font = ScriptUI.newFont("Arial", "BOLD", 16);
    
    // ============================================
    // Main Buttons Group
    // ============================================
    
    var mainGrp = win.add("group");
    mainGrp.orientation = "column";
    mainGrp.alignChildren = "fill";
    mainGrp.spacing = 10;
    mainGrp.margins = [0, 10, 0, 0];
    
    // Create Camera Button (Large, Primary)
    var btnCreateCam = mainGrp.add("button", undefined, "CREATE 3D CAMERA");
    btnCreateCam.preferredSize = [360, 45];
    btnCreateCam.helpTip = "Add 3D camera with auto-keyframes to composition";
    btnCreateCam.graphics.font = ScriptUI.newFont("Arial", "BOLD", 14);
    
    // Add Checkpoint Button
    var btnCheckpoint = mainGrp.add("button", undefined, "ADD CHECKPOINT");
    btnCheckpoint.preferredSize = [360, 35];
    btnCheckpoint.helpTip = "Mark current time as checkpoint";
    
    // ============================================
    // Add Elements Group
    // ============================================
    
    var elementsGrp = win.add("group");
    elementsGrp.orientation = "column";
    elementsGrp.alignChildren = "fill";
    elementsGrp.spacing = 8;
    elementsGrp.margins = [0, 8, 0, 0];
    
    var elemLabel = elementsGrp.add("statictext", undefined, "Add Elements");
    elemLabel.graphics.font = ScriptUI.newFont("Arial", "BOLD", 12);
    
    var elemBtnGrp = elementsGrp.add("group");
    elemBtnGrp.orientation = "row";
    elemBtnGrp.alignChildren = "fill";
    elemBtnGrp.spacing = 8;
    elemBtnGrp.margins = 0;
    
    var btnSolid = elemBtnGrp.add("button", undefined, "Solid");
    btnSolid.preferredSize = [115, 30];
    btnSolid.helpTip = "Add solid color layer";
    
    var btnNull = elemBtnGrp.add("button", undefined, "Null Object");
    btnNull.preferredSize = [115, 30];
    btnNull.helpTip = "Add null object for controlling camera";
    
    var btnLight = elemBtnGrp.add("button", undefined, "Light");
    btnLight.preferredSize = [115, 30];
    btnLight.helpTip = "Add point light";
    
    // ============================================
    // Color Picker for Solid
    // ============================================
    
    var colorGrp = elementsGrp.add("group");
    colorGrp.orientation = "row";
    colorGrp.alignChildren = ["left", "center"];
    colorGrp.spacing = 6;
    colorGrp.margins = 0;
    
    colorGrp.add("statictext", undefined, "Solid Color:");
    var colorBox = colorGrp.add("panel", undefined, "");
    colorBox.preferredSize = [40, 24];
    colorBox.alignment = ["left", "center"];
    colorBox.graphics.backgroundColor = colorBox.graphics.newBrush(colorBox.graphics.BrushType.SOLID_COLOR, [1, 0, 0, 1]);
    
    var btnPickColor = colorGrp.add("button", undefined, "Pick");
    btnPickColor.preferredSize = [60, 24];
    btnPickColor.helpTip = "Choose color for solid layer";
    
    // ============================================
    // Status Text
    // ============================================
    
    var statusGrp = win.add("group");
    statusGrp.orientation = "column";
    statusGrp.alignChildren = "fill";
    statusGrp.spacing = 4;
    statusGrp.margins = [0, 8, 0, 0];
    
    var statusText = statusGrp.add("statictext", undefined, "Ready");
    statusText.preferredSize = [360, 18];
    statusText.graphics.font = ScriptUI.newFont("Arial", 10);
    statusText.alignment = ["left", "center"];
    
    // ============================================
    // Global Variables
    // ============================================
    
    var g_comp = null;
    var g_selectedColor = [1, 0, 0]; // Default red
    var g_checkpointCounter = 0;
    
    // ============================================
    // Helper Functions
    // ============================================
    
    function ensureComp() {
        var active = app.project.activeItem;
        if (active instanceof CompItem) {
            return active;
        }
        // Create default composition
        return app.project.items.addComp(
            "Camera Composition",
            1920,
            1080,
            1.0,
            10,
            30
        );
    }
    
    function setStatus(msg) {
        statusText.text = msg;
    }
    
    function createKeyframes(camera, duration) {
        try {
            // Get camera position and rotation properties
            var posProp = camera.property("ADBE Transform Group").property("ADBE Position");
            var orientProp = camera.property("ADBE Transform Group").property("ADBE Orientation");
            var rotProp = camera.property("ADBE Transform Group").property("ADBE Rotation");
            
            // Add keyframes at start, middle, and end
            var times = [0, duration / 2, duration];
            var positions = [
                [0, 0, 0],
                [100, 50, 200],
                [200, 0, 400]
            ];
            var orientations = [
                [0, 0, 0],
                [15, 30, 0],
                [0, 0, 0]
            ];
            
            for (var i = 0; i < times.length; i++) {
                posProp.setValueAtTime(times[i], positions[i]);
                orientProp.setValueAtTime(times[i], orientations[i]);
            }
            
            return true;
        } catch (e) {
            return false;
        }
    }
    
    function createCheckpoint(comp, index) {
        try {
            // Add null object as checkpoint marker
            var nullLayer = comp.layers.addNull();
            nullLayer.name = "Checkpoint_" + index;
            
            // Position null at comp center
            var posProp = nullLayer.property("ADBE Transform Group").property("ADBE Position");
            posProp.setValue([comp.width / 2, comp.height / 2, 0]);
            
            // Add marker
            var currentTime = comp.time;
            nullLayer.marker.setNullMarker(currentTime);
            
            return nullLayer;
        } catch (e) {
            return null;
        }
    }
    
    function showColorPicker() {
        try {
            // For AE without color picker, use simple dialog
            var colorDialog = new Window("dialog", "Pick Color");
            
            colorDialog.orientation = "column";
            colorDialog.spacing = 10;
            colorDialog.margins = 12;
            
            // Color input
            var grpInput = colorDialog.add("group");
            grpInput.orientation = "row";
            grpInput.alignChildren = ["left", "center"];
            grpInput.spacing = 6;
            
            grpInput.add("statictext", undefined, "Hex:");
            var txtHex = grpInput.add("edittext", undefined, "FF0000");
            txtHex.characters = 10;
            txtHex.helpTip = "Enter hex color (RRGGBB)";
            
            // Buttons
            var btnGroup = colorDialog.add("group");
            btnGroup.orientation = "row";
            btnGroup.alignChildren = "fill";
            btnGroup.spacing = 6;
            
            var btnOK = btnGroup.add("button", undefined, "OK", {name: "ok"});
            var btnCancel = btnGroup.add("button", undefined, "Cancel", {name: "cancel"});
            
            btnOK.onClick = function () {
                var hex = txtHex.text.replace("#", "").substring(0, 6);
                g_selectedColor = [
                    parseInt(hex.substring(0, 2), 16) / 255 || 1,
                    parseInt(hex.substring(2, 4), 16) / 255 || 0,
                    parseInt(hex.substring(4, 6), 16) / 255 || 0
                ];
                colorBox.graphics.backgroundColor = colorBox.graphics.newBrush(
                    colorBox.graphics.BrushType.SOLID_COLOR,
                    [g_selectedColor[0], g_selectedColor[1], g_selectedColor[2], 1]
                );
                colorDialog.close();
            };
            
            colorDialog.show();
        } catch (e) {
            alert("Color picker error: " + e.toString());
        }
    }
    
    // ============================================
    // Event Handlers
    // ============================================
    
    btnCreateCam.onClick = function () {
        try {
            setStatus("Creating 3D camera...");
            
            g_comp = ensureComp();
            
            // Add camera
            var camera = g_comp.layers.addCamera(
                "Tracked Camera",
                [g_comp.width / 2, g_comp.height / 2]
            );
            camera.autoOrient = AutoOrientType.NO_AUTO_ORIENT;
            
            // Create auto keyframes
            var duration = g_comp.duration;
            if (createKeyframes(camera, duration)) {
                setStatus("✓ 3D camera created with keyframes");
            } else {
                setStatus("✓ 3D camera created (auto-keyframes may not work in your AE version)");
            }
            
            // Auto checkpoint
            createCheckpoint(g_comp, ++g_checkpointCounter);
            
        } catch (e) {
            setStatus("ERROR: " + e.toString());
        }
    };
    
    btnCheckpoint.onClick = function () {
        try {
            setStatus("Adding checkpoint...");
            
            if (!g_comp) {
                g_comp = ensureComp();
            }
            
            createCheckpoint(g_comp, ++g_checkpointCounter);
            setStatus("✓ Checkpoint " + g_checkpointCounter + " added");
            
        } catch (e) {
            setStatus("ERROR: " + e.toString());
        }
    };
    
    btnSolid.onClick = function () {
        try {
            setStatus("Creating solid layer...");
            
            if (!g_comp) {
                g_comp = ensureComp();
            }
            
            var solid = g_comp.layers.addSolid(
                g_selectedColor,
                "Solid",
                g_comp.width,
                g_comp.height,
                g_comp.pixelAspect
            );
            
            setStatus("✓ Solid layer created");
            
        } catch (e) {
            setStatus("ERROR: " + e.toString());
        }
    };
    
    btnNull.onClick = function () {
        try {
            setStatus("Creating null object...");
            
            if (!g_comp) {
                g_comp = ensureComp();
            }
            
            var nullLayer = g_comp.layers.addNull();
            nullLayer.name = "Controller";
            
            // Position at comp center
            var posProp = nullLayer.property("ADBE Transform Group").property("ADBE Position");
            posProp.setValue([g_comp.width / 2, g_comp.height / 2, 0]);
            
            setStatus("✓ Null object created");
            
        } catch (e) {
            setStatus("ERROR: " + e.toString());
        }
    };
    
    btnLight.onClick = function () {
        try {
            setStatus("Creating light...");
            
            if (!g_comp) {
                g_comp = ensureComp();
            }
            
            var light = g_comp.layers.addLight(
                "Light 1",
                [g_comp.width / 2, g_comp.height / 2, 200]
            );
            light.lightType = LightType.POINT;
            
            setStatus("✓ Point light created");
            
        } catch (e) {
            setStatus("ERROR: " + e.toString());
        }
    };
    
    btnPickColor.onClick = function () {
        showColorPicker();
    };
    
    // ============================================
    // Show Panel
    // ============================================
    
    win.show();
    setStatus("Ready");
    
})();
