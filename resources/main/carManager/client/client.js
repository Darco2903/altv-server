import * as alt from 'alt-client';
import * as native from 'natives';
import WebView from "./WebView";
//import { WebView } from "exports";
import { modList, wheelTypeList } from '../tables';


let webview
let veh
let restoreData = {}


alt.on('keydown', (key) => {
    switch (key) {
        case 49: //&
            toogleEngine()
            break;
    
        default:
            break;
    }
})

function toogleEngine () {
    veh = alt.Player.local.vehicle
    if (!veh) return
    let engine = !veh.getMeta('engine')
    veh.setMeta('engine', engine)
    native.setVehicleEngineOn(veh.scriptID, engine, false, true)
    //native.setVehicleUndriveable(!engine)
}

alt.on('keyup', (key) => {
    if (key == 27 && webview) { //Escape
        if (webview.url.includes("modWebview")){
            sendModsToServer()
            native.releasePreloadMods(veh)
        }
        webview = webview.close()
    }
})

alt.on("spawnVeh:load", openVeh)
alt.onServer('spawnVeh:load', openVeh)

function openVeh () {
    if (webview) return
    webview = new WebView("http://resource/client/html/vehWebview.html")
    webview.on('spawnVehicle', model => {
        alt.emitServer('spawn:Vehicle', JSON.stringify(model))
        webview = webview.close()
    })
    webview.open()
}

alt.on('modVeh:load', openMod)
alt.onServer('modVeh:load', openMod)

function openMod () {
    if (webview) return
    webview = new WebView('http://resource/client/html/modWebview.html')
    webview.on('stock', setStock)
    webview.on('restore', () => restoreAll())
    webview.on('setMod', setMod)
    webview.on('toogleMod', toogleMod)
    webview.on('setWheels', setWheels)
    //  webview.on('customColor', customColor)
    //  webview.on('color', color)
    //  webview.on('neons', neons)
    webview.on("startApp", startApp)
    startApp("mods")
    webview.open()
}

function startApp (app) {
    alt.log("startApp: ", app)
    let data
    switch (app) {
        case "mods":
            data = getModsData()
            restoreData.mods = data
            break;
        
        case "colors":
            //data = 
            //restoreData.colors = data
            break;
        
        case "wheels":
            data = getWheelsData()
            restoreData.wheels = data.restore
            break;
        
        case "neons":
            //data = 
            //restoreData.neons = data
            break;
            
        default:
            break;
    }
    webview.emit("app", [app, data])
}

function sendModsToServer () {
    let data = {
        mods: getModsData(),
        wheels: getWheelsData().restore
    }
    alt.emitServer("sendModsToServer", (data))
}

function setStock () {
    veh = alt.Player.local.vehicle
    const n = modList.length
    for (let modType = 0 ; modType < n ; modType++) {
        switch (modType) {
            //  case 17: ??
            case 18:
            //  case 19: ??
            case 20:
            //  case 21: ??
            case 22:
                toogleMod([modType, false])
                break;

            default:        
                native.removeVehicleMod(veh, modType)
                break;
        }
    }
}

function restoreAll () {
    setAllMod(restoreData.mods)
    setWheels(restoreData.wheels)
}

function setMod (data) {
    const [modType, modId] = data
    native.setVehicleMod(veh, modType, modId -1, false)
}
 
function toogleMod (data) {
    const [modType, bool] = data
    native.toggleVehicleMod(veh, modType, bool)
}

function setAllMod (data) {
    veh = alt.Player.local.vehicle
    for (let modType=0 ; modType < data.length ; modType++) {
        const mod = data[modType]
        
        switch (modType) {
            //  case 17: ??
            case 18: //Turbo
            //  case 19: ??
            case 20: //Custom Tires Smoke
            //  case 21: ??
            case 22: //Xenon
                toogleMod(mod)
                break;
            default:
                setMod(mod)
                break;
        }
    }
}

function getModsData () {
    veh = alt.Player.local.vehicle
    const n = modList.length
    let data = []
    for (let modType = 0 ; modType < n ; modType++) {
        native.preloadVehicleMod(veh, modType, 1)
        switch (modType) {
            //  case 17: ??
            case 18:
            //  case 19: ??
            case 20:
            //  case 21: ??
            case 22:
                const toogle = native.isToggleModOn(veh, modType)
                data.push([modType, toogle])
                break;
                
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
            case 12:
            case 13:
            case 14:
            case 15:
            case 16:
            //  case 23: //Front Wheels
            //  case 24: //Rear Wheels only for motocycles
            case 25:
            case 27:
            case 28:
            case 30:
            case 33:
            case 34:
            case 35:
            case 38:
            case 48:
                const num = native.getVehicleMod(veh, modType) +1
                const count = native.getNumVehicleMods(veh, modType, 1)
                data.push([modType, num, count])
                break;
            default:
                continue;
        }
    }
    return data
}

