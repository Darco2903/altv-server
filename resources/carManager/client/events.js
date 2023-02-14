import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;

alt.on("enteredVehicle", (vehicle, seat) => {
    native.setVehicleKeepEngineOnWhenAbandoned(vehicle, true);
    //checkDoors(vehicle)
});

alt.onServer("replacePlayerVehicle", async (vehicle) => {
    const oldVeh = player.vehicle;
    native.networkFadeOutEntity(oldVeh, true, 0);
    await alt.Utils.waitFor(() => vehicle.isSpawned, 1000);
    native.setEntityVisible(vehicle, false, 0);
    await alt.Utils.wait(50);
    const speed = native.getEntitySpeed(oldVeh);
    native.setVehicleForwardSpeed(vehicle, speed);
    native.setEntityCoords(vehicle, oldVeh.pos.x, oldVeh.pos.y, oldVeh.pos.z, oldVeh.rot.x, oldVeh.rot.y, oldVeh.rot.z, true);
    native.setPedIntoVehicle(player, vehicle, -1);
    native.setEntityVisible(oldVeh, false, 0);
    native.networkFadeInEntity(vehicle, 0, 0);
});

alt.on("keydown", (key) => {
    switch (true) {
        case key == 49 && !!player.vehicle && alt.gameControlsEnabled(): //  key: & = 49
            const running = native.getIsVehicleEngineRunning(player.vehicle);
            native.setVehicleEngineOn(player.vehicle, !running, false, true);
            break;

        default:
            break;
    }
});

alt.onServer("vehicle:setSpeed", (vehicle, speed) => {
    alt.Utils.waitFor(() => player.vehicle, 2000).then(() => native.setVehicleForwardSpeed(vehicle, parseFloat(speed)));
});

alt.onServer("vehicle:nearest", () => {
    let pos = player.pos;
    let vehId = native.getClosestVehicle(pos.x, pos.y, pos.z, 50, 0, 70);
    let veh = alt.Vehicle.getByScriptID(vehId);
    //alt.emitServer("vehicle:nearest", veh)
});

// alt.on("carManager:repair", () => {
//     alt.emitServer("vehicle:repair", player.vehicle);
// });

// alt.on("carManager:despawn", () => {
//     alt.emitServer("vehicle:", player.vehicle);
// });

// alt.on("carManager:save", () => {
//     alt.emitServer("vehicle:", player.vehicle);
// });

// alt.on("carManager:delete", () => {
//     alt.emitServer("vehicle:", player.vehicle);
// });
