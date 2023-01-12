import * as alt from "alt-client";
import * as native from "natives";

import "./Vehicle";

const player = alt.Player.local;
let app;

let webview = new alt.WebView("http://resource/client/webview/apps/tuner/index.html", false);
webview.isVisible = false;
webview.on("look", setCamPos);
webview.on("startApp", startApp);
//  webview.on("camPos", camByMod);
webview.on("stock", setStock);
webview.on("restore", restoreAll);
webview.on("setMod", (modType, modId) => player.vehicle.setMod(modType, modId));
webview.on("toogleMod", (modType, state) => player.vehicle.toogleMod(modType, state));
webview.on("setWheels", (wheelsData) => player.vehicle.setWheels(wheelsData));
webview.on("setColors", (colorsData) => player.vehicle.setColors(colorsData));
webview.on("setNeons", (neonsData) => player.vehicle.setNeons(neonsData));
webview.on("setPlate", (plateData) => player.vehicle.setPlate(plateData));

alt.on("carManager:tuner", open);
alt.on("menuOpen", close);

function keyHandler(key) {
    if (webview.isVisible && key == 27) close(); // ESC
}

function setCamPos(heading, pitch, scalingFactor = 0.5) {
    console.log(heading, pitch);
    native.setGameplayCamRelativeHeading(heading);
    native.setGameplayCamRelativePitch(pitch, scalingFactor);
    webview.emit("lookUpdate", heading, -pitch);
}

function camByApp(app) {
    switch (app) {
        case "mods":
            setCamPos(200, 0, 0.02);
            break;

        case "wheels":
            setCamPos(245, 10, 0.02);
            break;

        case "plate":
            setCamPos(0, 30, 0.02);
            break;

        default:
            break;
    }
}

/*
function camByMod(name) {
    console.log(name);
    switch (name) {
        case "spoiler":
            setCamPos(240, 40);
            break;

        default:
            break;
    }
}
*/

function open() {
    if (webview.isVisible) return;
    webview.toogle(true);
    toogleControls(false);
    alt.on("keyup", keyHandler);
    //  native.setGameplayCamRelativePitch(5, 0.01); //  Slow effect
    //  veh = player.vehicle;
    //  const lightState = native.getVehicleLightsState(veh)[1];
    //  if (lightState) native.setVehicleLights(veh, 1);
    //  restoreData.lightState = lightState;
    player.vehicle.storeData();
    startApp("mods");
}

function close() {
    if (!webview.isVisible) return;
    webview.toogle(false);
    toogleControls(true);
    alt.off("keyup", keyHandler);
    const pitch = native.getGameplayCamRelativePitch();
    native.setGameplayCamRelativePitch(pitch + 2, 1); //  Remove slow effect
    player.vehicle.storedData = null;
    sendModsToServer();
}

async function toogleControls(state) {
    if (state) await alt.Utils.wait(100);
    alt.toggleGameControls(state);
}

function dataByApp(app) {
    switch (app) {
        case "mods":
            return player.vehicle.getModsData();

        case "wheels":
            return player.vehicle.getWheelsData();

        case "colors":
            return player.vehicle.getColors();

        case "neons":
            return player.vehicle.getNeons();

        case "plate":
            return player.vehicle.getPlate();

        default:
            alt.log(`cant load: ${app}`);
            return;
    }
}

function startApp(app) {
    alt.log("startApp: ", app);
    const data = dataByApp(app);
    if (!data) return;
    player.vehicle.restoreData[app] = data;
    webview.emit("app", app, data);
    camByApp(app);
}

function refreshApp() {
    const data = dataByApp(app);
    if (!data) return;
    webview.emit("app", [app, data]);
}

function sendModsToServer() {
    alt.emitServer("sendDataToServer", getAllMods("server"));
}

