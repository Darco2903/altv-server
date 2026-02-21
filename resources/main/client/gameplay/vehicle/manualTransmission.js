import * as alt from "alt-client";
import * as native from "natives";

const APP_NAME = "vehicleManualTransmission";
const defaultKeys = {
    toggle: 89, // y
    upshift: 16, // shift
    downshift: 17, // ctrl
};
const manager = new alt.Utils.InputManager(APP_NAME, defaultKeys);
const player = alt.Player.local;

let manualTransmissionState = false;
// let gear = 0;

alt.on("resourceStart", () => {
    // console.log("Manual Transmission State:", alt.LocalStorage.has(APP_NAME), alt.LocalStorage.get(APP_NAME));
    if (alt.LocalStorage.has(APP_NAME)) {
        manualTransmissionState = alt.LocalStorage.get(APP_NAME);
    }
});

alt.on("enteredVehicle", (vehicle, seat) => {
    if (seat !== 1) return;
    native.setTransmissionReducedGearRatio(vehicle, manualTransmissionState);
});

alt.on("keydown", (key) => {
    const veh = player.vehicle;
    if (!veh || !alt.gameControlsEnabled()) return;
    switch (key) {
        case manager.keys.toggle:
            manualTransmissionState = !manualTransmissionState;
            alt.LocalStorage.set(APP_NAME, manualTransmissionState);
            native.setTransmissionReducedGearRatio(veh, manualTransmissionState);
            // console.log("Manual Transmission:", manualTransmission ? "ON " + veh.maxGear : "OFF");
            player.sendNotification({
                imageName: "CHAR_DEFAULT",
                headerMsg: "Manual Transmission" + (manualTransmissionState ? " ON" : " OFF"),
                duration: 1,
            });
            break;

        case manager.keys.upshift:
            if (manualTransmissionState && veh.gear < veh.maxGear) veh.gear++;
            // if (manualTransmission && gear < veh.maxGear) gear++;
            break;

        case manager.keys.downshift:
            if (manualTransmissionState && veh.gear > 0) veh.gear--;
            // if (manualTransmission && gear > -1) gear--;
            break;
    }
});

alt.everyTick(() => {
    // if (manualTransmission && player.vehicle) player.vehicle.gear = player.vehicle.gear;
    // if (manualTransmission && player.vehicle) player.vehicle.gear = gear;
});
