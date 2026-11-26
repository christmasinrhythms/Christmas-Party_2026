import { tryonSchools } from './tryon-looks.mjs?v=mirror-upper-body-20261126';
import { createSchoolFrame } from './tryon-frame.mjs?v=mirror-fit-20261126';

const copy = {
  en: {
    back: 'Ballroom', title: 'Try-on Camera', preview: 'Try-on preview', flip: 'Flip camera',
    welcome: 'Your Christmas look', framing: 'Keep both shoulders in view.',
    startCamera: 'Open camera', gallery: 'Choose a photo', captureMode: 'Capture mode',
    photo: 'Photo', video: 'Video', zoom: 'Camera zoom', wide: 'Wide', looks: 'Looks', rock: 'Rock', disco: 'Disco', jazz: 'Jazz',
    tracking: 'Follow shoulders', frame: 'Christmas frame',
    privacy: 'Photos and videos stay on this device.', close: 'Close', download: 'Download', share: 'Share',
    capturedPhoto: 'Captured try-on photo', capturedVideo: 'Captured try-on video',
    takePhoto: 'Take photo', startRecording: 'Start recording', stopRecording: 'Stop recording',
    startingCamera: 'Opening camera…', switchingCamera: 'Switching camera…',
    cameraFailed: 'Camera unavailable. Check permission or choose a photo.',
    cameraMissing: 'Open this page over HTTPS in Safari or Chrome to use the camera.',
    cameraEnded: 'Camera disconnected. Open it again or choose a photo.',
    imageFailed: 'Could not read this photo. Try a JPEG or PNG.',
    fitLoading: 'Starting shoulder tracking…', fitSearching: 'Step back until both shoulders are in view.',
    fitManual: 'Drag the look to adjust it.', fitUnavailable: 'Tracking unavailable. Drag the look to adjust it.',
    lookLoading: 'Loading look…', lookFailed: 'Could not load this look. Try another look or reload.',
    saving: 'Preparing preview…', captureFailed: 'Could not save this capture. Try again.',
    recordingUnavailable: 'Video recording is unavailable in this browser. You can still take photos.',
    recordingFailed: 'Recording could not be saved. Try a photo or reopen in Safari or Chrome.',
    shareFailed: 'Could not share. Use Download to save your file.', language: '繁中', languageLabel: '切換至繁體中文',
  },
  zh: {
    back: '宴會廳', title: '試穿相機', preview: '試穿預覽', flip: '轉換鏡頭',
    welcome: '試吓你嘅聖誕造型', framing: '請將兩邊肩膊一齊入鏡。',
    startCamera: '開啟相機', gallery: '從相簿選相', captureMode: '拍攝模式',
    photo: '拍照', video: '錄影', zoom: '相機縮放', wide: '廣角', looks: '試穿造型', rock: '搖滾', disco: '迪斯可', jazz: '爵士',
    tracking: '跟住肩位', frame: '聖誕相框', privacy: '相片同短片保留喺你嘅裝置。',
    close: '關閉', download: '下載', share: '分享', capturedPhoto: '試穿相片', capturedVideo: '試穿短片',
    takePhoto: '拍照', startRecording: '開始錄影', stopRecording: '停止錄影',
    startingCamera: '正在開啟相機…', switchingCamera: '正在轉換鏡頭…',
    cameraFailed: '相機未能開啟，請檢查權限或從相簿選相。',
    cameraMissing: '請用 Safari 或 Chrome 以 HTTPS 開啟此頁，然後再試相機。',
    cameraEnded: '鏡頭已中斷，請重新開啟相機或從相簿選相。',
    imageFailed: '讀取相片失敗。請試用 JPEG 或 PNG。',
    fitLoading: '正在啟動跟身功能…', fitSearching: '退後少少，等兩邊肩膊一齊入鏡。',
    fitManual: '拖動衣服可以調整位置。', fitUnavailable: '暫時未能跟身，可以拖動衣服調整位置。',
    lookLoading: '正在載入衣服…', lookFailed: '未能載入衣服，請試另一件或重新載入。',
    saving: '正在準備預覽…', captureFailed: '未能儲存，請再試一次。',
    recordingUnavailable: '這個瀏覽器未能錄影，仍然可以拍照。',
    recordingFailed: '未能儲存短片，請試拍照或用 Safari 或 Chrome 重開。',
    shareFailed: '未能分享，可以用「下載」儲存。', language: 'EN', languageLabel: 'Switch to English',
  },
};

