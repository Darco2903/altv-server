import * as alt from 'alt-server';
import * as chat from 'chat';
import { getDataBase } from "../../database/startup";
import * as Function from "./functions"
import { vehicleList } from '../tables';
import { multipleExist } from '../../data/globalFunctions';

///////////////////////////////

//DATABASE

let db
let carResources = ["moto", "carjdm", "carhyper", "cars", "i8"].map(name => alt.Resource.getByName(name))
alt.on('ConnectionComplete', () => {
    db = getDataBase()
    const noVeh = alt.Vehicle.all.length == 0
    const resourcesLoaded = multipleExist(alt.Resource.all, carResources)
    if (resourcesLoaded && noVeh) Function.serverStartVehicleSpawn()
})

///////////////////////////////


/*
alt.onClient('vehicle:CustomColor', (player, arg) => {
    var parsedColor1 = ['', parseInt(arg[0]), parseInt(arg[1]), parseInt(arg[2]), parseInt(arg[6]), parseInt(arg[7])]
    var parsedColor2 = ['', parseInt(arg[3]), parseInt(arg[4]), parseInt(arg[5]), parseInt(arg[6]), parseInt(arg[7])]
    Exports.color(player, parsedColor1, 1)
    Exports.color(player, parsedColor2, 2)
})

alt.onClient('vehicle:Color', (player, arg) => {
    alt.log('color')
    player.vehicle.primaryColor = arg[0]
    player.vehicle.secondaryColor = arg[1]
})
*/


alt.onClient('Server:SaveVehicle', (player, data) => {
    
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
    if (vehicleList[model]) model = vehicleList[model]
    Function.createVehicle(player, model, false)
})


chat.registerCmd('veh', (player, arg) => {
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
            alt.log("vehWebview:load")
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
            };
            Function.visibility(vehicle)
            break;

        default:
            chat.send(player, '{ff8f00}Use /veh help for more information')
            break;
    }


    //  if (arg[0] === 'help') {
    //      chat.send(player, "{00FF00}'/veh' command help :")
    //      chat.send(player, '{ff8f00}/veh spawn [model]')
    //      chat.send(player, '{ff8f00}/veh destroy [vehID]')
    //      chat.send(player, '{ff8f00}/veh garage')
    //      chat.send(player, '{ff8f00}/veh visible')
    //      chat.send(player, '{ff8f00}For more information enter /veh [command] help')
    //      return
    //  }
    //  
    //  if (!arg[0]) {
    //      alt.emitClient(player, 'vehWebview:load')
    //      return
    //  }
//  
    //  if (arg[0] === 'spawn') {
    //      if (!arg[1] || arg[1] == 'help') {
    //          return chat.send(player, '{ff8f00}Command use : /veh spawn [model]')
    //      }
    //      Exports.createVehicle(player, arg[1])
    //      return
    //  }
//  
    //  if (arg[0] === 'visible') {
    //      const vehicle = player.vehicle
    //      if (!vehicle) {
    //          return Exports.vehCatch(player, 'noVeh')
    //      };
    //      Exports.visibility(vehicle)
    //      return
    //  }
    //  
    //  return chat.send(player, '{ff8f00}Use /veh help for more information')
});