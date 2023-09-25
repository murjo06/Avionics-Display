import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias: false});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);
const ambientLight = new THREE.AmbientLight(0x404040, 7);
scene.add(ambientLight);
const light = new THREE.PointLight(0xf0f0f0, 4);
scene.add(light);
light.position.set(0, 10, 0);

const controls = new OrbitControls(camera, renderer.domElement);

const colors = {
    passive: 0xf28f38,
    progress: 0x234ec4,
    success: 0x2dbd3e,
    failure: 0xd61a1a
}

const mpu6050 = {
    status: "progress",
    set: false,
    object: undefined
};
const bme280 = {
    status: "progress",
    set: false,
    object: undefined
};
const hmc5883l = {
    status: "progress",
    set: false,
    object: undefined
}
const tilt = {
    status: "passive",
    set: false,
    object: undefined
}

const loader = new GLTFLoader;
loader.load("./models/mpu6050.gltf", (gltf) => {
    mpu6050.object = new THREE.Object3D().copy(gltf.scene);
    scene.add(mpu6050.object);
});
loader.load("./models/bme280.gltf", (gltf) => {
    bme280.object = new THREE.Object3D().copy(gltf.scene);
    scene.add(bme280.object);
});
loader.load("./models/hmc5883l.gltf", (gltf) => {
    hmc5883l.object = new THREE.Object3D().copy(gltf.scene);
    scene.add(hmc5883l.object);
});
loader.load("./models/tilt.gltf", (gltf) => {
    tilt.object = new THREE.Object3D().copy(gltf.scene);
    scene.add(tilt.object);
});

camera.position.z = 10;
camera.position.y = 5;
camera.position.x = 0;
controls.update();

function animate() {
    if(mpu6050.object && !mpu6050.set) {
        mpu6050.object.position.set(20, 0, 0);
        mpu6050.object.children[0].material.color.setHex(colors[mpu6050.status]);
        mpu6050.set = true;
    }
    if(bme280.object && !bme280.set) {
        bme280.object.children[0].material.color.setHex(colors[bme280.status]);
        bme280.set = true;
    }
    if(hmc5883l.object && !hmc5883l.set) {
        hmc5883l.object.children[0].material.color.setHex(colors[hmc5883l.status]);
        hmc5883l.object.position.set(0, 0, 20);
        hmc5883l.set = true;
    }
    if(tilt.object && !tilt.set) {
        tilt.object.children[0].material.color.setHex(colors[tilt.status]);
        tilt.object.position.set(0, 0, -20);
        tilt.set = true;
    }
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

requestAnimationFrame(animate);