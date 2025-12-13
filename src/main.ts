import * as THREE from 'three';

import { createScene, getController } from './scene';
import { randInt } from 'three/src/math/MathUtils.js';

const geometry = new THREE.BoxGeometry(0.2, 0.1, 0.1);
const material = new THREE.MeshStandardMaterial({ color: "#ffffff" });
function createBlock() {
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    return mesh;
}

const scene = createScene();

const controllers = [getController(0), getController(1)];
for (const controller of controllers) {
    controller.addEventListener('squeezestart', _event => { doGrab(controller) });
    controller.addEventListener('squeezeend', _event => { doDrop(controller) });
}

const blocks: THREE.Mesh[] = [];

let savedObject: THREE.Mesh | undefined = undefined;
//const savedQuaternion = new THREE.Quaternion();
const savedPosition = new THREE.Vector3();

function doDrop(_controller: THREE.XRTargetRaySpace) {
    if (savedObject) {
        // Already holding an object: drop it
        scene.attach(savedObject);
        alignBlock(savedObject, 0.05);
        savedObject = undefined;
    }
}

function doGrab(controller: THREE.XRTargetRaySpace) {
    doDrop(controller);
    const MIN_DIST = 0.2;
    // Find closest cube and move it to the controller
    let minDist = Number.MAX_VALUE;
    let grabObject: THREE.Mesh | undefined = undefined;
    for (const c of blocks) {
        if (savedObject !== c) {
            const dist = c.position.distanceTo(controller.position);
            if (dist < minDist) {
                minDist = dist;
                grabObject = c;
            }
        }
    }
    if (grabObject && (minDist < MIN_DIST)) {
        savedObject = grabObject;
        if (savedObject) {
            savedPosition.copy(savedObject.position);
            controller.attach(grabObject);
        }
    }
}

function alignBlock(block: THREE.Mesh, grid: number) {
    block.rotation.set(Math.round(block.rotation.x * 4 / Math.PI) * Math.PI / 4, Math.round(block.rotation.y * 4 / Math.PI) * Math.PI / 4, Math.round(block.rotation.z * 4 / Math.PI) * Math.PI / 4);
    block.position.x = Math.round(block.position.x / grid) * grid;
    block.position.y = Math.round(block.position.y / grid) * grid;
    block.position.z = Math.round(block.position.z / grid) * grid;
}

// Add some simple blocks for testing
for (let i = 0; i < 100; i++) {
    const block = createBlock();
    blocks.push(block);
    block.position.x = randInt(-5, 5) * 0.1;
    block.position.y = randInt(0, 10) * 0.1;
    block.position.z = randInt(-5, 5) * 0.1;
}
