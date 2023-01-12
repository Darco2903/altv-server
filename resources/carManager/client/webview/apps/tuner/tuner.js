import * as alt from "alt-client";
import * as native from "natives";

import "./Vehicle";

const player = alt.Player.local;

let webview = new alt.WebView("http://resource/client/webview/apps/tuner/index.html", false);
webview.isVisible = false;
webview.on("look", setCamPos);
webview.on("startApp", startApp);
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
        case "colors":
            setCamPos(210, 0, 0.02);
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

function open() {
    if (webview.isVisible) return;
    webview.toogle(true);
    alt.toggleGameControls(false);
    alt.on("keyup", keyHandler);
    player.vehicle.storeData();
    native.setVehicleLights(player.vehicle, 2); //  Enable lights
    startApp("mods");
}

function close() {
    if (!webview.isVisible) return;
    webview.toogle(false);
    alt.toggleGameControls(true);
    alt.off("keyup", keyHandler);
    const pitch = native.getGameplayCamRelativePitch();
    native.setGameplayCamRelativePitch(pitch + 2, 1); //  Remove slow effect
    native.setVehicleLights(player.vehicle, 0); //  Release lights
    player.vehicle.storedData = null;
    sendModsToServer();
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
