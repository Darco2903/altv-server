import * as alt from "alt-client";
import * as native from "natives";

import { AudioStream } from "../../../core/audioStream/AudioStream.js";

// const VIEW_URL = "http://127.0.0.1:7789/music-app/player.html";
const VIEW_URL = "https://dev.altv.darco2903.fr/music-app/player.html";

const APP_NAME = "audioPlayer";
const META_KEY = "audioPlayer:enabled";
const defaultKeys = {
    toggle: 117, // F6
};
const manager = new alt.Utils.InputManager(APP_NAME, defaultKeys);
const player = alt.Player.local;
const view = new alt.WebView(VIEW_URL, false);
view.isVisible = false;

let playerOpen = false;
let updateInterval;
let closeTimeout;
let timeSync = 0;

function startViewUpdate() {
    if (updateInterval) return;
    updateInterval = alt.setInterval(() => {
        if (!player.vehicle) return;
        const audioStreamId = player.vehicle.getStreamSyncedMeta("audioStream:id");
        const audioStream = AudioStream.getById(audioStreamId);

        if (!audioStream) {
            view.emit("player:stopped");
            return;
        }
        view.emit("player:timeSync", timeSync);
        view.emit("player:title", audioStream.title);
        view.emit("player:startTime", audioStream.startTime);
        view.emit("player:duration", audioStream.duration);
        view.emit("player:volume", audioStream.volume);
        view.emit("player:paused", audioStream.isPaused);
        view.emit("player:downloaded", audioStream.downloaded ?? 100);
        view.emit("player:elapsedTime", audioStream.elapsedTime);
    }, 200);
}

function toggle(state) {
    if (state !== playerOpen) {
        playerOpen = state;
        if (alt.isCursorVisible() !== state) alt.showCursor(state);
        player.lockCamera(state);
        alt.emit("chat:enable", !state);
        view.emit("player:toggle", state);
        if (state) {
            view.focus();
            view.centerPointer();
            if (closeTimeout) {
                alt.clearTimeout(closeTimeout);
                closeTimeout = undefined;
            }
        } else {
            view.unfocus();
        }
    }
}

view.on("minimized", () => {
    toggle(false);
});

view.on("search:toggle", (state) => {
    alt.toggleGameControls(!state);
});

view.on("player:play", (videoId) => {
    alt.emitServer("vehicle:audioPlayer:play", videoId, player.vehicle);
});

alt.onServer("vehicle:audioPlayer:play", () => {
    view.emit("player:playSuccess");
});

view.on("player:playPause", () => {
    const audioStreamId = player.vehicle.getStreamSyncedMeta("audioStream:id");
    alt.emit("audioStream:playPause", audioStreamId);
});

view.on("player:seek", (time) => {
    const audioStreamId = player.vehicle.getStreamSyncedMeta("audioStream:id");
    alt.emit("audioStream:seek", audioStreamId, time);
});

view.on("player:volume", (volume) => {
    if (!player.vehicle) return;
    const audioStreamId = player.vehicle.getStreamSyncedMeta("audioStream:id");
    if (audioStreamId === undefined) return;
    alt.emit("audioStream:volume", audioStreamId, volume);
});

alt.on("leftVehicle", () => {
    if (view.isVisible) {
        view.isVisible = false;
    }
});

alt.on("keyup", async (key) => {
    if (key === manager.keys.toggle && alt.getMeta(META_KEY)) {
        const state = !playerOpen;
        if (state && (!alt.gameControlsEnabled() || !player.vehicle)) return;
        toggle(state);
        if (state) {
            view.isVisible = state;
            startViewUpdate();
        } else {
            if (closeTimeout) alt.clearTimeout(closeTimeout);
            closeTimeout = alt.setTimeout(() => {
                view.isVisible = state;
                closeTimeout = undefined;
            }, 400);
            if (updateInterval) {
                alt.clearInterval(updateInterval);
                updateInterval = null;
            }
        }
    } else if (key === 27 && view.isVisible) {
        // Escape
        toggle(false);
        if (updateInterval) {
            alt.clearInterval(updateInterval);
            updateInterval = null;
        }
    }
});

alt.on("globalMetaChange", (key, value, oldValue) => {
    if (key !== META_KEY) return;
    if (!value && view.isVisible) {
        toggle(false);
    }
});

alt.onServer("audioPlayer:enabled", (state) => {
    alt.setMeta(META_KEY, !state);
});

alt.once("resourceStart", () => {
    alt.setMeta(META_KEY, true);
});
