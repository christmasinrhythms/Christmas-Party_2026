# MediaPipe for the try-on camera

- Runtime: `@mediapipe/tasks-vision` 0.10.32, from the npm registry. The JavaScript and WebAssembly are included verbatim.
- Model: Google MediaPipe Pose Landmarker Lite, float16 version 1. Both runtime and model files are served locally to the browser.
- Upstream project and license: https://github.com/google-ai-edge/mediapipe
- Model documentation: https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker

The Rock & Punk camera also uses [Google MediaPipe Face Landmarker](https://developers.google.com/edge/mediapipe/solutions/vision/face_landmarker), float16 version 1. Face tracking runs in the browser from the locally served model bundle.

`assets/tryon/rock-3d/face-topology.json` converts the surface positions, UV coordinates and triangles of the [MediaPipe canonical face model](https://github.com/google-ai-edge/mediapipe/blob/master/mediapipe/modules/face_geometry/data/canonical_face_model.obj) into arrays indexed by face landmark. Copyright Google LLC. Apache License 2.0.