const byId = (name) => document.getElementById(name);
const params = new URLSearchParams(location.search);
let language = params.get('lang') === 'zh' ? 'zh' : 'en';
const schoolCamera = document.documentElement.hasAttribute('data-tryon-camera');
const schoolCopy = {
  en: {
    title: 'Rock & Punk 3D Camera', welcome: 'Try on Rock & Punk', rock: 'Studded Vest',
    framing: 'Keep both shoulders in view and leave space above your head.',
    lookLoading: 'Loading the outfit…', lookFailed: 'The outfit did not load. Try selecting it again.',
    fitLoading: 'Starting face and body tracking…', fitSearching: 'Bring your face and shoulders into view.',
    fitUnavailable: 'Body tracking is unavailable in this browser.',
    fitManual: '', tracking: '3D vest', facePaint: 'Face paint', frame: 'Rock Christmas frame',
    gestureHint: 'Drag to move. Pinch to resize.',
    fitCanvas: 'Adjust outfit. Drag or use the arrow keys to move. Pinch or use plus and minus to resize.',
    resetMapping: 'Reset', resetOutfitLabel: 'Reset outfit position and size', remapping: 'Detecting your face and shoulders again…',
    fitPhotoMissing: 'Choose a photo that shows your face and both shoulders.',
  },
  zh: {
    back: '搖滾學院', title: 'Rock & Punk 3D 試穿', welcome: '試穿 Rock & Punk', rock: '銀釘背心',
    framing: '請將兩邊肩線一齊入鏡，頭頂預留少少空位。',
    lookLoading: '正在載入服裝…', lookFailed: '未能載入服裝，請再選一次。',
    fitLoading: '正在啟動面部同身體追蹤…', fitSearching: '請將面部同兩邊肩膊移入鏡頭。',
    fitUnavailable: '目前瀏覽器未能使用身體追蹤。',
    fitManual: '', tracking: '3D 背心', facePaint: '搖滾面妝', frame: '搖滾聖誕相框',
    gestureHint: '拖動服裝可移位，雙指捏合可縮放。',
    fitCanvas: '調整服裝。拖動或用方向鍵移位，雙指捏合或用加減鍵縮放。',
    resetMapping: '重設', resetOutfitLabel: '重設服裝位置同大小', remapping: '正在重新偵測面部同肩膊…',
    fitPhotoMissing: '請選一張見到面部同兩邊肩膊嘅相。',
  },
};
const requestedGenre = params.get('genre');
const genre = Object.hasOwn(tryonSchools, requestedGenre) ? requestedGenre : 'rock';
const school = tryonSchools[genre];
const studioCrest = byId('studio-crest');
if (studioCrest) {
  studioCrest.src = `assets/interior/school-crest-${genre}.png`;
  document.body.style.setProperty('--studio-tint', school.tint);
  document.body.style.setProperty('--studio-trim', school.trim);
}
const localized = (pair) => pair[language === 'zh' ? 1 : 0];
const canvas = byId('view');
const ctx = canvas.getContext('2d', { alpha: false });
const video = byId('camera-video');
const viewfinder = canvas.closest('.viewfinder');
const result = byId('result');
const shutter = byId('shutter');
const clock = byId('record-clock');
const looks = school.looks.map((entry) => {
  const button = document.createElement('button');
  const thumb = document.createElement('span');
  const image = new Image();
  const label = document.createElement('span');
  button.type = 'button';
  button.className = 'look';
  button.dataset.look = entry.id;
  thumb.className = `thumbnail ${genre}`;
  if (schoolCamera) {
    thumb.classList.add('look-photo');
    image.src = entry.preview ?? entry.reference;
    if (entry.focus && !entry.preview) {
      image.style.objectPosition = entry.focus;
      image.style.setProperty('--reference-focus', entry.focus);
      image.style.setProperty('--reference-zoom', entry.previewZoom);
    }
  } else {
    image.src = entry.src;
  }
  image.alt = '';
  image.decoding = 'async';
  thumb.append(image);
  button.append(thumb, label);
  byId('look-list').append(button);
  return { ...entry, button, image, labelNode: label };
});
const selectedFromGenre = looks.find((entry) => entry.id === params.get('look'));
const W = canvas.width;
const H = canvas.height;
const phoneCamera = matchMedia('(max-width: 700px)');
const zoomGroup = byId('camera-zoom');
const zoomButtons = [...zoomGroup.querySelectorAll('button')];
const limitSeconds = 15;
const defaultFit = { x: W * .5, y: H * .36, width: W * .67, angle: 0 };

let look = selectedFromGenre || looks[0];
const hasHeadEffect = () => Boolean(look.paint || look.head);
const t = (key) => {
  if (key === 'back') return localized(school.back);
  if (key === 'title') return localized(school.name) + (language === 'zh' ? ' 3D 試穿' : ' 3D Camera');
  if (key === 'welcome') return (language === 'zh' ? '試穿 ' : 'Try on ') + localized(school.name);
  if (key === 'tracking' && !look.paint) return language === 'zh' ? '3D 服裝' : '3D outfit';
  if (key === 'facePaint' && look.head) return localized(look.head.label);
  if (key === 'frame' && genre !== 'rock') return language === 'zh' ? '學院聖誕相框' : 'School Christmas frame';
  return schoolCopy[language][key] ?? copy[language][key];
};
let mode = 'photo';
let source = null;
let camera = null;
let facing = 'user';
let cameraZoom = 'wide';
let sourceInput = 0;
let cameraPending = false;
let mappingResetting = false;
let poseStatus = 'idle';
let poseLoading = null;
let tracker = null;
let faceTracker = null;
let trackerMode = 'VIDEO';
let modeChange = Promise.resolve();
let facePoints = null;
let faceAnchors = null;
let lastFaceAt = -Infinity;
let drawRockPaint = null;
let schoolFrame = null;
let headAsset = null;
let headwear = null;
let appearanceRequest = 0;
let rockLogo = null;
let previousVideoTime = -1;
let lastPoseTime = -Infinity;
let lastInferenceTime = -Infinity;
let lastTrackingAt = -Infinity;
let bodyFit = null;
let frozenFit = defaultFit;
const newOffset = () => ({ x: 0, y: 0, scale: 1, rotation: 0 });
let outfitOffset = newOffset();
const headOffset = newOffset();
let manualFit = null;
let hudStatus = '';
let previewError = '';
let recording = null;
let saving = false;
let resultFile = null;
let resultUrl = '';
let loop = 0;
const outfitPointers = new Map();
let rockVest = null;
let vestStatus = 'loading';
if (schoolCamera) {
  import('./rock-face-paint.mjs').then(({ paintRockFace }) => {
    drawRockPaint = paintRockFace;
    paintOnce();
    updateControls();
  }).catch(console.error);
  if (genre !== 'rock') {
    viewfinder.style.setProperty('--tryon-room-art', `url("assets/interior/${genre}.webp")`);
    viewfinder.style.setProperty('--tryon-tint', school.tint);
  }
  createSchoolFrame(genre, school, W, H).then((frame) => {
    schoolFrame = frame;
    paintOnce();
  }).catch(() => {});
  const logo = new Image();
  logo.src = new URL('./assets/logo.png', import.meta.url).href;
  logo.decode().then(() => {
    rockLogo = logo;
    paintOnce();
  }).catch(() => {});
  import('./rock-vest-3d.mjs?v=mirror-upper-body-20261126')
    .then(({ createRockVest }) => createRockVest(W, H))
    .then((vest) => {
      rockVest = vest;
      void loadAppearance();
      import('./rock-face-mesh.mjs').then(({ createRockFaceMesh }) => createRockFaceMesh(W, H, vest.renderLayer))
        .then(({ drawFaceMesh }) => {
          drawRockPaint = drawFaceMesh;
          paintOnce();
          updateControls();
        })
        .catch(() => {});
      if (source === 'photo' && trackingOn()) void fitGalleryPhoto();
      paintOnce();
      updateControls();
    })
    .catch((error) => {
      console.error('Try-on renderer could not load', error);
      vestStatus = 'error';
      updateControls();
    });
}

