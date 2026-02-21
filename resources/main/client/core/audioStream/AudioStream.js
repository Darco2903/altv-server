import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;
let camUpdateInterval;

function degToRad(deg) {
    return (deg * Math.PI) / 180.0;
}

function rotationToDirection(rot) {
    const zDeg = degToRad(rot.z);
    const xDeg = degToRad(rot.x);
    const n = Math.abs(Math.cos(xDeg));
    return new alt.Vector3(-Math.sin(zDeg) * n, Math.cos(zDeg) * n, Math.sin(xDeg));
}

function updateCamera() {
    const camPos = alt.getCamPos();
    const camRot = native.getGameplayCamRot(2);
    const lookAt = camPos.add(rotationToDirection(camRot).mul(100));
    AudioStream.updateCamera(player.pos, lookAt);
}

function startUpdateCamera() {
    if (camUpdateInterval) return;
    camUpdateInterval = alt.setInterval(updateCamera, 25);
}

export class AudioStream {
    /** @type {alt.WebView} */
    static #view;
    static init(viewUrl) {
        AudioStream.#view = new alt.WebView(viewUrl, false);
        AudioStream.#view.isVisible = false;
        AudioStream.#view.on("load", startUpdateCamera);
    }

    static updateCamera(pos, lookAt) {
        AudioStream.#view.emit("setCameraPos", pos, lookAt);
    }

    /** @type {Map<number, AudioStream>} */
    static #all = new Map();
    static get all() {
        return Array.from(AudioStream.#all.values());
    }
    static getById(id) {
        return AudioStream.#all.get(id);
    }

    /** @type {number} */
    #id;
    get id() {
        return this.#id;
    }

    /** @type {string} */
    #url;
    /** @type {number} */
    #duration;
    get duration() {
        return this.#duration;
    }

    /** @type {string} */
    title;

    /** @type {number} */
    startTime;
    /** @type {number} */
    elapsedTime;
    /** @type {number} */
    downloaded;
    /** @type {number} */
    #volume;
    get volume() {
        return this.#volume;
    }
    set volume(value) {
        this.#volume = value;
        AudioStream.#view.emit("volume", this.#id, value);
    }

    /** @type {boolean} */
    #isPaused;
    get isPaused() {
        return this.#isPaused;
    }

    /** @type {Map<alt.Entity|alt.VirtualEntity, number>} */
    #entityOutputs = new Map();

    /** @type {boolean} */
    #interiorMuffled = false;
    get interiorMuffled() {
        return this.#interiorMuffled;
    }
    set interiorMuffled(value) {
        if (this.#interiorMuffled === value) return;
        this.#interiorMuffled = value;
        if (value) this.addMuffle();
        else this.lessMuffle();
    }

    /** @type {boolean} */
    #exteriorMuffled = false;
    get exteriorMuffled() {
        return this.#exteriorMuffled;
    }
    set exteriorMuffled(value) {
        if (this.#exteriorMuffled === value) return;
        this.#exteriorMuffled = value;
        if (value) this.addMuffle();
        else this.lessMuffle();
    }

    #createUrl(path) {
        return "https://dev.altv.darco2903.fr" + path;
    }

    constructor(id, path, duration, distance, volume, is3dEnabled = false) {
        this.#id = id;
        this.#url = this.#createUrl(path);
        this.#duration = duration;
        this.#volume = volume;
        this.#isPaused = true;
        AudioStream.#all.set(id, this);
        AudioStream.#view.emit("createAudioStream", id, this.#url, distance, volume, is3dEnabled);
    }

    changeSource(id, path) {
        AudioStream.#all.delete(this.#id);
        this.#id = id;
        this.#url = this.#createUrl(path);
        AudioStream.#all.set(id, this);
        AudioStream.#view.emit("changeSource", this.#id, this.#url);
    }

    play() {
        this.#isPaused = false;
        AudioStream.#view.emit("play", this.#id);
    }

    pause() {
        this.#isPaused = true;
        AudioStream.#view.emit("pause", this.#id);
    }

    reload() {
        AudioStream.#view.emit("reload", this.#id);
    }

    enable3d(enable) {
        AudioStream.#view.emit("enable3d", this.#id, enable);
    }

    setResonance() {
        AudioStream.#view.emit("resonance", this.#id, player.pos);
    }

    #getEntityKey(audioId, output) {
        return `${audioId}:${output.type}:${output.id}`;
    }

    addOutput(name, pos, rot) {
        AudioStream.#view.emit("addOutput", this.#id, name, pos, rot);
    }

    removeOutput(name) {
        AudioStream.#view.emit("removeOutput", this.#id, name);
    }

    updateOutput(name, pos, rot) {
        AudioStream.#view.emit("updateOutput", this.#id, name, pos, rot);
    }

    addOutputOnEntity(entity, updatePos = false, updateRot = false) {
        // console.log("addOutputOnEntity", entity.id, updatePos, updateRot);
        const name = this.#getEntityKey(this.#id, entity);
        this.addOutput(name, entity.pos);
        if (!updatePos && !updateRot) return;
        const interval = alt.setInterval(() => {
            // console.log("updateOutput", name, updatePos, updateRot);
            this.updateOutput(name, updatePos ? entity.pos : null, updateRot ? entity.rot : null);
        }, 25);
        this.#entityOutputs.set(entity, interval);
    }

    removeOutputOnEntity(entity) {
        const name = this.#getEntityKey(this.#id, entity);
        this.removeOutput(name);
        const interval = this.#entityOutputs.get(entity);
        if (interval) {
            alt.clearInterval(interval);
            this.#entityOutputs.delete(entity);
        }
    }

    addMuffle() {
        AudioStream.#view.emit("addMuffle", this.#id);
    }

    lessMuffle() {
        AudioStream.#view.emit("lessMuffle", this.#id);
    }

    destroy() {
        this.#entityOutputs.forEach((interval) => alt.clearInterval(interval));
        this.#entityOutputs.clear();
        AudioStream.#all.delete(this.#id);
        AudioStream.#view.emit("destroy", this.#id);
    }
}
