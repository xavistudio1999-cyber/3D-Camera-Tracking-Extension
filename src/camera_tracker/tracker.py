from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any
import json

import cv2
import numpy as np


class TrackingError(RuntimeError):
    """Raised when a frame cannot be solved reliably."""


@dataclass(slots=True)
class TrackerConfig:
    max_features: int = 1800
    min_features: int = 120
    min_inliers: int = 30
    quality_level: float = 0.01
    min_distance: float = 8.0
    fb_threshold: float = 1.5
    ransac_threshold: float = 1.0
    focal_length: float | None = None
    principal_point: tuple[float, float] | None = None
    fps: float = 30.0


class CameraTracker:
    """Sparse monocular tracker with conservative failure handling."""

    def __init__(self, config: TrackerConfig | None = None) -> None:
        self.config = config or TrackerConfig()

    def _intrinsics(self, width: int, height: int) -> np.ndarray:
        f = self.config.focal_length or max(width, height) * 1.2
        cx, cy = self.config.principal_point or (width / 2.0, height / 2.0)
        return np.array([[f, 0, cx], [0, f, cy], [0, 0, 1]], dtype=np.float64)

    def _detect(self, image: np.ndarray) -> np.ndarray:
        points = cv2.goodFeaturesToTrack(
            image, maxCorners=self.config.max_features,
            qualityLevel=self.config.quality_level,
            minDistance=self.config.min_distance,
            blockSize=7, useHarrisDetector=False,
        )
        if points is None:
            return np.empty((0, 2), dtype=np.float32)
        return points.reshape(-1, 2).astype(np.float32)

    def _track(self, previous: np.ndarray, current: np.ndarray, points: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
        if len(points) < 8:
            return np.empty((0, 2), np.float32), np.empty((0, 2), np.float32)
        params = dict(winSize=(21, 21), maxLevel=3,
                      criteria=(cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 30, 0.01))
        next_points, ok1, _ = cv2.calcOpticalFlowPyrLK(previous, current, points.reshape(-1, 1, 2), None, **params)
        if next_points is None:
            return np.empty((0, 2), np.float32), np.empty((0, 2), np.float32)
        back_points, ok2, _ = cv2.calcOpticalFlowPyrLK(current, previous, next_points, None, **params)
        if back_points is None:
            return np.empty((0, 2), np.float32), np.empty((0, 2), np.float32)
        forward = next_points.reshape(-1, 2)
        backward = back_points.reshape(-1, 2)
        valid = (ok1.reshape(-1).astype(bool) & ok2.reshape(-1).astype(bool) &
                 (np.linalg.norm(points - backward, axis=1) <= self.config.fb_threshold))
        return points[valid], forward[valid]

    def track(self, video: str | Path) -> dict[str, Any]:
        capture = cv2.VideoCapture(str(video))
        if not capture.isOpened():
            raise TrackingError(f"Cannot open video: {video}")
        ok, first = capture.read()
        if not ok or first is None:
            capture.release()
            raise TrackingError("Video contains no readable frames")
        height, width = first.shape[:2]
        k = self._intrinsics(width, height)
        previous = cv2.cvtColor(first, cv2.COLOR_BGR2GRAY)
        points = self._detect(previous)
        pose = np.eye(4, dtype=np.float64)
        frames: list[dict[str, Any]] = [{"frame": 0, "time": 0.0, "camera_to_world": pose.tolist(), "inliers": len(points)}]
        frame_index = 0
        while True:
            ok, image = capture.read()
            if not ok:
                break
            frame_index += 1
            current = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            old_points, new_points = self._track(previous, current, points)
            inliers = 0
            if len(old_points) >= 8:
                essential, mask = cv2.findEssentialMat(old_points, new_points, k, cv2.RANSAC,
                                                       0.999, self.config.ransac_threshold)
                if essential is not None and mask is not None:
                    _, rotation, translation, pose_mask = cv2.recoverPose(essential, old_points, new_points, k, mask=mask)
                    good = pose_mask.reshape(-1).astype(bool)
                    inliers = int(good.sum())
                    if inliers >= self.config.min_inliers:
                        step = np.eye(4, dtype=np.float64)
                        step[:3, :3] = rotation.T
                        step[:3, 3] = (-rotation.T @ translation.reshape(3))
                        pose = pose @ step
                        old_points, new_points = old_points[good], new_points[good]
            if len(new_points) < self.config.min_features:
                new_points = self._detect(current)
            frames.append({"frame": frame_index, "time": frame_index / self.config.fps,
                           "camera_to_world": pose.tolist(), "inliers": inliers,
                           "tracked_points": int(len(new_points))})
            previous, points = current, new_points
        capture.release()
        if len(frames) < 2:
            raise TrackingError("Video must contain at least two frames")
        return {"schema": "camera-tracker/v1", "width": width, "height": height,
                "fps": self.config.fps, "intrinsics": k.tolist(),
                "scale": "arbitrary", "frames": frames}

    def export(self, video: str | Path, output: str | Path) -> None:
        result = self.track(video)
        Path(output).write_text(json.dumps(result, indent=2), encoding="utf-8")
