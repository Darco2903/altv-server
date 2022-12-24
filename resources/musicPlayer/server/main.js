import * as alt from "alt-server";
import * as chat from "chat";
import "./VehicleMusic";

alt.on("playerEnteredVehicle", (player, vehicle, seat) => vehicle.playerEnter(player));
alt.on("playerLeftVehicle", (player, vehicle, seat) => vehicle.playerLeft(player));
alt.on("playerDisconnect", (player) => {
    if (player.vehicle) player.vehicle.playerLeft(player);
});
alt.on("resourceStart", () => {
    alt.Vehicle.all.forEach((veh) => veh.initMusic());
    alt.Player.all.forEach((player) => {
        if (player.vehicle) player.vehicle.addPassenger(player);
    });
});

alt.on("resourceStop", () => alt.Vehicle.all.forEach((veh) => veh.updateMeta()));

alt.onClient("musicPlayer:ready", (player) => alt.emitClient(player, "musicPlayer:init", player.vehicle.music));

function inVeh(player) {
    let veh = !!player.vehicle;
    if (!veh) alt.emitClient(player, "notification", "command", "Entrez dans un véhicule");
    return veh;
}

chat.registerCmd("play", (player, [id]) => {
    let veh = player.vehicle;
    if (!inVeh(player)) return;
    else if (!id) {
        if (!veh.music.isPlaying()) alt.emitClient(player, "notification", "command", "Rien à jouer\n/load [id]");
        else veh.play();
    } else if (!veh.music.isPlaying()) veh.load(id);
    //  else veh.cueLoad(id);
});

//  chat.registerCmd("resume", (player) => {
//      if (!inVeh()) return;
//      let veh = player.vehicle;
//      if (veh.isMusic() && veh.music.state == 2) veh.resume();
//  });

chat.registerCmd("stop", (player) => player.vehicle.stop());
chat.registerCmd("pause", (player) => player.vehicle.pause());

chat.registerCmd("seek", (player, [time]) => {
    if (!inVeh(player)) return;
    else if (!time || isNaN(time)) {
        alt.emitClient(player, "notification", "command", "/seek [time seconde]");
        return;
    }
    let veh = player.vehicle;
    veh.seek(time);
});

chat.registerCmd("volume", (player, [volume]) => {
    if (!volume || isNaN(volume)) {
        alt.emitClient(player, "notification", "command", "/volume [0-100]");
        return;
    }
    let veh = player.vehicle;
    if (!veh) {
        alt.emitClient(player, "notification", "command", "Entrez dans un véhicule");
        return;
    }
    veh.volume(volume);
});
