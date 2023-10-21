import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;
const vehType = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 17, 18, 20, 22];

alt.on("resourceStart", () => {
    alt.emit("drivingCar", player.seat === 1 && vehType.includes(native.getVehicleClass(player.vehicle)));
});

alt.on("enteredVehicle", (vehicle, seat) => {
    if (vehType.includes(native.getVehicleClass(vehicle)) && seat === 1) {
        alt.emit("drivingCar", true);
    }
});

alt.on("leftVehicle", (vehicle, seat) => {
    if (vehType.includes(native.getVehicleClass(vehicle)) && seat === 1) {
        alt.emit("drivingCar", false);
    }
});

alt.on("changedVehicleSeat", (vehicle, oldSeat, seat) => {
    if (vehType.includes(native.getVehicleClass(vehicle))) {
        if (seat === 1) {
            alt.emit("drivingCar", true);
        } else if (oldSeat === 1) {
            alt.emit("drivingCar", false);
        }
    }
});
