# After Effects Setup Guide

## Installation

You have **2 options** to use the tracker with After Effects:

### Option 1: ScriptUI Panel (Recommended)

**Best for:** Regular use, access to all features, UI controls

#### Windows:
1. Create/navigate to:
   ```
   C:\Users\[YourUsername]\AppData\Roaming\Adobe\After Effects\2025\Scripts\ScriptUI Panels\
   ```
   (Replace "2025" with your AE version: 2024, 2023, etc.)

2. Copy `camera_tracker_panel.jsx` into this folder

3. Restart After Effects

4. Open panel:
   - **Window → camera_tracker_panel** (at the bottom of menu)

#### macOS:
1. Navigate to:
   ```
   ~/Library/Application Support/Adobe/After Effects/2025/Scripts/ScriptUI Panels/
   ```

2. Copy `camera_tracker_panel.jsx` here

3. Restart After Effects

4. Open panel:
   - **Window → camera_tracker_panel**

### Option 2: Run Script File

**Best for:** One-time use, or if you can't access ScriptUI Panels folder

#### Usage:
1. In After Effects:
   - **File → Scripts → Run Script File...**

2. Select `import_camera_solution_script.jsx`

3. Browse and select your `solution.json` file

4. Camera will be imported with keyframes

---

## Usage

### Import Camera Tracking

1. Run camera-track to generate JSON:
   ```bash
   camera-track input.mp4 --output solution.json \\
     --fx 1450 --fy 1450 --cx 960 --cy 540 --fps 30
   ```

2. Open After Effects and create a composition
   - Or use an existing one

3. **Option 1 (Panel):**
   - Open Window → camera_tracker_panel
   - Click "Import solution.json"
   - Select your solution.json file
   - Camera + keyframes will be created

4. **Option 2 (Script):**
   - File → Scripts → Run Script File...
   - Select import_camera_solution_script.jsx
   - Select solution.json when prompted

### Create Saber Effect

1. **Panel Method:**
   - Open Window → camera_tracker_panel
   - In "SABER EFFECT" section:
     - Blade Color: `#FF0000` (or any hex color)
     - Glow Intensity: 75 (adjust 0-100)
     - Glow Radius: 25 (adjust 5-60)
     - Line Thickness: 8 (adjust 2-30)
     - Enable Bloom: ☑
   - Click "Create Saber Effect"

2. Saber layer will be added to your composition

3. Adjust layer position/scale to match your footage

### Create Wave Effect (Volna 2 style)

1. In Panel:
   - Enable checkbox: "Enable Wave (Volna 2 style)"
   - Adjust Amplitude (0-50)
   - Adjust Frequency (0.1-10)
   - Click "Create Wave Effect"

2. Wave distortion layer will be added

### Quick Presets

Click one of these buttons to quickly set parameters:

| Preset | Color | Glow | Radius | Use Case |
|--------|-------|------|--------|----------|
| **Red Saber** | #FF0000 | 75 | 25px | Star Wars style |
| **Blue Saber** | #0099FF | 85 | 30px | Sci-Fi/Jedi |
| **Electric** | #FFFF00 | 100 | 15px | Lightning/Tesla |

---

## Parameters Explained

### Camera Tracking
- **Status**: Shows import progress and any errors
- **Focal Length**: Automatically set from solution.json intrinsics
- **Keyframes**: Position and rotation set for each frame

### Saber Effect
- **Blade Color**: Hex format (#RRGGBB)
  - #FF0000 = Red
  - #00FF00 = Green
  - #0000FF = Blue
  - #FFFF00 = Yellow
  
- **Glow Intensity**: 0-100
  - 0 = No glow
  - 50 = Medium glow
  - 100 = Maximum glow
  
- **Glow Radius**: 5-60 pixels
  - 5px = Sharp edge
  - 25px = Medium glow
  - 60px = Heavy bloom
  
- **Line Thickness**: 2-30 pixels
  - 2px = Thin laser
  - 8px = Standard saber
  - 30px = Thick beam
  
- **Bloom Effect**: On/Off
  - ON = Neon glowing look
  - OFF = Flat light
  
- **Wave Animation**: On/Off
  - ON = Distortion ripples
  - OFF = Static

### Wave Effect
- **Amplitude**: 0-50 (wave height)
- **Frequency**: 0.1-10 (wave speed)

---

## Troubleshooting

### Panel doesn't appear in Window menu
**Solution:**
- Confirm file is in correct folder: `Scripts/ScriptUI Panels/`
- File name must be exactly: `camera_tracker_panel.jsx`
- Restart After Effects
- Check AE version folder matches (2023, 2024, 2025, etc.)

### "Please select a composition first" error
**Solution:**
- Create a new composition in After Effects
- Or open an existing composition
- Then run the script

### Camera not importing
**Solution:**
- Ensure solution.json is from camera-track tool
- Check JSON file encoding is UTF-8
- Verify file format matches schema
- Try running script version instead of panel

### Effects not applying
**Solution:**
- Effect may not be available in your AE version
- Try a different effect (Gaussian Blur, Ripple, etc.)
- Check After Effects plugins are installed

### Panel runs but nothing happens
**Solution:**
- Open After Effects console: **Window → Developer → JavaScript Console**
- This shows error messages
- Copy error and report on GitHub

---

## File Locations

### Windows
```
C:\Users\[User]\AppData\Roaming\Adobe\After Effects\2025\Scripts\ScriptUI Panels\
```

### macOS
```
~/Library/Application Support/Adobe/After Effects/2025/Scripts/ScriptUI Panels/
```

### Alternative (All Versions)
If above doesn't work, try:
- **Windows**: `C:\Program Files\Adobe\Adobe After Effects 2025\Support Files\Scripts\ScriptUI Panels\`
- **Mac**: `/Applications/Adobe After Effects 2025/Scripts/ScriptUI Panels/`

---

## Keyboard Shortcuts

- **Open JavaScript Console**: Window → Developer → JavaScript Console
- **Show Expressions**: Alt+Shift+E (Windows) or Opt+Shift+E (Mac)
- **Toggle Undo/Redo**: Ctrl+Z / Cmd+Z

---

## Performance Tips

1. **Glow Radius > 50px** may slow playback
2. Use **Proxy Mode** (usually half resolution) during editing
3. Export at lower resolution first to test
4. Close other applications to free RAM
5. Disable Wave effect on 4K footage for better performance

---

## Examples

### Create a Red Saber with Bloom
1. Import camera tracking (creates composition)
2. Click "Red Saber" preset
3. Click "Create Saber Effect"
4. Play timeline to preview
5. Adjust color, glow, and bloom to taste

### Create Electric Arc Effect
1. Create blank composition (1920x1080, 30fps)
2. Click "Electric" preset
3. Check "Enable Wave (Volna 2 style)"
4. Click "Create Wave Effect"
5. Set wave amplitude to 20, frequency to 5

### Track Moving Scene + Add Saber
1. Create composition with video
2. Run "Import solution.json"
3. Camera + keyframes added
4. Create saber effect on top
5. Adjust blend mode (Add, Screen, etc.)

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Open JavaScript Console for error messages
3. Visit: https://github.com/xavistudio1999-cyber/3D-Camera-Tracking-Extension
4. Report issue with:
   - After Effects version
   - Operating system
   - Exact error message
   - Steps to reproduce

---

## License

MIT - See LICENSE in repository root
