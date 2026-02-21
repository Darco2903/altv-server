import * as alt from "alt-client";
import AudioBase from "./base/AudioBase.js";
import SyncedAudio from "./SyncedAudio.js";
import SyncedCarRadio from "./SyncedCarRadio.js";

const DEBUG = false;

/** @type {Map<string, number>} */
const destroyMap = new Map();
const DESTROY_TIMEOUT = 5000;

alt.on("resourceStart", () => AudioBase.init(DEBUG));

/**
 * @param {number} audioId
 * @param {alt.Entity|alt.VirtualEntity} output
 */
function getEntityKey(audioId, output) {
    return `${audioId}:${output.type}:${output.id}`;
}

/**
 * @param {alt.Entity|alt.VirtualEntity} audioEntity
 */
function audioInit(audioEntity, full = false) {
    const id = audioEntity.getStreamSyncedMeta("audio:id");
    // if (!id) throw new Error("No id");
    if (!id) return;

    const key = getEntityKey(id, audioEntity);
    console.log("audioInit", "full", full, "exists", destroyMap.has(key));
    if (destroyMap.has(key)) {
        alt.clearTimeout(destroyMap.get(key));
        destroyMap.delete(key);
        return;
    }

    let audio = audioEntity.hasStreamSyncedMeta("radio") ? SyncedCarRadio.getByRemoteID(id) : SyncedAudio.getByRemoteID(id);
    if (!audio) {
        if (audioEntity.hasStreamSyncedMeta("radio")) audio = new SyncedCarRadio(id, audioEntity);
        else audio = new SyncedAudio(id);
        if (full) {
            const data = Object.fromEntries(
                audioEntity.getStreamSyncedMetaKeys().map((key) => [key.replace("audio:", ""), audioEntity.getStreamSyncedMeta(key)])
            );
            if (data.source) audio.setSource(data.source);
            if (data.title) audio.title = data.title;
            if (data.volume !== undefined) audio.volume = data.volume;
            if (data.distance !== undefined) audio.distance = data.distance;
            if (data.startTime !== undefined) audio.setStartTime(data.startTime);
            if (data.status === "playing") audio.play();
            // if (data.autoPlay) audio.autoPlay = data.autoPlay;
        }
    }
    if (audioEntity instanceof alt.VirtualEntity) audio.setOutput(audioEntity);
    else audio.setOutputOnEntity(audioEntity);
    audioEntity.setMeta("initialized", true);
    return audio;
}

/**
 * @param {alt.Entity|alt.VirtualEntity} audioEntity
 */
function unstreamAudio(audioEntity) {
    const id = audioEntity.getStreamSyncedMeta("audio:id");
    let audio;
    let timeout;
    const key = getEntityKey(id, audioEntity);
    // console.log("unstreamAudio", key);
    if (!audioEntity.hasStreamSyncedMeta("radio")) {
        audio = SyncedAudio.getByRemoteID(id);
        if (!audio) return;
        timeout = alt.setTimeout(() => {
            // console.log("removing output");
            if (audioEntity instanceof alt.VirtualEntity) audio.removeOutput(audioEntity);
            else audio.removeOutputOnEntity(audioEntity);
            if (audio.outputsCount === 0) {
                // console.log("No outputs left: destroying Audio");
                audio.destroy();
            }
            audioEntity.setMeta("initialized", false);
            destroyMap.delete(key);
        }, DESTROY_TIMEOUT);
    } else {
        audio = SyncedCarRadio.getByRemoteID(id);
        // console.log("unstreamAudio", !!audio);
        if (!audio) return;
        timeout = alt.setTimeout(() => {
            if (!audioEntity.valid) return;
            // console.log("removing output");
            audio.destroy();
            audioEntity.setMeta("initialized", false);
            destroyMap.delete(key);
        }, DESTROY_TIMEOUT);
    }
    destroyMap.set(key, timeout);
}

alt.on("worldObjectStreamIn", async (audioEntity) => {
    if (!(audioEntity instanceof alt.VirtualEntity) || audioEntity.getStreamSyncedMeta("type") !== "audio") return;
    // alt.log("worldObjectStreamIn");
    audioInit(audioEntity, true);
});

alt.on("gameEntityCreate", async (audioEntity) => {
    if (!audioEntity.hasStreamSyncedMeta("audio")) return;
    // alt.log("gameEntityCreate");
    audioInit(audioEntity, true);
});