async function loadHeadwear(path) {
  const { createHeadwear } = await import('./tryon-headwear.mjs?v=mirror-upper-body-20261126');
  headwear ??= createHeadwear(W, H, rockVest.renderLayer);
  return headwear.load(path);
}

async function loadAppearance() {
  if (!rockVest) return;
  const selected = look;
  const request = ++appearanceRequest;
  vestStatus = 'loading';
  headAsset = null;
  updateControls();
  const [outfit, accessory] = await Promise.allSettled([
    rockVest.wear(selected), selected.head ? loadHeadwear(selected.head.model) : null,
  ]);
  if (request !== appearanceRequest) return;
  vestStatus = outfit.status === 'fulfilled' && outfit.value && accessory.status === 'fulfilled' ? 'ready' : 'error';
  headAsset = accessory.status === 'fulfilled' ? accessory.value : null;
  if (source === 'photo' && trackingNeeded()) void fitGalleryPhoto();
  paintOnce();
  updateControls();
}

const canRecord = typeof window.MediaRecorder === 'function' && typeof canvas.captureStream === 'function';
const statusNode = byId('status');
const selectPhoto = () => byId('gallery-input').click();
const formatClock = (seconds) => '00:' + String(seconds).padStart(2, '0');
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const trackingOn = () => byId('track-pose').checked;
const facePaintOn = () => schoolCamera && hasHeadEffect() && byId('show-face-paint').checked;
const trackingNeeded = () => trackingOn() || facePaintOn();
const fittedVestReady = () => trackingOn() && Boolean(rockVest && vestStatus === 'ready' && (bodyFit || manualFit));
const paintedFaceReady = () => facePaintOn() && Boolean((look.paint ? drawRockPaint : headAsset) && facePoints);
const fitBusy = () => Boolean(recording || saving || cameraPending || mappingResetting);
const canAdjustOutfit = () => Boolean(source && trackingOn() && garmentReady() && !fitBusy());
const garmentReady = () => schoolCamera ? vestStatus === 'ready' :
  look.image.complete && look.image.naturalWidth > 0;
const captureReady = () => schoolCamera
  ? (!trackingOn() || vestStatus !== 'loading') && Boolean(fittedVestReady() || paintedFaceReady() || !trackingNeeded())
  : garmentReady();

function refreshStatus() {
  const key = (mappingResetting && source ? 'remapping' : '') || previewError || hudStatus || (source && !garmentReady() && (!schoolCamera || trackingOn())
    ? ((schoolCamera ? vestStatus === 'error' : look.image.complete) ? 'lookFailed' : 'lookLoading')
    : source === 'camera'
      ? poseStatus === 'error' && trackingNeeded() && !captureReady() ? 'fitUnavailable'
        : trackingNeeded() && poseStatus === 'loading' ? 'fitLoading'
          : trackingNeeded() && !fittedVestReady() && !bodyFit && !paintedFaceReady() ? 'fitSearching' : ''
      : source === 'photo' ? trackingNeeded() && poseStatus === 'loading' ? 'fitLoading' : 'fitManual' : '');
  const value = key ? t(key) : '';
  if (statusNode.textContent !== value) statusNode.textContent = value;
}

function setLanguage() {
  document.documentElement.lang = language === 'zh' ? 'zh-Hant' : 'en';
  document.title = t('title') + ' · Christmas in Rhythms';
  document.querySelectorAll('[data-text]').forEach((el) => { el.textContent = t(el.dataset.text); });
  document.querySelectorAll('[data-label]').forEach((el) => {
    const label = t(el.dataset.label);
    el.setAttribute('aria-label', label);
    if (el.classList.contains('camera-icon')) el.title = label;
  });
  document.querySelectorAll('[data-alt]').forEach((el) => { el.alt = t(el.dataset.alt); });
  const button = byId('language');
  button.textContent = t('language');
  button.setAttribute('aria-label', t('languageLabel'));
  byId('back-link').href = `index.html?room=${genre}` + (language === 'zh' ? '&lang=zh' : '');
  looks.forEach((entry) => { entry.labelNode.textContent = localized(entry.label); });
  if (resultFile) byId('result-title').textContent = t(resultFile.type.startsWith('video/') ? 'capturedVideo' : 'capturedPhoto');
  updateControls();
}

function updateControls() {
  const active = Boolean(source);
  const busy = fitBusy();
  const canAdjust = canAdjustOutfit();
  byId('welcome').hidden = active || cameraPending;
  viewfinder.classList.toggle('has-source', active);
  viewfinder.classList.toggle('is-recording', Boolean(recording));
  byId('view-top').hidden = schoolCamera ? !active : source !== 'camera';
  byId('flip-camera').hidden = source !== 'camera';
  byId('flip-camera').disabled = busy;
  byId('capture-controls').hidden = !active;
  zoomGroup.hidden = source !== 'camera' || !phoneCamera.matches;
  for (const button of zoomButtons) {
    button.disabled = busy;
    button.setAttribute('aria-pressed', String(button.dataset.cameraZoom === cameraZoom));
  }
  byId('reset-mapping').disabled = busy;
  byId('outfit-gesture-hint').hidden = !canAdjust;
  viewfinder.classList.toggle('can-adjust', canAdjust);
  canvas.tabIndex = canAdjust ? 0 : -1;
  canvas.setAttribute('aria-hidden', String(!canAdjust));
  canvas.setAttribute('aria-label', t('fitCanvas'));
  if (!canAdjust) clearOutfitGesture();
  byId('gallery-button').disabled = busy;
  byId('back-to-camera').hidden = source !== 'photo';
  byId('back-to-camera').disabled = busy;
  byId('start-camera').disabled = cameraPending;
  document.querySelectorAll('[data-mode]').forEach((btn) => {
    const isVideo = btn.dataset.mode === 'video';
    btn.hidden = source === 'photo';
    btn.disabled = busy || (isVideo && !canRecord);
    btn.setAttribute('aria-pressed', String(mode === btn.dataset.mode));
    btn.title = t(isVideo && !canRecord ? 'recordingUnavailable' : btn.dataset.mode);
  });
  shutter.classList.toggle('video', mode === 'video');
  shutter.classList.toggle('recording', Boolean(recording));
  shutter.disabled = saving || cameraPending || mappingResetting || (!captureReady() && !recording);
  shutter.setAttribute('aria-label', t(mode === 'photo' ? 'takePhoto' : recording ? 'stopRecording' : 'startRecording'));
  clock.hidden = !recording;
  byId('head-effect-control').hidden = !hasHeadEffect();
  byId('track-pose').disabled = mappingResetting;
  byId('show-face-paint').disabled = mappingResetting;
  looks.forEach((entry) => {
    entry.button.disabled = busy;
    entry.button.setAttribute('aria-pressed', String(entry === look));
  });
  refreshStatus();
}

