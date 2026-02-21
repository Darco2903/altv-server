import * as alt from "alt-client";
import * as native from "natives";

const INPUT_VEH_HEADLIGHT = 74;

const player = alt.Player.local;

let lightState = 0; // 0 - off, 1 - lowbeam, 2 - highbeam

function getVehicleLightsState(vehicle) {
    const [_, beam, highbeam] = native.getVehicleLightsState(vehicle, false, false);
    return highbeam ? 2 : !beam ? 1 : 0;
}

function getVehicleLightsState2(vehicle) {
    const [_, beam, highbeam] = native.getVehicleLightsState(vehicle, false, false);
    return highbeam ? 2 : beam ? 1 : 0;
}

let stopDisable = false;

let disableHeadlight;

// native.setVehicleLights(player.vehicle, 2);
// native.setVehicleFullbeam(player.vehicle, false);

alt.on("keydown", (key) => {
    const veh = player.vehicle;
    if (!veh) return;
    return;

    // if (native.isControlPressed(0, INPUT_VEH_HEADLIGHT)) {
    if (native.isDisabledControlPressed(0, INPUT_VEH_HEADLIGHT)) {
        // if (++lightState > 2) lightState = 0;
        // lightState = getVehicleLightsState(veh);
        // const hour = native.getClockHours();
        console.log("l", getVehicleLightsState(veh), getVehicleLightsState2(veh));
        lightState = lightState + 1 > 2 ? 0 : lightState + 1;
        // console.log("hour", hour, lightState);
        // if (a === 0 || (hour === 12 && a === 2)) {
        setLights(veh, lightState);
    }
});

/**
 * @param {alt.Vehicle} vehicle
 * @param {number} state
 */
function setLights(vehicle, state) {
    if (state === 0) {
        state = 0;
        native.setVehicleLights(vehicle, 1);
        // native.setVehicleLights(vehicle, 0);
    } else {
        native.setVehicleLights(vehicle, 2);
        // console.log("highbeam", state === 2);
        native.setVehicleFullbeam(vehicle, state === 2);
    }
}

alt.setInterval(() => {
    if (!player.vehicle) return;
    // console.log("lightState", getVehicleLightsState(player.vehicle), getVehicleLightsState2(player.vehicle));
}, 1000);

alt.on("drivingCar", (state, vehicle) => {
    // if (state) {
    //     const l = getVehicleLightsState(vehicle);
    //     console.log("l", l, getVehicleLightsState2(vehicle));
    //     if (l <= 1) native.setControlValueNextFrame(0, INPUT_VEH_HEADLIGHT, 1);
    //     setLights(vehicle, lightState);
    //     alt.setTimeout(() => {
    //         disableHeadlight = alt.everyTick(() => {
    //             native.disableControlAction(0, INPUT_VEH_HEADLIGHT, true);
    //         });
    //     }, 100);
    // } else if (disableHeadlight) {
    //     alt.clearEveryTick(disableHeadlight);
    //     disableHeadlight = null;
    // }
});
