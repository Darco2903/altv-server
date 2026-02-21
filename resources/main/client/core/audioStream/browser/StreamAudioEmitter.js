import * as THREE from "./ThreeJS.js";

export class StreamAudioEmitter {
    /** @type {Map<number, StreamAudioEmitter>} */
    static #all = new Map();
    static getById(id) {
        return StreamAudioEmitter.#all.get(id);
    }

    /** @type {THREE.Scene} */
    #scene;
    /** @type {THREE.AudioListener} */
    #listener;

    /** @type {number} */
    #id;
    /** @type {HTMLAudioElement} */
    #audio;
    /** @type {AudioNode} */
    #gainNode;

    /** @type {number} */
    #distance;
    get distance() {
        return this.#distance;
    }
    set distance(value) {
        this.#distance = value;
        this.#outputs.forEach((audio) => {
            audio.setRolloffFactor(this.#calcRolloffFactor());
        });
    }
    /** @type {boolean} */
    #is3dEnabled;

    /** @type {number} */
    #volume;
    get volume() {
        return this.#volume;
    }
    set volume(value) {
        this.#volume = value;
        const volumeToApply = this.#volume * (1 - this.#muffleLevel / 3);
        console.log("volumeToApply", volumeToApply);
        // console.log("rollOff", this.#volume, this.#distance, this.#calcRolloffFactor());
        this.#outputs.forEach((audio) => {
            // audio.setVolume(this.#is3dEnabled ? (volumeToApply * 0.5) ** 2 : 0);
            audio.setVolume((this.#is3dEnabled ? volumeToApply ** 2 : 0) * 3);
            audio.setRolloffFactor(this.#calcRolloffFactor());
        });
        this.#gainNode.gain.setValueAtTime(this.#is3dEnabled ? 0 : (volumeToApply * 2) ** 2, 0);
        // this.#audio.volume = 0.3;
        // this.#gainNode.gain.setValueAtTime(0, 0);
    }

    #calcRolloffFactor() {
        if (this.#distance == 0) return 0;
        // return 1 / ((this.#volume == 0 ? 1 : this.#volume) * 5);
        // return 100 / ((this.#volume == 0 ? 1 : this.#volume) * 5 * this.#distance);
        return 700 / ((this.#volume == 0 ? 1 : this.#volume) * 5 * this.#distance);
    }

    /** @type {number} */
    #muffleLevel;

    /** @type {Map<string, THREE.PositionalAudio>} */
    #outputs = new Map();

    #createBiQuadFilter() {
        const audioContext = this.#listener.context;
        const biquadFilter = audioContext.createBiquadFilter();
        biquadFilter.type = "lowpass";
        // biquadFilter.frequency.value = 96000;
        biquadFilter.frequency.value = 22050;
        return biquadFilter;
    }

    #setBiQuadFilterFrequency(value) {
        this.#outputs.forEach((audio) => {
            audio.filters[0].frequency.value = value;
        });
    }

    constructor(scene, listener, id, source, distance, volume, is3dEnabled) {
        this.#scene = scene;
        this.#listener = listener;
        this.#id = id;
        StreamAudioEmitter.#all.set(id, this);
        this.#is3dEnabled = is3dEnabled;
        this.#distance = distance;
        this.#muffleLevel = 0;
        this.#audio = new Audio(source);
        this.#audio.volume = 0.25;
        const audioContext = this.#listener.context;
        this.audioSource = audioContext.createMediaElementSource(this.#audio);
        this.#gainNode = audioContext.createGain();
        this.audioSource.connect(this.#gainNode);
        this.#gainNode.connect(audioContext.destination);
        // this.#gainNode.gain.setValueAtTime(0, 0);
        this.volume = volume;
    }

    changeSource(id, source) {
        StreamAudioEmitter.#all.delete(this.#id);
        this.#id = id;
        this.#audio.src = source;
        StreamAudioEmitter.#all.set(id, this);
    }

    addOutput(name, pos, rot) {
        console.log("addOutput", name, pos, rot);
        const audio = new THREE.PositionalAudio(this.#listener);
        this.#outputs.set(name, audio);
        audio.position.set(pos.x, pos.y, pos.z);

        if (rot) {
            audio.setDirectionalCone(130, 90, 0.3);
            audio.rotation.set(rot.x, rot.y, rot.z);
        }
        audio.setDistanceModel("inverse");
        // audio.setRefDistance(1);
        audio.setRefDistance(10);
        const biquadFilter = this.#createBiQuadFilter();
        audio.setFilter(biquadFilter);

        // const gainFilter = this.#listener.context.createGain();
        // gainFilter.gain.setValueAtTime(1, 0);
        // audio.setFilter(gainFilter);
        audio.setNodeSource(this.audioSource);
        this.volume = this.#volume;
        this.#scene.add(audio);
    }

    removeOutput(name) {
        const audio = this.#outputs.get(name);
        if (!audio) {
            console.log(`ERROR: No output with the name (${name})`);
            return;
        }
        audio.disconnect();
        this.#scene.remove(audio);
        this.#outputs.delete(name);
        if (this.#outputs.size === 0) {
            this.destroy();
        }
    }

    updateOutput(name, pos, rot) {
        const audio = this.#outputs.get(name);
        if (!audio) {
            console.log(`ERROR: No output with the name (${name})`);
            return;
        }
        if (pos) audio.position.set(pos.x, pos.y, pos.z);
        if (rot) audio.rotation.set(rot.x, rot.y, rot.z);
    }

    play() {
        this.#audio.play();
    }

    pause() {
        this.#audio.pause();
    }

    // stop() {
    //     this.#audio.pause();
    //     this.#audio.currentTime = 0;
    // }

    reload() {
        const playing = !this.#audio.paused;
        this.#audio.src = this.#audio.src;
        if (playing) this.#audio.play();
    }

    async enable3d(value) {
        // console.log("TOGGLE 3D", value);
        this.#is3dEnabled = value;
        const MAX = 5;
        const wait = (time) => new Promise((resolve) => setTimeout(resolve, time));
        if (value) {
            for (let i = 1; i <= MAX; i++) {
                this.#outputs.forEach((audio) => {
                    audio.setVolume(this.#volume ** 2 * (i / MAX) * 2);
                });
                await wait(50);
                this.#gainNode.gain.setValueAtTime((this.#volume * 2) ** 2 * (1 - i / MAX), 0);
            }
        } else {
            for (let i = 1; i <= MAX; i++) {
                this.#gainNode.gain.setValueAtTime((this.#volume * 2) ** 2 * (i / MAX), 0);
                await wait(50);
                this.#outputs.forEach((audio) => {
                    audio.setVolume(this.#volume ** 2 * (1 - i / MAX) * 2);
                });
            }
        }
        this.volume = this.#volume;
    }

    #muffle() {
        this.#setBiQuadFilterFrequency(600 * (1 - this.#muffleLevel / 5));
        this.volume = this.volume;
    }

    #removeMuffle() {
        this.#setBiQuadFilterFrequency(22050);
        this.volume = this.volume;
    }

    addMuffle() {
        if (this.#muffleLevel >= 2) return;
        this.#muffleLevel++;
        console.log("ADD MUFFLE", this.#muffleLevel);
        this.#muffle();
    }

    lessMuffle() {
        if (this.#muffleLevel <= 0) return;
        this.#muffleLevel--;
        console.log("LESS MUFFLE", this.#muffleLevel);
        if (this.#muffleLevel !== 0) this.#muffle();
        else this.#removeMuffle();
    }

    async destroy() {
        StreamAudioEmitter.#all.delete(this.#id);
        this.#outputs.forEach((audio) => {
            audio.disconnect();
            this.#scene.remove(audio);
        });
        this.#outputs.clear();
        this.#gainNode.disconnect();
        this.#gainNode = null;
        if (this.#audio.currentTime === 0) await new Promise((resolve) => (this.#audio.oncanplay = resolve));
        this.#audio.pause();
        this.#audio.src = "";
        this.#audio = null;
    }
}
