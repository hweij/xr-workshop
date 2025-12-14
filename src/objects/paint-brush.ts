import * as THREE from 'three';

const geometry = new THREE.CylinderGeometry(0.005, 0.005, 0.2);
geometry.rotateX(Math.PI / 2);
geometry.translate(0, 0, -0.1);

const defaultMaterial = new THREE.MeshBasicMaterial({ color: "#ffffff" });

export class PaintBrush extends THREE.Mesh {
    constructor(material?: THREE.Material) {
        super(geometry, material || defaultMaterial);
    }
}
