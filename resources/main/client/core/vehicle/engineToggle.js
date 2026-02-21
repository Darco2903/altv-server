import * as alt from "alt-client";
import * as native from "natives";

alt.onServer("vehicle:engine:toggle", (vehicle, state, instant = false) => {
    native.setVehicleEngineOn(vehicle, state, instant, true);
});
