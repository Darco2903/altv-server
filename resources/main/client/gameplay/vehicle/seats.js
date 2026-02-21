import * as alt from "alt-client";
import * as native from "natives";

const APP_NAME = "vehicleSeats";
const defaultKeys = {
    change: 223, // !
};
const manager = new alt.Utils.InputManager(APP_NAME, defaultKeys);
const CTaskInVehicleSeatShuffle = 165;

const player = alt.Player.local;

let isChangingSeat = false;

alt.on("enteredVehicle", () => {
    native.setPedConfigFlag(player, 184, true); // PreventAutoShuffleToDriversSeat
    native.setPedConfigFlag(player, 360, true); // PreventAutoShuffleToTurretSeat
    native.setPedConfigFlag(player, 366, false); // AllowAutoShuffleToDriversSeat
    native.setPedConfigFlag(player, 431, true); // DisableTurretOrRearSeatPreference
    native.setPedConfigFlag(player, 445, true); // DontShuffleInVehicleToMakeRoom
});

alt.on("keydown", async (key) => {
    if (key === manager.keys.change) {
        if (!player.vehicle || isChangingSeat) return;
        isChangingSeat = true;
        native.taskShuffleToNextVehicleSeat(player, player.vehicle, false);
        await alt.Utils.waitFor(() => !native.getIsTaskActive(player, CTaskInVehicleSeatShuffle), 5000);
        isChangingSeat = false;
    }
});
