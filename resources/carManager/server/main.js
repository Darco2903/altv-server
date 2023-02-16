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

alt.Player.prototype.getNearestVehicle = async function () {
    return new Promise((resolve, reject) => {
        const eventName = `vehicle:nearest-${this.id}`;
        const handler = function (player, veh) {
            alt.clearTimeout(timeout);
            alt.offClient(eventName, handler);
            if (veh && veh.valid) resolve(veh);
            else resolve();
        };
        alt.emitClient(this, "vehicle:getNearest");
        alt.onClient(eventName, handler);
        const timeout = alt.setTimeout(() => {
            alt.offClient(eventName, handler);
            resolve();
        }, 2000);
    });
};

//  function initSpawn () {
//      if (db.isReady() && !alt.Vehicle.all.length)
//          spawnStored()
//  }

//  function spawnStored () {
//      return
//      db.fetchAllData("Vehicle", (dataArray) => {
//          if (!dataArray) return
//          dataArray.forEach((data) => {
//              data.pos = new alt.Vector3(JSON.parse(data.pos))
//              data.rot = new alt.Vector3(JSON.parse(data.rot))
//              if (data.garage) {
//                  alt.emit("vehicle:spawnInGarage", data)
//                  return
//              }
//              let veh = new alt.Vehicle(data.model, data.pos, data.rot)
//              veh.init(data.model)
//              veh.initWithData(data.id, data.appearance)
//          })
//          log("All Vehicles spawned")
//      })
//  }

//  let i=0
//  alt.on("playerEnteredVehicle", (player, vehicle, seat) => {
//      setInterval(() => {
//          console.log(vehicle.lightsMultiplier)
//          vehicle.lightsMultiplier = i++
//      }, 1000);
//  })

// chat.registerCmd("enter", (player) => {
//     alt.emitClient(player, "vehicle:Enter");
// });
