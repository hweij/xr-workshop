import * as THREE from 'three';

import { createScene } from './scene';

const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
const material = new THREE.MeshStandardMaterial({ color: "#ffffff" });
function createBlock() {
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    return mesh;
}

const scene = createScene();

// Add some simple blocks for testing
const block0 = createBlock();
const block1 = createBlock();
block1.position.x = 0.1;
const block2 = createBlock();
block2.position.x = 0.2;

