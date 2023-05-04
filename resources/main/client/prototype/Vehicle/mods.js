import * as alt from "alt-client";
import * as native from "natives";
import { modList } from "../../data/index.js";

const FRONTWHEELS = 23; // Front Wheels
const REARWHEELS = 24; // Rear Wheels (Motorcycles)

alt.Vehicle.isToggleMod = function (modType) {
    // return [17, 18, 19, 20, 21, 22].includes(modType);
    return modType === 18;
};

alt.Vehicle.isSkipMod = function (modType) {
    return [17, 19, 20, 21, 22].includes(modType);
};

alt.Vehicle.prototype.getModData = function (modType) {
    let modData = { count: 0, modType, name: "", num: 0 };
    if (alt.Vehicle.isSkipMod(modType)) return modData;
    else if (alt.Vehicle.isToggleMod(modType)) {
        modData.count = 1;
        modData.num = native.isToggleModOn(this, modType);
    } else if (modType != FRONTWHEELS && modType != REARWHEELS) {
        modData.count = native.getNumVehicleMods(this, modType);
        modData.num = native.getVehicleMod(this, modType);
    }
    modData.name = native.getModSlotName(this, modType);
    return modData;
};

alt.Vehicle.prototype.getModsData = function () {
    const modsData = [];
    for (let modType = 0; modType < modList.length; modType++) {
        // native.preloadVehicleMod(this, modType, 1)
        const modData = this.getModData(modType);
        if (modData.count > 0) {
            modsData.push(modData);
        }
    }
    return modsData;
};

alt.Vehicle.prototype.setMod = function (modType, modId) {
    native.setVehicleMod(this, modType, modId, false);
};

alt.Vehicle.prototype.toggleMod = function (modType, state) {
    native.toggleVehicleMod(this, modType, state);
};

alt.Vehicle.prototype.setMods = function (modsData) {
    modsData.forEach((modData, modType) => {
        if (alt.Vehicle.isToggleMod(modType)) {
            this.toggleMod(modType, modData.num);
        } else if (modType === 48) {
            native.setVehicleLivery(this, modData.num);
        } else {
            this.setMod(modType, modData.num);
        }
    });
};

alt.Vehicle.prototype.setStockMods = function () {
    for (let modType = 0; modType < modList.length; modType++) {
        if (alt.Vehicle.isToggleMod(modType)) {
            this.toggleMod(modType, false);
        } else {
            native.removeVehicleMod(this, modType);
        }
    }
};
