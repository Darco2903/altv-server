import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;
let updateTick;
let speedo = new alt.WebView("http://resource/hud.html", false);

function toogle(state) {
    speedo.isVisible = state;
    if (state && player.vehicle && !updateTick) {
        updateTick = alt.everyTick(() => {
            native.hideStreetAndCarNamesThisFrame();
            speedo.emit("updateHUD", {
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

toogle(player.vehicle);

alt.on("enteredVehicle", (vehicle, seat) => {
    toogle(true);
});

alt.on("leftVehicle", (vehicle, seat) => {
    toogle(false);
});
