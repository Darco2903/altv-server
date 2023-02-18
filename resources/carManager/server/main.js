import * as alt from "alt-server";
import "./Vehicle";
import "./events";
import "./commands";

function log(msg) {
    alt.log("~c~" + msg);
}

function saveLog(msg) {
    alt.log("~g~" + msg);
}

alt.Player.prototype.notif = function (vehicle, message) {
    const modelName = vehicle.getNameByHash().capitalizeFirstLetter();
    alt.emitClient(this, "notificationRaw", "CHAR_CARSITE", "Garage", modelName, message);
};

String.prototype.capitalizeFirstLetter = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

alt.Player.prototype.getNearestVehicle = function () {
    const eventName = `vehicle:nearest`;
    return this.getDataFromClient(eventName);
};

alt.Player.prototype.getDataFromClient = function (eventName) {
    return new Promise((resolve, reject) => {
        alt.emitClient(this, `${eventName}-get`);
        const handler = function (player, res) {
            alt.clearTimeout(timeout);
            if (res) resolve(res);
            else resolve();
        };
        alt.onceClient(`${eventName}-${this.id}`, handler);
        const timeout = alt.setTimeout(() => {
            alt.offClient(`${eventName}-${this.id}`, handler);
            resolve();
        }, 2000);
    });
};
