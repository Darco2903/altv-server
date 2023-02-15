import * as alt from "alt-server";
import * as chat from "chat";
import * as db from "database";

function log(msg) {
    alt.log("~y~" + msg);
}

alt.Vehicle.prototype.init = function () {
    this.manualEngineControl = true;
    this.modKit = +(this.modKitsCount > 0);
    this.setSyncedMeta("kmAge", 0);
};

alt.Vehicle.prototype.initWithData = function (id, appearance) {
    this.setSyncedMeta("id", id);
    //this.setMeta("appearance", appearance)
    this.setAppearanceDataBase64(appearance);
    //veh.("owner") = owner
    //veh.garage = garage
};

alt.Vehicle.prototype.getAllData = function () {
    let data = {
        id: this.getSyncedMeta("id"),
        model: this.getMeta("model"),
    };
    console.log(Object.assign(data, this.getDataToSave()));
    console.log(data);
    return data;
};

alt.Vehicle.prototype.getDataToSave = function () {
    const data = {
        pos: JSON.stringify(this.pos.toFixed(2).toArray()),
        rot: JSON.stringify(this.rot.toFixed(2).toArray()),
        //owner: this.owner,
        //appearance: this.getAppearanceDataBase64(),
        //garage: this.garage
    };
    return data;
};

alt.Vehicle.prototype.getVehMods = function () {
    let modData = [];
    let n = modList.length;
    for (let i = 0; i < n; i++) modData[i] = { mod: this.getMod(i), count: this.getModsCount(i) };
    return modData;
};

alt.Vehicle.prototype.setAllMods = function (data) {
    // data = [[modType, modNum]]
    data.forEach(([modType, modNum]) => {
        try {
            this.setMod(modType, modNum);
        } catch (error) {
            console.log("type", modType, "num", modNum);
            console.log(error);
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

alt.Vehicle.prototype.register = function (player) {
    return new Promise((resolve, reject) => {
        const model = this.getNameByHash();
        const owner = player.getSyncedMeta("id");
        db.upsertData({ model, owner }, "Vehicle", (res) => {
            if (!res || !res.id) {
                reject();
                return;
            }
            this.setSyncedMeta("id", res.id);
            this.setMeta("owner", owner);
            this.save();
            this.saveAppearance();
            resolve(res.id);
            db.log(`${player.name} ${model} registered in database with id: ${res.id}`);
        });
    });
};

alt.Vehicle.prototype.delete = function () {
    return new Promise((resolve, reject) => {
        const id = this.getSyncedMeta("id");
        db.deleteByIds(id, "Vehicle", (res) => {
            if (!res || !res.affected) {
                reject();
                return;
            }
            this.deleteSyncedMeta("id");
            resolve();
            db.log(`${this.getNameByHash()} id: ${id} deleted from database`);
        });
    });
};

alt.Vehicle.prototype.save = function () {
    return new Promise((resolve, reject) => {
        const id = this.getSyncedMeta("id");
        db.updatePartialData(id, this.getDataToSave(), "Vehicle", (res) => {
            if (!res || !res.affected) {
                reject();
                return;
            }
            db.log(`${this.getNameByHash()} id: ${id} saved in database`);
            resolve();
        });
    });
};

alt.Vehicle.prototype.saveAppearance = function () {
    const appearance = this.getAppearanceDataBase64();
    db.updatePartialData(this.getSyncedMeta("id"), { appearance }, "Vehicle", (callback) => {});
};

alt.Vehicle.prototype.getNameByHash = function () {
    return alt.getVehicleModelInfoByHash(this.model).title;
};
