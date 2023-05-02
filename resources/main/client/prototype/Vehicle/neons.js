import * as alt from "alt-client";
import * as native from "natives";

alt.Vehicle.prototype.getNeonsData = function () {
    let enabled = native.getVehicleNeonEnabled(this, 0);
    let color = native.getVehicleNeonColour(this).splice(1, 3); //[void, int, int, int]
    color = new alt.RGBA(color);
    return { color, enabled };
};

alt.Vehicle.prototype.setNeons = function ({ enabled, color }) {
    native.suppressNeonsOnVehicle(this, false);
    for (let i = 0; i < 4; i++) native.setVehicleNeonEnabled(this, i, enabled);
    native.setVehicleNeonColour(this, color.r, color.g, color.b);
};

alt.Vehicle.prototype.setStockNeons = function () {
    native.suppressNeonsOnVehicle(this, true);
};
