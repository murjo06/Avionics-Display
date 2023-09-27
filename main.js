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
scene.background = new THREE.Color(0x637fad);

const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.autoRotateSpeed = 0.7;
camera.position.y = 20;
camera.position.x = 40;

const colors = {
    passive: 0xf28f38,
    progress: 0x234ec4,
    success: 0x2dbd3e,
    failure: 0xd61a1a
}
const textColors = {
    passive: "#f28f38",
    progress: "#234ec4",
    success: "#2dbd3e",
    failure: "#d61a1a"
}

const arduino = {
    status: "process",
    set: false,
    object: undefined,
    path: "arduino",
    type: "Arduino",
    name: "",
    element: undefined
};
const mpu6050 = {
    status: "success",
    set: false,
    object: undefined,
    path: "mpu6050",
    type: "Accelerometer",
    name: "MPU-6050",
    element: undefined
};
const bme280 = {
    status: "failure",
    set: false,
    object: undefined,
    path: "bme280",
    type: "Altimeter",
    name: "BME280",
    element: undefined
};
const hmc5883l = {
    status: "progress",
    set: false,
    object: undefined,
    path: "hmc5883l",
    type: "Magnetometer",
    name: "HMC5883L",
    element: undefined
}
const tilt = {
    status: "passive",
    set: false,
    object: undefined,
    path: "tilt",
    type: "Tilt Switch",
    name: "",
    element: undefined
}

const loader = new GLTFLoader;
const states = document.querySelector("#states");
function loadComponent(component) {
    loader.load(`./models/${component.path}.gltf`, (gltf) => {
        component.object = new THREE.Object3D().copy(gltf.scene);
        scene.add(component.object);
    });
    const state = document.createElement("p");
    state.innerText = component.name != "" ? `${component.type} (${component.name})` : component.type;
    component.element = state;
    onStateChange(component, component.status);
    states.appendChild(component.element);
}
function onStateChange(component, state) {
    component.element.style.color = textColors[state];
    try {
        component.object.children[0].material.color.setHex(colors[state]);
    } catch {}
}
loadComponent(arduino);
loadComponent(mpu6050);
loadComponent(bme280);
loadComponent(hmc5883l);
loadComponent(tilt);

function animate() {
    if(arduino.object && !arduino.set) {
        onStateChange(arduino, "progress");
        arduino.object.position.set(-60, 0, 0);
    }
    if(mpu6050.object && !mpu6050.set) {
        onStateChange(mpu6050, "success");
        mpu6050.object.position.set(20, 0, 0);
        mpu6050.set = true;
    }
    if(bme280.object && !bme280.set) {
        onStateChange(bme280, "failure");
        bme280.set = true;
    }
    if(hmc5883l.object && !hmc5883l.set) {
        onStateChange(hmc5883l, "progress");
        hmc5883l.object.position.set(0, 0, 20);
        hmc5883l.set = true;
    }
    if(tilt.object && !tilt.set) {
        onStateChange(tilt, "passive");
        tilt.object.position.set(0, 0, -20);
        tilt.set = true;
    }
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

requestAnimationFrame(animate);