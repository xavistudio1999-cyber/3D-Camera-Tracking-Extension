# Premiere Pro Integration

## Camera Tracker + Saber Effect for Premiere Pro

### Features

- **Camera Tracking Import** — Load JSON solution directly into Premiere Pro
- **Saber Effect Generator** — Create glowing light sword effects
- **Volna 2-style Wave Animation** — Procedural wave distortion effects
- **Bloom & Glow** — Configurable bloom and gaussian blur effects
- **Real-time Preview** — See changes as you adjust parameters

### Installation

#### Option 1: CEP Extension (Recommended)

1. Create directory:
   ```
   %APPDATA%\Adobe\CEP\extensions\CameraTrackerImporter
   ```

2. Copy files:
   ```
   camera_tracker_saber.jsx
   saber_generator.jsx
   ```

3. Restart Premiere Pro

4. Open panel: **Window → Extensions → Camera Tracker Importer**

#### Option 2: Manual Script Execution

1. In Premiere Pro: **File → Scripts → Run Script File...**
2. Select `camera_tracker_saber.jsx`

### Usage

#### Import Camera Solution

1. Generate camera tracking:
   ```bash
   camera-track input.mp4 --output solution.json
   ```

2. Click "Import Camera Solution (JSON)"
3. Select the `solution.json` file
4. An adjustment layer will be created with the camera data

#### Create Saber Effect

1. **Blade Color**: Enter hex color (e.g., `#FF0000` for red)
2. **Glow Intensity**: 0-100 (higher = more glow)
3. **Glow Radius**: 5-50 pixels
4. **Line Thickness**: 2-30 pixels
5. **Enable Bloom**: Toggle bloom effect
6. Click **Create Saber Effect**

The effect will be added as an adjustment layer to your sequence.

#### Create Wave Effect

1. Enable "Wave Animation (Volna 2 style)" checkbox
2. Click **Create Wave Effect**
3. Adjust parameters to customize the wave animation

### Parameters

| Parameter | Range | Effect |
|-----------|-------|--------|
| Blade Color | Hex (#RRGGBB) | Color of the saber blade |
| Glow Intensity | 0-100 | Brightness of the glow effect |
| Glow Radius | 5-50 px | Size of the glow blur |
| Line Thickness | 2-30 px | Width of the saber line |
| Bloom Effect | On/Off | Adds bloom for neon look |
| Wave Animation | On/Off | Enable Volna 2-style wave |

### Keyboard Shortcuts

- **Ctrl+Shift+S** — Open script console for debugging
- **Window → Extensions → Camera Tracker** — Toggle panel

### Compatibility

- **Premiere Pro**: 2019 or later
- **Operating Systems**: Windows 10/11, macOS 10.13+
- **GPU**: Recommended for real-time preview

### Troubleshooting

#### Panel doesn't appear
- Ensure CEP is enabled: **Edit → Preferences → Security (CEP)**
- Check that extension folder path is correct
- Restart Premiere Pro

#### Effects not applying
- Verify you have an active sequence
- Import a video clip first
- Check Premiere Pro version (2019+)

#### JSON import fails
- Ensure `solution.json` is from `camera-track` tool
- Check file encoding is UTF-8
- Verify JSON structure: `{"frames": [...], "intrinsics": [...]}`

### Scripting API

You can extend the functionality by modifying the JSX files:

```javascript
// Generate saber pixels
var pixels = generateSaberPixels(
    1920,      // width
    1080,      // height
    960,       // center X
    540,       // center Y
    45,        // angle (degrees)
    600,       // length
    8,         // thickness
    "FF0000",  // color (hex)
    20         // glow radius
);

// Apply gaussian blur for bloom
var blurred = applyGaussianBlur(pixels, 20, 1920, 1080);

// Generate wave frame
var wavePixels = generateWaveFrame(
    1920,      // width
    1080,      // height
    0.5,       // time (0-1)
    10,        // amplitude
    3.0,       // frequency
    200        // wavelength
);
```

### Performance Notes

- **Glow Radius > 50px** may cause slowdown
- **Wave Animation** on 4K+ requires GPU acceleration
- Use Proxy Mode for smooth playback during editing
- Export with 1/2 or 1/4 resolution for faster processing

### Examples

#### Red Saber (Star Wars style)
- Color: `#FF0000`
- Glow: 75
- Radius: 25 px
- Thickness: 10 px
- Bloom: Enabled

#### Blue Saber (Sci-fi style)
- Color: `#0099FF`
- Glow: 85
- Radius: 30 px
- Thickness: 8 px
- Bloom: Enabled

#### Electric Arc (Tesla effect)
- Color: `#FFFF00`
- Glow: 100
- Radius: 15 px
- Thickness: 3 px
- Wave: Enabled

### Support & Issues

For bugs, feature requests, or questions:
1. Check Premiere Pro console for error messages
2. Verify your `solution.json` format
3. Post an issue on the GitHub repository

### License

MIT — See LICENSE file in repository root
