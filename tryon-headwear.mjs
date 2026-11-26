import * as THREE from './assets/tryon/vendor/three/three.module.min.js';
import { GLTFLoader } from './assets/tryon/vendor/three/GLTFLoader.js';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const vector = (point) => new THREE.Vector3(point.x, -point.y, point.z);

export function createHeadwear(width, height, renderLayer) {
  const loader = new GLTFLoader();
  const models = new Map();
  const scene = new THREE.Scene();
  const anchor = new THREE.Group();
  scene.add(anchor);
  const camera = new THREE.OrthographicCamera(0, width, 0, -height, 1, 5000);
  camera.position.z = 2000;
  const fill = new THREE.HemisphereLight(0xfff5fa, 0xb5a5be, 2.4);
  const key = new THREE.DirectionalLight(0xfff4e5, 2.8);
  const side = new THREE.DirectionalLight(0xd6dfff, 2.7);
  key.position.set(-2, 4, 6);
  side.position.set(4, 2, -4);
  scene.add(fill, key, side);

  const depthMaterial = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: true, side: THREE.DoubleSide });
  const headVolume = new THREE.SphereGeometry(1, 28, 16);
  const scalpMask = new THREE.Mesh(headVolume, depthMaterial);
  const neckMask = new THREE.Mesh(headVolume, depthMaterial);
  for (const mask of [scalpMask, neckMask]) {
    mask.visible = false;
    mask.renderOrder = -1;
    scene.add(mask);
  }

  let depth;
  const topology = fetch(new URL('./assets/tryon/rock-3d/face-topology.json', import.meta.url))
    .then((response) => {
      if (!response.ok) throw new Error('Headwear depth geometry is unavailable');
      return response.json();
    }).then(({ uv, indices }) => {
      const geometry = new THREE.BufferGeometry();
      geometry.setIndex(indices);
      const vertexCount = uv.length / 2;
      geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertexCount * 3), 3)
        .setUsage(THREE.DynamicDrawUsage));
      depth = new THREE.Mesh(geometry, depthMaterial);
      depth.frustumCulled = false;
      depth.renderOrder = -1;
      depth.visible = false;
      scene.add(depth);
    }).catch(() => {});

  function load(path) {
    if (!models.has(path)) {
      const pending = Promise.all([loader.loadAsync(new URL(path, import.meta.url).href), topology])
        .then(([asset]) => asset.scene);
      models.set(path, pending);
      pending.catch(() => models.delete(path));
    }
    return models.get(path);
  }

  function draw(ctx, model, points, offset, liveFace, fit) {
    const forehead = vector(points[10]);
    const chin = vector(points[152]);
    const temples = [vector(points[234]), vector(points[454])].sort((a, b) => a.x - b.x);
    const across = temples[1].sub(temples[0]);
    const projected = Math.hypot(across.x, across.y);
    if (projected < 8) return;
    across.z = clamp(across.z * .93, -projected * 2.05, projected * 2.05);
    const span = Math.min(across.length(), forehead.distanceTo(chin) * 1.32);
    across.normalize();
    const up = forehead.clone().sub(chin);
    up.addScaledVector(across, -up.dot(across)).normalize();
    const forward = new THREE.Vector3().crossVectors(across, up).normalize();
    if (forward.z < .02) return;
    up.crossVectors(forward, across).normalize();

    if (anchor.children[0] !== model) {
      anchor.clear();
      anchor.add(model);
    }
    const basis = new THREE.Matrix4().makeBasis(across, up, forward);
    anchor.quaternion.setFromRotationMatrix(basis);
    const roll = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -offset.rotation * Math.PI / 180);
    anchor.quaternion.premultiply(roll);
    anchor.scale.setScalar(span * offset.scale * fit.size);
    anchor.position.copy(forehead)
      .addScaledVector(forward, -span * (fit.setback ?? .43))
      .addScaledVector(up, span * fit.rise);
    anchor.position.x += offset.x;
    anchor.position.y -= offset.y;

    // The tracked face mesh stops at the hairline and jaw. Mask the backs
    // of long hairstyles behind the scalp and neck while leaving the front locks visible.
    scalpMask.visible = neckMask.visible = Boolean(fit.longHair && liveFace);
    if (scalpMask.visible) {
      scalpMask.quaternion.setFromRotationMatrix(basis);
      scalpMask.position.copy(forehead).addScaledVector(up, span * .10).addScaledVector(forward, -span * .24);
      scalpMask.scale.set(span * .43, span * .35, span * .23);
      neckMask.quaternion.copy(scalpMask.quaternion);
      neckMask.position.copy(chin).addScaledVector(up, -span * .24).addScaledVector(forward, -span * .17);
      neckMask.scale.set(span * .32, span * .39, span * .20);
    }

    if (depth) {
      const position = depth.geometry.attributes.position;
      depth.visible = liveFace?.length >= position.count;
      if (depth.visible) {
        for (let i = 0; i < position.count; i += 1) {
          const point = liveFace[i];
          position.setXYZ(i, point.x, -point.y, point.z);
        }
        position.needsUpdate = true;
      }
    }
    renderLayer(scene, camera, ctx);
  }

  return { load, draw };
}
