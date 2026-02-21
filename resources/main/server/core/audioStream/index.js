import * as alt from "alt-server";
// import { AutoSocket } from "./AutoSocket.js";
import { AudioStream } from "./AudioStream.js";
import { ws } from "./socket.js";

// const ws = new AutoSocket("ws://127.0.0.1:7789/music-app/resources/scripts/streamer-controls.js");

alt.on("resourceStart", () => {
    // ws.connect();

    // const player = alt.Player.all[0];
    // if (!player) return;
    // const veh = new alt.Vehicle("fd", player.pos.add(2, 2, 0), alt.Vector3.zero, 10);
    // veh.setStreamSyncedMeta("audioStream:id", 0);
    return;
    setTimeout(() => {
        console.log("create audioStream");
        const audioStream = new AudioStream(0);
        // mainBigR: { pos: [307.97, -1614.7, 32.22], rot: [0, 0.9, 0] },
        const pos = new alt.Vector3(307.97, -1614.7, 32.22);
        const rot = new alt.Vector3(0, 0.9, 0);
        audioStream.createOutput("mainBigR", pos, rot);

        setTimeout(() => {
            // audioStream.removeOutput("mainBigR");
        }, 5000);
    }, 2000);
});

// TEMP
alt.on("resourceStop", () => {
    alt.VirtualEntity.all.forEach((entity) => {
        entity.destroy();
    });
});

alt.on("removeEntity", (entity) => {
    console.log("removeEntity", entity.id, entity.type);
    // check if entity is a vehicle
    if (entity.type !== 1) return;
    const audioStreamId = entity.getStreamSyncedMeta("audioStream:id");
    console.log("vehicle destroy", entity.id, audioStreamId);
    if (audioStreamId !== undefined) {
        ws.sendJSON({ action: "delete", id: audioStreamId });
    }
});

ws.addEventListener("message", (message) => {
    const data = JSON.parse(message.data);
    // console.log("message", data);
    switch (data.action) {
        case "play":
            // console.log("play", data.id, data.startTime);
            break;

        case "delete":
            alt.Entity.all.concat(alt.VirtualEntity.all).forEach((entity) => {
                if (entity.getStreamSyncedMeta("audioStream:id") !== data.id) return;
                entity.setStreamSyncedMeta("audioStream:id", undefined);
            });
            break;
    }
});

alt.onClient("vehicle:audioPlayer:play", async (player, videoId, vehicle) => {
    if (vehicle.hasStreamSyncedMeta("audioStream:id")) {
        const audioStreamId = vehicle.getStreamSyncedMeta("audioStream:id");
        ws.sendJSON({ action: "delete", id: audioStreamId });
        vehicle.setStreamSyncedMeta("audioStream:id", undefined);
    }
    // const name = `${videoId}:${vehicle.id}`;
    // ws.sendJSON({ action: "create", videoId, name });
    // const audioStreamId = await waitForCreate(name);
    const audioStream = await AudioStream.create(videoId);
    audioStream.createEntityOutput(vehicle, true);
    // vehicle.setStreamSyncedMeta("audioStream:id", audioStream.id);
    console.log("successfully created audioStream", audioStream.id);
    alt.emitClient(player, "vehicle:audioPlayer:play");
});
