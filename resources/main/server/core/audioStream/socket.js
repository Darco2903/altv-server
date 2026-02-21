import * as alt from "alt-server";
import { AutoSocket } from "./AutoSocket.js";

export const ws = new AutoSocket("ws://127.0.0.1:7789/music-app/resources/scripts/streamer-controls.js");

alt.on("resourceStart", () => {
    ws.connect();
});

async function waitForCreate(name) {
    return new Promise((resolve) => {
        const onMessage = (message) => {
            const data = JSON.parse(message.data);
            if (data.action === "created" && data.name === name) {
                resolve(data.id);
                ws.removeEventListener("message", onMessage);
            }
        };
        ws.addEventListener("message", onMessage);
    });
}

export async function createAudioStream(videoId, volume = 0.5) {
    const name = Date.now().toString();
    ws.sendJSON({ action: "create", videoId, name, volume });
    return waitForCreate(name);
}
