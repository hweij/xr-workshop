import * as THREE from 'three';

import { createScene } from './scene';
import { randInt } from 'three/src/math/MathUtils.js';

const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
const material = new THREE.MeshStandardMaterial({ color: "#ffffff" });
function createBlock() {
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    return mesh;
}

const scene = createScene();

// Add some simple blocks for testing
for (let i = 0; i < 100; i++) {
    const block = createBlock();
    block.position.x = randInt(-5, 5) * 0.1;
    block.position.y = randInt(-5, 5) * 0.1;
    block.position.z = randInt(-5, 5) * 0.1;
}
