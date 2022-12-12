import * as alt from "alt-client";
import * as native from "natives";
import { open, close, cantLoad } from "webview";
import { modList, serverColors } from "../tables";


let player = alt.Player.local

let webview
let restoreData = {}
let veh


alt.on("keyup", (key) => {
    if (key == 27 && webview) {     //  key: 27 = Escape
        if (webview.url.includes("modWebview")){
            sendModsToServer()
            veh = null
        }
        closeWebView()
    }
})

function closeWebView () {
    close(webview)
    webview = undefined
}

alt.on("spawnVeh:load", openVeh)
//alt.onServer("spawnVeh:load", openVeh)

function openVeh () {
    if (webview) return
    webview = new alt.WebView("http://resource/client/html/vehSpawn/vehWebview.html", false)
    webview.on("spawnVehicle", model => {
        alt.emitServer("spawn:Vehicle", model)
        closeWebView()
    })
    open(webview)
}

alt.on("modVeh:load", openMod)
//alt.onServer("modVeh:load", openMod)

function openMod () {
    if (webview)
        return
    veh = player.vehicle
    native.setVehicleFixed(veh)

    webview = new alt.WebView("http://resource/client/html/vehMod/modWebview.html", false)
    webview.on("startApp", startApp)
    webview.on("stock", setStock)
    webview.on("restore", restoreAll)
    webview.on("setMod", (setMod))
    webview.on("toogleMod", toogleMod)
    webview.on("setWheels", setWheels)
    webview.on("setWheelsExtra", setWheelsExtra)
    webview.on("setColors", setColors)
    webview.on("setExtraColors", setExtraColors)
    webview.on("setNeons", setNeons)
    webview.on("setPlate", setPlate)
    startApp("mods")
    open(webview)
}

function startApp (app) {
    alt.log("startApp: ", app)
    let data = {}
    switch (app) {
        case "mods":
            data = getModsData()
            restoreData.mods = data
            break;
        
        case "wheels":
            const wheels = getWheelsData()
            restoreData.wheels = wheels
            const extraWheels = getWheelsExtra()
            restoreData.extraWheels = extraWheels
            Object.assign(data, wheels, extraWheels);
            break;

        case "colors":
            const colors = getColors()
            restoreData.colors = colors
            const extraColors = getExtraColors()
            restoreData.extraColors = extraColors
            Object.assign(data, colors, extraColors);
            break;
        
        case "neons":
            data = getNeons()
            restoreData.neons = data
            break;

        case "plate":
            data = getPlate()
            restoreData.plate = data
            break;
            
        default:
            break;
    }
    webview.emit("app", [app, data])
}

function refreshApp (app) {
    let data = {}
    switch (app) {
        case "mods":
            data = getModsData()
            break;
        
        case "wheels":
            data = getWheelsData()
            break;

        case "colors":
            const color = getColors()
            const extraColor = getExtraColors()
            Object.assign(data, color, extraColor);
            break;
        
        case "neons":
            data = getNeons()
            break;

        case "plate":
            data = getPlate()
            break;
            
        default:
            log(`cant load: ${app}`)
            return;
    }
    webview.emit("app", [app, data])
}

function sendModsToServer () {
    alt.emitServer("sendDataToServer", getAllMods("server"))
}

function getAllMods (side) {
    return {
        mods: getModsData(),
        wheels: getWheelsData(),
        colors: side == "server" ? getServerColors() : getColors(),
        extraColors: getExtraColors(),
        neons: getNeons(),
        plate: getPlate()
    }
}

function setStock (app) {
    restoreData = getAllMods()
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
    setExtraColors({xenon: 0, window: 0})
    native.suppressNeonsOnVehicle(veh, true)
    setPlate({plateIndex: 0, plateText: "ALTV"})
    refreshApp(app)
}

function restoreAll (app) {
    if (restoreData.mods)
        setAllMod(restoreData.mods)
    if (restoreData.wheels)
        setWheels(restoreData.wheels)
    if (restoreData.colors)
        setColors(restoreData.colors)
    if (restoreData.extraColors)
        setExtraColors(restoreData.extraColors)
    if (restoreData.neons)
        setNeons(restoreData.neons)
    if (restoreData.plate)
        setPlate(restoreData.plate)
    refreshApp(app)
}

