import * as alt from "alt-client";
import * as native from "natives";
import * as types from "../prototype/Vehicle/index.js";

const player = alt.Player.local;
let appLoaded;

let view = new alt.WebView("http://resource/client/webview/tuner/index.html", false);
view.isVisible = false;

view.on("startApp", startApp);
view.on("exit", () => view.toggle(false));
view.on("restore", () => {
    player.vehicle.restore();
    refreshApp();
});
view.on("stock", () => {
    player.vehicle.setStock();
    refreshApp();
});
view.on("setMod", (modType, modId) => player.vehicle.setMod(modType, modId));
view.on("toogleMod", (modType, state) => player.vehicle.toggleMod(modType, state));
view.on("setWheels", (wheelsData) => player.vehicle.setWheels(wheelsData));
view.on("setColors", (colorsData) => player.vehicle.setColors(colorsData));
view.on("setNeons", (neonsData) => player.vehicle.setNeons(neonsData));
view.on("setPlate", (plateData) => player.vehicle.setPlate(plateData));

/**
 * @param {number} heading
 * @param {number} pitch
 * @param {number} scalingFactor
 */
function setCamPos(heading, pitch, scalingFactor = 0.5) {
    //  console.log(heading, pitch);
    native.setGameplayCamRelativeHeading(heading);
    native.setGameplayCamRelativePitch(pitch, scalingFactor);
    view.emit("lookUpdate", heading, -pitch);
}

/**
 * @param {string} app
 */
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
    }
}

view.toggle = function (state) {
    const veh = player.vehicle;
    if (state && !view.isVisible) {
        veh.setMeta("speed", native.getEntitySpeed(veh));
        veh.setMeta("storedData", veh.getAllMods());
        startApp("mods");
        alt.Utils.toggleTunerControls(true);
        view.open();
    } else if (!state && view.isVisible) {
        alt.Utils.toggleTunerControls(false);
        view.close();
        view.emit("exit");
        const speed = veh.getMeta("speed");
        native.setVehicleForwardSpeed(veh, speed);
        const pitch = native.getGameplayCamRelativePitch();
        const heading = speed > 1 ? 0 : native.getGameplayCamRelativeHeading();
        setCamPos(heading, pitch + 2, 1); //  Remove slow effect
        veh.deleteMeta("speed");
        veh.deleteMeta("storedData");
        veh.getAllModsServer();
    }
};

/**
 * @param {string} app
 * @returns {types.colorsData|types.modData|types.neonData|types.plateData|types.wheelsData|undefined}
 */
function dataByApp(app) {
    switch (app) {
        case "colors":
            return player.vehicle.getColorsData();

        case "mods":
            player.vehicle.getModsData().forEach((mod) => {
                console.log(mod.name, mod.modType);
            });
            return player.vehicle.getModsData();

        case "neons":
            return player.vehicle.getNeonsData();

        case "plate":
            return player.vehicle.getPlateData();

        case "wheels":
            const vehClass = native.getVehicleClass(player.vehicle);
            if ([13, 14, 15, 16, 21].includes(vehClass)) return; // Cycles Boats Helicopters Planes Trains
            return player.vehicle.getWheelsData();

        default:
            alt.log(`cant load: ${app}`);
            return;
    }
}

/**
 * @param {string} app
 */
function startApp(app) {
    appLoaded = app;
    alt.log("startApp: ", app);
    const data = dataByApp(app);
    if (!data) return;
    view.emit("app", app, data);
    camByApp(app);
}

function refreshApp() {
    const data = dataByApp(appLoaded);
    view.emit("app", appLoaded, data);
}

export default view;
