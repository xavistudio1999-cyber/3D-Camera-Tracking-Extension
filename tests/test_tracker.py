import numpy as np

from camera_tracker.tracker import CameraTracker, TrackerConfig


def test_intrinsics_have_expected_shape():
    matrix = CameraTracker()._intrinsics(1920, 1080)
    assert matrix.shape == (3, 3)
    assert np.allclose(matrix[2], [0, 0, 1])


def test_empty_feature_tracking_is_safe():
    tracker = CameraTracker(TrackerConfig())
    old, new = tracker._track(np.zeros((20, 20), np.uint8), np.zeros((20, 20), np.uint8), np.empty((0, 2), np.float32))
    assert old.shape == (0, 2)
    assert new.shape == (0, 2)
