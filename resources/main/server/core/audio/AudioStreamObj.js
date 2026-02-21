import * as alt from "alt-server";

export default class AudioStreamObj {
    static #staticId = 1;
    static #minVolume = 0;
    static #maxVolume = 1;
    static #minDistance = 0;

    /** @type {Map<number, AudioStreamObj>} */
    static #all = new Map();
    static get all() {
        return [...this.#all.values()];
    }

    static getByID(id) {
        return this.#all.get(id);
    }

    /** @type {alt.VirtualEntityGroup} */
    static #virtualGroup = new alt.VirtualEntityGroup(999_999);
    // /** @type {alt.VirtualEntityGroup[]} */
    // static #virtualGroups = [];
    // static #getVirtualGroup() {
    //     this.#virtualGroups.push(group);
    //     console.log(group.maxEntitiesInStream, group.refCount);
    //     const a = new alt.VirtualEntity(group, alt.Vector3.zero, 100);
    //     console.log(group.maxEntitiesInStream, group.refCount);
    //     a.destroy();
    //     return group;
    // }

    // static #initiated = false;
    // static #init() {
    //     this.#initiated = true;
    // }

    /** @type {number} */
    _id;
    get id() {
        return this._id;
    }

    /** @type {string} */
    #source;
    get source() {
        return this.#source;
    }

    set source(source) {
        this.#source = source;
        this.#outputs.forEach((entity) => {
            entity.setStreamSyncedMeta("audio:source", source);
        });
    }

    /** @type {string} */
    #title;
    get title() {
        return this.#title;
    }

    set title(title) {
        this.#title = title;
        this.#outputs.forEach((entity) => {
            entity.setStreamSyncedMeta("audio:title", title);
        });
    }

    /** @type {number} */
    #volume;
    get volume() {
        return this.#volume;
    }

    set volume(volume) {
        if (volume < AudioStreamObj.#minVolume) throw new Error("Volume can't be lower than 0");
        if (volume > AudioStreamObj.#maxVolume) throw new Error("Volume can't be higher than 1");
        this.#volume = volume;
        this.#outputs.forEach((entity) => {
            entity.setStreamSyncedMeta("audio:volume", volume);
        });
    }

    /** @type {number} */
    #distance;
    get distance() {
        return this.#distance;
    }

    set distance(distance) {
        if (distance < AudioStreamObj.#minDistance) throw new Error("Distance can't be lower than 0");
        this.#distance = distance;
        this.#outputs.forEach((entity) => {
            entity.setStreamSyncedMeta("audio:distance", distance);
        });
    }

    /** @type {number} */
    #streamingDistance;
    get streamingDistance() {
        return this.#streamingDistance;
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

    // /** @type {alt.VirtualEntityGroup} */
    // #virtualEntityGroup;

    /** @type {Map<string, alt.Entity|alt.VirtualEntity>} */
    #outputs;

    /** @type {number} */
    #startTime;
    /** @type {number} */
    #currentTime;
    // get currentTime() {
    //     return this.#startTime ? alt.getNetTime() - this.#startTime : 0;
    // }

    /** @type {number} */
    #duration;
    get duration() {
        return this.#duration;
    }

    /** @type {boolean} */
    #autoDestroy;

    constructor({ source, title = "", volume = 0.5, distance = 100, time = 0, streamingDistance = 100, autoPlay = false, autoDestroy = false } = {}) {
        this._id = AudioStreamObj.#staticId;
        AudioStreamObj.#staticId += 2;
        AudioStreamObj.#all.set(this._id, this);
        this.#outputs = new Map();
        this.#source = source;
        this.#title = title;
        this.#isPlaying = autoPlay;
        this.#isPaused = false;
        this.#volume = volume;
        this.#distance = distance;
        this.#streamingDistance = streamingDistance;
        this.#currentTime = time;
        this.#startTime = undefined;
        this.#ended = false;
        // this.#duration = 0;
        // this.#getDuration();
        // if (autoPlay) this.play();
        this.#autoDestroy = autoDestroy;
    }

    #getOutputData() {
        return {
            "audio:id": this._id,
            "audio:source": this.#source,
            "audio:title": this.#title,
            "audio:volume": this.#volume,
            "audio:distance": this.#distance,
            "audio:status": this.#isPlaying ? "playing" : this.#isPaused ? "paused" : "stopped",
            "audio:startTime": this.#startTime,
            // "audio:autoPlay": this.#autoPlay,
            // "audio:autoDestroy": this.#autoDestroy,
        };
    }

    addOutput(name, pos, rot) {
        if (!name) throw new Error("Invalid name");
        if (this.#outputs.has(name)) throw new Error("Output already exists");
        if (!(pos instanceof alt.Vector3)) throw new Error("Invalid position");
        if (rot && !(rot instanceof alt.Vector3)) throw new Error("Invalid rotation");
        // console.log("addOutput", name, pos);
        const data = Object.assign({ type: "audio", "audio:rot": rot }, this.#getOutputData());
        // const virtualEntity = new alt.VirtualEntity(this.#virtualEntityGroup, pos, this.#streamingDistance, data);
        const virtualEntity = new alt.VirtualEntity(AudioStreamObj.#virtualGroup, pos, this.#streamingDistance, data);
        this.#outputs.set(name, virtualEntity);
        // debug
        // new alt.Ped("a_f_m_beach_01", pos, alt.Vector3.zero, 10);
    }

    removeOutput(name) {
        if (!name) throw new Error("Invalid name");
        if (!this.#outputs.has(name)) throw new Error("Output doesn't exist");
        this.#outputs.delete(name);
    }

    #getEntityName(entity) {
        return `${entity.type}:${entity.id}`;
    }

    setOutputOnEntity(entity) {
        if (!(entity instanceof alt.Entity)) throw new Error("Invalid entity");
        this.#outputs.set(this.#getEntityName(entity), entity);
        entity.setStreamSyncedMeta("audio", true);
        Object.entries(this.#getOutputData()).forEach(([key, value]) => {
            entity.setStreamSyncedMeta(key, value);
        });
    }

    removeOutputOnEntity(entity) {
        if (!(entity instanceof alt.Entity)) throw new Error("Invalid entity");
        this.removeOutput(this.#getEntityName(entity));
    }

    play() {
        if (!this.#source) throw new Error("No source");
        if (this.#isPlaying) throw new Error("Already playing");
        this.#isPlaying = true;
        this.#isPaused = false;
        this.#ended = false;
        this.#startTime = alt.getNetTime();
        this.#outputs.forEach((entity) => {
            entity.setStreamSyncedMeta("audio:status", "playing");
            entity.setStreamSyncedMeta("audio:startTime", this.#startTime - this.#currentTime);
        });
    }

    pause() {
        if (!this.#isPlaying) throw new Error("Not playing");
        if (this.#isPaused) throw new Error("Already paused");
        this.#isPlaying = false;
        this.#isPaused = true;
        this.#currentTime += alt.getNetTime() - this.#startTime;
        this.#outputs.forEach((entity) => {
            entity.setStreamSyncedMeta("audio:status", "paused");
            // entity.setStreamSyncedMeta("currentTime", this.#currentTime);
            // entity.deleteStreamSyncedMeta("startTime");
        });
    }

    stop() {
        if (!this.#isPlaying) throw new Error("Not playing");
        this.#isPlaying = false;
        this.#isPaused = false;
        this.#startTime = undefined;
        this.#currentTime = 0;
        this.#outputs.forEach((entity) => {
            entity.setStreamSyncedMeta("audio:status", "stopped");
        });
    }

    seek(time) {
        if (!this.#source) throw new Error("No source");
        if (time < 0) throw new Error("Time can't be lower than 0");
        if (time > this.#duration) throw new Error("Time can't be higher than duration");
        this.#currentTime = time * 1000;
        this.#outputs.forEach((entity) => {
            // entity.setStreamSyncedMeta("audio:startTime", this.#startTime - this.#currentTime);
            entity.setStreamSyncedMeta("audio:startTime", alt.getNetTime() - this.#currentTime);
        });
    }

    // setFilters(filters) {}
    // removeAllFilters() {}

    destroy() {
        console.log("destroy", this._id);
        this.#outputs.forEach((entity) => {
            // entity.deleteStreamSyncedMeta("audio");
            // entity.deleteStreamSyncedMeta("audio:id");
            // entity.deleteStreamSyncedMeta("audio:source");
            // entity.deleteStreamSyncedMeta("audio:volume");
            // entity.deleteStreamSyncedMeta("audio:distance");
            // entity.deleteStreamSyncedMeta("audio:status");
            // entity.deleteStreamSyncedMeta("audio:startTime");
            if (entity.type === 20) {
                entity.setStreamSyncedMeta("audio:destroy", true);
                setTimeout(() => {
                    entity.destroy();
                }, 500);
            }
        });
        this.#outputs.clear();
        // if (this.#virtualEntityGroup) this.#virtualEntityGroup.destroy();
        AudioStreamObj.#all.delete(this._id);
    }
}
