import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;
let updateTick;

const view = new alt.WebView("http://resource/client/gameplay/vehicle/speedo-forza/index.html", true);
view.isVisible = false;

function toggle(state) {
    view.isVisible = state;
    if (state && player.vehicle && !updateTick) {
        updateTick = alt.everyTick(() => {
            native.hideStreetAndCarNamesThisFrame();
            view.emit("updateHUD", {
                rpm: (player.vehicle.rpm * 9).toFixed(2),
                speed: player.vehicle.speed * 3.6,
                gear: player.vehicle.gear,
                handbrake: native.isControlPressed(0, 76),
                // fuel: player.vehicle.fuelLevel,
                // oil: player.vehicle.oilLevel,
            });
        });
    } else if (updateTick) {
        alt.clearEveryTick(updateTick);
        updateTick = null;
    }
}

alt.on("abs:enable", (state) => {
    view.emit("abs:enable", state);
});

alt.on("abs:active", (active) => {
    view.emit("abs:active", active);
});

alt.on("esc:enable", (state) => {
    view.emit("esc:enable", state);
});

alt.on("esc:active", (active) => {
    view.emit("esc:active", active);
});

alt.on("tc:enable", (state) => {
    view.emit("tc:enable", state);
});

alt.on("tc:active", (active) => {
    view.emit("tc:active", active);
});

alt.on("speedController:enable", (state) => {
    view.emit("speedController:enable", state);
});

alt.on("speedController:active", (active) => {
    view.emit("speedController:active", active);
});

alt.on("speedController:speed", (speed) => {
    view.emit("speedController:speed", speed);
});

alt.on("drivingCar", toggle);
