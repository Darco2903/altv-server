import * as alt from "alt-client";
import AudioBase from "./base/AudioBase.js";

export default class SyncedAudio extends AudioBase {
    /** @type {Map<number, SyncedAudio>} */
    static #remoteIdMap = new Map();
    static getByRemoteID(remoteId) {
        return this.#remoteIdMap.get(remoteId);
    }

    /** @type {Map<string, SyncedAudio>} */
    static #idMap = new Map();
    static getByID(id) {
        return this.#idMap.get(id);
    }

    /** @type {number} */
    _remoteId;

    /** @type {number} */
    #timeSync;
    get timeSync() {
        return this.#timeSync;
    }

    /** @type {()=>void} */
    #execQueue = [];
    /** @type {boolean} */
    #execRunning = false;

    constructor(remoteId, options = {}) {
        if (!remoteId) throw new Error("No id");
        super(options);
        this._remoteId = remoteId;
        SyncedAudio.#idMap.set(this.id, this);
        SyncedAudio.#remoteIdMap.set(remoteId, this);
        this.#timeSync = alt.getNetTime();
        // alt.on("audioEnded", (id) => {
        //     if (id !== this.id) return;

        // });
    }

    async #exec() {
        // console.log("exec", this.#execQueue.length);
        if (this.#execRunning) return;
        // console.log("exec", true);
        this.#execRunning = true;
        while (this.#execQueue.length) await this.#execQueue.shift()();
        // console.log("exec", false);
        this.#execRunning = false;
    }

    #run(f, ...args) {
        // console.log("run", f.name, args);
        this.#execQueue.push(() => f.apply(this, args));
        this.#exec();
    }

    /** @override */
    setSource(...args) {
        this.#run(super.setSource, ...args);
    }

    // /** @override */
    // setOutput(...args) {
    //     this.#run(super.setOutput, ...args);
    // }

    // /** @override */
    // removeOutput(...args) {
    //     // this.#run(super.removeOutput, ...args);
    //     super.removeOutput(...args);
    // }

    // /** @override */
    // updateOuputPos(...args) {
    //     // this.#run(super.updateOuputPos, ...args);
    //     super.updateOuputPos(...args);
    // }

    // /** @override */
    // setOutputOnEntity(...args) {
    //     // this.#run(super.setOutputOnEntity, ...args);
    //     super.setOutputOnEntity(...args);
    // }

    // /** @override */
    // removeOutputOnEntity(...args) {
    //     // this.#run(super.removeOutputOnEntity, ...args);
    //     super.removeOutputOnEntity(...args);
    // }

    /** @override */
    play() {
        this.#run(super.play);
    }

    /** @override */
    pause() {
        this.#run(super.pause);
    }

    /** @override */
    stop() {
        this.#run(super.stop);
    }

    setStartTime(startTime) {
        this.#run(() => {
            // if (Math.abs(this.#timeSync - startTime) > 100) {
            const time = (alt.getNetTime() - startTime) / 1000;
            this.#timeSync = startTime;
            super._seek(time);
            // }
        });
    }

    /** @override */
    setFilters(...args) {
        this.#run(super.setFilters, ...args);
    }

    /** @override */
    removeAllFilters(...args) {
        this.#run(super.removeAllFilters, ...args);
    }

    /** @override */
    setVolume(...args) {
        this.#run(super.setVolume, ...args);
    }

    /** @override */
    destroy() {
        SyncedAudio.#remoteIdMap.delete(this._remoteId);
        // this.#run(super.destroy);
        super.destroy();
    }
}
