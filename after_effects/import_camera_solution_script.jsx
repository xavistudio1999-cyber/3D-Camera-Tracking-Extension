#target aftereffects

/*
 * After Effects: Run Script File version
 * 
 * Usage:
 *   1. File > Scripts > Run Script File...
 *   2. Select this file
 *   3. Select solution.json when prompted
 * 
 * This is a simpler version without the UI panel,
 * used when running as a regular script.
 */

(function () {
    app.beginUndoGroup("Import Camera Tracking");

    function parseJSON(text) {
        if (typeof JSON !== "undefined" && JSON.parse) {
            return JSON.parse(text);
        }
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
            "Tracked Scene",
            Number(solution.width) || 1920,
            Number(solution.height) || 1080,
            1.0,
            (solution.frames.length / (Number(solution.fps) || 30)),
            Number(solution.fps) || 30
        );
        return comp;
    }

    var jsonFile = File.openDialog("Select camera-tracker solution.json");
    if (!jsonFile) {
        alert("No file selected.");
        app.endUndoGroup();
        return;
    }

    var solution = readJSON(jsonFile);
    if (!solution || !isArray(solution.frames) || solution.frames.length === 0) {
        alert("Invalid camera-tracker solution file.");
        app.endUndoGroup();
        return;
    }

    var comp = findOrCreateComp(solution);
    var camera = comp.layers.addCamera("Tracked Camera", [comp.width / 2, comp.height / 2]);
    camera.autoOrient = AutoOrientType.NO_AUTO_ORIENT;

    var position = camera.property("ADBE Transform Group").property("ADBE Position");
    var orientation = camera.property("ADBE Transform Group").property("ADBE Orientation");

    var focal = solution.intrinsics && solution.intrinsics[0] ? Number(solution.intrinsics[0][0]) : 0;
    if (focal > 0) {
        camera.property("ADBE Camera Options Group").property("ADBE Camera Lens").setValue(
            (36 * Number(solution.width || comp.width)) / (2 * focal)
        );
    }

    for (var i = 0; i < solution.frames.length; i++) {
        var frameData = solution.frames[i];
        var matrix = frameData.camera_to_world;
        var frameNumber = Number(frameData.frame) || i;
        var time = Number(frameData.time);
        if (isNaN(time)) time = frameNumber / (Number(solution.fps) || 30);
        position.setValueAtTime(time, cameraPosition(matrix));
        orientation.setValueAtTime(time, orientationFromCameraToWorld(matrix));
    }

    comp.time = 0;
    camera.selected = true;

    app.endUndoGroup();
    alert("✓ Imported camera tracking with " + solution.frames.length + " keyframes\n\nComposition: " + comp.name + "\nCamera: " + camera.name);
})();