function getAllMods(side) {
    return {
        mods: this.getModsData(),
        wheels: this.getWheelsData(),
        colors: side == "server" ? this.getServerColors() : this.getColors(),
        extraColors: this.getExtraColors(),
        neons: this.getNeons(),
        plate: this.getPlate(),
    };
}

function setStock() {
    player.vehicle.setStock();
    refreshApp();
}

function restoreAll() {
    player.vehicle.restore();
    refreshApp();
}
/*
function setMod([modType, modId]) {
    switch (modType) {
        case 0:
            setCamPos(30, 1);
            break;
        case 1:
            setCamPos(200, 2);
            break;
        case 2:
            setCamPos(-10, 3);
            break;
        case 3:
            setCamPos(-100, 1);
            break;

        default:
            break;
    }
    native.setVehicleMod(veh, modType, modId - 1, false);
}
*/
/*
function toogleMod([modType, bool]) {
    setCamPos(-160, 1);
    native.toggleVehicleMod(veh, modType, bool);
}
*/
/*
function setAllMod(data) {
    //for (let modType=0 ; modType < data.length ; modType++) {
    data.forEach((mod, modType) => {
        switch (modType) {
            //  case 17: ??
            case 18: //Turbo
                //  case 19: ??
                //  case 20: //Custom Tires Smoke
                //  case 21: ??
                //  case 22: //Xenon
                toogleMod(mod);
                break;

            case 48:
                native.setVehicleLivery(veh, mod);
                break;

            default:
                setMod(mod);
                break;
        }
    });
}
*/
/*
function getModsData() {
    const n = modList.length;
    let data = [];
    for (let modType = 0; modType < n; modType++) {
        //native.preloadVehicleMod(veh, modType, 1)
        switch (modType) {
            //  case 17: ??
            case 18:
                //  case 19: ??
                //  case 20: custom tires
                //  case 21: ??
                //  case 22: xenon
                const toogle = native.isToggleModOn(veh, modType);
                data.push([modType, toogle]);
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
                const num = native.getVehicleMod(veh, modType) + 1;
                const count = native.getNumVehicleMods(veh, modType);
                console.log(native.getModSlotName(veh, modType));
                data.push([modType, num, count]);
                break;
            default:
                continue;
        }
    }
    return data;
}
*/
//  const wheelsFront = 23; // Front Wheels
//  const wheelsRear = 24; // Rear Wheels (Motorcycles)
/*
function getWheelsData() {
    const wheelType = native.getVehicleWheelType(veh);
    const wheelNum = native.getVehicleMod(veh, wheelsFront) + 1;
    //  console.log(native.getVehicleMod(veh, wheelsFront), native.getVehicleMod(veh, wheelsRear));
    const wheelColor = native.getVehicleExtraColours(veh, 1, 1)[2]; //  [void, pearl, color]
    const drift = native.getDriftTyresSet(veh);
    return { wheelType, wheelNum, wheelColor, drift };
}
*/
/*
function setWheels({ wheelType, wheelNum, wheelColor, drift }) {
    const customWheels = native.getVehicleModVariation(veh, wheelsFront);
    native.setVehicleWheelType(veh, wheelType);
    native.setVehicleMod(veh, wheelsFront, wheelNum - 1, customWheels);
    const pearl = native.getVehicleExtraColours(veh, 1, 1)[1]; //  [void, pearl, color]
    native.setVehicleExtraColours(veh, pearl, wheelColor);
    native.setDriftTyres(veh, drift);
}
*/
/*
function getWheelsExtra() {
    const camber = parseFloat(veh.getWheelCamber(0).toFixed(2));
    const track = [veh.getWheelTrackWidth(0), veh.getWheelTrackWidth(2)].map((value) => parseFloat(value.toFixed(2))); //  [Front, Rear]
    return { camber, track };
}
*/
/*
function setWheelsExtra({ camber, track }) {
    console.log(camber);
    console.log(veh.wheelsCount);
    for (let wheelId = 0; wheelId < veh.wheelsCount; wheelId++) {
        console.log(wheelId, camber, track);
        veh.setWheelCamber(wheelId, camber);
        const i = native.floor(wheelId / 2);
        const width = track[i] || track[i - 1];
        veh.setWheelTrackWidth(wheelId, width);
    }
}
*/
/*
function getColors() {
    let [serverPrimary, serverSecondary] = native.getVehicleColours(veh).splice(1, 2);
    let [type1, color1] = native.getVehicleModColor1(veh).splice(1, 2); //  [void, paintType, color, pearl(client-side)]
    let [type2, color2] = native.getVehicleModColor2(veh).splice(1, 2); //  [void, paintType, color]
    const pearl = native.getVehicleModColor1(veh)[3]; //  [void, colorType, colorNum, pearl(client-side)]
    if (type1 == 7 || color1 == -1) {
        [type1, color1] = serverColors[serverPrimary].client;
        [type2, color2] = serverColors[serverSecondary].client;
    }
    const primary = { colorType: type1, colorNum: color1, pearl };
    const secondary = { colorType: type2, colorNum: color2 };
    return { primary, secondary };
}
*/
/*
function getServerColors() {
    const [primary, secondary] = native.getVehicleColours(veh).splice(1, 2);
    const pearl = native.getVehicleExtraColours(veh)[1]; //  [void, pearl(server-side), color(wheels)]
    return { primary, secondary, pearl };
}
*/
/*
function setColors({ primary, secondary }) {
    native.setVehicleModColor1(veh, primary.colorType, primary.colorNum, primary.pearl);
    native.setVehicleModColor2(veh, secondary.colorType, secondary.colorNum);
    const wheelColor = native.getVehicleExtraColours(veh, 1, 1)[2]; //  [void, pearl, wheelColor]
    native.setVehicleExtraColours(veh, primary.pearl, wheelColor);
}
*/
/*
function getExtraColors() {
    let xenon = native.getVehicleXenonLightColorIndex(veh) + 2;
    xenon = xenon < 15 ? xenon : 0;
    const window = native.getVehicleWindowTint(veh);
    const tireSmoke = native.getVehicleTyreSmokeColor(veh);

    //  data.interior = native.getVehicleInteriorColor(veh,)[1]
    //  data.dash = native.getVehicleDashboardColor(veh,)[1]

    //interior native.setVehicleExtraColour5()
    //dash native.setVehicleExtraColour6()

    return { xenon, window, tireSmoke };
}
*/
/*
function setExtraColors({ xenon, window }) {
    native.toggleVehicleMod(veh, 22, xenon != 0);
    native.setVehicleXenonLightColorIndex(veh, xenon - 2);
    native.setVehicleWindowTint(veh, window);
    //  native.setVehicleTyreSmokeColor(veh, 255, 255, 255)
}
*/
/*
function getNeons() {
    let enabled = native.getVehicleNeonEnabled(veh, 0);
    let color = native.getVehicleNeonColour(veh).splice(1, 3); //[void, int, int, int]
    color = new alt.RGBA(color);
    return { color, enabled };
}
*/
/*
function setNeons({ enabled, color }) {
    native.suppressNeonsOnVehicle(veh, false);
    for (let i = 0; i < 4; i++) native.setVehicleNeonEnabled(veh, i, enabled);
    native.setVehicleNeonColour(veh, color.r, color.g, color.b);
}
*/
/*
function getPlate() {
    let plateIndex = native.getVehicleNumberPlateTextIndex(veh);
    let plateText = native.getVehicleNumberPlateText(veh);
    return { plateIndex, plateText };
}
*/
/*
function setPlate({ plateIndex, plateText }) {
    native.setVehicleNumberPlateTextIndex(veh, plateIndex);
    native.setVehicleNumberPlateText(veh, plateText);
}
*/

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
//      alt.emit("webview:open", webview)
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
//      alt.emit("webview:open", webview)
//  }
