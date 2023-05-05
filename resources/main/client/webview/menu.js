import * as alt from "alt-client";
import * as native from "natives";

import armory from "./armory.js";
import model from "./model.js";
import * as nametag from "../nametag.js";
import spawner from "./spawner.js";
import trackEditor from "./trackEditor.js";
import tuner from "./tuner.js";

let player = alt.Player.local;

let view = new alt.WebView("http://resource/client/webview/menu/index.html");
view.isVisible = false;

view.on("event", (id, state) => {
    switch (id) {
        case "spawner":
            view.toggle(false);
            spawner.toggle(true);
            break;

        case "tuner":
            view.toggle(false);
            tuner.toggle(true);
            break;

        case "repair":
        case "despawn":
        case "register":
        case "delete":
            alt.emitServer(`vehicle:${id}`, player.vehicle);
            view.toggle(false);
            break;

        case "model":
            view.toggle(false);
            model.toggle(true);
            break;

        case "armory":
            view.toggle(false);
            armory.toggle(true);
            break;

        case "trackEditor":
            view.toggle(false);
            trackEditor.toggle(true);
            break;

        case "nametag":
            nametag.display(state);
            break;
    }
});

function updateWebview() {
    view.emit("vehicle", !!player.vehicle);
    view.emit("vehicleHasId", player.vehicle?.hasSyncedMeta("id"));
    view.emit("nametag", alt.getMeta("displayNametag"));
}

// alt.on("enteredVehicle", switchControls);
// alt.on("leftVehicle", switchControls);

view.toggle = function (state) {
    if (state && !view.isVisible) {
        updateWebview();
        view.centerPointer();
        alt.Utils.toggleOnlyMove(true);
        view.open();
    } else if (!state && view.isVisible) {
        alt.Utils.toggleOnlyMove(false);
        view.close();
    }
};

export default view;