const wheelsModType = 23    // Front Wheels

function getWheelsData () {
    veh = alt.Player.local.vehicle
    let data = {}
    const typeIndex = native.getVehicleWheelType(veh)
    const wheelNum = native.getVehicleMod(veh, wheelsModType) +1
    const customWheels = native.getVehicleModVariation(veh, wheelsModType)
    native.preloadVehicleMod(veh, wheelsModType, 1)
    wheelTypeList.forEach((type, typeIndex) => {
        native.setVehicleWheelType(veh, typeIndex)
        const wheelCount = native.getNumVehicleMods(veh, wheelsModType)
        data[typeIndex] = {name: type, count: wheelCount}
    })
    native.setVehicleWheelType(veh, typeIndex)
    native.setVehicleMod(veh, wheelsModType, wheelNum -1, customWheels)
    data.restore = {typeIndex, wheelNum, wheelTypeCount: wheelTypeList.length}
    return data
}

function setWheels (data) {
    veh = alt.Player.local.vehicle
    const {typeIndex, wheelNum} = data
    const customWheels = native.getVehicleModVariation(veh, wheelsModType)
    native.setVehicleWheelType(veh, typeIndex)
    native.setVehicleMod(veh, wheelsModType, wheelNum -1, customWheels)
}

function getColors () {
    veh = alt.Player.local.vehicle
    const xenon = native.getVehicleXenonLightsColor(veh)
    const interior = native.getVehicleInteriorColor(veh, 1)
    const dash = native.getVehicleDashboardColor(veh, 1)
    const count = native.getNumModColors(veh, 1)
    const modColor1 = native.getVehicleModColor1(veh, 1, 1, 1)
    const modColor2 = native.getVehicleModColor2(veh, 1)
    const modColor1Name = native.getVehicleModColor1Name(veh, true)
    const modColor2Name = native.getVehicleModColor1Name(veh)
    const tireSmoke = native.getVehicleTyreSmokeColor(veh, 1, 1, 1)
    const color = native.getVehicleColor(veh, 1, 1, 1)
    
    console.log(
    "xenon:", xenon,
    "interior:", interior,
    "dash:", dash,
    "count:", count,
    "modColor1:", modColor1,
    "modColor2:", modColor2,
    "modColor1Name:", modColor1Name,
    "modColor2Name:", modColor2Name,
    "tireSmoke:", tireSmoke,
    "color:", color
    );
}


//  alt.onServer('handlingWebview:load', () => {
//      handlingWebview()
//  })
//  
//  
//  function handlingWebview () {
//      if (webview) return
//      webview = new WebView('http://resource/client/html/handlingWebview.html')
//      webview.on('close:Webview', () => webview = webview.close())
//      webview.on('handling:Set', toSetHandling)
//  
//      const handlingData = alt.Player.local.vehicle.handling
//      
//      for (const elem in handlingData) {
//          //console.log(elem, handlingData[elem])
//  
//          if (elem != null && elem != 'isModified' && elem != 'reset') {
//              webview.emit('handlingData', [elem, handlingData[elem]])
//          }
//      }
//      webview.open()
//  }
//  
//  alt.onServer("personnalspawnVeh:load", (vehList) => {
//      personnalVehWebview()
//  })
//  
//  function personnalVehWebview () {
//      if (webview) return
//      webview = new WebView('http://resource/client/html/personnalVehWebview.html')
//      webview.on('close:Webview', () => webview = webview.close())
//  
//      webview.emit('vehList', vehList)
//  
//      webview.open()
//  }
//  
//  
//  function toSetHandling (handling) {
//      var veh = alt.Player.local.vehicle
//      if (!veh) return
//  
//      if (handling == 'reset' && veh.handling.isModified()) {
//          veh.handling.reset()
//          closeWebview()
//          setTimeout(() => {
//              handlingWebview()
//          }, 100);
//          return
//      }
//      
//      if (typeof handling == 'object' && Object.keys(handling).length > 2) {
//          console.log('obj')
//          for (const elem in handling) veh.handling[elem] = handling[elem]
//          closeWebview()
//          setTimeout(() => {
//              handlingWebview()
//          }, 100);
//          return
//      }
//      console.log('hand')
//      veh.handling[handling[0]] = handling[1]
//  }


