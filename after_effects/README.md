# After Effects importer

`import_camera_solution.jsx` is a standalone ExtendScript file. It does not require a CEP installation.

## Use

1. Install the Python tracker and generate a solution:

   ```bash
   camera-track input.mp4 --output solution.json --fps 30
   ```

2. Open After Effects.
3. Select **File → Scripts → Run Script File…**.
4. Choose `after_effects/import_camera_solution.jsx`.
5. Select `solution.json` when prompted.

The script creates a composition when no composition is active, creates a 3D camera, sets focal length from the exported intrinsics, and adds position/orientation keyframes.

For a permanent ScriptUI panel, copy the JSX file into the After Effects `Scripts/ScriptUI Panels` directory and restart After Effects. It will then appear under **Window**.

## Important coordinate note

The JSON solution is monocular, so translation scale is arbitrary. The importer preserves the exported coordinate system; you may need to rotate or scale the camera and scene to match your footage. Lens distortion is exported as metadata but is not automatically applied to the AE layer.
