import * as alt from 'alt-client';
import * as native from 'natives';
import { WebView } from '../../webview/webview';
import { modList } from '../tables';

alt.log("WEBVIEW STARTED")

let webview
let restoreData = {}

alt.on('keydown', (key) => {
    switch (key) {
        case 49:    //&
            toogleEngine()
            break;
    
        default:
            break;
    }
})

alt.on('keyup', (key) => {
    if (key == 27 && webview) { //Escape
        //if (webview.url == 'http://resource/client/html/modWebview.html') vehicleDiscardChange()
        //else if (webview.url == 'http://resource/client/html/clothesWebview.html') playerDiscardChange()
        webview = webview.close()
    }
})

alt.onServer('vehWebview:load', () => {
    alt.log("vehWebview:load")
    if (webview) return
    webview = new WebView("http://resource/client/html/vehWebview.html")
    webview.on('spawnVehicle', model => {
        alt.emitServer('spawn:Vehicle', JSON.stringify(model))
        webview = webview.close()
    })
    webview.open()
})


alt.onServer('modWebview:load', () => {
    if (webview) return
    webview = new WebView('http://resource/client/html/modWebview.html')
    webview.on('stock', setStock)
    webview.on('restore', () => setAllMod(restoreData.mod))
    webview.on('setMod', setMod)
    webview.on('toogleMod', toogleMod)
    //  webview.on('setwheels', setwheels)
    //  webview.on('customColor', customColor)
    //  webview.on('color', color)
    //  webview.on('neons', neons)
    webview.on("startApp", startApp)
    startApp("mods")
    webview.open()
})

function startApp (app) {
    alt.log("startApp: ", app)
    let data
    switch (app) {
        case "mods":
            data = getModsData()
            restoreData.mod = data
            break;
            
        default:
            break;
    }
    webview.emit("app", [app, data])
}

function setStock () {
    const veh = alt.Player.local.vehicle
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


function setMod (data) {
    const [modType, modId] = data
    const veh = alt.Player.local.vehicle
    native.setVehicleMod(veh, modType, modId -1, false)
}


function toogleMod (data) {
    const [modType, bool] = data
    const veh = alt.Player.local.vehicle
    native.toggleVehicleMod(veh, modType, bool)
}


function setAllMod (data) {
    const n = modList.length
    for (let modType=0 ; modType < n ; modType++) {
        const mod = data[modType]
        alt.log(mod)
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
    const veh = alt.Player.local.vehicle
    const n = modList.length
    let data = []
    for (let modType = 0 ; modType < n ; modType++) {
        
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
                const count = native.getNumVehicleMods(veh, modType)
                data.push([modType, num, count])
                break;
            default:
                continue;
        }
    }
    return data
}


function toogleEngine () {
    let vehicle = alt.Player.local.vehicle
    if (!vehicle) return
    let engine = !vehicle.getMeta('engine')
    vehicle.setMeta('engine', engine)
    native.setVehicleEngineOn(vehicle.scriptID, engine, false, true)
    //native.setVehicleUndriveable(!engine)
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
//  alt.onServer("personnalVehWebview:load", (vehList) => {
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


