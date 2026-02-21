import * as alt from "alt-client";
import * as native from "natives";

export default class AudioBase {
    static #SOURCE_TIMEOUT = 60_000;
    static #VIEW_URL = "http://resource/client/core/audio/base/browser/index.html";
    /** @type {alt.WebView} */
    static #view;
    /** @type {boolean} */
    static #debug;
    static get debug() {
        return AudioBase.#debug;
    }

    static set debug(value) {
        if (value === AudioBase.#debug) return;
        if (typeof value !== "boolean") throw new Error("Invalid debug");
        AudioBase.#debug = value;
        AudioBase.#view.isVisible = value;
        AudioBase.#view.emit("setDebug", value);
    }

    /** @type {number} */
    static #staticId = 0;

    /** @type {Map<number, AudioBase>} */
    static #all = new Map();
    static get all() {
        return Array.from(AudioBase.#all.values());
    }

    static getByID(id) {
        return AudioBase.#all.get(id);
    }

    /** @type {number} */
    #id;
    get id() {
        return this.#id;
    }

    /** @type {string} */
    #source;
    get source() {
        return this.#source;
    }

    /** @type {string} */
    #sourceToSet;

    // /** @type {boolean} */
    // #sourceReady;

    /** @type {string} */
    #title;
    get title() {
        return this.#title;
    }

    set title(title) {
        this.#title = title;
    }

    /** @type {number} */
    #duration;
    get duration() {
        return this.#duration;
    }

    /** @type {number} */
    #startTime;

    /** @type {number} */
    #currentTime;

    get currentTime() {
        return (this.#isPlaying ? alt.getNetTime() - this.#startTime : 0) + this.#currentTime;
    }

    /** @type {number} */
    #volume;
    get volume() {
        return this.#volume;
    }

    set volume(value) {
        // this.setVolume(volume);
        if (value < 0) value = 0;
        if (value > 1) value = 1;
        this.#volume = value;
        AudioBase.#view.emit("setVolume", this.#id, value);
    }

    /** @type {number} */
    #distance;
    get distance() {
        return this.#distance;
    }

    set distance(value) {
        // this.setDistance(value);
        if (value < 0) throw new Error("Invalid distance");
        this.#distance = value;
        AudioBase.#view.emit("setDistance", this.#id, value);
    }

    /** @type {boolean} */
    #isPlaying;
    get isPlaying() {
        return this.#isPlaying;
    }

    /** @type {boolean} */
    #isPaused;
    get isPaused() {
        return this.#isPaused;
    }

    /** @type {boolean} */
    #ended;
    get ended() {
        return this.#ended;
    }

    // /** @type {boolean} */
    // #ended;
    // get ended() {
    //     return this.#ended;
    // }

    /** @type {boolean} */
    #is3dEnabled;
    get is3dEnabled() {
        return this.#is3dEnabled;
    }

    /** @type {Map<string, alt.Entity>} */
    #outputs;

    /** @type {number} */
    #outputsPosCount;
    /** @type {number} */
    get outputsCount() {
        return this.#outputsPosCount;
    }

    /** @type {number} */
    #entityOutputUpdateTick;

    static #degToRad(deg) {
        return (deg * Math.PI) / 180.0;
    }

    static #rotationToDirection(rot) {
        const zDeg = AudioBase.#degToRad(rot.z);
        const xDeg = AudioBase.#degToRad(rot.x);
        const n = Math.abs(Math.cos(xDeg));
        return new alt.Vector3(-Math.sin(zDeg) * n, Math.cos(zDeg) * n, Math.sin(xDeg));
    }

    static async init(debug = false) {
        if (AudioBase.#view) return;
        AudioBase.#view = new alt.WebView(AudioBase.#VIEW_URL);
        AudioBase.#view.emit("init");
        AudioBase.debug = debug;
        // AudioBase.#view.isVisible = debug;
        AudioBase.#view.on("cameraPosUpdate:start", () => {
            AudioBase.#view.emit("setCameraFov", Math.round(native.getGameplayCamFov()));
            const ref = alt.setInterval(() => {
                const camPos = alt.getCamPos();
                const camRot = native.getGameplayCamRot(2);
                const lookAt = camPos.add(AudioBase.#rotationToDirection(camRot).mul(100));
                AudioBase.#view.emit("setCameraPos", new alt.Vector3(alt.Player.local.pos), new alt.Vector3(lookAt));
            }, 25);
            AudioBase.#view.once("cameraPosUpdate:stop", () => alt.clearInterval(ref));
        });
        AudioBase.#view.on("audioEnded", (id) => {
            const audio = AudioBase.getByID(id);
            if (!audio) return;
            audio.#ended = true;
            console.log("audioEnded", id);
            // audio.#ended = true;
            audio.stop();
            alt.emit("audioEnded", id);
            if (audio.onended) audio.onended();
        });
    }

    /** @type {Function} */
    onended;

    // /** @type {boolean} */
    // #autoPlay;
    // get autoPlay() {
    //     return this.#autoPlay;
    // }
    // set autoPlay(value) {
    //     this.#autoPlay = value;
    // }

    constructor({ distance = 1, support2dAudio = false, volume = 1, autoPlay = false }) {
        this.#id = ++AudioBase.#staticId;
        AudioBase.#all.set(this.#id, this);
        AudioBase.#view.emit("initAudioEmitter", this.#id, support2dAudio);
        this.volume = volume;
        this.distance = distance;
        // this.#sourceReady = false;
        this.#isPlaying = false;
        this.#isPaused = false;
        this.#outputs = new Map();
        this.#outputsPosCount = 0;
        this.#is3dEnabled = true;
        this.#currentTime = 0;
        // this.#autoPlay = autoPlay;
    }

    async setSource(source) {
        if (!source) throw new Error("No source");
        if (typeof source !== "string") throw new Error("Source is not a string");
        if (this.#source === source) {
            alt.logWarning("Same source");
            return;
        }
        if (this.#sourceToSet === source) {
            alt.logWarning("Source is already being set");
            return;
        }
        return new Promise((resolve, reject) => {
            this.#sourceToSet = source;
            // this.#sourceReady = false;
            const playing = this.#isPlaying;
            if (playing) this.stop();
            console.log("SET SOURCE", source);
            AudioBase.#view.emit("setSource", this.#id, source);

            let timeout;
            const f = (sourceSet, isSourceReady, duration) => {
                if (sourceSet !== source) return;
                // console.log("SOURCE READY");
                console.log("autoPlay", playing);
                // if (playing || this.#autoPlay) this.play();
                if (playing) this.play();
                this.#source = source;
                this.#sourceToSet = null;
                // this.#sourceReady = isSourceReady;
                this.#duration = duration;
                clearTimeout(timeout);
                AudioBase.#view.off("sourceReady", f);
                if (isSourceReady) resolve();
                else reject(new Error("setSource error"));
            };
            timeout = setTimeout(() => {
                reject(new Error(`Audio id:${this.#id} setSource timeout`));
                AudioBase.#view.off("sourceReady", f);
            }, AudioBase.#SOURCE_TIMEOUT);
            AudioBase.#view.on("sourceReady", f);
        });
    }

    /**
     * @param {alt.VirtualEntity} virtualEntity
     */
    setOutput(virtualEntity) {
        const name = AudioBase.#entityOutputName(virtualEntity);
        const rot = virtualEntity.getStreamSyncedMeta("audio:rot");
        AudioBase.#view.emit("setOuput", this.#id, name, virtualEntity.pos, rot);
        this.#outputsPosCount++;
        this.#muffle();
        if (AudioBase.#debug) alt.Utils.drawText3d(name, virtualEntity.pos, 1, 1, new alt.RGBA(255, 255, 255, 255), false, true, 0);
    }

    removeOutput(virtualEntity) {
        const name = AudioBase.#entityOutputName(virtualEntity);
        AudioBase.#view.emit("removeOuput", this.#id, name);
        this.#outputsPosCount--;
    }

    updateOutputPos(entity, pos) {
        // if (!pos) throw new Error("No output pos");
        // if (!(pos instanceof alt.Vector3)) throw new Error("pos is not an instance of alt.Vector3");
        const name = AudioBase.#entityOutputName(entity);
        AudioBase.#view.emit("updateOutputPos", this.#id, name, pos);
    }

    updateOutputRot(entity, rot) {
        // if (!rot) throw new Error("No output rot");
        // if (!(rot instanceof alt.Vector3)) throw new Error("rot is not an instance of alt.Vector3");
        const name = AudioBase.#entityOutputName(entity);
        AudioBase.#view.emit("updateOutputRot", this.#id, name, rot);
    }

    /**
     * @param {alt.Entity} entity
     * @param {string} name
     */
    static #entityOutputName(entity) {
        return `${entity.type}:${entity.id}`;
    }

    #startEntityOutputUpdate() {
        // console.log("startEntityOutputUpdate");
        alt.on("removeEntity", this.removeOutputOnEntity.bind(this));
        this.#entityOutputUpdateTick = alt.everyTick(() => {
            this.#outputs.forEach((entity, name) => {
                // console.log(entity.valid);
                // if (!entity.valid) this.removeOutputOnEntity(entity);
                // else this.updateOutputPos(name, entity.pos);
                // this.updateOutputPos(name, entity.pos);
                this.updateOutputPos(entity, entity.pos);
            });
        });
    }

    #stopEntityOutputUpdate() {
        // console.log("stopEntityOutputUpdate");
        alt.off("removeEntity", this.removeOutputOnEntity.bind(this));
        alt.clearEveryTick(this.#entityOutputUpdateTick);
        this.#entityOutputUpdateTick = undefined;
    }

    setOutputOnEntity(entity) {
        // if (!entity) throw new Error("No entity");
        // if (!(entity instanceof alt.Entity)) throw new Error("entity is not an instance of alt.Entity");
        this.setOutput(entity);
        const name = AudioBase.#entityOutputName(entity);
        this.#outputs.set(name, entity);
        // console.log("outputsCount:", this.#outputs.size);
        if (this.#outputs.size === 1 && !this.#entityOutputUpdateTick) {
            this.#startEntityOutputUpdate();
        }
    }

    removeOutputOnEntity(entity) {
        // console.log("removeOutputOnEntity");
        // if (!entity) throw new Error("No entity");
        // if (!(entity instanceof alt.Entity)) throw new Error("entity is not an instance of alt.Entity");
        this.removeOutput(entity);
        const name = AudioBase.#entityOutputName(entity);
        this.#outputs.delete(name);
        if (this.#outputs.size === 0 && this.#entityOutputUpdateTick) {
            this.#stopEntityOutputUpdate();
        }
    }

    play() {
        if (!this.#source) throw new Error("No source");
        // if (!this.#source && !this.#sourceToSet) throw new Error("No source");
        // if (!this.#sourceReady) await alt.Utils.waitFor(() => this.#sourceReady, AudioBase.#SOURCE_TIMEOUT);
        if (this.#isPlaying) throw new Error("Already playing");
        this.#isPlaying = true;
        this.#isPaused = false;
        this.#ended = false;
        this.#startTime = alt.getNetTime();
        AudioBase.#view.emit("play", this.#id);
    }

    pause() {
        if (!this.#source) throw new Error("No source");
        // if (!this.#source && !this.#sourceToSet) throw new Error("No source");
        // if (!this.#sourceReady) await alt.Utils.waitFor(() => this.#sourceReady, AudioBase.#SOURCE_TIMEOUT);
        if (!this.#isPlaying) throw new Error("Not playing");
        if (this.#isPaused) throw new Error("Already paused");
        this.#isPlaying = false;
        this.#isPaused = true;
        this.#currentTime += alt.getNetTime() - this.#startTime;
        AudioBase.#view.emit("pause", this.#id);
    }

    stop() {
        if (!this.#source) throw new Error("No source");
        // if (!this.#source && !this.#sourceToSet) throw new Error("No source");
        // if (!this.#sourceReady) await alt.Utils.waitFor(() => this.#sourceReady, AudioBase.#SOURCE_TIMEOUT);
        if (!this.#isPlaying && !this.#isPaused) throw new Error("Not playing");
        this.#isPlaying = false;
        this.#isPaused = false;
        this.#startTime = undefined;
        this.#currentTime = 0;
        AudioBase.#view.emit("stop", this.#id);
    }

    // setVolume(volume) {
    //     if (volume < 0 || volume > 1) throw new Error("Invalid volume");
    //     this.#volume = volume;
    //     Audio.#view.emit("setVolume", this.#id, volume);
    // }

    // setDistance(distance) {
    //     if (distance < 0) throw new Error("Invalid distance");
    //     this.#distance = distance;
    //     Audio.#view.emit("setDistance", this.#id, distance);
    // }

    _seek(time) {
        if (time < 0 || time > this.#duration) throw new Error("Invalid time");
        if (!this.#source) throw new Error("No source");
        // if (!this.#source && !this.#sourceToSet) throw new Error("No source");
        // if (!this.#sourceReady) await alt.Utils.waitFor(() => this.#sourceReady, AudioBase.#SOURCE_TIMEOUT);
        // console.log("SEEK 1st", time);
        this.#startTime = alt.getNetTime();
        this.#currentTime = time * 1000;
        AudioBase.#view.emit("seek", this.#id, time);
    }

    setFilter(filter, ...options) {
        switch (filter) {
            case "biquad":
            case "gain":
            case "delay":
            case "convolver":
                if (!options[0]) {
                    console.log("ERROR: No filter options");
                    return;
                }
                AudioBase.#view.emit("filter", this.#id, filter, ...options);
                break;

            default:
                console.log(`ERROR: Filter (${filter}) not found`);
                break;
        }
    }

    setAudioFilters(filters) {
        filters.forEach(([filter, ...options]) => {
            switch (filter) {
                case "biquad":
                case "gain":
                    if (!options[0]) {
                        console.log("ERROR: No filter options");
                        return;
                    }
                    break;
                case "delay":
                case "convolver":
                    return;
                default:
                    console.log(`ERROR: Filter (${filter}) not found`);
                    break;
            }
        });
        // filters.push(["gain", this.#calcGain()]);
        console.log("SET FILTERS", filters);
        AudioBase.#view.emit("filters", this.#id, filters);
    }

    removeFilters() {
        AudioBase.#view.emit("removeAllFilters", this.#id);
    }

    _enable3d(enable) {
        if (this.#is3dEnabled === enable) return;
        this.#is3dEnabled = enable;
        AudioBase.#view.emit("enable3d", this.#id, enable);
    }

    destroy() {
        if (this.#entityOutputUpdateTick) this.#stopEntityOutputUpdate();
        AudioBase.#view.emit("destroyAudioEmitter", this.#id);
        AudioBase.#all.delete(this.#id);
    }

    ///////////////////////////

    /** @type {boolean} */
    #isExteriorMuffled = false;
    get isExteriorMuffled() {
        return this.#isExteriorMuffled;
    }

    #muffleLevel = 0;
    get muffleLevel() {
        return this.#muffleLevel;
    }

    #calcGain() {
        return 0.2 * (1 - this.#muffleLevel / 5) * (1 / this.#outputsPosCount);
    }

    async #muffle() {
        // this.distance = SyncedCarRadio.#DEFAULT_DISTANCE - this.#muffleLevel * 3;
        this.removeFilters();
        // console.log("MUFFLE", this.#muffleLevel);
        if (this.#muffleLevel > 0) {
            this.setAudioFilters([
                ["biquad", "lowpass", 600 * (1 - this.#muffleLevel / 5)],
                ["gain", this.#calcGain()],
            ]);
        } else {
            this.setAudioFilters([["gain", this.#calcGain()]]);
        }
    }

    addMuffle() {
        // console.log("ADD MUFFLE");
        if (this.#muffleLevel >= 2) return;
        this.volume /= 1.25;
        // this.volume /= 1.75;
        // this.distance /= 2;
        this.#muffleLevel++;
        this.#muffle();
    }

    lessMuffle() {
        // console.log("LESS MUFFLE");
        if (this.#muffleLevel <= 0) return;
        this.volume *= 1.25;
        // this.volume *= 1.75;
        // this.distance *= 2;
        this.#muffleLevel--;
        this.#muffle();
    }

    exteriorMuffle(enable) {
        // console.log("EXTERIOR MUFFLE", enable);
        if (enable === this.#isExteriorMuffled) return;
        this.#isExteriorMuffled = enable;
        if (enable) this.addMuffle();
        else this.lessMuffle();
    }
}
