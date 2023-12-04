import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;
let updateTick;

const view = new alt.WebView("http://resource/client/gameplay/vehicle/speedo-forza/browser/index.html", true);
view.isVisible = false;

function toggle(state) {
    view.isVisible = state;
    if (state && player.vehicle && !updateTick) {
        updateTick = alt.everyTick(() => {
            native.hideStreetAndCarNamesThisFrame();
            updateSpeedo();
        });
    } else if (updateTick) {
        alt.clearEveryTick(updateTick);
        updateTick = null;
    }
}

function isEngineIdling() {
    return player.vehicle.rpm.toFixed(2) == 0.2;
}

function isEngineRedlining() {
    return player.vehicle.rpm.toFixed(2) == 1 && native.isControlPressed(0, 71) && player.vehicle.gear !== player.vehicle.maxGear && player.vehicle.gear !== 0;
}

function convertRPM(rpm) {
    return (rpm * 9).toFixed(2);
}

let dropRPM = 0;
let rpmdrop = false;
let rpmdroped = true;
let dropSpeed = 0.01;
let redlineRPM = 1;
let redlineRPMSwitch = false;

function calcRPM() {
    if (player.vehicle.engineOn) {
        rpmdroped = false;
        rpmdrop = false;
        if (isEngineRedlining()) {
            if (redlineRPM >= 1) redlineRPMSwitch = true;
            else if (redlineRPM <= 0.9) redlineRPMSwitch = false;
            if (redlineRPMSwitch) redlineRPM -= 0.03;
            else redlineRPM += 0.03;
            return convertRPM(redlineRPM);
        }
        return convertRPM(player.vehicle.rpm);
    } else if (!rpmdrop) {
        dropRPM = player.vehicle.rpm;
        if (isEngineIdling()) {
            setTimeout(() => (rpmdrop = true), 400);
            dropSpeed = 0.01;
        } else {
            rpmdrop = true;
            dropSpeed = 0.0036;
        }
        return convertRPM(player.vehicle.rpm);
    }
    if (!rpmdroped) {
        if (dropRPM > 0) {
            dropRPM -= dropSpeed;
            return convertRPM(dropRPM);
        } else {
            rpmdroped = true;
        }
    }
    return 0;
}

function clutchState() {
    return !player.vehicle.engineOn || (player.vehicle.gear <= 1 && (isEngineIdling() || player.vehicle.speed < 0.1 || native.isControlPressed(0, 76)));
}

function updateSpeedo() {
    view.emit("updateHUD", {
        rpm: calcRPM(),
        speed: player.vehicle.speed * 3.6,
        gear: clutchState() ? -1 : player.vehicle.gear,
        handbrake: native.isControlPressed(0, 76),
        // fuel: player.vehicle.fuelLevel,
        // oil: player.vehicle.oilLevel,
    });
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
