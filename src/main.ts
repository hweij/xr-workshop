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

const scene = createScene(actionCallback);

const blocks: THREE.Mesh[] = [];

let savedObject: THREE.Mesh | undefined = undefined;
const savedPosition = new THREE.Vector3();

function actionCallback(action: string, controller: THREE.XRTargetRaySpace) {
    if (action === "grab") {
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
        if (grabObject) {
            if (savedObject) {
                scene.add(savedObject);
                savedObject.position.copy(savedPosition);
                savedObject = undefined;
            }
            savedObject = grabObject;
            if (savedObject) {
                savedPosition.copy(savedObject.position);

                // grabObject.position.set(0, 0, 0);
                // controller.add(grabObject);

                // Animate position
                // TODO: change this and implement a ticker linked to the renderer
                let f = 0;
                const tick = () => {
                    if (savedObject) {
                        savedObject.position.lerpVectors(savedPosition, controller.position, f);
                    }
                    if (f < 1.0) {
                        f = (Math.min(1, f + 0.025));
                    }
                    if (f < 1) {
                        window.setTimeout(tick, 0.1);
                    }
                    else {
                        controller.attach(grabObject);
                    }
                }
                tick();
            }
        }
    }
}

// Add some simple blocks for testing
for (let i = 0; i < 100; i++) {
    const block = createBlock();
    blocks.push(block);
    block.position.x = randInt(-5, 5) * 0.1;
    block.position.y = randInt(-5, 5) * 0.1;
    block.position.z = randInt(-5, 5) * 0.1;
}