function stopTracks(stream) {
  stream?.getTracks().forEach((track) => track.stop());
}

function releaseCamera() {
  stopTracks(camera);
  camera = null;
  video.srcObject = null;
}

function clearOutfitGesture() {
  const pointers = [...outfitPointers.keys()];
  outfitPointers.clear();
  for (const id of pointers) {
    if (canvas.hasPointerCapture(id)) canvas.releasePointerCapture(id);
  }
  viewfinder.classList.remove('dragging');
}

function resetPosition() {
  clearOutfitGesture();
  outfitOffset = newOffset();
  manualFit = null;
}

function paintOnce() {
  if (source !== 'camera') paint();
}

function resetTracking() {
  rockVest?.reset();
  faceAnchors = null;
  facePoints = null;
  lastFaceAt = -Infinity;
  bodyFit = null;
  frozenFit = defaultFit;
  lastTrackingAt = -Infinity;
  lastPoseTime = -Infinity;
  previousVideoTime = -1;
}

function setSource(value) {
  source = value;
  clearOutfitGesture();
  resetTracking();
  previewError = '';
  if (value !== 'camera') mode = 'photo';
  cancelAnimationFrame(loop);
  if (value === 'camera') loop = requestAnimationFrame(cameraFrame);
  else paint();
  updateControls();
}

async function openCamera(nextFacing = 'user') {
  if (recording || saving) return;
  previewError = '';
  if (!navigator.mediaDevices?.getUserMedia) {
    previewError = 'cameraMissing';
    return refreshStatus();
  }
  const switching = source === 'camera';
  const id = ++sourceInput;
  cameraPending = true;
  if (switching) {
    releaseCamera();
    setSource(null);
  }
  hudStatus = switching ? 'switchingCamera' : 'startingCamera';
  updateControls();
  let acquired;
  try {
    const constraints = phoneCamera.matches
      ? { width: { ideal: 1280 }, resizeMode: { ideal: 'none' } }
      : { width: { ideal: 720 }, height: { ideal: 1280 } };
    acquired = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: nextFacing }, ...constraints },
      audio: false,
    });
    if (id !== sourceInput) return stopTracks(acquired);
    camera = acquired;
    const track = acquired.getVideoTracks()[0];
    if (phoneCamera.matches) {
      const minZoom = track.getCapabilities?.()?.zoom?.min;
      if (Number.isFinite(minZoom) && minZoom < (track.getSettings().zoom ?? 1)) {
        await track.applyConstraints({ ...track.getConstraints(), advanced: [{ zoom: minZoom }] }).catch(() => {});
      }
    }
    if (id !== sourceInput) return stopTracks(acquired);
    video.srcObject = acquired;
    await video.play();
    if (id !== sourceInput) return stopTracks(acquired);
    facing = track.getSettings().facingMode || nextFacing;
    track.addEventListener('ended', () => {
      if (camera !== acquired) return;
      if (recording) stopRecording();
      releaseCamera();
      setSource(null);
      previewError = 'cameraEnded';
      refreshStatus();
    });
    cameraZoom = 'wide';
    resetPosition();
    setSource('camera');
    if (trackingNeeded()) prepareCameraTracking();
  } catch {
    stopTracks(acquired);
    if (id !== sourceInput) return;
    if (camera === acquired) releaseCamera();
    previewError = 'cameraFailed';
  } finally {
    if (id === sourceInput) {
      cameraPending = false;
      hudStatus = '';
      updateControls();
    }
  }
}

let imageSource = null;
async function openPhoto(file) {
  if (!file || recording || saving) return;
  const id = ++sourceInput;
  cameraPending = true;
  previewError = '';
  updateControls();
  const localUrl = URL.createObjectURL(file);
  const image = new Image();
  try {
    image.src = localUrl;
    await image.decode();
    if (id !== sourceInput) return;
    releaseCamera();
    imageSource = image;
    resetPosition();
    setSource('photo');
    if (trackingNeeded()) fitGalleryPhoto();
  } catch {
    if (id === sourceInput) previewError = 'imageFailed';
  } finally {
    URL.revokeObjectURL(localUrl);
    if (id === sourceInput) {
      cameraPending = false;
      hudStatus = '';
      updateControls();
    }
  }
}

