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

let mpu6050;
let mpu6050Set = false;
let bme280;
let bme280Set = false;

const loader = new GLTFLoader;
await loader.load("./models/mpu6050.gltf", (gltf) => {
    mpu6050 = new THREE.Object3D().copy(gltf.scene);
    console.log(gltf);
    scene.add(mpu6050);
});

await loader.load("./models/bme280.gltf", (gltf) => {
    bme280 = new THREE.Object3D().copy(gltf.scene);
    scene.add(bme280);
});

camera.position.z = 10;
camera.position.y = 5;
camera.position.x = 0;
controls.update();

function animate() {
    if(mpu6050 && !mpu6050Set) {
        mpu6050.position.set(20, 0, 0);
        mpu6050.children[0].material.color.setHex(0x2dbd3e);
        mpu6050Set = true;
    }
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

requestAnimationFrame(animate);