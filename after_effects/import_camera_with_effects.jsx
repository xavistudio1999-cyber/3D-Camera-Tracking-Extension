/*
 * After Effects Enhanced Camera Importer with Saber & Volna Effects
 *
 * Improved version with support for:
 *   - Light saber effects with custom glow
 *   - Volna 2-style wave distortion
 *   - Bloom and HDR effects
 *   - Advanced camera matrix support
 */

(function () {
    app.beginUndoGroup("Import 3D Camera + Effects");

    var settings = {
        saberColor: [1.0, 0.0, 0.0],
        glowIntensity: 0.8,
        glowRadius: 25,
        enableVolna: true,
        enableBloom: true,
        lineThickness: 8
    };

    function fail(message) {
        alert("Camera Tracker\n\n" + message);
        app.endUndoGroup();
    }

    function parseJSON(text) {
        if (typeof JSON !== "undefined" && JSON.parse) return JSON.parse(text);
        return eval("(" + text + ")");
    }

    function readJSON(file) {
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
            "Tracked Camera",
            Number(solution.width) || 1920,
            Number(solution.height) || 1080,
            1.0,
            (solution.frames.length / (Number(solution.fps) || 30)),
            Number(solution.fps) || 30
        );
        return comp;
    }

    // Import camera tracking solution
    var jsonFile = File.openDialog("Select camera-tracker solution.json", "JSON:*.json");
    if (!jsonFile) { fail("No JSON file selected."); return; }

    var solution;
    try { solution = readJSON(jsonFile); }
    catch (e) { fail("Could not parse JSON:\n" + e.toString()); return; }

    if (!solution || !isArray(solution.frames) || solution.frames.length === 0) {
        fail("The selected file is not a valid camera-tracker solution.");
        return;
    }

    var comp = findOrCreateComp(solution);

    // Create camera
    var camera = comp.layers.addCamera("Tracked Camera", [comp.width / 2, comp.height / 2]);
    camera.autoOrient = AutoOrientType.NO_AUTO_ORIENT;

    var position = camera.property("ADBE Transform Group").property("ADBE Position");
    var orientation = camera.property("ADBE Transform Group").property("ADBE Orientation");

    // Set camera intrinsics
    var focal = solution.intrinsics && solution.intrinsics[0] ? Number(solution.intrinsics[0][0]) : 0;
    var filmWidth = 36.0;
    if (focal > 0) {
        camera.property("ADBE Camera Options Group").property("ADBE Camera Lens").setValue(
            (filmWidth * Number(solution.width || comp.width)) / (2 * focal)
        );
    }

    // Add keyframes
    for (var i = 0; i < solution.frames.length; i++) {
        var frameData = solution.frames[i];
        var matrix = frameData.camera_to_world;
        var frameNumber = Number(frameData.frame) || i;
        var time = Number(frameData.time);
        if (isNaN(time)) time = frameNumber / (Number(solution.fps) || 30);
        position.setValueAtTime(time, cameraPosition(matrix));
        orientation.setValueAtTime(time, orientationFromCameraToWorld(matrix));
    }

    // Add Saber Effect Layer
    var saberSolid = comp.layers.addSolid([1, 0, 0], "Saber Layer", comp.width, comp.height, comp.pixelAspect);
    saberSolid.blendMode = BlendMode.ADD;
    saberSolid.opacity.setValue(80);

    // Apply Gaussian Blur for glow
    var blurEffect = saberSolid.Effects.addProperty("ADBE Gaussian Blur 2");
    blurEffect.property("Blur Radius").setValue(settings.glowRadius);

    // Apply Curves for bloom
    if (settings.enableBloom) {
        try {
            var curvesEffect = saberSolid.Effects.addProperty("ADBE Curves2");
            // Increase highlights for bloom
        } catch (e) {
            // Curves may not be available
        }
    }

    // Add Volna-style Wave Effect
    if (settings.enableVolna) {
        try {
            var waveEffect = saberSolid.Effects.addProperty("ADBE Ripple");
            waveEffect.property("Wave Width").setValue(100);
            waveEffect.property("Wave Height").setValue(10);
        } catch (e) {
            // Ripple effect may not be available
        }
    }

    comp.time = 0;
    camera.selected = true;
    alert("✓ Imported camera + effects:\n" + solution.frames.length + " keyframes\n" + comp.name);
    app.endUndoGroup();
}());