function prepareTracker() {
  if (poseLoading) return poseLoading;
  poseStatus = 'loading';
  refreshStatus();
  poseLoading = (async () => {
    try {
      const base = new URL('assets/tryon/vendor/mediapipe/', import.meta.url);
      const { FilesetResolver, PoseLandmarker, FaceLandmarker } = await import(new URL('vision_bundle.mjs', base));
      const files = await FilesetResolver.forVisionTasks(new URL('wasm/', base).href.replace(/\/$/, ''));
      const poseTask = PoseLandmarker.createFromOptions(files, {
        baseOptions: { modelAssetPath: new URL('pose-landmarker-lite.task', base).href, delegate: 'CPU' },
        runningMode: 'VIDEO',
        numPoses: 1,
        minPoseDetectionConfidence: .5,
        minPosePresenceConfidence: .5,
        minTrackingConfidence: .5,
        outputSegmentationMasks: schoolCamera,
      });
      const faceTask = schoolCamera ? FaceLandmarker.createFromOptions(files, {
        baseOptions: { modelAssetPath: new URL('face-landmarker.task', base).href, delegate: 'CPU' },
        runningMode: 'VIDEO',
        numFaces: 1,
      }) : Promise.resolve(null);
      const [poseResult, faceResult] = await Promise.allSettled([poseTask, faceTask]);
      tracker = poseResult.status === 'fulfilled' ? poseResult.value : null;
      faceTracker = faceResult.status === 'fulfilled' ? faceResult.value : null;
      poseStatus = tracker || faceTracker ? 'ready' : 'error';
    } catch {
      poseStatus = 'error';
    }
    refreshStatus();
  })();
  return poseLoading;
}

function setTrackingMode(mode) {
  modeChange = modeChange.catch(() => {}).then(async () => {
    if (mode === trackerMode) return;
    const [body, face] = await Promise.allSettled([
      // Static frames do not need the GPU-backed mask readback.
      tracker?.setOptions({ runningMode: mode, outputSegmentationMasks: schoolCamera && mode === 'VIDEO' }),
      faceTracker?.setOptions({ runningMode: mode }),
    ]);
    if (body.status === 'rejected') {
      tracker?.close();
      tracker = null;
    }
    if (face.status === 'rejected') {
      faceTracker?.close();
      faceTracker = null;
    }
    if (!tracker && !faceTracker) poseStatus = 'error';
    trackerMode = mode;
  });
  return modeChange;
}

function prepareCameraTracking() {
  const ready = prepareTracker();
  if (schoolCamera) void ready.then(() => {
    if (source === 'camera' && !mappingResetting) return setTrackingMode('VIDEO');
  });
}

function imageLayout(image) {
  const width = image.videoWidth || image.naturalWidth;
  const height = image.videoHeight || image.naturalHeight;
  if (!width || !height) return null;
  const cover = Math.max(W / width, H / height);
  const scale = image === video && phoneCamera.matches ? Math.min(W / width, H / height, cover * .85) : cover;
  const w = width * scale;
  const h = height * scale;
  return { x: (W - w) / 2, y: (H - h) / 2, w, h };
}

function cameraScale(layout) {
  if (source !== 'camera' || !phoneCamera.matches || cameraZoom === 'wide' || !layout) return 1;
  return Number(cameraZoom) * Math.max(W / layout.w, H / layout.h);
}

function mirrorOn() {
  return source === 'camera' && facing === 'user';
}

function landmarkPosition(point, layout) {
  const x = layout.x + point.x * layout.w;
  return { x: mirrorOn() ? W - x : x, y: layout.y + point.y * layout.h };
}

function detectFit(media, layout, now, still = false) {
  lastInferenceTime = Math.max(now, lastInferenceTime + 1);
  if (schoolCamera && faceTracker) {
    let nextFace;
    try {
      const result = still ? faceTracker.detect(media) : faceTracker.detectForVideo(media, lastInferenceTime);
      nextFace = result.faceLandmarks[0];
    } catch {
      faceTracker.close();
      faceTracker = null;
      if (!tracker) poseStatus = 'error';
    }
    if (nextFace) {
      faceAnchors = nextFace;
      facePoints = nextFace.map((point) => ({...landmarkPosition(point, layout), z: -point.z * layout.w}));
      lastFaceAt = now;
    } else if (now - lastFaceAt > 210) {
      faceAnchors = null;
      facePoints = null;
    }
  }
  if (schoolCamera) {
    if (!rockVest || !trackingOn()) return null;
    let fitted = false;
    function fit(result) {
      fitted = rockVest.update(result.landmarks[0], layout, mirrorOn(), faceAnchors, result.segmentationMasks?.[0]);
    }
    if (tracker) {
      try {
        if (still) tracker.detect(media, fit);
        else tracker.detectForVideo(media, lastInferenceTime, fit);
      } catch {
        tracker.close();
        tracker = null;
        if (!faceTracker) poseStatus = 'error';
      }
    }
    if (!tracker) fitted = rockVest.update(null, layout, mirrorOn(), faceAnchors);
    return fitted ? defaultFit : null;
  }
  const points = tracker.detectForVideo(media, lastInferenceTime).landmarks[0];
  if (!points || points[11].visibility < .55 || points[12].visibility < .55) return null;
  let left = landmarkPosition(points[11], layout);
  let right = landmarkPosition(points[12], layout);
  if (left.x > right.x) [left, right] = [right, left];
  const dx = right.x - left.x;
  const dy = right.y - left.y;
  const width = Math.hypot(dx, dy);
  if (width < W * .12) return null;
  return {
    x: (left.x + right.x) / 2,
    y: (left.y + right.y) / 2,
    width: clamp(width * 1.7, W * .25, W * 1.5),
    angle: clamp(Math.atan2(dy, dx), -.65, .65),
  };
}

function handleTrackerError() {
  tracker?.close();
  faceTracker?.close();
  tracker = null;
  faceTracker = null;
  faceAnchors = null;
  facePoints = null;
  poseStatus = 'error';
  bodyFit = null;
}

async function resetMapping() {
  if (!source || !trackingNeeded() || recording || saving || cameraPending || mappingResetting) return;
  const request = sourceInput;
  const live = source === 'camera';
  const image = live ? video : imageSource;
  const isCurrent = () => request === sourceInput;
  mappingResetting = true;
  previewError = '';
  resetPosition();
  resetTracking();
  paintOnce();
  updateControls();
  try {
    if (poseStatus === 'error' && !tracker && !faceTracker) {
      await modeChange.catch(() => {});
      if (!isCurrent()) return;
      poseLoading = null;
      trackerMode = 'VIDEO';
    }
    await prepareTracker();
    if (!isCurrent()) return;
    // IMAGE mode starts a fresh detection instead of inheriting a tracked ROI.
    await setTrackingMode('IMAGE');
    if (!isCurrent()) return;
    if (!tracker && !faceTracker) {
      previewError = 'fitUnavailable';
      return;
    }
    const layout = imageLayout(image);
    if (layout && (!live || video.readyState >= 2)) {
      bodyFit = detectFit(image, layout, performance.now(), true);
      if (bodyFit) {
        frozenFit = { ...bodyFit };
        lastTrackingAt = performance.now();
      }
    }
    if (!live && !bodyFit && !facePoints) previewError = 'fitPhotoMissing';
  } catch {
    handleTrackerError();
    previewError = 'fitUnavailable';
  } finally {
    if (source === 'camera') await setTrackingMode('VIDEO');
    mappingResetting = false;
    paintOnce();
    updateControls();
  }
}

