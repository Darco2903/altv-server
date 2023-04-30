import * as alt from "alt-server";
import { db, tables } from "../database/index.js";

alt.Vehicle.prototype.init = function () {
    this.manualEngineControl = true;
    this.modKit = +(this.modKitsCount > 0);
    // this.setSyncedMeta("kmAge", 0);
};

alt.Vehicle.prototype.getAllData = function () {
    let data = {
        id: this.getSyncedMeta("id"),
        model: this.getMeta("model"),
    };
    return data;
};

alt.Vehicle.prototype.getDataToSave = function () {
    const data = {
        pos: JSON.stringify(this.pos.toFixed(2).toArray()),
        rot: JSON.stringify(this.rot.toFixed(2).toArray()),
        // owner: this.owner,
        // appearance: this.getAppearanceDataBase64(),
        // garage: this.garage
    };
    return data;
};

alt.Vehicle.prototype.getVehMods = function () {
    let modData = [];
    let n = modList.length;
    for (let i = 0; i < n; i++) modData[i] = { mod: this.getMod(i), count: this.getModsCount(i) };
    return modData;
};

alt.Vehicle.prototype.setAllMods = function (data) /* [[modType, modNum]] */ {
    data.forEach(([modType, modNum]) => {
        try {
            this.setMod(modType, modNum);
        } catch (error) {
            alt.logWarning("type", modType, "num", modNum);
            alt.logWarning(error);
        }
    });
};

alt.Vehicle.prototype.setAllWheels = function ({ type, num, color }) {
    this.setWheels(type, num + 1);
    this.wheelColor = color;
};

alt.Vehicle.prototype.setAllColors = function (data) {
    const { primary, secondary, pearl } = data;
    this.primaryColor = primary;
    this.secondaryColor = secondary;
    this.pearlColor = pearl;

    ////  Extra
    const { xenon, window, tireSmoke } = data;
    //  console.log(+(xenon != 0));
    //  console.log(xenon - 2);
    this.setMod(22, +(xenon != 0));
    this.headlightColor = xenon - 2;
    this.windowTint = window;
    //  this.tireSmokeColor = tireSmoke
    ////

    //  this.dashboardColor = data.dash
    //  this.interiorColor = data.interiorColor
};

alt.Vehicle.prototype.setAllNeons = function ({ color, enabled }) {
    this.neonColor = color;
    this.neon = {
        front: enabled,
        back: enabled,
        left: enabled,
        right: enabled,
    };
};

alt.Vehicle.prototype.setPlate = function (data) {
    let { plateIndex, plateText } = data;
    this.numberPlateIndex = plateIndex;
    this.numberPlateText = plateText;
};

alt.Vehicle.prototype.toJSON = function (data) {
    Object.keys(data).forEach(function (key) {
        data[key] = JSON.stringify(data[key]);
    });
    return data;
};

alt.Vehicle.prototype.parseJSON = function (data) {
    Object.entires(data).forEach(function ([key, value]) {
        data[key] = JSON.parse(value);
    });
    return data;
};

alt.Vehicle.prototype.register = async function () {
    const model = this.getNameByHash();
    const owner = this.driver.getSyncedMeta("id");
    const data = {
        model,
        owner,
        appearance: vehicle.getAppearanceDataBase64(),
    };
    const id = await db.insertData(data, tables.vehicle);
    this.setSyncedMeta("id", id);
    this.setMeta("owner", owner);
    Promise.resolve(id);
};

alt.Vehicle.prototype.delete = async function () {
    const id = vehicle.getSyncedMeta("id");
    await db.deleteByIds(id, tables.vehicle);
};

alt.Vehicle.prototype.update = async function (data) {
    if (!this.hasSyncedMeta("id")) {
        throw new Error("Vehicle not registered");
    }
    const id = this.getSyncedMeta("id");
    const updated = await db.updateDataByIds(id, data, tables.vehicle);
    if (!updated) {
        throw new Error("Vehicle not updated");
    }
};

alt.Vehicle.prototype.saveAppearance = async function () {
    await this.update({ appearance: this.getAppearanceDataBase64() });
    return Promise.resolve();
};

alt.Vehicle.prototype.chnageOwner = async function (newOwner) {
    await this.update({ owner: newOwner });
    return Promise.resolve();
};

alt.Vehicle.prototype.getNameByHash = function () {
    return alt.getVehicleModelInfoByHash(this.model).title;
};
