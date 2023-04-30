import * as alt from "alt-client";
import * as native from "natives";

import "./colors.js";
import "./mods.js";
import "./neons.js";
import "./plate.js";
import "./wheels.js";

import { colors, modList, plateList, serverColors, tireBrands, tireColors, wheelTypeList, windowTints, xenonColors } from "../../data/index.js";

alt.Vehicle.prototype.storeData = function () {
    this.storedData = this.getMods();
    this.storedData.speed = native.getEntitySpeed(this);
};

alt.Vehicle.prototype.restore = function () {
    this.setAllMod(this.storedData.mods);
    this.setWheels(this.storedData.wheels);
    this.setColors(this.storedData.colors);
    this.setNeons(this.storedData.neons);
    this.setPlate(this.storedData.plate);
};

alt.Vehicle.prototype.setStock = function () {
    this.setStockMods();
    this.setStockWheels();
    this.setStockColors();
    this.setStockNeons();
    this.setStockPlate();
};

alt.Vehicle.prototype.getMods = function () {
    return {
        mods: this.getModsData(),
        wheels: this.getWheelsData(),
        colors: this.getColors(),
        //  extraColors: this.getExtraColors(),
        neons: this.getNeons(),
        plate: this.getPlate(),
    };
};

alt.Vehicle.prototype.sendModsToServer = function () {
    alt.emitServer("sendDataToServer", {
        mods: this.getModsData().map((data) => {
            if (!isToggleMod) {
                //  +1 client to server conversion except toggle mods
                data.num++;
            }
            return data;
        }),
        wheels: this.getWheelsData(),
        colors: this.getServerColors(),
        //  extraColors: this.getExtraColors(),
        neons: this.getNeons(),
        plate: this.getPlate(),
    });
};
