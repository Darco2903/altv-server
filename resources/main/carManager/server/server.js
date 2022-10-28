import * as alt from 'alt-server';
import * as chat from 'chat';
import * as db from "database"
//import { globalFunction } from "main"
import * as Function from "./functions"
import { vehicleList } from '../tables.js';



///////////////////////////////

alt.on("ConnectionComplete", () => {
    const noVeh = alt.Vehicle.all.length == 0
    const carResources = ["moto", "carjdm", "carhyper", "cars", "i8"].map(name => alt.Resource.all.includes(alt.Resource.getByName(name)))
    const resourcesLoaded = !carResources.includes(false)
    if (resourcesLoaded && noVeh) Function.serverStartVehicleSpawn()
})

///////////////////////////////


alt.onClient('SaveVehicle', (player, data) => {
    
    let veh = player.vehicle
    alt.log(data)
    
    let modified
    
    const modData = data.mod
    if (modData) {

        //if (veh.modKitsCount < 1) veh.modKit = 0
        //else veh.modKit = 1

        for (const modIndex in modData) {
            var mod = modData[modIndex]
            veh.setMod(modIndex, mod +1)
        }
        modified = true
    }

    if (data.color) {
        //alt.log(data.color[1]) fghg
        veh.primaryColor = data.color[1]
        veh.secondaryColor = data.color[2]
        modified = true
    }

    const wheel = data.wheel
    if (wheel) {
        veh.setWheels(wheel.type, wheel.num +1)
        veh.wheelColor = wheel.color
        modified = true
    }

    const neon = data.neon

    if (neon) {
        veh.neon = {front: true, back: true, left: true, right: true}
        veh.neonColor = {r: neon.r, g: neon.g, b: neon.b, a: 1}
        modified = true
    }

/*
    if (modData) alt.log("mod")
    if (data.color) alt.log("color")
    if (wheel) alt.log("wheel")
    if (neon) alt.log("neon")
*/

    if (modified) Function.saveAppearance(veh)

})




/*
alt.onClient('vehicle:SetWheels', (player, wheels) => {
    var vehicle = player.vehicle
    wheels = [parseInt(wheels[0]), parseInt(wheels[1]), parseInt(wheels[2])]
    vehicle.setWheels(wheels[0], wheels[1])
    vehicle.wheelColor = wheels[2]
})
*/


alt.onClient('vehicle:ToRepair', (player, vehicle) => {
    if (!vehicle) {
        return chat.send(player, '{ff8f00}No vehicle found')
    }
    const rot = vehicle.rot
    vehicle.rot = {x: 0, y: rot.y, z: rot.z}
    vehicle.repair()
    chat.send(player, `{00FF00}${vehicle.getSyncedMeta('model')} fixed`)
})

/*
alt.onClient('vehicle:Neons', (player, color) => {
    var parsedNeons = [color[0], color[1], color[2]]
    Exports.neons(player, parsedNeons)
})
*/


alt.onClient('spawn:Vehicle', (player, model) => {
    model = JSON.parse(model)
    if (model in vehicleList) model = vehicleList[model]
    Function.createVehicle(player, model, false)
})


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
            alt.emitClient(player, 'vehWebview:load')
            break;

        case "spawn":
            if (!model || model == 'help') {
                chat.send(player, '{ff8f00}Command use : /veh spawn [model]')
                return
            }
            Function.createVehicle(player, model)
            break;
        
        case "visible":
            const vehicle = player.vehicle
            if (!vehicle) {
                return Function.vehCatch(player, 'noVeh')
            }
            Function.visibility(vehicle)
            break;

        default:
            chat.send(player, '{ff8f00}Use /veh help for more information')
            break;
    }
})


chat.registerCmd('delete', (player) => {
    const vehicle = player.vehicle

    if (!vehicle) {
        Function.vehCatch(player, 'noVeh')
        return
    } 

    if (player.name != vehicle.getSyncedMeta('owner')) {
        if (!Function.authorized(player, 2)) {
            return chat.send(player, '{ff8f00}This is not your vehicle')
        }
    }
    const callback = Function.destroyVehicle(vehicle)
    switch (callback) {
        case "deleted":
            chat.send(player, `${vehicle.model} supprimé`)
            break;

        case "databaseErr":
            chat.send(player, `L'entitée n'a pas été supprimé dans la database`)
            break;
    
        default:
            break;
    }
})

chat.registerCmd('mod', (player, arg) => {
    const vehicle = player.vehicle
    if (!vehicle) {
        Function.vehCatch(player, 'noVeh')
        return
    }

    if (player.name != vehicle.getSyncedMeta('owner') && !Function.authorized(player, 2)) {
        Function.vehCatch(player, "notOwner")
        return
        
    }

    //const vehModOption = Function.getVehMod(vehicle)

    if (!arg[0]) {
        alt.emitClient(player, 'modWebview:load')
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
        Function.vehCatch(player, 'noVeh')
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