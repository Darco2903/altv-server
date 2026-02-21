import * as alt from "alt-client";
import * as native from "natives";

import { AudioStream } from "./AudioStream.js";

const player = alt.Player.local;

alt.on("enteredVehicle", (vehicle, seat) => {
    const audioStreamId = vehicle.getStreamSyncedMeta("audioStream:id");
    if (audioStreamId === undefined) return;
    const audioStream = AudioStream.getById(audioStreamId);
    if (!audioStream) return;
    audioStream.enable3d(false);
});

alt.on("leftVehicle", (vehicle, seat) => {
    const audioStreamId = vehicle.getStreamSyncedMeta("audioStream:id");
    if (audioStreamId === undefined) return;
    const audioStream = AudioStream.getById(audioStreamId);
    if (!audioStream) return;
    audioStream.enable3d(true);
});

alt.setInterval(() => {
    alt.Vehicle.streamedIn.forEach((vehicle) => {
        if (!vehicle.hasStreamSyncedMeta("audioStream:id")) return;
        const audioStreamId = vehicle.getStreamSyncedMeta("audioStream:id");
        const audioStream = AudioStream.getById(audioStreamId);
        if (!audioStream) return;
        const windowsIntact = native.areAllVehicleWindowsIntact(vehicle);
        const doorsOpen = Array.from({ length: native.getNumberOfVehicleDoors(vehicle) }).some((v, i) => native.getVehicleDoorAngleRatio(vehicle, i) !== 0);

        if (player.vehicle === vehicle) return;

        if (windowsIntact && !doorsOpen && !audioStream.interiorMuffled) {
            audioStream.interiorMuffled = true;
        } else if ((!windowsIntact || doorsOpen) && audioStream.interiorMuffled) {
            audioStream.interiorMuffled = false;
        }
    });

    const hasHelmet = native.isPedWearingHelmet(player);
    const vehicleWithHelmet = player.vehicle && native.getVehicleClass(player.vehicle) === 8;

    if (player.vehicle && !vehicleWithHelmet) {
        const audioStreamId = player.vehicle.getStreamSyncedMeta("audioStream:id");
        const windowsIntact = native.areAllVehicleWindowsIntact(player.vehicle);
        const doorsOpen = Array.from({ length: native.getNumberOfVehicleDoors(player.vehicle) }).some(
            (v, i) => native.getVehicleDoorAngleRatio(player.vehicle, i) !== 0
        );

        if (windowsIntact && !doorsOpen) {
            AudioStream.all.forEach((stream) => {
                if (stream.id !== audioStreamId && !stream.exteriorMuffled) {
                    stream.exteriorMuffled = true;
                }
            });
        } else if (!windowsIntact || doorsOpen) {
            AudioStream.all.forEach((stream) => {
                if (stream.id !== audioStreamId && stream.exteriorMuffled) {
                    stream.exteriorMuffled = false;
                }
            });
        }
    } else {
        if (hasHelmet) {
            AudioStream.all.forEach((stream) => {
                if (!stream.exteriorMuffled) {
                    stream.exteriorMuffled = true;
                }
            });
        } else {
            AudioStream.all.forEach((stream) => {
                if (stream.exteriorMuffled) {
                    stream.exteriorMuffled = false;
                }
            });
        }
    }
}, 100);

// alt.setInterval(() => {
//     // set resonance distance for all audio streams
//     AudioStream.all.forEach((stream) => {
//         // const
//         stream.setResonance();
//     });
// }, 1000);
