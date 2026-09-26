# After Effects Universal Installation Guide

## File: `camera_tracker_universal.jsx`

This script works with **all After Effects versions** from CC 2014 to 2025+

## Installation Method 1: Quick Script (All Versions)

### Windows & macOS:
1. Open After Effects
2. Go to: **File → Scripts → Run Script File...**
3. Select `camera_tracker_universal.jsx`
4. Panel will open immediately

This method works on **any AE version**.

## Installation Method 2: Permanent Panel (Recommended)

Make the panel appear in Window menu.

### Windows (All Versions):

1. Find your After Effects Scripts folder:
   ```
   C:\Users\[YourUsername]\AppData\Roaming\Adobe\After Effects\[VERSION]\Scripts\ScriptUI Panels\
   ```
   Replace `[VERSION]` with: `2014.0`, `2015.0`, `2015.1`, `2016.0`, ..., `2025`

2. Copy `camera_tracker_universal.jsx` into this folder

3. Rename it to: `camera_tracker_universal.jsx` (if not already)

4. Restart After Effects

5. Open panel:
   - **Window → camera_tracker_universal**

### macOS (All Versions):

1. Open Finder, go to:
   ```
   ~/Library/Application Support/Adobe/After Effects/[VERSION]/Scripts/ScriptUI Panels/
   ```
   Replace `[VERSION]` with your AE version folder

2. Copy `camera_tracker_universal.jsx` here

3. Restart After Effects

4. Open panel:
   - **Window → camera_tracker_universal**

### Alternative Path (If above doesn't work):

**Windows:**
```
C:\Program Files\Adobe\Adobe After Effects [VERSION]\Support Files\Scripts\ScriptUI Panels\
```

**macOS:**
```
/Applications/Adobe After Effects [VERSION]/Scripts/ScriptUI Panels/
```

## Usage

### Step 1: Generate Camera Tracking JSON

```bash
camera-track input.mp4 --output solution.json \
  --fx 1450 --fy 1450 --cx 960 --cy 540 --fps 30
```

### Step 2: Open After Effects

Create a new composition or open an existing one.

### Step 3: Run Panel

**Option A (Script):**
- File → Scripts → Run Script File...
- Select `camera_tracker_universal.jsx`

**Option B (Permanent Panel):**
- Window → camera_tracker_universal

### Step 4: Import JSON

1. Click **"Select JSON File"**
2. Browse and select your `solution.json`
3. Wait for status to show "✓ Loaded X camera frames"

### Step 5: Create Camera

1. Click **"Create Camera Layer"**
2. Camera layer will be added to your composition
3. Position and orientation keyframes are automatically set
4. Status will show "✓ Camera created with X keyframes"

### Step 6: Add Effects (Optional)

#### Create Saber Effect:
1. Adjust **Color** (hex format like #FF0000)
2. Adjust **Glow** slider (0-100)
3. Adjust **Radius** slider (5-60 pixels)
4. Toggle **Enable Bloom Effect**
5. Click **"Create Saber Effect"**

#### Create Wave Effect:
1. Adjust **Amplitude** slider (0-50)
2. Click **"Create Wave Effect"**

## Compatibility

Tested and compatible with:
- ✓ After Effects CC 2014
- ✓ After Effects CC 2015
- ✓ After Effects CC 2015.1
- ✓ After Effects CC 2016
- ✓ After Effects CC 2017
- ✓ After Effects 2018
- ✓ After Effects 2019
- ✓ After Effects 2020
- ✓ After Effects 2021
- ✓ After Effects 2022
- ✓ After Effects 2023
- ✓ After Effects 2024
- ✓ After Effects 2025

## Troubleshooting

### "Cannot open file" error
- Ensure the JSON file is from `camera-track` tool
- Check file encoding is UTF-8
- Try copying file to Desktop first

### Panel doesn't appear in Window menu
- Confirm file is in correct ScriptUI Panels folder
- Verify folder path matches your AE version
- Try restarting After Effects
- Use Method 1 (Run Script File) as fallback

### Camera not importing
- Check status text shows "✓ Loaded X frames"
- Ensure you have an active composition
- Try creating a new composition first

### Effects not appearing
- Some effects may not be available in your AE version
- Use Gaussian Blur / Fast Blur as alternative
- Try applying effects manually

### Script shows error
- Open **Window → Developer → JavaScript Console** to see error details
- Copy error and report on GitHub

## Quick Presets

For convenience, you can set:

**Red Saber (Star Wars):**
- Color: `#FF0000`
- Glow: 75
- Radius: 25px
- Bloom: ON

**Blue Saber (Jedi):**
- Color: `#0099FF`
- Glow: 85
- Radius: 30px
- Bloom: ON

**Electric Arc:**
- Color: `#FFFF00`
- Glow: 100
- Radius: 15px
- Wave Amplitude: 20

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Open JavaScript Console for error messages
3. Visit: https://github.com/xavistudio1999-cyber/3D-Camera-Tracking-Extension
4. Report with:
   - Your AE version
   - Operating system
   - Error message from console
   - Steps to reproduce

## Tips

- Keep the panel docked in your workspace for easy access
- Use "Run Script File" method for quick testing
- Set focal length in camera-track for accurate results
- Try 4K/high-resolution footage for better tracking
- Use proxy mode during editing for better performance

## Version History

### v2.1 (Current)
- Universal compatibility with all AE versions
- Fallback for effects not available in older versions
- Improved error handling
- Support for JSON parsing in CC 2014+

### v2.0
- Added wave effect
- Bloom effect support
- Better UI layout

### v1.0
- Initial release
- Camera import with keyframes
- Saber effect

## License

MIT - See LICENSE in repository
