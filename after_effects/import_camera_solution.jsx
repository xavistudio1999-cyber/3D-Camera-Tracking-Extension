/*
 * Camera Tracker JSON -> After Effects importer
 *
 * Usage:
 *   1. Run camera-track to create solution.json.
 *   2. In After Effects choose File > Scripts > Run Script File...
 *   3. Select this file, then select solution.json.
 *
 * The tracker exports camera-to-world matrices. This script creates one
 * AE 3D camera and keyframes its position/orientation. Translation scale
 * is arbitrary because a monocular camera cannot recover real-world scale.
 */
(function () {
    app.beginUndoGroup("Import 3D Camera Tracking Solution");

    function fail(message) {
        alert("Camera Tracker\n\n" + message);
        app.endUndoGroup();
    }

    function parseJSON(text) {
        // ExtendScript versions differ in JSON support. Use the native parser
        // when available and a restricted fallback for tracker-generated JSON.
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

    function transpose3(r) {
        return [[r[0][0], r[1][0], r[2][0]],
                [r[0][1], r[1][1], r[2][1]],
                [r[0][2], r[1][2], r[2][2]]];
    }

    function mul3(a, b) {
        var out = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        var i, j, k;
        for (i = 0; i < 3; i++) for (j = 0; j < 3; j++) {
            for (k = 0; k < 3; k++) out[i][j] += a[i][k] * b[k][j];
        }
        return out;
    }

    function normalize(v) {
        var n = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        return n < 1e-8 ? [0, 0, 0] : [v[0] / n, v[1] / n, v[2] / n];
    }

    function clamp(value, low, high) {
        return Math.max(low, Math.min(high, value));
    }

    // Convert a camera-to-world rotation to AE Orientation [X,Y,Z].
    // AE uses degrees and a camera looks along its local -Z axis.
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
    var camera = comp.layers.addCamera("Tracked Camera", [comp.width / 2, comp.height / 2]);
    camera.autoOrient = AutoOrientType.NO_AUTO_ORIENT;

    var position = camera.property("ADBE Transform Group").property("ADBE Position");
    var orientation = camera.property("ADBE Transform Group").property("ADBE Orientation");

    var i, frameData, matrix, frameNumber, time;
    var first = solution.frames[0];
    var firstMatrix = first.camera_to_world;
    var focal = solution.intrinsics && solution.intrinsics[0] ? Number(solution.intrinsics[0][0]) : 0;
    var filmWidth = 36.0;
    if (focal > 0) camera.property("ADBE Camera Options Group").property("ADBE Camera Lens").setValue((filmWidth * Number(solution.width || comp.width)) / (2 * focal));

    for (i = 0; i < solution.frames.length; i++) {
        frameData = solution.frames[i];
        matrix = frameData.camera_to_world;
        frameNumber = Number(frameData.frame) || i;
        time = Number(frameData.time);
        if (isNaN(time)) time = frameNumber / (Number(solution.fps) || 30);
        position.setValueAtTime(time, cameraPosition(matrix));
        orientation.setValueAtTime(time, orientationFromCameraToWorld(matrix));
    }

    comp.time = Number(first.time) || 0;
    camera.selected = true;
    alert("Imported " + solution.frames.length + " camera keyframes into '" + comp.name + "'.\n\nScale: " + (solution.scale || "arbitrary"));
    app.endUndoGroup();
}());
