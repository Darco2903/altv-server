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

// alt.Player.prototype.repairNearestVehicle = function () {
//     const eventName = `vehicle:nearest-${player.id}`;
//     alt.emitClient(player, "vehicle:getNearest");
//     const clientHandler = function (player, veh) {
//         alt.clearTimeout(timeout);
//         clearEvent();
//         repair(veh);
//     };
//     const repair = function (veh) {
//         veh.repair();
//         player.notif(veh, "~g~Réparé");
//     };
//     const clearEvent = function () {
//         alt.offClient(eventName, clientHandler);
//     };
//     const timeout = alt.setTimeout(clearEvent, 2000);
//     alt.onClient(eventName, clientHandler);
// }

alt.Player.prototype.getNearestVehicle = async function () {
    return new Promise((resolve, reject) => {
        const eventName = `vehicle:nearest-${player.id}`;
        console.log(eventName);
        alt.emitClient(player, "vehicle:getNearest");
        alt.onClient(eventName, handler);
        const handler = function (player, veh) {
            alt.clearTimeout(timeout);
            alt.offClient(eventName, handler);
            if (veh.valid) resolve(veh);
            else reject();
        };
        const timeout = alt.setTimeout(() => {
            alt.offClient(eventName, handler);
            reject();
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

/*
alt.onClient('vehicle:ToRepair', (player, vehicle) => {
    if (!vehicle) {
        chat.send(player, '{ff8f00}No vehicle found')
        return
    }
    const rot = vehicle.rot
    vehicle.rot = {x: 0, y: rot.y, z: rot.z}
    vehicle.repair()
    chat.send(player, `{00FF00}${vehicle.getSyncedMeta('model')} fixed`)
})
*/
/*
alt.onClient('vehicle:Neons', (player, color) => {
    var parsedNeons = [color[0], color[1], color[2]]
    Exports.neons(player, parsedNeons)
})
*/

/*
chat.registerCmd("veh", (player, arg) => {
    let [command, model] = arg
    switch (command) {
        case "help":
            chat.send(player, "{00FF00}'/veh' command help :")
            chat.send(player, '{ff8f00}/veh spawn [model]')
            chat.send(player, '{ff8f00}/veh destroy [vehID]')
            chat.send(player, '{ff8f00}/veh garage')
            chat.send(player, '{ff8f00}/veh visible')
            chat.send(player, '{ff8f00}For more information enter /veh [command] help')
            break;
        
        case undefined:
            alt.emitClient(player, 'spawnVeh:load')
            break;

        case "spawn":
            if (!model || model == 'help') {
                chat.send(player, '{ff8f00}Command use : /veh spawn [model]')
                return
            }
            carManager.createVehicle(player, model)
            break;
        
        case "visible":
            const vehicle = player.vehicle
            if (!vehicle) {
                return carManager.vehCatch(player, 'noVeh')
            }
            carManager.visibility(vehicle)
            break;

        default:
            chat.send(player, '{ff8f00}Use /veh help for more information')
            break;
    }
})


chat.registerCmd('delete', (player) => {
    const veh = player.vehicle

    if (!veh) {
        carManager.vehCatch(player, 'noVeh')
        return
    } 

    if (player.name != veh.owner) {
        if (!Functions.authorized(player, 2))
            return
    }
    veh.delete()
    veh.destroy()
})

chat.registerCmd('mod', (player, arg) => {
    const vehicle = player.vehicle
    if (!vehicle) {
        carManager.vehCatch(player, 'noVeh')
        return
    }

    if (player.name != vehicle.getSyncedMeta('owner') && !carManager.authorized(player, 2)) {
        carManager.vehCatch(player, "notOwner")
        return
        
    }

    //const vehModOption = Function.getVehMod(vehicle)

    if (!arg[0]) {
        alt.emitClient(player, 'modVeh:load')
        return
    }
    if (!arg[1]) {
        chat.send(player, '{fff800}Command use /mod [modID][modIndex]')
        return
    }

    var n = parseInt(arg[0])
    var b = parseInt(arg[1])
    if (!(0 <= n <= 67) || !(-1 <= b < vehModOption.count[n])) {
        chat.send(player, '{fff800}Wrong ModID or ModIndex')
    }

    vehicle.modKit = 1;
    vehicle.setMod(n, b);   

    //Function.saveAppearance(vehicle)
})

chat.registerCmd('repair', (player) => {
    if (player.vehicle) {
        var vehicle = player.vehicle
        vehicle.repair()
        return
    }
    alt.emitClient(player, 'vehicle:Repair')
})

chat.registerCmd('h', (player) => {
    if (!player.vehicle) {
        carManager.vehCatch(player, 'noVeh')
        return
    }
    alt.emitClient(player, 'handlingWebview:load')
})

chat.registerCmd('p', (player) => {
    alt.emit('p', (player))
})

chat.registerCmd('enter', (player) => {
    alt.emitClient(player, 'vehicle:Enter')
})
*/
