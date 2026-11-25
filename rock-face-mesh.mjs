import * as THREE from './assets/tryon/vendor/three/three.module.min.js';
import { paintRockFace } from './rock-face-paint.mjs';

export async function createRockFaceMesh(width, height, renderLayer) {
  const asset = new URL('./assets/tryon/rock-3d/face-topology.json', import.meta.url);
  const response = await fetch(asset);
  if (!response.ok) throw new Error('Face mesh topology is unavailable');
  const { uv, indices, rest } = await response.json();
  const count = uv.length / 2;

  const textureCanvas = document.createElement('canvas');
  textureCanvas.width = textureCanvas.height = 512;
  const texturePoints = Array.from({length: count}, (_, i) => ({
    x: uv[i * 2] * 512, y: (1 - uv[i * 2 + 1]) * 512,
  }));
  paintRockFace(textureCanvas.getContext('2d'), texturePoints);
  const texture = new THREE.CanvasTexture(textureCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  const positions = new Float32Array(count * 3);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  const normalOrder = new THREE.Uint16BufferAttribute(indices, 1);
  const mirrorOrder = new THREE.Uint16BufferAttribute(indices.map((index, i) =>
    i % 3 === 1 ? indices[i + 1] : i % 3 === 2 ? indices[i - 1] : index), 1);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(0, width, 0, -height, 1, 5000);
  camera.position.z = 2000;
  const depth = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
    colorWrite: false, depthWrite: true, side: THREE.DoubleSide,
  }));
  const paint = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
    map: texture, transparent: true, depthWrite: false, toneMapped: false,
  }));
  depth.renderOrder = -1;
  depth.frustumCulled = paint.frustumCulled = false;
  scene.add(depth, paint);

  const layer = document.createElement('canvas');
  layer.width = width;
  layer.height = height;
  const context = layer.getContext('2d');
  let previous = null;
  let previousMirror = false;

  function drawFaceMesh(ctx, points, mirrored) {
    if (points.length < count) return paintRockFace(ctx, points);
    if (points !== previous || mirrored !== previousMirror) {
      for (let i = 0; i < count; i += 1) {
        positions[i * 3] = points[i].x;
        positions[i * 3 + 1] = -points[i].y;
        positions[i * 3 + 2] = points[i].z;
      }
      geometry.setIndex(mirrored ? mirrorOrder : normalOrder);
      geometry.attributes.position.needsUpdate = true;
      context.clearRect(0, 0, width, height);
      renderLayer(scene, camera, context);
      previous = points;
      previousMirror = mirrored;
    }
    ctx.drawImage(layer, 0, 0);
  }

  function defaultFace(mirrored) {
    const scale = width * .30 / 15.5;
    const direction = mirrored ? -1 : 1;
    return Array.from({length: count}, (_, i) => ({
      x: width * .5 + rest[i * 3] * scale * direction,
      y: height * .32 - rest[i * 3 + 1] * scale,
      z: rest[i * 3 + 2] * scale,
    }));
  }
  return { drawFaceMesh, defaultFace };
}
