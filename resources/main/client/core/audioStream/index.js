import * as alt from "alt-client";
import * as native from "natives";
import { AudioStream } from "./AudioStream.js";
import "./muffler.js";

const VIEW_URL = "http://resources/main/client/core/audioStream/browser/index.html";

// const ws = new alt.WebSocketClient("ws://127.0.0.1:7789/music-app/resources/scripts/streamer-controls.js");
const ws = new alt.WebSocketClient("wss://dev.altv.darco2903.fr/music-app/resources/scripts/streamer-controls.js");
ws.autoReconnect = true;
ws.setExtraHeader("origin", "https://dev.altv.darco2903.fr");
ws.setExtraHeader("sec-websocket-protocol", "echo-protocol");

const player = alt.Player.local;
let timeSync = 0;

alt.on("streamSyncedMetaChange", (entity, key, audioStreamId, oldValue) => {
    // console.log("streamSyncedMetaChange", entity.id, key, audioStreamId, oldValue);
    if (key !== "audioStream:id") return;
    if (isOutputPos(entity)) return;
    else if (audioStreamId === undefined && oldValue !== undefined) {
        const audioStream = AudioStream.getById(oldValue);
        if (audioStream) {
            console.log("removing output", entity.id);
            audioStream.removeOutputOnEntity(entity);
        }
        return;
    } else if (audioStreamId === undefined) return;

    console.log("streamSyncedMetaChange audioStream:id", audioStreamId);
    startPlay(entity);
});

alt.on("worldObjectStreamIn", (entity) => {
    const audioStreamId = entity.getStreamSyncedMeta("audioStream:id");
    if (audioStreamId === undefined) return;
    startPlay(entity);
});

alt.on("gameEntityDestroy", (entity) => {
    const audioStreamId = entity.getStreamSyncedMeta("audioStream:id");
    if (audioStreamId === undefined) return;
    const audioStream = AudioStream.getById(audioStreamId);
    if (!audioStream) return;
    audioStream.removeOutputOnEntity(entity);
    console.log("gameEntityDestroy", entity.id);
});

alt.on("worldObjectStreamOut", (entity) => {
    const audioStreamId = entity.getStreamSyncedMeta("audioStream:id");
    if (audioStreamId === undefined) return;
    const audioStream = AudioStream.getById(audioStreamId);
    if (!audioStream) return;
    const name = entity.getStreamSyncedMeta("audioStream:name");
    audioStream.removeOutput(name);
    console.log("worldObjectStreamOut", entity.id);
});

alt.on("audioStream:playPause", (id) => {
    if (!AudioStream.getById(id)) return;
    ws.sendJSON({ action: "play-pause", id });
});

alt.on("audioStream:seek", (id, time) => {
    if (!AudioStream.getById(id)) return;
    ws.sendJSON({ action: "seek", id, time });
});

let volumeSendTimeout;
let volumeCooldown;
const volumeCooldownTime = 200;
let volumeNextTick;

async function sendVolume(id, volume) {
    volumeCooldown = true;
    ws.sendJSON({ action: "volume", id, volume });
    await alt.Utils.wait(volumeCooldownTime);
    volumeCooldown = false;
}

alt.on("audioStream:volume", (id, volume) => {
    const audioStream = AudioStream.getById(id);
    if (!audioStream) return;
    // ws.sendJSON({ action: "volume", id, volume });
    audioStream.volume = volume;
    if (!volumeCooldown) {
        sendVolume(volume);
    } else {
        volumeNextTick = volume;
        if (volumeSendTimeout) return;
        volumeSendTimeout = alt.setTimeout(() => {
            sendVolume(id, volumeNextTick);
            volumeSendTimeout = undefined;
        }, volumeCooldownTime);
    }
});