async function fitGalleryPhoto() {
  const image = imageSource;
  await prepareTracker();
  if ((!tracker && !faceTracker) || source !== 'photo' || image !== imageSource || !trackingNeeded() || mappingResetting) return;
  if (schoolCamera) await setTrackingMode('IMAGE');
  if (source !== 'photo' || image !== imageSource || !trackingNeeded() || mappingResetting) return;
  try {
    const fit = detectFit(image, imageLayout(image), performance.now(), schoolCamera);
    if (fit) {
      bodyFit = fit;
      frozenFit = fit;
      manualFit = null;
    } else if (schoolCamera) bodyFit = null;
  } catch {
    handleTrackerError();
  }
  paintOnce();
  updateControls();
}

function trackShoulders(now, layout) {
  if (!trackingNeeded() || (!tracker && !faceTracker) || !layout || video.readyState < 2 ||
      (schoolCamera && trackerMode !== 'VIDEO')) return;
  if (video.currentTime !== previousVideoTime && now - lastPoseTime >= (schoolCamera ? 66 : 84)) {
    lastPoseTime = now;
    previousVideoTime = video.currentTime;
    try {
      const next = detectFit(video, layout, now);
      if (next) {
        if (!bodyFit) bodyFit = next;
        else {
          for (const key of Object.keys(next)) bodyFit[key] += (next[key] - bodyFit[key]) * .39;
        }
        frozenFit = { ...bodyFit };
        manualFit = null;
        lastTrackingAt = now;
      }
    } catch {
      handleTrackerError();
    }
  }
  if (now - lastTrackingAt > 640) bodyFit = null;
  if (schoolCamera && now - lastFaceAt > 350) {
    faceAnchors = null;
    facePoints = null;
  }
}

function cameraFrame(now) {
  if (source !== 'camera') return;
  const layout = imageLayout(video);
  const couldCapture = schoolCamera && captureReady();
  if (!mappingResetting) trackShoulders(now, layout);
  if (schoolCamera && couldCapture !== captureReady()) updateControls();
  paint(layout);
  refreshStatus();
  loop = requestAnimationFrame(cameraFrame);
}

function drawFrame() {
  if (schoolFrame) {
    ctx.drawImage(schoolFrame, 0, 0, W, H);
    ctx.save();
    ctx.textAlign = 'center';
    ctx.shadowColor = '#180507';
    ctx.shadowBlur = 7;
    ctx.fillStyle = '#fff0c2';
    ctx.font = 'bold 60px Georgia, serif';
    ctx.fillText(school.marque, W / 2, 73, W * .81);
    if (rockLogo) {
      const logoWidth = W * .56;
      const logoHeight = logoWidth * rockLogo.naturalHeight / rockLogo.naturalWidth;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#160807';
      ctx.drawImage(rockLogo, (W - logoWidth) / 2, H - 20 - logoHeight, logoWidth, logoHeight);
    }
    ctx.restore();
    return;
  }
  const edge = 24;
  const section = 98;
  ctx.save();
  const shade = ctx.createLinearGradient(0, H * .86, 0, H);
  shade.addColorStop(0, 'transparent');
  shade.addColorStop(1, 'rgba(40,18,16,.66)');
  ctx.fillStyle = shade;
  ctx.fillRect(0, H * .86, W, H * .14);
  ctx.strokeStyle = 'rgba(248,211,146,.90)';
  ctx.lineWidth = 2;
  for (const [x, y, sx, sy] of [[edge, edge, 1, 1], [W - edge, edge, -1, 1],
    [edge, H - edge, 1, -1], [W - edge, H - edge, -1, -1]]) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(sx, sy);
    ctx.beginPath();
    ctx.moveTo(section, 0);
    ctx.lineTo(20, 0);
    ctx.quadraticCurveTo(0, 0, 0, 20);
    ctx.lineTo(0, section);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(12, 50);
    ctx.quadraticCurveTo(24, 21, 50, 12);
    ctx.stroke();
    ctx.fillStyle = '#fff0c5';
    for (const [sx, sy, size] of [[42, 35, 8], [61, 20, 4], [22, 62, 4]]) {
      ctx.beginPath();
      ctx.moveTo(sx, sy - size);
      ctx.lineTo(sx + size / 3, sy - size / 3);
      ctx.lineTo(sx + size, sy);
      ctx.lineTo(sx + size / 3, sy + size / 3);
      ctx.lineTo(sx, sy + size);
      ctx.lineTo(sx - size / 3, sy + size / 3);
      ctx.lineTo(sx - size, sy);
      ctx.lineTo(sx - size / 3, sy - size / 3);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }
  ctx.fillStyle = '#fff0d5';
  ctx.textAlign = 'center';
  ctx.font = 'italic 33px Georgia, serif';
  ctx.fillText('Christmas in Rhythms', W / 2, H - 47);
  ctx.restore();
}

// Ordered MediaPipe face perimeter, from the hairline around the jaw.
const faceOval = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377,
  152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];

function drawGarment() {
  ctx.save();
  if (facePoints) {
    // Keep the real lower face in front of the clothing, including during a manual refit.
    const jaw = new Path2D();
    jaw.rect(0, 0, W, H);
    for (const [index, id] of faceOval.entries()) {
      const point = facePoints[id];
      if (index === 0) jaw.moveTo(point.x, point.y);
      else jaw.lineTo(point.x, point.y);
    }
    jaw.closePath();
    ctx.clip(jaw, 'evenodd');
  }
  rockVest.draw(ctx, outfitOffset, manualFit);
  ctx.restore();
}

