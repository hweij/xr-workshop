import * as THREE from 'three';

const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.2);

export class PaintBucket extends THREE.Mesh {
    constructor(material: THREE.Material) {
        // const material = new THREE.MeshStandardMaterial({ color });
        super(geometry, material);
    }
}