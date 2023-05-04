import * as alt from "alt-client";

import "./Vehicle/colors.js";
import "./Vehicle/mods.js";
import "./Vehicle/neons.js";
import "./Vehicle/plate.js";
import "./Vehicle/wheels.js";

alt.Vehicle.prototype.storeData = function () {
    this.setMeta("storedData", this.getAllMods());
};

alt.Vehicle.prototype.restore = function () {
    /** @type {alt.Vehicle.allMods} */
    const stored = this.getMeta("storedData");
    this.setAllMods(stored.mods);
    this.setWheels(stored.wheels);
    this.setColors(stored.colors);
    this.setNeons(stored.neons);
    this.setPlate(stored.plate);
};

alt.Vehicle.prototype.setStock = function () {
    this.setStockMods();
    this.setStockWheels();
    this.setStockColors();
    this.setStockNeons();
    this.setStockPlate();
};

alt.Vehicle.prototype.getAllMods = function () {
    return {
        mods: this.getModsData(),
        wheels: this.getWheelsData(),
        colors: this.getColorsData(),
        //  extraColors: this.getExtraColors(),
        neons: this.getNeonsData(),
        plate: this.getPlateData(),
    };
};

alt.Vehicle.prototype.getAllModsServer = function () {
    return {
        colors: this.getServerColors(),
        mods: this.getModsData().map((data) => {
            if (!alt.Vehicle.isToggleMod(data.modType)) {
                //  +1 client to server conversion except toggle mods
                data.num++;
            }
            return data;
        }),
        //  extraColors: this.getExtraColors(),
        neons: this.getNeonsData(),
        plate: this.getPlateData(),
        wheels: this.getWheelsData(),
    };
};
