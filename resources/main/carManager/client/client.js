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
        model = model.toLowerCase()
        model = model.replaceAll(' ', '_')
        alt.emitServer('spawn:Vehicle', model)
        webview = webview.close()
    })
    webview.open()
}

alt.on('modVeh:load', openMod)
alt.onServer('modVeh:load', openMod)

function openMod () {
    if (webview) return
    webview = new WebView('http://resource/client/html/modWebview.html')
    webview.on("startApp", startApp)
    webview.on('stock', setStock)
    webview.on('restore', () => restoreAll())
    webview.on('setMod', setMod)
    webview.on('toogleMod', toogleMod)
    webview.on('setWheels', setWheels)
    webview.on('setColors', setColors)
    //  webview.on('neons', neons)
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
        
        case "wheels":
            data = getWheelsData()
            restoreData.wheels = data.restore
            break;

        case "colors":
            data = getColors()
            restoreData.colors = data.restore
        
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
        wheels: getWheelsData().restore,
        colors: getServerColors()
    }
    alt.emitServer("sendDataToServer", (data))
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
    const color = {
        primary: {colorType: 0, colorNum: 0, pearl: 0},
        secondary: {colorType: 0, colorNum: 0}
    }
    setColors(color)
}

function restoreAll () {
    if (restoreData.mods)
        setAllMod(restoreData.mods)
    if (restoreData.wheels)
        setWheels(restoreData.wheels)
    if (restoreData.colors)
        setColors(restoreData.colors)
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
    //const customWheels = native.getVehicleModVariation(veh, wheelsModType)
    const wheelColor = native.getVehicleExtraColours(veh, 1, 1)[2]  //  [void, pearl, color]
    native.preloadVehicleMod(veh, wheelsModType, 1)
    for (let i=0 ; i<wheelTypeList.length ; i++) {
        native.setVehicleWheelType(veh, i)
        const wheelCount = native.getNumVehicleMods(veh, wheelsModType)
        data[i] = wheelCount
    }
    data.colorCount = 160   //getColorsCount()
    //  native.setVehicleWheelType(veh, typeIndex)
    //  native.setVehicleMod(veh, wheelsModType, wheelNum -1, customWheels)
    data.restore = {typeIndex, wheelNum, wheelColor}
    setWheels(data.restore)
    return data
}

function setWheels (data) {
    veh = alt.Player.local.vehicle
    const {typeIndex, wheelNum, wheelColor} = data
    const customWheels = native.getVehicleModVariation(veh, wheelsModType)
    native.setVehicleWheelType(veh, typeIndex)
    native.setVehicleMod(veh, wheelsModType, wheelNum -1, customWheels)
    const pearl = native.getVehicleExtraColours(veh, 1, 1)[1]  //  [void, pearl, color]
    console.log(pearl);
    native.setVehicleExtraColours(veh, pearl, wheelColor)
}

function getColors () {
    veh = alt.Player.local.vehicle
    let data = {}
    let [type1, color1, pearl] = native.getVehicleModColor1(veh, 1, 1, 1).splice(1, 3)  //  [void, paintType, color, pearl]
    let [type2, color2] = native.getVehicleModColor2(veh, 1).splice(1, 2)               //  [void, paintType, color]
    if (type1 == 7 || color1 == -1)
        [type1, color1] = [0, 0]
    if (type2 == 7 || color2 == -1)
        [type2, color2] = [0, 0]

    const primary = {colorType: type1, colorNum: color1, pearl}
    const secondary = {colorType: type2, colorNum: color2}
    data.restore = {primary, secondary}

    data.xenon = native.getVehicleXenonLightsColor(veh)
    data.interior = native.getVehicleInteriorColor(veh,)[1]
    data.dash = native.getVehicleDashboardColor(veh,)[1]
    data.tireSmoke = native.getVehicleTyreSmokeColor(veh,)    
    return data
}

function getServerColors () {
    veh = alt.Player.local.vehicle
    const [primary, secondary] = native.getVehicleColours(veh,).splice(1, 2)
    const pearl = native.getVehicleModColor1(veh,)[3]       //[void, colorType, colorNum, pearl]
    console.log(pearl);
    return {primary, secondary, pearl}
}

function setColors (data) {
    veh = alt.Player.local.vehicle
    let {primary, secondary} = data
    native.setVehicleModColor1(veh, primary.colorType, primary.colorNum, primary.pearl)
    native.setVehicleModColor2(veh, secondary.colorType, secondary.colorNum)

    //  native.setVehicleXenonLightsColor(veh, 1) //0-12
    //  native.setVehicleTyreSmokeColor(veh, 255, 255, 255)

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


