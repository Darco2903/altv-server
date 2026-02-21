import * as alt from "alt-client";

import { AudioStream } from "../../../core/audioStream/AudioStream";

const APP_NAME = "audioplayer";
const defaultKeys = {
    toggle: 117, // F6
};
const manager = new alt.Utils.InputManager(APP_NAME, defaultKeys);
const player = alt.Player.local;
// ::ffff:127.0.0.1
const serverAddress = alt.getServerIp().substring(7);
// setTimeout(() => {
//     console.log("serverAddress", serverAddress);
// }, 2000);
// const view = new alt.WebView("http://127.0.0.1:8080/altv/music-converter/player.html", true);
// const view = new alt.WebView(`http://${serverAddress}:7789/music-app/player.html`, true);
const view = new alt.WebView(`https://dev.altv.darco2903.fr/music-app/player.html`, true);
// const view = new alt.WebView("http://127.0.0.1:7789/music-app/player.html", true);
// const view = new alt.WebView("https://darco2903.fr/altv/music-converter/player.html", true);
// const view = new alt.WebView(`http://${serverAddress}:8080/altv/music-converter/player.html`, true);
// const view = new alt.WebView(`http://86.249.168.189:8080/altv/music-converter/player.html`, true);
// const view = new alt.WebView(`http://dev.local.darco2903.fr:8080/altv/music-converter/player.html`, true);
view.isVisible = false;
let playerOpen = false;
let updateInterval;
let timeSync = 0;

alt.on("audioStream:timeSync", (sync) => {
    timeSync = sync;
    view.emit("player: timeSync", timeSync);
});

function toggle(state) {
    
    if (state !== playerOpen) {
        playerOpen = state;
        if (alt.isCursorVisible() !== state) alt.showCursor(state);
        player.lockCamera(state);
        alt.emit("chat:enable", !state);
        view.emit("player:toggle", state);
        if (state) {
            view.focus();
            const audioStreamId = player.vehicle.getStreamSyncedMeta("audioStream:id");
            console.log("audioStreamId", audioStreamId);
            const audioStream = AudioStream.getById(audioStreamId);
            if (!audioStream) {
                alt.logWarning("audioStream not found", audioStreamId);
                return;
            }
            view.emit("player:timeSync", timeSync);
            view.emit("player:startTime", audioStream.startTime);
            view.emit("player:duration", audioStream.duration);
        } else view.unfocus();
    }
}

function init() {
    if (!updateInterval) {
        updateInterval = alt.setInterval(() => {
            // if (player.vehicle.radio?.volume) view.emit("player:volume", player.vehicle.radio.volume);
            // if (player.vehicle.radio?.title) view.emit("player:title", player.vehicle.radio.title);
            // if (player.vehicle.radio?.duration) view.emit("player:maxTime", player.vehicle.radio.duration);
            // if (player.vehicle.radio?.currentTime) view.emit("player:time", player.vehicle.radio.currentTime / 1000);
            // if (player.vehicle.radio?.isPlaying) view.emit("player:state", "playing");
            // else if (player.vehicle.radio?.isPaused) view.emit("player:state", "paused");
            // else view.emit("player:state", "stopped");
            // if (player.vehicle.radio?.ended) view.emit("player:ended");
        }, 500);
    }
}

view.on("minimized", () => {
    toggle(false);
});

view.on("search:toggle", (state) => {
    alt.toggleGameControls(!state);
});

view.on("player:play", async (url, title, volume) => {
    if (!player.vehicle) return;
    // const source = "http://127.0.0.1:7789/proxy?" + url;
    const source = `https://altv-web.darco2903.fr/proxy?` + url;
    alt.emitServer("player:play", source, title, volume);
    await alt.Utils.waitFor(() => player.vehicle.radio, 2000);
    // init();
    // alt.Utils.waitFor(() => player.vehicle.radio.source === source, 8000)
    alt.Utils.waitFor(() => player.vehicle.radio.isPlaying, 60_000)
        .catch(() => {})
        .finally(() => {
            view.emit("player:sourceSet");
            alt.emitServer("player:sourceSet");
        });
});

view.on("player:pause", () => {
    if (!player.vehicle) return;
    alt.emitServer("player:pause");
});

view.on("player:resume", () => {
    if (!player.vehicle) return;
    alt.emitServer("player:resume");
});

view.on("player:seek", (time) => {
    if (!player.vehicle) return;
    alt.emitServer("player:seek", time);
});

let volumeSendTimeout;
let volumeCooldown;
const volumeCooldownTime = 200;
let volumeNextTick;

async function sendVolume(volume) {
    volumeCooldown = true;
    alt.emitServer("player:volume", volume);
    await alt.Utils.wait(volumeCooldownTime);
    volumeCooldown = false;
}

view.on("player:volume", (v) => {
    if (!player.vehicle) return;
    if (!volumeCooldown) {
        sendVolume(v);
    } else {
        volumeNextTick = v;
        if (volumeSendTimeout) return;
        volumeSendTimeout = alt.setTimeout(() => {
            sendVolume(volumeNextTick);
            volumeSendTimeout = undefined;
        }, volumeCooldownTime);
    }
});

view.on("search:start", () => {
    alt.toggleGameControls(false);
});

view.on("search:end", () => {
    alt.toggleGameControls(true);
});

alt.on("enteredVehicle", (vehicle, seat) => {
    // view.isVisible = true;
    init();
});

alt.on("leftVehicle", (vehicle, seat) => {
    // view.isVisible = false;
    // toggle(false);
    if (updateInterval) {
        alt.clearInterval(updateInterval);
        updateInterval = undefined;
    }
});

alt.on("resourceStart", () => {
    // view.isVisible = !!player.vehicle;
    if (player.vehicle) init();
    // if (player?.vehicle?.radio) {
    //     view.emit("player:volume", player.vehicle.radio.volume);
    // }
});

alt.on("menu:option:open", (id) => {
    if (id === "audioplayer" && player.vehicle) {
        toggle(true);
    }
});

alt.on("ui:close:all", () => {
    toggle(false);
});

alt.on("keyup", async (key) => {
    if (key === manager.keys.toggle) {
        const state = !playerOpen;
        if (state && (!alt.gameControlsEnabled() || !player.vehicle)) return;
        toggle(state);
        if (!state) await alt.Utils.wait(400);
        view.isVisible = state;
    } else if (key === 27 && view.isVisible && alt.gameControlsEnabled()) {
        // Escape
        toggle(false);
    }
});
