import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;
let updateTick;

const view = new alt.WebView("http://resource/client/gameplay/vehicle/plane-hud/index.html", true, new alt.Vector2(0, 0), new alt.Vector2(4500, 2500));
view.isVisible = false;

alt.on("enteredVehicle", (vehicle) => {
    if (isVehicleAPlane(vehicle)) {
        toggle(true);
    }
});

alt.on("leftVehicle", (vehicle) => {
    if (isVehicleAPlane(vehicle)) {
        toggle(false);
    }
});

alt.on("resourceStart", () => {
    if (player.vehicle && isVehicleAPlane(player.vehicle)) {
        toggle(true);
    }
});

/**
 * @param {alt.Vehicle} vehicle
 * @returns {boolean}
 */
function isVehicleAPlane(vehicle) {
    return native.isThisModelAPlane(vehicle.model);
}

function isFlying(vehicle) {
    return native.getEntityHeightAboveGround(vehicle) > 5 || native.getEntitySpeed(vehicle) > 5;
}

function toggle(state) {
    view.isVisible = state;
    const vehicle = player.vehicle;
    if (state && !updateTick) {
        // native.setEntityMaxSpeed(vehicle, 9999);
        updateTick = alt.everyTick(() => {
            view.emit("updateHorizon", vehicle.rot);

            let engineState = -1;
            switch (true) {
                case vehicle.engineLight:
                    engineState = 0;
                    break;

                case vehicle.engineOn:
                    engineState = -1;
                    break;

                case !vehicle.engineOn && isFlying(vehicle) && native.isControlPressed(0, 88) && !alt.getMeta("noclip:active"): // INPUT_VEH_FLY_THROTTLE_DOWN
                    native.setVehicleEngineOn(vehicle, true, true, true);

                case !vehicle.engineOn && isFlying(vehicle):
                    engineState = 2;
                    break;

                case !vehicle.engineOn:
                    engineState = 1;
                    break;
            }
            view.emit("updateEngine", engineState);

            const entitySpeed = native.getEntitySpeed(vehicle);
            const speed = parseInt(entitySpeed * 1.943);
            view.emit("updateSpeed", speed);

            const groundHeight = native.getEntityHeightAboveGround(vehicle);
            const altitude = parseInt(groundHeight * 3.281);
            view.emit("updateAltitude", altitude);
            view.emit("updateGear", !native.isPlaneLandingGearIntact(vehicle) ? 0 : native.getLandingGearState(vehicle) > 0 ? 1 : 2);

            const maxSpeed = native.getVehicleEstimatedMaxSpeed(vehicle);
            if (speed > maxSpeed - 10 && speed < maxSpeed) {
                native.setEntityMaxSpeed(vehicle, 9999);
            }

            // landing gear
            // if (native.isControlJustPressed(0, 113)) {
            //     alt.emit()
            // }
        });
    } else {
        alt.clearEveryTick(updateTick);
        updateTick = null;
    }
}

let task = false;
alt.on("keyup", async (key) => {
    // console.log(native.getVehicleEstimatedMaxSpeed(player.vehicle));
    // console.log(native.getVehicleModelEstimatedMaxSpeed(player.vehicle.model));
    // alt.KeyCode.A
    // if (key === 65 && player.vehicle && isVehiclePlane(player.vehicle)) {
    //     // console.log(native.statGetFlyingAltitude(player.vehicle));
    //     if (!task) {
    //         console.log("landing init");
    //         task = true;
    //         // console.log("1");
    //         // const pos = new alt.Vector3(-707.77, -1140.31, 147.89);
    //         // native.taskVehicleDriveToCoord(player, player.vehicle, pos.x, pos.y, pos.z, 100, 0, player.vehicle.model, 0, 100, 10);
    //         // await new Promise((resolve) => {
    //         //     const interval = alt.setInterval(() => {
    //         //         if (player.vehicle.pos.distanceTo(pos) < 50) {
    //         //             alt.clearInterval(interval);
    //         //             resolve();
    //         //         }
    //         //     }, 500);
    //         // });
    //         // console.log("2");
    //         // const alignPos = new alt.Vector3(-947.2, -1549.6, 147.91);
    //         // native.taskVehicleDriveToCoord(player, player.vehicle, alignPos.x, alignPos.y, alignPos.z, 50, 0, player.vehicle.model, 1, 10, 10);
    //         // await new Promise((resolve) => {
    //         //     const interval = alt.setInterval(() => {
    //         //         if (player.vehicle.pos.distanceTo(alignPos) < 20) {
    //         //             alt.clearInterval(interval);
    //         //             resolve();
    //         //         }
    //         //     }, 500);
    //         // });
    //         native.taskPlaneLand(player, player.vehicle, -1208.79, -1988.67, 54.95, -1624.59, -2710.01, 13.95);
    //     } else {
    //         console.log("landing cancel");
    //         task = false;
    //         native.clearPedTasks(player);
    //     }
    // }
});
