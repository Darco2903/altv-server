import * as alt from "alt-server";

alt.Vehicle.clearAll = function () {
    alt.Vehicle.all.forEach((vehicle) => {
        vehicle.destroy();
    });
    alt.log("~g~All vehicles have been cleared");
};
