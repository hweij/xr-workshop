import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// XR
import { XRButton } from 'three/addons/webxr/XRButton.js';

/** Field of view */
const FOV = 70;
/** Default eye level, for non-VR */
const EYE_LEVEL = 1.75;
/** Initial perspective camera position */
const P0 = [0, EYE_LEVEL, 1];
/** Background/clear color */
const BACKGROUND_COLOR = "#cccccc";

/** Helper to reference an HTMLElement */
const EL = (id: string) => document.getElementById(id)!;

const container = EL("divThree");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.1, 20);
const controls = new OrbitControls(camera, container);
const renderer = new THREE.WebGLRenderer({ antialias: true });
//** Controller 0 */
var controller0: THREE.XRTargetRaySpace;
var controller1: THREE.XRTargetRaySpace;

export function createScene(onConnect: (evt: { data: XRInputSource; } & THREE.Event<"connected", THREE.XRTargetRaySpace>) => void) {
    //_actionCallback = actionCallback;

    function addControllers() {
        function addController(index: number) {
            const controller = renderer.xr.getController(index);
            controller.addEventListener('selectstart', _data => { controller.children[0].position.z = -0.1; });
            controller.addEventListener('selectend', _data => { controller.children[0].position.z = 0.0; });
            controller.addEventListener('connected', (event) => {
                onConnect(event);
                return createControllerNode(controller, event.data);
            });
            controller.addEventListener('disconnected', () => controller.children[0]?.remove());
            scene.add(controller);
            return controller;
        };
        controller0 = addController(0);
        controller1 = addController(1);
    };

    // Camera
    camera.position.fromArray(P0);
    scene.add(camera);

    // Controls
    controls.target.fromArray([0, 0, 0]);
    controls.update();

    // Renderer
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(BACKGROUND_COLOR);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    renderer.setAnimationLoop(animate);
    container.appendChild(renderer.domElement);

    addGrid();

    addLights();

    window.addEventListener('resize', onWindowResize);

    // XR
    document.body.appendChild(XRButton.createButton(renderer, {
        'optionalFeatures': ['depth-sensing'],
        'depthSensing': { 'usagePreference': ['gpu-optimized'], 'dataFormatPreference': [] }
    }));
    // VR
    // document.body.appendChild(VRButton.createButton(renderer));

    addControllers();

    return scene;
}


export function getController(index: number) {
    return (index === 0) ? controller0 : controller1;
}

function createControllerNode(controller: THREE.XRTargetRaySpace, data: XRInputSource) {
    const color = (data.handedness === "right") ? "#ff0000" : "#0000ff";
    const geometry = new THREE.CylinderGeometry(0.005, 0.005, 0.2);
    geometry.rotateX(Math.PI / 2);
    geometry.translate(0, 0, -0.1);
    const material = new THREE.MeshBasicMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);
    controller.add(mesh);
    return mesh;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function addGrid() {
    const size = 1;
    const divisions = 10;
    const gridHelper = new THREE.GridHelper(size, divisions);
    scene.add(gridHelper);
}

function addLights() {
    {    // Ambient light
        const skyColor = 0xFFEEEE;
        const groundColor = 0x776666;
        const intensity = 1;
        const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        scene.add(light);
    }
    {// Light from the top front
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0, 6, 4);
        scene.add(light);
    }
    // Light from the left side
    {
        const light = new THREE.DirectionalLight(0xffffff, 0.5);
        light.position.set(-10, 5, 0);
        scene.add(light);
    }
    // Light from the right side
    {
        const light = new THREE.DirectionalLight(0xffffff, 0.5);
        light.position.set(10, 5, 0);
        scene.add(light);
    }
}

/** Animate and render */
function animate() {
    renderer.render(scene, camera);
}
