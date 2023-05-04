import * as alt from "alt-client";
import * as native from "natives";
import { plateList } from "../../data/index.js";

alt.Vehicle.prototype.getPlateData = function () {
    let plateIndex = native.getVehicleNumberPlateTextIndex(this);
    let plateText = native.getVehicleNumberPlateText(this);
    return { plateIndex, plateText };
};

alt.Vehicle.prototype.setPlate = function ({ plateIndex, plateText }) {
    native.setVehicleNumberPlateTextIndex(this, plateIndex);
    native.setVehicleNumberPlateText(this, plateText);
};

alt.Vehicle.prototype.setStockPlate = function () {
    this.setPlate({ plateIndex: 0, plateText: "ALTV" });
};