function setMod ([modType, modId]) {
    native.setVehicleMod(veh, modType, modId -1, false)
}
 
function toogleMod ([modType, bool]) {
    native.toggleVehicleMod(veh, modType, bool)
}

function setAllMod (data) {
    //for (let modType=0 ; modType < data.length ; modType++) {
    data.forEach((mod, modType) => {          
        switch (modType) {
            //  case 17: ??
            case 18: //Turbo
            //  case 19: ??
            //  case 20: //Custom Tires Smoke
            //  case 21: ??
            //  case 22: //Xenon
                toogleMod(mod)
                break;

            case 48:
                native.setVehicleLivery(veh, mod)
                break;
                
            default:
                setMod(mod)
                break;
        }
    })
}

function getModsData () {
    const n = modList.length
    let data = []
    for (let modType = 0 ; modType < n ; modType++) {
        //native.preloadVehicleMod(veh, modType, 1)
        switch (modType) {
            //  case 17: ??
            case 18:
            //  case 19: ??
            //  case 20: custom tires
            //  case 21: ??
            //  case 22: xenon
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

const wheelsFront = 23    // Front Wheels
const wheelsRear = 24    // Rear Wheels (Motorcycles)

function getWheelsData () {
    const wheelType = native.getVehicleWheelType(veh)
    const wheelNum = native.getVehicleMod(veh, wheelsFront) +1
    //  console.log(native.getVehicleMod(veh, wheelsFront), native.getVehicleMod(veh, wheelsRear));
    const wheelColor = native.getVehicleExtraColours(veh, 1, 1)[2]  //  [void, pearl, color]
    const drift = native.getDriftTyresSet(veh)
    return {wheelType, wheelNum, wheelColor, drift}
}

function setWheels ({wheelType, wheelNum, wheelColor, drift}) {
    const customWheels = native.getVehicleModVariation(veh, wheelsFront)
    native.setVehicleWheelType(veh, wheelType)
    native.setVehicleMod(veh, wheelsFront, wheelNum -1, customWheels)
    const pearl = native.getVehicleExtraColours(veh, 1, 1)[1]  //  [void, pearl, color]
    native.setVehicleExtraColours(veh, pearl, wheelColor)
    native.setDriftTyres(veh, drift)
}

function getWheelsExtra () {
    const camber = parseFloat(veh.getWheelCamber(0).toFixed(2))
    const track = [veh.getWheelTrackWidth(0), veh.getWheelTrackWidth(2)].map(value => parseFloat(value.toFixed(2)))    //  [Front, Rear]
    return {camber, track}
}

function setWheelsExtra ({camber, track}) {
    console.log(camber);
    console.log(veh.wheelsCount);
    for (let wheelId=0 ; wheelId<veh.wheelsCount ; wheelId++) {
        console.log(wheelId, camber, track);
        veh.setWheelCamber(wheelId, camber)
        const i = native.floor(wheelId/2)
        const width = track[i] || track[i-1]
        veh.setWheelTrackWidth(wheelId, width)
    }
}

function getColors () {
    let [serverPrimary, serverSecondary] = native.getVehicleColours(veh,).splice(1, 2)
    let [type1, color1] = native.getVehicleModColor1(veh,).splice(1, 2)  //  [void, paintType, color, pearl(client-side)]
    let [type2, color2] = native.getVehicleModColor2(veh,).splice(1, 2)  //  [void, paintType, color]
    const pearl = native.getVehicleModColor1(veh,)[3]       //  [void, colorType, colorNum, pearl(client-side)]
    if (type1 == 7 || color1 == -1) {
        [type1, color1] = serverColors[serverPrimary].client;
        [type2, color2] = serverColors[serverSecondary].client;
    }
    const primary = {colorType: type1, colorNum: color1, pearl}
    const secondary = {colorType: type2, colorNum: color2}
    return {primary, secondary}
}

function getServerColors () {
    const [primary, secondary] = native.getVehicleColours(veh,).splice(1, 2)
    const pearl = native.getVehicleExtraColours(veh,)[1]  //  [void, pearl(server-side), color(wheels)]
    return {primary, secondary, pearl}
}

function setColors ({primary, secondary}) {
    native.setVehicleModColor1(veh, primary.colorType, primary.colorNum, primary.pearl)
    native.setVehicleModColor2(veh, secondary.colorType, secondary.colorNum)
    const wheelColor = native.getVehicleExtraColours(veh, 1, 1)[2]  //  [void, pearl, wheelColor]
    native.setVehicleExtraColours(veh, primary.pearl, wheelColor)
}

function getExtraColors () {
    let xenon = native.getVehicleXenonLightColorIndex(veh) +2
    xenon = xenon < 15 ? xenon : 0
    const window = native.getVehicleWindowTint(veh)
    const tireSmoke = native.getVehicleTyreSmokeColor(veh,)
    
    //  data.interior = native.getVehicleInteriorColor(veh,)[1]
    //  data.dash = native.getVehicleDashboardColor(veh,)[1]

    //interior native.setVehicleExtraColour5()
    //dash native.setVehicleExtraColour6()

    return {xenon, window, tireSmoke}
}

function setExtraColors ({xenon, window}) {
    native.toggleVehicleMod(veh, 22, xenon != 0)
    native.setVehicleXenonLightColorIndex(veh, xenon -2)
    native.setVehicleWindowTint(veh, window)
    //  native.setVehicleTyreSmokeColor(veh, 255, 255, 255)
}

function getNeons () {
    let enabled = native.getVehicleNeonEnabled(veh, 0)
    let color = native.getVehicleNeonColour(veh,).splice(1, 3)//[void, int, int, int]
    color = new alt.RGBA(color)
    return {color, enabled}
}

function setNeons ({enabled, color}) {
    native.suppressNeonsOnVehicle(veh, false)
    for (let i=0 ; i<4 ; i++) native.setVehicleNeonEnabled(veh, i, enabled)
    native.setVehicleNeonColour(veh, color.r, color.g, color.b)
}

function getPlate () {
    let plateIndex = native.getVehicleNumberPlateTextIndex(veh)
    let plateText = native.getVehicleNumberPlateText(veh)
    return {plateIndex, plateText}
}

function setPlate ({plateIndex, plateText}) {
    native.setVehicleNumberPlateTextIndex(veh, plateIndex)
    native.setVehicleNumberPlateText(veh, plateText)
}



//  alt.onServer("handlingWebview:load", () => {
//      handlingWebview()
//  })
//  
//  
//  function handlingWebview () {
//      if (webview) return
//      webview = new WebView("http://resource/client/html/handlingWebview.html")
//      webview.on("close:Webview", () => closeWebView())
//      webview.on("handling:Set", toSetHandling)
//  
//      const handlingData = alt.Player.local.vehicle.handling
//      
//      for (const elem in handlingData) {
//          //console.log(elem, handlingData[elem])
//  
//          if (elem != null && elem != "isModified" && elem != "reset") {
//              webview.emit("handlingData", [elem, handlingData[elem]])
//          }
//      }
//      open(webview)
//  }
//  
//  alt.onServer("personnalspawnVeh:load", (vehList) => {
//      personnalVehWebview()
//  })

//  function toSetHandling (handling) {
//      var 
//      if (!veh) return
//  
//      if (handling == "reset" && veh.handling.isModified()) {
//          veh.handling.reset()
//          closeWebview()
//          setTimeout(() => {
//              handlingWebview()
//          }, 100);
//          return
//      }
//      
//      if (typeof handling == "object" && Object.keys(handling).length > 2) {
//          console.log("obj")
//          for (const elem in handling) veh.handling[elem] = handling[elem]
//          closeWebview()
//          setTimeout(() => {
//              handlingWebview()
//          }, 100);
//          return
//      }
//      console.log("hand")
//      veh.handling[handling[0]] = handling[1]
//  }


//  function personnalVehWebview () {
//      if (webview) return
//      webview = new WebView("http://resource/client/html/personnalVehWebview.html")
//      webview.on("close:Webview", () => closeWebView())
//  
//      webview.emit("vehList", vehList)
//  
//      open(webview)
//  }