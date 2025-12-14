import * as THREE from 'three';

import { createScene } from './scene';
import { PaintBucket } from './objects/paint-bucket';

const geometry = new THREE.BoxGeometry(0.2, 0.1, 0.1);
function createBlock(material: THREE.Material) {
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    return mesh;
}

const scene = createScene(evt => {
    // Called for each controller (check handedness in event data)
    const controller = evt.target;
    controller.addEventListener('squeezestart', _event => { doGrab(controller) });
    controller.addEventListener('squeezeend', _event => { doDrop(controller) });
});

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
const materials = [
    new THREE.MeshStandardMaterial({ color: "#ffffff" }),
    new THREE.MeshStandardMaterial({ color: "#ffcccc" }),
    new THREE.MeshStandardMaterial({ color: "#ccccff" }),
    new THREE.MeshStandardMaterial({ color: "#ccffcc" })
];

for (let stack = 0; stack < materials.length; stack++) {
    const material = materials[stack];
    for (let x = 0; x < 3; x++) {
        for (let z = 0; z < 3; z++) {
            for (let y = 0; y < 3; y++) {
                const block = createBlock(material);
                blocks.push(block);
                block.position.x = x * 0.2 - 1;
                block.position.y = y * 0.1 + 1;
                block.position.z = z * 0.1 + ((stack - 2) * 0.5);
            }
        }
    }
}

// Paint buckets
for (let i = 0; i < materials.length; i++) {
    const paintBucket = new PaintBucket(materials[i], { fill: Math.random() * 0.4 + 0.5 });
    paintBucket.position.x = -0.2;
    paintBucket.position.y = 1;
    paintBucket.position.z = (i - 2) * 0.5 + 0.1;
    scene.add(paintBucket);
}