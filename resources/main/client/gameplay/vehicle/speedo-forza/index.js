import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;
const vehType = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 17, 18, 20];
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
                abs: native.isControlPressed(0, 72),
                handbrake: +native.isControlPressed(0, 76) * 2,
            });
        });
    } else if (updateTick) {
        alt.clearEveryTick(updateTick);
        updateTick = null;
    }
}

alt.on("resourceStart", () => {
    toggle(!!player.vehicle && vehType.includes(native.getVehicleClass(player.vehicle)));
});

alt.on("enteredVehicle", (vehicle, seat) => {
    if (vehType.includes(native.getVehicleClass(vehicle))) {
        toggle(true);
    }
});

alt.on("leftVehicle", (vehicle, seat) => {
    if (vehType.includes(native.getVehicleClass(vehicle))) {
        toggle(false);
    }
});
