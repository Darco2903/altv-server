import * as alt from "alt-server";

function createHunterCar(player) {
    const pos = new alt.Vector3(825.07, -3061.98, 5.57);
    const rot = new alt.Vector3(0, 0, -1.56);
    player.pos = pos;
    // random issi spawn 2 - 9
    const car = new alt.Vehicle("issi2", pos, rot);
    car.engineOn = true;
    car.numberPlateText = "HUNTER";
    car.setMeta("upn:hunter", "");
    player.setIntoVehicle(car, 1);
}

function getAllCars() {
    return alt.Vehicle.all.filter((veh) => veh.hasMeta("upn:hunter"));
}

function cleanup() {
    getAllCars().forEach((veh) => veh.destroy());
}

alt.on("upn:cleanup", cleanup);

export { createHunterCar };