ws.on("message", (message) => {
    const data = JSON.parse(message);
    let audioStream;
    switch (data.action) {
        case "sync":
            // const aller = data.serverTime - data.localTime;
            // const retour = Date.now() - data.serverTime;
            // const allerRetour = aller + retour;
            // console.log("aller", aller, "retour", retour, "allerRetour", allerRetour);
            timeSync = data.serverTime - Date.now();
            console.log("timeSync", timeSync);
            alt.emit("audioStream:timeSync", timeSync);
            break;

        case "get":
            audioStream = AudioStream.getById(data.id);
            if (!audioStream) return;
            // audioStream.streamUrl = data.streamUrl;
            // audioStream.duration = data.duration;
            // audioStream.startTime = data.startTime;
            // audioStream.elapsedTime = data.elapsedTime;
            // audioStream.volume = data.volume;
            // audioStream.playing = data.playing;
            break;

        case "play":
            audioStream = AudioStream.getById(data.id);
            console.log("play", data.id, !!audioStream);
            if (!audioStream) return;
            audioStream.play();
            audioStream.startTime = data.startTime;
            break;

        case "pause":
            audioStream = AudioStream.getById(data.id);
            if (!audioStream) return;
            audioStream.pause();
            audioStream.elapsedTime = data.elapsedTime;
            break;

        case "seek":
            audioStream = AudioStream.getById(data.id);
            if (!audioStream) return;
            audioStream.reload();
            audioStream.startTime = data.startTime;
            break;

        case "volume":
            audioStream = AudioStream.getById(data.id);
            if (!audioStream) return;
            audioStream.volume = data.volume;
            break;

        case "delete":
            audioStream = AudioStream.getById(data.id);
            if (!audioStream) return;
            audioStream.destroy();
            break;

        case "progress":
            audioStream = AudioStream.getById(data.id);
            if (!audioStream) return;
            audioStream.downloaded = (data.progress.current / data.progress.total) * 100;
            break;

        case "progressEnd":
            audioStream = AudioStream.getById(data.id);
            if (!audioStream) return;
            audioStream.downloaded = 100;
            break;
    }
});

ws.on("open", () => {
    console.log("WS CONNECTED");
    ws.sendJSON({ action: "sync", localTime: Date.now() });

    restorePlay();
});

ws.on("error", (e) => {
    console.log("WS ERROR", e);
});

ws.on("close", (code, reason) => {
    console.log("WS CLOSE", code, reason);
});

alt.on("resourceStart", () => {
    ws.start();
    AudioStream.init(VIEW_URL);
});

async function isAudioStreamedIdValid(id) {
    return new Promise((resolve) => {
        ws.sendJSON({ action: "check", id });
        const onMessage = (message) => {
            const data = JSON.parse(message);
            if (data.action === "check" && data.id === id) {
                ws.off("message", onMessage);
                resolve(data.valid);
            }
        };
        ws.on("message", onMessage);
    });
}

async function getAudioStream(id) {
    return new Promise((resolve) => {
        ws.sendJSON({ action: "get", id });
        const onMessage = (message) => {
            const data = JSON.parse(message);
            if (data.action === "get" && data.id === id) {
                ws.off("message", onMessage);
                resolve(data);
            }
        };
        ws.on("message", onMessage);
    });
}

function restorePlay() {
    alt.Vehicle.streamedIn.forEach(async (vehicle) => {
        console.log("streamedIn", vehicle.id);
        const audioStreamId = vehicle.getStreamSyncedMeta("audioStream:id");
        if (audioStreamId === undefined) return;

        console.log("check audioStream", audioStreamId);
        const valid = await isAudioStreamedIdValid(audioStreamId);
        console.log("valid", valid);
        if (!valid) return;
        startPlay(vehicle);
    });
}

function isOutputPos(entity) {
    return entity.type === 20;
}

/**
 * @param {alt.Entity|alt.VirtualEntity} entity
 */
async function startPlay(entity) {
    console.log("startPlay", entity.id);

    const audioStreamId = entity.getStreamSyncedMeta("audioStream:id");
    if (audioStreamId === undefined) return;

    // console.log("get audioStream");
    const data = await getAudioStream(audioStreamId);
    // console.log("get audioStream data", data);
    const audioStream = new AudioStream(audioStreamId, data.streamUrl, data.duration, 100, data.volume, player.vehicle !== entity);
    // audioStream.streamUrl = data.streamUrl;
    // audioStream.duration = data.duration;
    audioStream.title = data.title;
    audioStream.startTime = data.startTime;
    audioStream.elapsedTime = data.elapsedTime;
    if (data.playing) audioStream.play();

    if (isOutputPos(entity)) {
        const name = entity.getStreamSyncedMeta("audioStream:name");
        const pos = entity.pos;
        const rot = entity.getStreamSyncedMeta("audioStream:rot");
        audioStream.addOutput(name, pos, rot);
    } else {
        console.log("ENTITY", entity.id);
        const updatePos = entity.getStreamSyncedMeta("audioStream:updatePos");
        const updateRot = entity.getStreamSyncedMeta("audioStream:updateRot");
        audioStream.addOutputOnEntity(entity, updatePos, updateRot);
    }
}
