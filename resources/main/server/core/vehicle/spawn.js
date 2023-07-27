import * as alt from "alt-server";

alt.Vehicle.spawn = function (model, pos, rot, { engineOn = false, passengers = [] } = {}) {
    const vehicle = new alt.Vehicle(model, pos, rot);
    vehicle.manualEngineControl = true;
    vehicle.modKit = +(vehicle.modKitsCount > 0);
    vehicle.engineOn = engineOn;
    passengers.forEach((p, i) => p.setIntoVehicle(vehicle, i + 1));
    return vehicle;
};

alt.onClient("vehicle:spawn", (player, model, pos, rot, { engineOn, passengers }) => alt.Vehicle.spawn(model, pos, rot, { engineOn, passengers }));

alt.Vehicle.prototype.replace = async function (model) {
    const passengers = alt.Player.all.filter((p) => p.vehicle == this).sort((p1, p2) => p1.seat - p2.seat);
    const vehicle = alt.Vehicle.spawn(model, this.pos, this.rot, { engineOn: this.engineOn, passengers });
    alt.Player.all
        .filter((p) => p.pos.distanceTo(this.pos) < 100)
        .concat(passengers)
        .forEach((p) => {
            alt.emitClient(p, "vehicle:replace", this, vehicle);
        });
    await alt.Utils.wait(1000);
    this.destroy();
};

alt.onClient("vehicle:replace", (player, vehicle, model) => vehicle.replace(model));
