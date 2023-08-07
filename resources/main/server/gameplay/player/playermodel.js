import * as alt from "alt-server";

alt.onClient("playermodel:set", (player, hash) => {
    const vehicle = player.vehicle;
    const seat = player.seat;

    player.model = hash;

    if (vehicle && seat) {
        player.setIntoVehicle(vehicle, seat);
    }
});
