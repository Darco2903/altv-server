import * as alt from "alt-client";
import * as native from "natives";

const CTaskEnterVehicle = 160;

const player = alt.Player.local;

function getClosestVehicleDoor(vehicle) {
    let closestDistance;
    let closestDoor;
    const numberOfDoors = native.getNumberOfVehicleDoors(vehicle);
    for (let i = 0; i < numberOfDoors; i++) {
        const distance = player.pos.distanceTo(native.getEntryPointPosition(vehicle, i));
        if (!closestDistance || distance < closestDistance) {
            closestDistance = distance;
            closestDoor = i;
        }
    }
    return closestDoor - 1;
}

alt.on("taskChange", (oldTask, newTask) => {
    if (newTask !== CTaskEnterVehicle) return;
    const vehicle = alt.Utils.getClosestVehicle({ pos: player.pos });
    const door = getClosestVehicleDoor(vehicle);
    const TIMEOUT = 10_000;
    native.taskEnterVehicle(player, vehicle, TIMEOUT, door, 1.0, 1, "NULL", 0);
    const entering = (v) => {
        // console.log("startEnteringVehicle", v);
        alt.clearEveryTick(tick);
        if (vehicle !== v) throw new Error("Wrong vehicle");
    };

    alt.once("startEnteringVehicle", entering);
    const tick = alt.everyTick(() => {
        switch (true) {
            case native.isControlPressed(0, 22): // INPUT_JUMP
            // case native.isControlPressed(0, 32): // INPUT_MOVE_UP_ONLY
            case native.isControlPressed(0, 33): // INPUT_MOVE_DOWN_ONLY
            // case native.isControlPressed(0, 34): // INPUT_MOVE_LEFT_ONLY
            // case native.isControlPressed(0, 35): // INPUT_MOVE_RIGHT_ONLY
                // alt.log("canceling enter vehicle task");
                alt.clearEveryTick(tick);
                native.clearPedTasks(player);
                alt.off("startEnteringVehicle", entering);
                break;
        }
    });
});
