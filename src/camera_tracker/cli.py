from __future__ import annotations

import argparse
import sys

from .tracker import CameraTracker, TrackerConfig, TrackingError


def main() -> int:
    parser = argparse.ArgumentParser(description="Lightweight 3D camera tracker")
    parser.add_argument("video")
    parser.add_argument("--output", "-o", required=True)
    parser.add_argument("--fx", type=float, help="Focal length in pixels")
    parser.add_argument("--fy", type=float, help="Accepted for CLI compatibility; fx is used")
    parser.add_argument("--cx", type=float)
    parser.add_argument("--cy", type=float)
    parser.add_argument("--fps", type=float, default=30.0)
    parser.add_argument("--min-features", type=int, default=120)
    args = parser.parse_args()
    focal = args.fx or args.fy
    principal = (args.cx, args.cy) if args.cx is not None and args.cy is not None else None
    config = TrackerConfig(focal_length=focal, principal_point=principal,
                           fps=args.fps, min_features=args.min_features)
    try:
        CameraTracker(config).export(args.video, args.output)
    except TrackingError as error:
        print(f"camera-track: {error}", file=sys.stderr)
        return 2
    print(f"Wrote tracking solution to {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
