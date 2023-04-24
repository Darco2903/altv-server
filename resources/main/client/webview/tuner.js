import * as alt from "alt-client";
import * as native from "natives";

// import "./controlsDisabler";
// import "./Vehicle";

const player = alt.Player.local;

let webview = new alt.WebView("http://resource/client/webview/tuner/index.html", false);
webview.isVisible = false;

webview.on("startApp", startApp);
webview.on("exit", close);
webview.on("restore", restoreAll);
webview.on("stock", setStock);
webview.on("setMod", (modType, modId) => player.vehicle.setMod(modType, modId));
webview.on("toogleMod", (modType, state) => player.vehicle.toggleMod(modType, state));
webview.on("setWheels", (wheelsData) => player.vehicle.setWheels(wheelsData));
webview.on("setColors", (colorsData) => player.vehicle.setColors(colorsData));
webview.on("setNeons", (neonsData) => player.vehicle.setNeons(neonsData));
webview.on("setPlate", (plateData) => player.vehicle.setPlate(plateData));

function setCamPos(heading, pitch, scalingFactor = 0.5) {
    //  console.log(heading, pitch);
    native.setGameplayCamRelativeHeading(heading);
    native.setGameplayCamRelativePitch(pitch, scalingFactor);
    webview.emit("lookUpdate", heading, -pitch);
}

function camByApp(app) {
    switch (app) {
        case "mods":
        case "colors":
            setCamPos(210, 0, 0.02);
            break;

        case "wheels":
            setCamPos(245, 10, 0.02);
            break;

        case "plate":
            setCamPos(0, 20, 0.02);
            break;

        default:
            break;
    }
}

function open() {
    webview.toggle(true);
    player.vehicle.storeData();
    alt.Utils.toggleTunerControls(true);
    native.freezeEntityPosition(player.vehicle, true);
    native.setVehicleLights(player.vehicle, 2); //  Enable lights
    startApp("mods");
}

function close() {
    webview.toggle(false);
    alt.Utils.toggleTunerControls(false);
    native.freezeEntityPosition(player.vehicle, false);
    const speed = player.vehicle.storedData.speed;
    native.setVehicleForwardSpeed(player.vehicle, speed);
    native.setVehicleLights(player.vehicle, 0); //  Release lights
    const pitch = native.getGameplayCamRelativePitch();
    const heading = speed > 1 ? 0 : native.getGameplayCamRelativeHeading();
    setCamPos(heading, pitch + 2, 1); //  Remove slow effect
    player.vehicle.storedData = null;
    sendModsToServer();
}
/**
 * @param {boolean} state
 */
export function toggle(state) {
    if (state && !webview.isVisible) {
        open();
    } else if (!state && webview.isVisible) {
        close();
    }
}

function dataByApp(app) {
    switch (app) {
        case "mods":
            return player.vehicle.getModsData();

        case "wheels":
            const vehClass = native.getVehicleClass(player.vehicle);
            if ([13, 14, 15, 16, 21].includes(vehClass)) return; // Cycles Boats Helicopters Planes Trains
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
    webview.app = app;
    alt.log("startApp: ", app);
    const data = dataByApp(app);
    if (!data) return;
    webview.emit("app", app, data);
    camByApp(app);
}

function refreshApp() {
    const data = dataByApp(webview.app);
    webview.emit("app", webview.app, data);
}

function sendModsToServer() {
    alt.emitServer("sendDataToServer", player.vehicle.getAllMods("server"));
}

function setStock() {
    player.vehicle.setStock();
    refreshApp();
}

function restoreAll() {
    player.vehicle.restore();
    refreshApp();
}

alt.on("webview:closeAll", () => {
    toggle(false);
});
