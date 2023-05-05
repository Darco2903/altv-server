import * as alt from "alt-server";
import { db, tables } from "../database/index.js";

// alt.Vehicle.prototype.init = function () {
//     this.manualEngineControl = true;
//     this.modKit = +(this.modKitsCount > 0);
//     // this.setSyncedMeta("kmAge", 0);
// };

// alt.Vehicle.prototype.getAllData = function () {
//     let data = {
//         id: this.getSyncedMeta("id"),
//         model: this.getMeta("model"),
//     };
//     return data;
// };

// alt.Vehicle.prototype.getDataToSave = function () {
//     const data = {
//         pos: JSON.stringify(this.pos.toFixed(2).toArray()),
//         rot: JSON.stringify(this.rot.toFixed(2).toArray()),
//         // owner: this.owner,
//         // appearance: this.getAppearanceDataBase64(),
//         // garage: this.garage
//     };
//     return data;
// };

// alt.Vehicle.prototype.getVehMods = function () {
//     let modData = [];
//     let n = modList.length;
//     for (let i = 0; i < n; i++) modData[i] = { mod: this.getMod(i), count: this.getModsCount(i) };
//     return modData;
// };

alt.Vehicle.prototype.setColorsData = function (data) {
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

alt.Vehicle.prototype.setModsData = function (modsData) {
    modsData.forEach(({ modType, num }) => {
        try {
            this.setMod(modType, num);
        } catch (error) {
            alt.logWarning("type", modType, "num", num);
            alt.logWarning(error);
        }
    });
};

alt.Vehicle.prototype.setNeonsData = function ({ color, enabled }) {
    this.neonColor = color;
    this.neon = {
        front: enabled,
        back: enabled,
        left: enabled,
        right: enabled,
    };
};

alt.Vehicle.prototype.setPlateData = function (data) {
    let { plateIndex, plateText } = data;
    this.numberPlateIndex = plateIndex;
    this.numberPlateText = plateText;
};

alt.Vehicle.prototype.setWheelsData = function ({ type, num, color }) {
    this.setWheels(type, num + 1);
    this.wheelColor = color;
};

// alt.Vehicle.prototype.toJSON = function (data) {
//     Object.keys(data).forEach(function (key) {
//         data[key] = JSON.stringify(data[key]);
//     });
//     return data;
// };

// alt.Vehicle.prototype.parseJSON = function (data) {
//     Object.entires(data).forEach(function ([key, value]) {
//         data[key] = JSON.parse(value);
//     });
//     return data;
// };

alt.Vehicle.prototype.getModelName = function () {
    return alt.getVehicleModelInfoByHash(this.model).title;
};

alt.Vehicle.prototype.delete = async function () {
    const id = this.getSyncedMeta("id");
    await db.deleteByIds(id, tables.vehicle);
    this.deleteSyncedMeta("id");
    this.deleteMeta("owner");
    return Promise.resolve(id);
};

/**
 * @param {alt.Player} owner
 */
alt.Vehicle.prototype.register = async function (owner) {
    const model = this.getModelName();
    const ownerId = owner.getSyncedMeta("id");
    const id = await db.insertData(
        {
            model,
            owner: ownerId,
            appearance: this.getAppearanceDataBase64(),
        },
        tables.vehicle
    );
    this.setSyncedMeta("id", id);
    this.setMeta("owner", ownerId);
    return Promise.resolve(id);
};

/**
 * @param {object} data
 */
alt.Vehicle.prototype.update = async function (data) {
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

alt.Vehicle.prototype.changeOwner = async function (newOwner) {
    await this.update({ owner: newOwner });
    return Promise.resolve();
};
