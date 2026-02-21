// import * as THREE from "three";
import * as THREE from "./ThreeJS.js";
import AudioEmitter from "./AudioEmitter.js";

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
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let debug = false;
const debugCones = new Map();

/**
 * @param {alt.Vector3} v
 * @returns {THREE.Vector3}
 */
function toThreePos(v) {
    return new THREE.Vector3(v.x, v.z, -v.y);
}

function toThreeRot(v) {
    if (!v) return;
    return new THREE.Vector3(v.x, Math.PI + v.y, v.z);
}

alt.on("init", () => {
    camera.add(listener);
    camera.position.set(0, 0, 0);
});

alt.on("setCameraFov", (fov) => (scene.fov = fov));

alt.on("setCameraPos", (pos, lookAt) => {
    pos = toThreePos(pos);
    lookAt = toThreePos(lookAt);
    camera.position.set(pos.x, pos.y, pos.z);
    camera.lookAt(lookAt.x, lookAt.y, lookAt.z);
    renderer.render(scene, camera);
    // AudioEmitter.all.forEach((audio) => {
    //     audio.outputs.forEach((output) => {
    //         console.log(output.position.distanceTo(pos));
    //     });
    // });
});

//////////////////////////////
// DEBUG
//////////////////////////////

function toThreeRotCone(v) {
    return new THREE.Vector3(v.x - Math.PI / 2, v.z, v.y);
}

alt.on("setDebug", (enable) => {
    if (debug === enable) return;
    debug = enable;
    if (enable) {
        debugCones.forEach((cone) => scene.add(cone));
    } else {
        debugCones.forEach((cone) => scene.remove(cone));
    }
});

alt.on("setOuput", (id, name, pos, rot) => {
    const coneGeometry = new THREE.ConeGeometry(0.5, 1, 32);
    const coneMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const coneMesh = new THREE.Mesh(coneGeometry, coneMaterial);
    pos = toThreePos(pos);
    coneMesh.position.set(pos.x, pos.y, pos.z);
    if (rot) {
        rot = toThreeRotCone(rot);
        coneMesh.rotation.set(rot.x, rot.y, rot.z);
    }
    debugCones.set(name, coneMesh);
    if (debug) scene.add(coneMesh);
});

alt.on("removeOuput", (id, name) => {
    if (debug) scene.remove(debugCones.get(name));
    debugCones.delete(name);
});

alt.on("updateOutputPos", (id, name, pos) => {
    pos = toThreePos(pos);
    debugCones.get(name).position.set(pos.x, pos.y, pos.z);
});

alt.on("updateOutputRot", (id, name, rot) => {
    rot = toThreeRotCone(rot);
    debugCones.get(name).rotation.set(rot.x, rot.y, rot.z);
});

//////////////////////////////

alt.on("initAudioEmitter", (id, audio2d) => {
    new AudioEmitter(scene, listener, id, audio2d);
    if (AudioEmitter.all.length === 1) {
        alt.emit("cameraPosUpdate:start");
    }
});

AudioEmitter.addEventListener("ended", (event) => {
    alt.emit("audioEnded", event.id);
});

alt.on("setSource", async (id, source) => {
    try {
        // console.log("SET SOURCE", id, source);
        const audio = AudioEmitter.getByID(id);
        await audio.setSource(source);
        // console.log("SOURCE SET");
        alt.emit("sourceReady", source, true, audio.duration);
    } catch (error) {
        console.log("SOURCE SET ERROR", error);
        alt.emit("sourceReady", source, false, null);
    }
});

alt.on("setVolume", (id, volume) => (AudioEmitter.getByID(id).volume = volume));
alt.on("setDistance", (id, distance) => (AudioEmitter.getByID(id).distance = distance));
alt.on("setOuput", (id, name, pos, rot) => AudioEmitter.getByID(id).setOuput(name, toThreePos(pos), toThreeRot(rot)));
alt.on("removeOuput", (id, name) => AudioEmitter.getByID(id).removeOuput(name));
alt.on("updateOutputPos", (id, name, pos) => AudioEmitter.getByID(id).updateOutputPos(name, toThreePos(pos)));
alt.on("updateOutputRot", (id, name, rot) => AudioEmitter.getByID(id).updateOutputRot(name, toThreeRot(rot)));
alt.on("play", (id) => AudioEmitter.getByID(id).play());
alt.on("pause", (id) => AudioEmitter.getByID(id).pause());
alt.on("stop", (id) => AudioEmitter.getByID(id).stop());
alt.on("seek", (id, time) => AudioEmitter.getByID(id).seek(time));
alt.on("enable3d", (id, enable) => AudioEmitter.getByID(id).enable3d(enable));
alt.on("destroy", (id) => AudioEmitter.getByID(id).destroy());

alt.on("filter", (id, filterName, ...options) => {
    let filter;
    const audioEmitter = AudioEmitter.getByID(id);
    switch (filterName) {
        case "biquad":
            filter = audioEmitter.Filter.createBiquadFilter(...options);
            break;
        case "gain":
            filter = audioEmitter.Filter.createGain(...options);
            break;
        case "delay":
        // filter = audioEmitter.Filter.createDelay(...options);
        // filter.delayTime.value = 10;
        // break;
        case "convolver":
            return;
        default:
            console.log(`ERROR: Filter (${filterName}) not found`);
            break;
    }
    AudioEmitter.getByID(id).setFilter(filter);
});

alt.on("filters", (id, rawFilters) => {
    let filters = [];
    rawFilters.forEach(([filterName, ...options]) => {
        const audioEmitter = AudioEmitter.getByID(id);
        switch (filterName) {
            case "biquad":
                filters.push(audioEmitter.Filter.createBiquadFilter(...options));
                break;
            case "gain":
                filters.push(audioEmitter.Filter.createGain(...options));
                break;
            case "delay":
            // filter = audioEmitter.Filter.createDelay(...options);
            // filter.delayTime.value = 10;
            // break;
            case "convolver":
                return;
            default:
                console.log(`ERROR: Filter (${filterName}) not found`);
                break;
        }
    });
    AudioEmitter.getByID(id).setFilter(filters);
});

alt.on("removeAllFilters", (id) => AudioEmitter.getByID(id).removeAllFilters());

alt.on("destroyAudioEmitter", (id) => {
    const audioEmitter = AudioEmitter.getByID(id);
    if (!audioEmitter) {
        console.log(`ERROR: No audio emitter running with the id (${id})`);
        return;
    }
    audioEmitter.destroy();
    if (AudioEmitter.all.length === 0) {
        alt.emit("cameraPosUpdate:stop");
    }
});