alt.on("worldObjectStreamOut", (audioEntity) => {
    // console.log("worldObjectStreamOut", audioEntity.getStreamSyncedMeta("audio:id"));
    // console.log(!(audioEntity instanceof alt.VirtualEntity), audioEntity.getStreamSyncedMeta("type"), "audio");
    if (!(audioEntity instanceof alt.VirtualEntity) || audioEntity.getStreamSyncedMeta("type") !== "audio") return;
    // alt.log("worldObjectStreamOut");
    console.log("unstreamAudio");
    // console.log("valid", audioEntity.valid);
    console.log("audio:destroy", audioEntity.getStreamSyncedMeta("audio:destroy"));
    if (audioEntity.getStreamSyncedMeta("audio:destroy")) {
        const id = audioEntity.getStreamSyncedMeta("audio:id");
        const audio = SyncedCarRadio.getByRemoteID(id);
        if (audio) audio.destroy();
    } else unstreamAudio(audioEntity);
});

alt.on("gameEntityDestroy", (audioEntity) => {
    // console.log("gameEntityDestroy", audioEntity.getStreamSyncedMeta("audio:id"));
    if (!audioEntity.hasStreamSyncedMeta("audio")) return;
    // alt.log("gameEntityDestroy");
    unstreamAudio(audioEntity);
});

alt.on("streamSyncedMetaChange", async (audioEntity, key, value) => {
    if (!key.startsWith("audio:") || value === undefined) return;
    // alt.log("streamSyncedMetaChange", key, value, audioEntity);

    const id = audioEntity.getStreamSyncedMeta("audio:id");
    if (!id) throw new Error("No id");

    const isRadio = audioEntity.hasStreamSyncedMeta("radio");
    // console.log("isRadio", isRadio);
    // const audio = (isRadio ? SyncedCarRadio.getByRemoteID(id) : SyncedAudio.getByRemoteID(id)) ?? audioInit(audioEntity, !isRadio);
    // const audio = (isRadio ? SyncedCarRadio.getByRemoteID(id) : SyncedAudio.getByRemoteID(id)) ?? audioInit(audioEntity, false);
    const audio = (isRadio ? SyncedCarRadio.getByRemoteID(id) : SyncedAudio.getByRemoteID(id)) ?? audioInit(audioEntity, true);
    // const audio = isRadio ? SyncedCarRadio.getByRemoteID(id) : SyncedAudio.getByRemoteID(id);
    // console.log("initialized", audioEntity.getMeta("initialized"));
    if (!audio || !audioEntity.getMeta("initialized")) return;

    switch (key) {
        case "audio:source":
            if (audio.source !== value) audio.setSource(value);
            break;

        case "audio:title":
            if (audio.title !== value) audio.title = value;
            break;

        case "audio:volume":
            if (audio.volume !== value) audio.volume = value;
            break;

        case "audio:distance":
            if (audio.distance !== value) audio.distance = value;
            break;

        case "audio:pos":
            audio.updateOutputPos(audioEntity, value);
            break;

        case "audio:rot":
            audio.updateOutputRot(audioEntity, value);
            break;

        case "audio:startTime":
            if (audio.timeSync !== value) audio.setStartTime(value);
            break;

        case "audio:status":
            if (value === "playing" && !audio.isPlaying) audio.play();
            else if (value === "paused" && !audio.isPaused) audio.pause();
            else if ((value === "stopped" && audio.isPlaying) || audio.isPaused) audio.stop();
            break;

        default:
            alt.logWarning("Unknown streamSyncedMetaChange key:", key);
            break;
    }
});

alt.on("removeEntity", (entity) => {
    if (entity.hasStreamSyncedMeta("radio")) {
        const id = entity.getStreamSyncedMeta("audio:id");
        const audio = SyncedCarRadio.getByRemoteID(id);
        if (audio) audio.destroy();
    }
});

alt.on("resourceStop", () => {
    // console.log("resourceStop");
    SyncedAudio.all.forEach((audio) => {
        audio.destroy();
    });
});

alt.on("audioEnded", (id) => {
    // const audio = SyncedAudio.getByRemoteID(id);
    const audio = SyncedAudio.getByID(id);
    // if (audio) audio.stop();
    if (!audio) return;
    alt.emitServer("audioEnded", audio._remoteId);
});
