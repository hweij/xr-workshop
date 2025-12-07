import * as THREE from 'three';

import { createScene } from './scene';

const scene = createScene();

// Add a simple shape for testing
const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
const material = new THREE.MeshStandardMaterial({ color: "#ffffff" });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);