import * as THREE from "./ThreeJS.js";
import { StreamAudioEmitter } from "./StreamAudioEmitter.js";

if (window.alt === undefined) {
    window.alt = {
        emit: () => {},
        on: () => {},
    };
}

const DEFAULT_CAMERA_FOV = 50;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
const scene = new THREE.Scene();
const listener = new THREE.AudioListener();
const camera = new THREE.PerspectiveCamera(DEFAULT_CAMERA_FOV, window.innerWidth / window.innerHeight, 1, 10000);
camera.add(listener);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/**
 * @param {alt.Vector3} v
 * @returns {THREE.Vector3}
 */
function toThreePos(v) {
    return new THREE.Vector3(v.x, v.z, -v.y);
}

/**
 * @param {alt.Vector3} v
 * @returns {THREE.Vector3}
 */
function toThreeRot(v) {
    return new THREE.Vector3(v.x, Math.PI + v.y, v.z);
}

alt.on("setCameraPos", (pos, lookAt) => {
    // console.log("setCameraPos", pos, lookAt);
    pos = toThreePos(pos);
    lookAt = toThreePos(lookAt);
    camera.position.set(pos.x, pos.y, pos.z);
    camera.lookAt(lookAt.x, lookAt.y, lookAt.z);
    renderer.render(scene, camera);
});

alt.on("createAudioStream", (id, source, distance, volume, is3dEnabled) => {
    if (StreamAudioEmitter.getById(id)) {
        console.warn("AudioStream already exists");
        return;
    }
    const audioStream = new StreamAudioEmitter(scene, listener, id, source, distance, volume, is3dEnabled);
});

alt.on("changeSource", (id, newId, source) => {
    const audioStream = StreamAudioEmitter.getById(id);
    if (!audioStream) return;
    audioStream.changeSource(newId, source);
});

alt.on("addOutput", (audioStreamId, name, pos, rot) => {
    const audioStream = StreamAudioEmitter.getById(audioStreamId);
    if (!audioStream) return;
    if (pos) pos = toThreePos(pos);
    if (rot) rot = toThreeRot(rot);
    audioStream.addOutput(name, pos, rot);
});

alt.on("removeOutput", (audioStreamId, name) => {
    const audioStream = StreamAudioEmitter.getById(audioStreamId);
    if (!audioStream) return;
    audioStream.removeOutput(name);
});

alt.on("updateOutput", (audioStreamId, name, pos, rot) => {
    const audioStream = StreamAudioEmitter.getById(audioStreamId);
    if (!audioStream) return;
    if (pos) pos = toThreePos(pos);
    if (rot) rot = toThreeRot(rot);
    audioStream.updateOutput(name, pos, rot);
});

alt.on("play", (id) => {
    const audioStream = StreamAudioEmitter.getById(id);
    if (!audioStream) return;
    audioStream.play();
});

alt.on("pause", (id) => {
    const audioStream = StreamAudioEmitter.getById(id);
    if (!audioStream) return;
    audioStream.pause();
});

alt.on("reload", (id) => {
    const audioStream = StreamAudioEmitter.getById(id);
    if (!audioStream) return;
    audioStream.reload();
});

alt.on("enable3d", (id, enable) => {
    const audioStream = StreamAudioEmitter.getById(id);
    if (!audioStream) return;
    audioStream.enable3d(enable);
});

alt.on("volume", (id, volume) => {
    const audioStream = StreamAudioEmitter.getById(id);
    if (!audioStream) return;
    audioStream.volume = volume;
});

alt.on("addMuffle", (id) => {
    const audioStream = StreamAudioEmitter.getById(id);
    if (!audioStream) return;
    audioStream.addMuffle();
});

alt.on("lessMuffle", (id) => {
    const audioStream = StreamAudioEmitter.getById(id);
    if (!audioStream) return;
    audioStream.lessMuffle();
});

alt.on("resonance", (id, playerPos) => {
    const audioStream = StreamAudioEmitter.getById(id);
    if (!audioStream) return;
    if (!audioStream.setResonanceDistance) return;
    playerPos = toThreePos(playerPos);
    audioStream.setResonanceDistance(playerPos);
});

alt.on("destroy", (id) => {
    const audioStream = StreamAudioEmitter.getById(id);
    if (!audioStream) return;
    audioStream.destroy();
});
