import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;
let updateTick;
let view = new alt.WebView("http://resource/client/webview/speedo-forza/index.html", true);

view.toggle = function (state) {
    view.isVisible = state;
    if (state && player.vehicle && !updateTick) {
        updateTick = alt.everyTick(() => {
            native.hideStreetAndCarNamesThisFrame();
            view.emit("updateHUD", {
                rpm: (player.vehicle.rpm * 9).toFixed(2),
                speed: player.vehicle.speed * 3.6,
                gear: player.vehicle.gear,
                abs: native.isControlPressed(0, 72),
                handbrake: +native.isControlPressed(0, 76) * 2,
            });
        });
    } else if (updateTick) {
        alt.clearEveryTick(updateTick);
        updateTick = null;
    }
};

alt.on("spawned", () => {
    view.toggle(!!player.vehicle);
});

alt.on("resourceStart", () => {
    view.toggle(!!player.vehicle);
});

alt.on("enteredVehicle", (vehicle, seat) => {
    view.toggle(true);
});

alt.on("leftVehicle", (vehicle, seat) => {
    view.toggle(false);
});

export default view;
