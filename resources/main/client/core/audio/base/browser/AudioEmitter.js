// import * as THREE from "three";
import * as THREE from "./ThreeJS.js";
import Filter from "./Filter.js";
import EmptyAudioChannel from "./EmptyAudioChannel.js";

export default class AudioEmitter {
    /** @type {THREE.AudioLoader} */
    static #audioLoader = new THREE.AudioLoader();

    /** @type {Map<number, AudioEmitter>} */
    static #all = new Map();

    static get all() {
        return Array.from(this.#all.values());
    }

    static #eventTarget = new EventTarget();

    /**
     * @param {string} event
     * @param {Function} callback
     */
    static addEventListener(event, callback) {
        this.#eventTarget.addEventListener(event, callback);
    }

    /**
     * @param {string} event
     * @param {Function} callback
     */
    static removeEventListener(event, callback) {
        this.#eventTarget.removeEventListener(event, callback);
    }

    /** @type {THREE.Scene} */
    #scene;
    /** @type {THREE.AudioListener} */
    #listener;

    /** @type {number} */
    #id;
    get virtualId() {
        return this.#id;
    }

    static getByID(id) {
        return this.#all.get(id);
    }

    /** @type {number} */
    #volume;
    get volume() {
        return this.#volume;
    }

    set volume(volume) {
        // console.log("SET VOLUME", volume, this.#is3dEnabled);
        this.#volume = volume;
        this.#outputs.forEach((audio) => {
            audio.setVolume(this.#is3dEnabled ? volume ** 2 : 0);
            audio.setRolloffFactor(this.#calcRolloffFactor());
        });
        this.#audio2d.setVolume(this.#is3dEnabled ? 0 : volume ** 2);
    }

    #calcRolloffFactor() {
        if (this.#distance == 0) return 0;
        // return 1 / ((this.#volume == 0 ? 1 : this.#volume) * 5);
        return 100 / ((this.#volume == 0 ? 1 : this.#volume) * 5 * this.#distance);
    }

    #distance;
    get distance() {
        return this.#distance;
    }

    set distance(distance) {
        // console.log("SET DISTANCE", distance);
        this.#distance = distance;
        this.#outputs.forEach((audio) => {
            audio.setRolloffFactor(this.#calcRolloffFactor());
        });
    }

    /** @type {AudioBuffer} */
    #sourceBuffer;

    /** @type {AudioBuffer} */
    #currentBuffer;
    get buffer() {
        return this.#currentBuffer;
    }

    get duration() {
        return this.#currentBuffer?.duration;
    }

    /** @type {string} */
    #source;
    get source() {
        return this.#source;
    }

    #isPlaying;
    get isPlaying() {
        return this.#isPlaying;
    }

    #isPaused;
    get isPaused() {
        return this.#isPaused;
    }

    /** @type {boolean} */
    #ended;
    get ended() {
        return this.#ended;
    }

    /** @type {Filter} */
    #Filter;
    get Filter() {
        return this.#Filter;
    }

    /** @type {Array<AudioNode>} */
    #filters;

    /** @type {boolean} */
    #is3dEnabled;

    /** @type {Map<string, THREE.PositionalAudio>} */
    #outputs;
    get outputs() {
        return Array.from(this.#outputs.values());
    }
    // #supportsAudio3d;
    getOutput(name) {
        return this.#outputs.get(name);
    }

    hasOutput(name) {
        return this.#outputs.has(name);
    }

    // get supportsAudio3d() {
    //     return this.#supportsAudio3d;
    // }

    // set supportsAudio3d(supports) {
    //     if (this.#supportsAudio3d === supports) return;
    //     if (supports) {
    //         this.#outputs.forEach((audio) => this.#scene.add(audio));
    //     } else {
    //         this.#outputs.forEach((audio) => this.#scene.remove(audio));
    //     }
    //     this.#supportsAudio3d = supports;
    // }

    /** @type {THREE.Audio} */
    #audio2d;
    #supportsAudio2d;
    get supportsAudio2d() {
        return this.#supportsAudio2d;
    }

    // set supportsAudio2d(supports) {
    //     if (this.#supportsAudio2d === supports) return;
    //     if (supports) {
    //         this.#audio2d = new THREE.Audio(this.#listener);
    //         this.#scene.add(this.#audio2d);
    //     } else {
    //         this.#audio2d = new EmptyAudioChannel();
    //         this.#scene.remove(this.#audio2d);
    //     }
    //     this.#supportsAudio2d = supports;
    // }

    /** @type {THREE.Clock} */
    #clock;

    /** @type {number} */
    #time;
    get time() {
        return this.#time + this.#clock.getElapsedTime();
    }

    /**
     * @param {THREE.Scene} scene
     * @param {THREE.AudioListener} listener
     */
    constructor(scene, listener, id, supportsAudio2d) {
        AudioEmitter.#all.set(id, this);
        this.#scene = scene;
        this.#listener = listener;
        this.#id = id;
        this.#volume = 0;
        this.#distance = 0;
        this.#isPlaying = false;
        this.#isPaused = false;
        this.#Filter = new Filter(this.#listener.context);
        this.#filters = [];
        this.#is3dEnabled = true;
        this.#outputs = new Map();
        this.#audio2d = supportsAudio2d ? new THREE.Audio(listener) : new EmptyAudioChannel();
        this.#audio2d.setVolume(0);
        this.#supportsAudio2d = supportsAudio2d;
        this.#clock = new THREE.Clock();
        this.#time = 0;
        this.#audio2d.onEnded = this.#onEnded;
    }

    /**
     * @param {string} source
     * @returns {Promise<void>}
     */
    async setSource(source) {
        // console.log("SET SOURCE");
        const blob = await fetch(source, {
            headers: {
                range: "bytes=0-",
            },
        }).then((res) => res.blob());
        const url = URL.createObjectURL(blob);
        const buffer = await AudioEmitter.#audioLoader.loadAsync(url, (progressEvent) => {});
        // console.log("SET BUFFER");
        this.#source = source;
        this.#sourceBuffer = buffer;
        this.#currentBuffer = buffer;
        this.#outputs.forEach((audio) => {
            if (this.#isPlaying) audio.stop();
            audio.setBuffer(buffer);
            if (this.#isPlaying) audio.play();
        });
        if (this.#isPlaying) this.#audio2d.stop();
        this.#audio2d.setBuffer(buffer);
        if (this.#isPlaying) this.#audio2d.play();
    }

    /**
     * @param {string} name
     * @param {THREE.Vector3} pos
     * @param {{innerAngle: number, outerAngle: number, outerGain: number}} [cone]
     */
    setOuput(name, pos, rot) {
        // console.log("SET OUTPUT", name);
        if (this.#outputs.has(name)) {
            // console.log(`ERROR: Output with the name (${name}) already exists`);
            return;
        }
        // console.log(
        //     "SET OUTPUT",
        //     name,
        //     pos.toArray().map((n) => n.toFixed(2))
        // );
        const audio = new THREE.PositionalAudio(this.#listener);
        audio.position.set(pos.x, pos.y, pos.z);
        this.#outputs.set(name, audio);
        this.#scene.add(audio);
        if (rot) {
            audio.setDirectionalCone(130, 90, 0.3);
            audio.rotation.set(rot.x, rot.y, rot.z);
        }
        // audio.setDistanceModel("exponential");
        audio.setDistanceModel("inverse");
        audio.setRefDistance(1);
        this.volume = this.#volume;
        audio.onEnded = this.#onEnded;
        audio.filters.push(...this.#filters);
        // console.log("play", this.#isPlaying, this.#isPaused);
        if (this.#isPlaying || this.#isPaused) {
            // console.log("PLAYING", this.times);
            this.seek(this.time);
            audio.play();
        } else if (this.#currentBuffer) {
            audio.setBuffer(this.#currentBuffer);
        }
    }

    #onEnded = () => {
        if (this.#ended) return;
        this.#ended = true;
        this.stop();
        this.seek(0);
        const event = new Event("ended");
        event.id = this.#id;
        AudioEmitter.#eventTarget.dispatchEvent(event);
    };

    removeOuput(name) {
        if (!this.#outputs.has(name)) {
            console.log(`ERROR: No output with the name (${name})`);
            return;
        }
        const audio = this.#outputs.get(name);
        audio.stop();
        this.#scene.remove(audio);
        this.#outputs.delete(name);
    }

    /**
     * @param {string} name
     * @param {THREE.Vector3} pos
     */
    updateOutputPos(name, pos) {
        if (!this.#outputs.has(name)) {
            console.log(`ERROR: No output with the name (${name})`);
            return;
        }
        const audio = this.#outputs.get(name);
        audio.position.set(pos.x, pos.y, pos.z);
    }

    /**
     * @param {string} name
     * @param {THREE.Vector3} rot
     */
    updateOutputRot(name, rot) {
        if (!this.#outputs.has(name)) {
            console.log(`ERROR: No output with the name (${name})`);
            return;
        }
        const audio = this.#outputs.get(name);
        audio.rotation.set(rot.x, rot.y, rot.z);
    }

    play() {
        if (!this.#currentBuffer) {
            // console.log("NO BUFFER");
            return;
        }
        if (this.#isPlaying) {
            // console.log("ALREADY PLAYING");
            return;
        }
        this.#isPlaying = true;
        this.#isPaused = false;
        this.#ended = false;
        this.#outputs.forEach((audio) => audio.play());
        this.#audio2d.play();
        this.#time += this.#clock.elapsedTime;
        this.#clock.start();
    }

    pause() {
        // console.log("PAUSE");
        if (!this.#isPlaying) {
            // console.log("NOT PLAYING");
            return;
        }
        this.#isPlaying = false;
        this.#isPaused = true;
        this.#outputs.forEach((audio) => audio.pause());
        this.#audio2d.pause();
        this.#clock.stop();
    }

    stop() {
        // console.log("STOP");
        if (!this.#isPlaying && !this.#isPaused) {
            // console.log("NOT PLAYING");
            return;
        }
        this.#isPlaying = false;
        this.#isPaused = false;
        this.#outputs.forEach((audio) => audio.stop());
        this.#audio2d.stop();
        this.#clock.stop();
        this.#time = 0;
        this.#clock.elapsedTime = 0;
    }

    /**
     * @param {AudioNode|Array<AudioNode>} filter
     */
    setFilter(filter) {
        if (!Array.isArray(filter)) filter = [filter];
        // console.log("SET FILTER", filter);
        this.#filters = this.#filters.concat(filter);
        this.#outputs.forEach((audio) => {
            audio.filters.push(...filter);
            if (this.#isPlaying) {
                audio.pause();
                audio.play();
            }
        });
    }

    removeAllFilters() {
        this.#filters = [];
        this.#outputs.forEach((audio) => {
            audio.filters = [];
            if (this.#isPlaying) {
                audio.pause();
                audio.play();
            }
        });
    }

    /**
     * @param {number} time
     */
    seek(time) {
        console.log("SEEK 3rd", time);
        if (!this.#sourceBuffer) throw new Error("No sourceBuffer");
        if (isNaN(time) || time < 0 || time > this.#sourceBuffer.duration) {
            throw new Error(`Invalid time (${time})`);
        }
        time += 0.05; // 50ms because of the delay
        this.#clock.stop();
        this.#time = time;
        this.#clock.start();
        const percent = time / this.#sourceBuffer.duration;
        const start = this.#sourceBuffer.length * percent;
        const length = this.#sourceBuffer.length - start;
        // console.log("buffer", length);
        const newBuffer = new AudioBuffer({
            length,
            duration: this.#sourceBuffer.duration - time,
            numberOfChannels: this.#sourceBuffer.numberOfChannels,
            sampleRate: this.#sourceBuffer.sampleRate,
        });
        for (let i = 0; i < this.#sourceBuffer.numberOfChannels; i++) {
            const channelData = this.#sourceBuffer.getChannelData(i);
            newBuffer.copyToChannel(channelData.slice(start), i);
        }
        this.#currentBuffer = newBuffer;
        this.#outputs.forEach((audio) => {
            // console.log(!!audio, audio);
            audio.setBuffer(newBuffer);
            if (this.#isPlaying) {
                try {
                    audio.stop();
                } catch (error) {}
                audio.play();
            }
        });
        this.#audio2d.setBuffer(newBuffer);
        if (this.#isPlaying) {
            this.#audio2d.stop();
            this.#audio2d.play();
        }
    }

    async enable3d(enable) {
        if (this.#is3dEnabled === enable) return;
        // console.log("TOGGLE 3D", enable);
        this.#is3dEnabled = enable;
        const MAX = 5;
        if (enable) {
            for (let i = 1; i <= MAX; i++) {
                // console.log(this.#volume, i, i / MAX, 1 - i / MAX);
                this.#outputs.forEach((audio) => audio.setVolume(this.#volume ** 2 * (i / MAX)));
                this.#audio2d.setVolume(this.#volume ** 2 * (1 - i / MAX));
                await new Promise((resolve) => setTimeout(resolve, 50));
            }
            // this.#outputs.forEach((audio) => audio.setVolume(this.#volume));
            // this.#audio2d.setVolume(0);
        } else {
            for (let i = 1; i <= MAX; i++) {
                // console.log(this.#volume, i, i / MAX, 1 - i / MAX);
                this.#outputs.forEach((audio) => audio.setVolume(this.#volume ** 2 * (1 - i / MAX)));
                this.#audio2d.setVolume(this.#volume ** 2 * (i / MAX));
                await new Promise((resolve) => setTimeout(resolve, 50));
            }
            // this.#outputs.forEach((audio) => audio.setVolume(0));
            // this.#audio2d.setVolume(this.#volume);
        }
    }

    destroy() {
        // console.log("DESTROY");
        this.#outputs.forEach((audio) => {
            audio.stop();
            this.#scene.remove(audio);
        });
        this.#audio2d.stop();
        this.#outputs.clear();
        AudioEmitter.#all.delete(this.virtualId);
        this.#id = -1;
    }
}
