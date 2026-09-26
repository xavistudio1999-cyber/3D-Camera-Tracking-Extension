# 3D Camera Tracking Extension

A lightweight, deterministic 3D camera tracker for image sequences and video. It uses OpenCV's sparse feature tracking, essential-matrix pose estimation, keyframe re-localisation, and bundle adjustment-friendly exports instead of a heavy neural pipeline.

> This is an engine and CLI MVP. It exports a camera solution in a neutral JSON format that can be imported into After Effects, Blender, or a custom host extension. It does not attempt to replace a full visual-effects suite: metric scale and absolute world orientation cannot be recovered from a monocular video without scene measurements.

## Features

- Sparse **KLT optical flow** with Shi–Tomasi feature detection
- Forward/backward flow validation and RANSAC outlier rejection
- Essential matrix + `recoverPose` camera-motion estimation
- Automatic keyframe re-detection when tracks become unreliable
- Optional known camera intrinsics (recommended for accuracy)
- JSON export containing camera poses, intrinsics, and tracked 2D points
- No GPU, model download, or proprietary runtime required

## Requirements

- Python 3.10+
- OpenCV 4.8+ and NumPy

```bash
python -m venv .venv
source .venv/bin/activate       # Windows: .venv\\Scripts\\activate
pip install -e .
```

## Usage

```bash
camera-track input.mp4 --output solution.json
camera-track input.mp4 --output solution.json \\
  --fx 1450 --fy 1450 --cx 960 --cy 540 --fps 30
```

If intrinsics are omitted, a reasonable focal-length estimate is used. For production work, calibrate the lens first and pass `fx`, `fy`, `cx`, and `cy`; this significantly improves rotation and translation direction.

The JSON contains poses as camera-to-world 4×4 matrices. Translation is up to an unknown scale, as is mathematically unavoidable with a single camera. Use `--min-features` to trade speed for robustness.

## Design notes

1. Frames are decoded once and converted to grayscale.
2. Existing points are tracked using pyramidal Lucas–Kanade flow.
3. Tracks that fail forward/backward consistency are removed.
4. A robust essential matrix estimates relative motion; `recoverPose` selects the physically valid solution.
5. New features are detected only when needed, reducing CPU use on long shots.
6. Failed frames are reported rather than silently producing a misleading solution.

The engine intentionally does not hallucinate depth. For a reliable solve, use footage with visible parallax, limited motion blur, and textured, non-reflective surfaces.

## Development

```bash
pip install -e '.[dev]'
pytest
```

## License

MIT
