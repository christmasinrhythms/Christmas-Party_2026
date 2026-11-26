import * as THREE from './assets/tryon/vendor/three/three.module.min.js';
import { GLTFLoader } from './assets/tryon/vendor/three/GLTFLoader.js';
import { measureShoulderOutline } from './rock-shoulder-fit.mjs';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const average = (a, b) => a.clone().add(b).multiplyScalar(.5);
const up = new THREE.Vector3(0, 1, 0);
const front = new THREE.Vector3(0, 0, 1);
const landmarks = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 23, 24];
const between = (a, b, amount) => a.clone().lerp(b, amount);

export async function createRockVest(width, height) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
  renderer.setSize(width, height, false);
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(0, width, 0, -height, 1, 5000);
  camera.position.z = 2000;
  const fill = new THREE.HemisphereLight(0xf1f4ff, 0xf8d7b7, 2.2);
  const key = new THREE.DirectionalLight(0xfff2e4, 3.1);
  key.position.set(-2, 4, 6);
  const rim = new THREE.DirectionalLight(0xdbe6ff, 2.1);
  rim.position.set(5, 2, 2);
  scene.add(fill, key, rim);

  const capsuleGeometry = new THREE.CapsuleGeometry(1, 1, 4, 8);
  const occlusionMaterial = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: true });
  const models = new Map();
  let model = null;
  let desiredLook = null;

  const loader = new GLTFLoader();

  async function loadGarment(look) {
    const { scene: vest } = await loader.loadAsync(new URL(look.model, import.meta.url).href);
    vest.traverse((part) => {
      if (part.isSkinnedMesh) part.frustumCulled = false;
      if (look.paint && part.isMesh) {
        part.material.side = THREE.DoubleSide;
        part.material.normalScale.set(.46, .46);
        part.material.metalness = .52;
      }
    });
    const pads = ['LeftShoulder', 'RightShoulder'].map((name) => vest.getObjectByName(name));
    const forearms = ['LeftForearm', 'RightForearm'].map((name) => vest.getObjectByName(name));
    const waist = vest.getObjectByName('Waist');
    const bones = look.sleeves ? [...pads, ...forearms, waist] : [...pads, waist];
    if (bones.some((bone) => !bone?.isBone)) throw new Error('Garment rig is missing bones');
    // Recess the neck mask on the fitted tops so it hides the inner back
    // collar without cutting through the photographed front of the garment.
    const neckDimensions = look.openCollar ? [.12, .02, .53]
      : look.upperBody ? [.089, .108, .25]
      : look.paint ? [.20, .225, .34] : [.134, .163, .34];
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(...neckDimensions, 24), occlusionMaterial);
    neck.position.set(0, look.openCollar ? -.09 : .115, look.upperBody ? -.063 : look.paint ? .04 : -.006);
    neck.renderOrder = -1;
    vest.add(neck);
    return { vest, waist, pads, forearms, look };
  }

  async function wear(look) {
    desiredLook = look.id;
    if (model) model.vest.visible = false;
    if (!models.has(look.id)) {
      const pending = loadGarment(look);
      models.set(look.id, pending);
      pending.catch(() => models.delete(look.id));
    }
    const next = await models.get(look.id);
    if (desiredLook !== look.id) return false;
    if (model) scene.remove(model.vest);
    model = next;
    scene.add(model.vest);
    return true;
  }

  const segments = Array.from({ length: 6 }, () => {
    const segment = new THREE.Mesh(capsuleGeometry, occlusionMaterial);
    segment.visible = false;
    segment.renderOrder = -1;
    scene.add(segment);
    return segment;
  });

  let pose = null;
  let head = null;
  let shoulderOutline = null;

  function update(points, layout, mirrored, face = null, mask = null) {
    const measured = points && measureShoulderOutline(mask, [points[11], points[12]], face, layout);
    if (measured) {
      const previous = shoulderOutline;
      shoulderOutline = {
        y: previous ? previous.y + (measured.y - previous.y) * .42 : measured.y,
        width: previous?.width && measured.width ? previous.width + (measured.width - previous.width) * .42 : measured.width,
      };
    } else {
      shoulderOutline = null;
    }
    const project = (point, centerZ = 0) => {
      const x = layout.x + point.x * layout.w;
      return new THREE.Vector3(mirrored ? width - x : x,
        -(layout.y + point.y * layout.h), -(point.z - centerZ) * layout.w);
    };

    if (face) {
      const chin = project(face[152]);
      const brow = project(face[10]);
      const temples = [project(face[234]), project(face[454])];
      const headHeight = Math.hypot(chin.x - brow.x, chin.y - brow.y);
      const headWidth = Math.hypot(temples[0].x - temples[1].x, temples[0].y - temples[1].y);
      head = headHeight > 20 && headWidth > 16 ? { chin, height: headHeight, width: headWidth } : null;
    } else {
      head = null;
    }

    const next = {};
    const centerZ = ((points?.[11]?.z || 0) + (points?.[12]?.z || 0)) / 2;
    for (const index of landmarks) {
      const point = points?.[index];
      if (!point || (point.visibility ?? 1) < (index >= 23 ? .53 : .52)) continue;
      const target = project(point, centerZ);
      next[index] = pose?.[index] ? pose[index].lerp(target, .52) : target;
    }
    pose = next[11] && next[12] ? next : null;
    return Boolean(pose || head);
  }

  function placeOccluder(segment, a, b, radius, minZ) {
    if (!a || !b || Math.max(a.z, b.z) < minZ) return;
    const axis = b.clone().sub(a);
    const length = axis.length();
    if (length < 3) return;
    // Capsule geometry is unit radius with the cap centers one unit apart.
    segment.position.copy(average(a, b));
    segment.quaternion.setFromUnitVectors(up, axis.normalize());
    segment.scale.set(radius, (length + 2 * radius) / 3, radius);
    segment.visible = true;
  }

  function fittedSnapshot() {
    const shoulders = {
      11: new THREE.Vector3(width * .29, -height * .48, 0),
      12: new THREE.Vector3(width * .71, -height * .48, 0),
    };
    const snapshotPose = pose ? Object.fromEntries(Object.entries(pose).map(([id, point]) => [id, point.clone()])) : null;
    return { pose: snapshotPose || (!head ? shoulders : null), head, shoulderOutline };
  }

  function draw(ctx, offset, fixed = null) {
    const fittedPose = fixed ? fixed.pose : pose;
    const fittedHead = fixed ? fixed.head : head;
    const fittedOutline = fixed ? fixed.shoulderOutline : shoulderOutline;
    return drawFit(ctx, offset, fittedPose, fittedHead, fittedOutline, Boolean(fixed));
  }

  function drawFit(ctx, offset, pose, head, shoulderOutline, fixed) {
    if (!model || (!pose && !head)) return false;
    const { vest, pads, forearms, waist, look } = model;
    const ordered = pose && (pose[11].x <= pose[12].x ? [11, 12] : [12, 11]);
    const left = pose && pose[ordered[0]];
    const right = pose && pose[ordered[1]];
    const across = pose ? right.clone().sub(left) : new THREE.Vector3(1, 0, 0);
    const rawWidth = pose ? Math.hypot(across.x, across.y) : head.width * 1.65;
    if (rawWidth < width * .075) return false;
    across.z = clamp(across.z * .78, -rawWidth * .72, rawWidth * .72);
    const measuredSpan = pose ? across.length() : rawWidth;
    across.normalize();

    const shoulderCenter = pose ? average(left, right) : head.chin.clone().setZ(0);
    const hips = pose?.[23] && pose?.[24] ? average(pose[23], pose[24]) : null;
    const vertical = hips ? shoulderCenter.clone().sub(hips) : up.clone();
    vertical.z = clamp(vertical.z * .33, -rawWidth * .28, rawWidth * .28);
    vertical.addScaledVector(across, -vertical.dot(across)).normalize();
    const facing = new THREE.Vector3().crossVectors(across, vertical).normalize();
    vertical.crossVectors(facing, across).normalize();
    const basis = new THREE.Matrix4().makeBasis(across, vertical, facing);
    vest.quaternion.setFromRotationMatrix(basis);
    const roll = new THREE.Quaternion().setFromAxisAngle(front, -offset.rotation * Math.PI / 180);
    vest.quaternion.premultiply(roll);
    const inverse = vest.quaternion.clone().invert();
    // Shoulder joint centers are narrower than the clothes on top of them.
    // In close selfies, the face still gives a width reference past the crop.
    const close = head ? clamp((head.width / width - .26) / .22, 0, 1) : 0;
    const anchor = shoulderCenter.clone();
    let shoulderSpan = measuredSpan * 1.09;
    if (head) {
      const chinDrop = head.height * ((hips ? .29 : .36) + close * .15);
      const neckBaseY = head.chin.y - chinDrop;
      const raisedRidgeY = shoulderCenter.y + head.height * .09;
      const headWeight = pose ? (hips ? .30 : .54) + close * (hips ? .25 : .46) : 1;
      anchor.y = raisedRidgeY + (neckBaseY - raisedRidgeY) * headWeight;
      anchor.x += clamp(head.chin.x - anchor.x, -measuredSpan * .25, measuredSpan * .25) *
        (pose ? .12 + close * .20 : 1);
      const faceWidth = head.width * (1.86 + close * .29);
      const orientedWidth = faceWidth / Math.max(across.x, .74);
      shoulderSpan = Math.max(shoulderSpan, orientedWidth);
      if (shoulderOutline) {
        // The modeled shoulder caps sit at the vest origin. Keep the
        // jaw/pose estimate as a prior if an arm or the frame cuts the silhouette.
        const correction = clamp(shoulderOutline.y - anchor.y, -head.height * .11, head.height * .26);
        anchor.y += correction * .72;
        if (shoulderOutline.width) {
          const screenSpan = Math.max(across.x, .62);
          const silhouetteSpan = shoulderOutline.width / (1.10 * screenSpan);
          const bounded = clamp(silhouetteSpan, shoulderSpan * .93, shoulderSpan * 1.21);
          shoulderSpan += (bounded - shoulderSpan) * .64;
        }
      }
      anchor.y = Math.min(anchor.y, head.chin.y - head.height * (.17 + close * .13));
      shoulderSpan = Math.min(shoulderSpan, head.width * (3.05 + close * .20));
    }
    if (-anchor.y > height + shoulderSpan * .10) return false;
    const scale = shoulderSpan * offset.scale;
    const torsoLength = hips ? Math.abs(shoulderCenter.clone().sub(hips).dot(vertical)) : rawWidth * 1.15;
    // Widening the shoulders should not make tall lapels grow up toward the face.
    const verticalScale = clamp(torsoLength, shoulderSpan * .75, shoulderSpan * 1.42) * offset.scale;
    vest.position.copy(anchor);
    vest.position.x += offset.x;
    vest.position.y -= offset.y + scale * (look.paint ? .018 : -.025);
    vest.scale.set(scale * (look.upperBody ? 1.09 : 1), verticalScale, scale);
    vest.visible = true;
    const hipAxis = hips ? pose[24].clone().sub(pose[23]) : null;
    if (hipAxis && hipAxis.x < 0) hipAxis.negate();
    waist.rotation.y = hipAxis ? clamp(-Math.atan2(hipAxis.z, hipAxis.x) -
      Math.atan2(-across.z, across.x), -.24, .24) : 0;

    segments.forEach((segment) => { segment.visible = false; });
    for (let side = 0; side < 2; side += 1) {
      const forearm = forearms[side];
      const shoulderId = ordered?.[side];
      if (shoulderId == null) {
        pads[side].rotation.set(0, 0, 0);
        forearm?.rotation.set(0, 0, 0);
        continue;
      }
      const shoulder = pose[shoulderId];
      const elbow = pose[shoulderId + 2];
      const wrist = pose[shoulderId + 4];
      const pinky = pose[shoulderId + 6];
      const index = pose[shoulderId + 8];
      const hand = pinky && index ? average(pinky, index) : index || pinky;
      const localArm = elbow?.clone().sub(shoulder).applyQuaternion(inverse);
      const sign = side === 0 ? -1 : 1;
      const lift = localArm ? clamp(Math.atan2(sign * localArm.x, -localArm.y), -.52, 2.22) : .12;
      const restAngle = look.sleeves ? .31 : .14;
      pads[side].rotation.z = sign * clamp((lift - restAngle) * (look.sleeves ? .80 : .38), look.sleeves ? -.39 : -.28, look.sleeves ? 1.32 : .65);
      pads[side].rotation.x = localArm ? (look.sleeves ? -.27 : -.18) * clamp(localArm.z / shoulderSpan, -.55, .9) : 0;
      if (look.sleeves && elbow && wrist && localArm) {
        const lower = wrist.clone().sub(elbow).applyQuaternion(inverse);
        const angle = Math.atan2(sign * lower.x, -lower.y) - lift;
        const bend = Math.atan2(Math.sin(angle), Math.cos(angle));
        forearm.rotation.z = sign * clamp((bend + .14) * .79, -.94, 1.27);
        forearm.rotation.x = -.40 * clamp(lower.z / shoulderSpan, -.75, 1);
      } else forearm?.rotation.set(0, 0, 0);

      if (fixed) continue;
      const minZ = shoulderCenter.z + shoulderSpan * .13;
      if (elbow) {
        const inset = between(shoulder, elbow, .34);
        placeOccluder(segments[side * 3], inset, elbow, shoulderSpan * .117, minZ);
      }
      placeOccluder(segments[side * 3 + 1], elbow, wrist, shoulderSpan * .092, minZ);
      if (wrist && hand) {
        placeOccluder(segments[side * 3 + 2], wrist, hand, shoulderSpan * .079, minZ);
      }
    }

    renderLayer(scene, camera, ctx);
    return true;
  }

  function renderLayer(layerScene, layerCamera, target) {
    renderer.render(layerScene, layerCamera);
    target.drawImage(renderer.domElement, 0, 0);
  }

  function reset() {
    pose = null;
    head = null;
    shoulderOutline = null;
  }

  return { update, draw, wear, fittedSnapshot, renderLayer, reset };
}
