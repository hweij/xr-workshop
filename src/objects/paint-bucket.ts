import * as THREE from 'three';
import { clamp } from 'three/src/math/MathUtils.js';

/** Bucket height */
const height = 0.2;
/** Bucket outer radius */
const radius = 0.1;
/** Bucket inner radius / content radius */
const innerRadius = 0.08;
/** Number of segments to use for round shapes */
const n = 32;
// Bucket container material
const bucketMaterial = new THREE.MeshStandardMaterial({ color: "#ffffff" });

const bucketGeometry = createBucketGeometry();

// Paint content inside
const paintContentGeometry = new THREE.CylinderGeometry(innerRadius, innerRadius, height);
paintContentGeometry.translate(0, height / 2, 0);

export class PaintBucket extends THREE.Group {
    material: THREE.Material;

    content: THREE.Mesh;

    constructor(material: THREE.Material, options?: { fill?: number }) {
        super();

        this.material = material;

        const bucket = new THREE.Mesh(bucketGeometry, bucketMaterial);
        this.content = new THREE.Mesh(paintContentGeometry, material);

        this.add(bucket, this.content);

        if (options?.fill) {
            this.setFill(options.fill);
        }
    }

    setFill(fill: number) {
        this.content.scale.setY(clamp(fill, 0, 1));
    }
}

function createBucketGeometry() {
    const shape = new THREE.Shape();
    shape.moveTo(0, radius);
    for (let i = 0; i < n; i++) {
        const angle = i * 2 * Math.PI / n;
        shape.lineTo(Math.sin(angle) * radius, Math.cos(angle) * radius);
    }

    const points: THREE.Vector2[] = [];
    for (let i = 0; i < n; i++) {
        const angle = -i * 2 * Math.PI / n;
        points.push(new THREE.Vector2(Math.sin(angle) * innerRadius, Math.cos(angle) * innerRadius));
    }
    const path = new THREE.Path(points);
    shape.holes = [path];

    const geometry = new THREE.ExtrudeGeometry(shape, { bevelEnabled: false, depth: height });
    geometry.rotateX(-Math.PI / 2);
    return geometry;
}
