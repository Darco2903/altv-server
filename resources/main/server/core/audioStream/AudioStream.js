import * as alt from "alt-server";
import { ws, createAudioStream } from "./socket.js";

export class AudioStream {
    /** @type {number} */
    #id;
    get id() {
        return this.#id;
    }

    /** @type {alt.VirtualEntityGroup} */
    #entityGroup;
    /** @type {Map<string, alt.VirtualEntity>} */
    #entities = new Map();

    static async create(videoId, volume) {
        const id = await createAudioStream(videoId, volume);
        return new AudioStream(id);
    }

    constructor(id) {
        this.#id = id;
        this.#entityGroup = new alt.VirtualEntityGroup(999);
    }

    /**
     * @param {alt.Entity | alt.VirtualEntity} entity
     */
    createEntityOutput(entity, updatePos = false, updateRot = false) {
        entity.setStreamSyncedMeta("audioStream:id", this.#id);
        entity.setStreamSyncedMeta("audioStream:updatePos", updatePos);
        entity.setStreamSyncedMeta("audioStream:updateRot", updateRot);
        console.log("createEntityOutput", entity.id, entity.type);
    }

    createOutput(name, pos, rot) {
        const entity = new alt.VirtualEntity(this.#entityGroup, pos, 400, {
            "audioStream:name": name,
            "audioStream:rot": rot,
        });
        this.#entities.set(name, entity);
        this.createEntityOutput(entity);
    }

    /**
     * @param {alt.Entity | alt.VirtualEntity} entity
     */
    removeEntityOutput(entity) {
        entity.deleteStreamSyncedMeta("audioStream:id");
        entity.deleteStreamSyncedMeta("audioStream:updatePos");
        entity.deleteStreamSyncedMeta("audioStream:updateRot");
    }

    removeOutput(name) {
        const entity = this.#entities.get(name);
        if (!entity) return;
        // this.removeEntityOutput(entity);
        // entity.deleteStreamSyncedMeta("audioStream:name");
        // entity.deleteStreamSyncedMeta("audioStream:rot");
        this.#entities.delete(name);
        entity.destroy();
    }
}