function paint(layout) {
  const media = source === 'camera' ? video : source === 'photo' ? imageSource : null;
  const placement = media && (layout || imageLayout(media));
  ctx.fillStyle = source ? '#281918' : '#352326';
  ctx.fillRect(0, 0, W, H);
  if (!placement || (source === 'camera' && video.readyState < 2)) return;

  // Scale the already aligned camera and filters together. The Christmas frame stays fixed.
  const zoom = cameraScale(placement);
  ctx.save();
  ctx.translate(W * (1 - zoom) / 2, H * (1 - zoom) / 2);
  ctx.scale(zoom, zoom);
  ctx.save();
  if (mirrorOn()) {
    ctx.translate(W, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(media, placement.x, placement.y, placement.w, placement.h);
  ctx.restore();

  if (schoolCamera) {
    if (fittedVestReady()) drawGarment();
    if (paintedFaceReady()) {
      if (look.paint) drawRockPaint(ctx, facePoints, mirrorOn());
      else headwear.draw(ctx, headAsset, facePoints, headOffset, facePoints, look.head);
    }
  } else if (garmentReady()) {
    const offset = outfitOffset;
    const fit = (source === 'camera' && trackingOn() && bodyFit) || frozenFit;
    const width = fit.width * offset.scale;
    const height = width * look.image.naturalHeight / look.image.naturalWidth;
    ctx.save();
    ctx.translate(fit.x + offset.x, fit.y + offset.y);
    ctx.rotate(fit.angle + offset.rotation * Math.PI / 180);
    ctx.drawImage(look.image, -width / 2, -.145 * height, width, height);
    ctx.restore();
  }
  ctx.restore();
  if (byId('show-frame').checked) drawFrame();
}

function showResult(blob, type) {
  if (!blob?.size) throw new Error('Empty capture');
  const mime = blob.type.split(';')[0];
  const extension = type === 'photo' ? 'jpg' : mime === 'video/mp4' ? 'mp4' : 'webm';
  const fileName = 'christmas-in-rhythms-' + Date.now() + '.' + extension;
  if (resultUrl) URL.revokeObjectURL(resultUrl);
  resultFile = new File([blob], fileName, { type: mime || (type === 'photo' ? 'image/jpeg' : 'video/webm') });
  resultUrl = URL.createObjectURL(resultFile);

  const picture = byId('result-photo');
  const player = byId('result-video');
  player.pause();
  if (type === 'video') {
    picture.removeAttribute('src');
    player.src = resultUrl;
  } else {
    player.removeAttribute('src');
    player.load();
    picture.src = resultUrl;
  }
  picture.hidden = type !== 'photo';
  player.hidden = type !== 'video';
  byId('result-title').textContent = t(type === 'photo' ? 'capturedPhoto' : 'capturedVideo');
  const download = byId('download');
  download.href = resultUrl;
  download.download = fileName;
  byId('share').hidden = !(navigator.share && navigator.canShare?.({ files: [resultFile] }));
  if (!result.open) result.showModal();
}

async function snap() {
  if (!source || cameraPending || saving || !captureReady()) return;
  saving = true;
  previewError = '';
  hudStatus = 'saving';
  updateControls();
  try {
    paint();
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', .94));
    showResult(blob, 'photo');
  } catch {
    previewError = 'captureFailed';
  } finally {
    hudStatus = '';
    saving = false;
    updateControls();
  }
}

function readRecorders(stream) {
  const types = ['video/mp4', 'video/webm;codecs=vp8', 'video/webm', ''];
  for (const mimeType of types) {
    if (mimeType && !MediaRecorder.isTypeSupported?.(mimeType)) continue;
    try {
      const options = { videoBitsPerSecond: 3_500_000 };
      if (mimeType) options.mimeType = mimeType;
      const instance = new MediaRecorder(stream, options);
      instance.start(250);
      return instance;
    } catch {
      // Some browsers advertise a container that they can't start encoding.
    }
  }
  return null;
}

function startRecording() {
  if (source !== 'camera' || cameraPending || recording || saving || !captureReady()) return;
  previewError = '';
  if (!canRecord) {
    previewError = 'recordingUnavailable';
    return refreshStatus();
  }
  let stream;
  let recorder;
  try {
    paint();
    stream = canvas.captureStream(24);
    recorder = readRecorders(stream);
    if (!recorder) throw new Error('Unsupported recorder');
  } catch {
    stopTracks(stream);
    previewError = 'recordingFailed';
    return updateControls();
  }
  const entry = { recorder, stream, startedAt: performance.now(), chunks: [], timer: null, failed: false };
  recording = entry;
  clock.textContent = formatClock(0);
  recorder.ondataavailable = (event) => { if (event.data.size) entry.chunks.push(event.data); };
  recorder.onerror = () => { entry.failed = true; stopRecording(); };
  recorder.onstop = () => {
    clearInterval(entry.timer);
    stopTracks(stream);
    if (recording !== entry) return;
    recording = null;
    saving = false;
    hudStatus = '';
    try {
      if (entry.failed) throw new Error('Encoder failed');
      showResult(new Blob(entry.chunks, { type: recorder.mimeType || entry.chunks[0]?.type }), 'video');
    } catch {
      previewError = 'recordingFailed';
    }
    updateControls();
  };
  entry.timer = setInterval(() => {
    const seconds = (performance.now() - entry.startedAt) / 1000;
    clock.textContent = formatClock(Math.min(limitSeconds, Math.floor(seconds)));
    if (seconds >= limitSeconds) stopRecording();
  }, 100);
  updateControls();
}

function stopRecording() {
  if (!recording) return;
  clearInterval(recording.timer);
  if (recording.recorder.state !== 'inactive') {
    saving = true;
    updateControls();
    recording.recorder.stop();
  }
}

function capture() {
  if (recording) stopRecording();
  else if (mode === 'photo') void snap();
  else startRecording();
}

for (const entry of looks) {
  entry.button.addEventListener('click', () => {
    if (recording || saving || (entry === look && vestStatus !== 'error')) return;
    look = entry;
    params.set('look', entry.id);
    history.replaceState(null, '', location.pathname + '?' + params.toString());
    previewError = '';
    resetPosition();
    byId('track-pose').checked = true;
    byId('show-face-paint').checked = hasHeadEffect();
    setLanguage();
    void loadAppearance();
  });
}
document.querySelectorAll('[data-mode]').forEach((button) => button.addEventListener('click', () => {
  if (recording || saving) return;
  mode = button.dataset.mode;
  previewError = '';
  updateControls();
}));
byId('language').addEventListener('click', () => {
  language = language === 'en' ? 'zh' : 'en';
  if (language === 'zh') params.set('lang', 'zh');
  else params.delete('lang');
  const query = params.toString();
  history.replaceState(null, '', location.pathname + (query ? '?' + query : ''));
  setLanguage();
});
byId('start-camera').addEventListener('click', () => void openCamera());
byId('back-to-camera').addEventListener('click', () => void openCamera());
byId('flip-camera').addEventListener('click', () => void openCamera(facing === 'user' ? 'environment' : 'user'));
for (const button of zoomButtons) {
  button.addEventListener('click', () => {
    cameraZoom = button.dataset.cameraZoom;
    updateControls();
  });
}
phoneCamera.addEventListener('change', updateControls);
byId('welcome-gallery').addEventListener('click', selectPhoto);
byId('gallery-button').addEventListener('click', selectPhoto);
byId('gallery-input').addEventListener('change', (event) => {
  const file = event.target.files[0];
  event.target.value = '';
  void openPhoto(file);
});
byId('track-pose').addEventListener('change', () => {
  if (schoolCamera && !trackingOn()) {
    rockVest?.reset();
    bodyFit = manualFit = null;
  }
  if (source === 'camera' && trackingOn()) prepareCameraTracking();
  if (source === 'photo' && trackingOn()) fitGalleryPhoto();
  paintOnce();
  updateControls();
});
byId('show-face-paint')?.addEventListener('change', () => {
  if (source === 'camera' && trackingNeeded()) prepareCameraTracking();
  if (source === 'photo' && trackingNeeded()) void fitGalleryPhoto();
  paintOnce();
  updateControls();
});
byId('show-frame').addEventListener('change', paintOnce);
byId('reset-mapping').addEventListener('click', () => {
  if (trackingNeeded()) {
    void resetMapping();
  } else {
    resetPosition();
    frozenFit = defaultFit;
    paintOnce();
  }
});

function gestureFrame() {
  const [first, second] = outfitPointers.values();
  return second ? {
    x: (first.x + second.x) / 2,
    y: (first.y + second.y) / 2,
    span: Math.hypot(second.x - first.x, second.y - first.y),
  } : { ...first, span: 0 };
}

function adjustOutfit(dx, dy, ratio = 1) {
  if (schoolCamera && !bodyFit && !manualFit) manualFit = rockVest.fittedSnapshot();
  outfitOffset.x = clamp(outfitOffset.x + dx, -W, W);
  outfitOffset.y = clamp(outfitOffset.y + dy, -H * .85, H * .85);
  outfitOffset.scale = clamp(outfitOffset.scale * ratio, .35, 2);
  paintOnce();
  if (manualFit && !bodyFit && shutter.disabled) updateControls();
}

canvas.addEventListener('pointerdown', (event) => {
  if (!canAdjustOutfit() || event.button !== 0 || outfitPointers.size >= 2) return;
  outfitPointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  canvas.setPointerCapture(event.pointerId);
  viewfinder.classList.add('dragging');
});
canvas.addEventListener('pointermove', (event) => {
  if (!outfitPointers.has(event.pointerId)) return;
  const before = gestureFrame();
  outfitPointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  const after = gestureFrame();
  const bounds = canvas.getBoundingClientRect();
  const zoom = cameraScale(imageLayout(video));
  const ratio = before.span > 6 && after.span > 6 ? after.span / before.span : 1;
  adjustOutfit(
    (after.x - before.x) * W / (bounds.width * zoom),
    (after.y - before.y) * H / (bounds.height * zoom),
    ratio,
  );
});
for (const name of ['lostpointercapture', 'pointercancel', 'pointerup']) {
  canvas.addEventListener(name, (event) => {
    outfitPointers.delete(event.pointerId);
    if (!outfitPointers.size) viewfinder.classList.remove('dragging');
  });
}
canvas.addEventListener('keydown', (event) => {
  if (!canAdjustOutfit()) return;
  const directions = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };
  const direction = directions[event.key];
  const ratio = event.key === '+' || event.key === '=' ? 1.05 : event.key === '-' ? 1 / 1.05 : 1;
  if (!direction && ratio === 1) return;
  event.preventDefault();
  const step = (event.shiftKey ? 20 : 5) / cameraScale(imageLayout(video));
  adjustOutfit((direction?.[0] || 0) * step, (direction?.[1] || 0) * step, ratio);
});
canvas.addEventListener('wheel', (event) => {
  if (!event.ctrlKey || !canAdjustOutfit()) return;
  event.preventDefault();
  adjustOutfit(0, 0, Math.exp(clamp(-event.deltaY * .012, -.25, .25)));
}, { passive: false });
shutter.addEventListener('click', capture);
byId('result-close').addEventListener('click', () => result.close());
result.addEventListener('close', () => {
  byId('result-video').pause();
  if (source) shutter.focus({ preventScroll: true });
});
byId('share').addEventListener('click', async () => {
  if (!resultFile) return;
  try {
    await navigator.share({ files: [resultFile] });
  } catch (error) {
    if (error.name === 'AbortError') return;
    byId('download').focus({ preventScroll: true });
    byId('result-title').textContent = t('shareFailed');
  }
});
addEventListener('pagehide', () => {
  ++sourceInput;
  if (recording) stopRecording();
  releaseCamera();
  setSource(null);
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden && recording) stopRecording();
});
setLanguage();
paint();
