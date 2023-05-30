import * as alt from "alt-server";

alt.Vehicle.spawn = function (model, pos, rot, engineOn = false) {
    const vehicle = new alt.Vehicle(model, pos, rot);
    vehicle.manualEngineControl = true;
    vehicle.modKit = +(vehicle.modKitsCount > 0);
    vehicle.engineOn = engineOn;
    return vehicle;
};
