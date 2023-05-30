import * as alt from "alt-server";

alt.Vehicle.clear = function () {
    alt.Vehicle.all.forEach((vehicle) => {
        if (!vehicle.driver) {
            vehicle.destroy();
        }
    });
    alt.log("~g~All unused vehicles have been cleared");
};

alt.Vehicle.clearAll = function () {
    alt.Vehicle.all.forEach((vehicle) => {
        vehicle.destroy();
    });
    alt.log("~g~All vehicles have been cleared");
};
