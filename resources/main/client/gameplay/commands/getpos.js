import * as alt from "alt-client";

const player = alt.Player.local;

alt.onServer("command:getpos", () => {
    const pos = (player.vehicle?.pos ?? player.pos).toFixed(2);
    alt.copyToClipboard(pos.toArray().toString());
    player.sendNotification({
        imageName: "CHAR_MP_FM_CONTACT",
        headerMsg: "Position Actuelle",
        detailsMsg: "~y~Copié dans le presse-papier",
        message: `~g~x: ~w~${pos.x}\n~r~y: ~w~${pos.y}\n~b~z: ~w~${pos.z}`,
        duration: 7,
    });
});

alt.onServer("command:getrot", () => {
    const rot = (player.vehicle?.rot ?? player.rot).toFixed(2);
    alt.copyToClipboard(rot.toArray().toString());
    player.sendNotification({
        imageName: "CHAR_MP_FM_CONTACT",
        headerMsg: "Rotation Actuelle",
        detailsMsg: "~y~Copié dans le presse-papier",
        message: `~g~x: ~w~${rot.x}\n~r~y: ~w~${rot.y}\n~b~z: ~w~${rot.z}`,
        duration: 7,
    });
});

alt.onServer("command:getposrot", () => {
    const pos = (player.vehicle?.pos ?? player.pos).toFixed(2);
    const rot = (player.vehicle?.rot ?? player.rot).toFixed(2);
    alt.copyToClipboard(`${pos.toArray().toString()}, ${rot.toArray().toString()}`);
    player.sendNotification({
        imageName: "CHAR_MP_FM_CONTACT",
        headerMsg: "Position et Rotation Actuelle",
        detailsMsg: "~y~Copié dans le presse-papier",
        message: `~g~x: ~w~${pos.x}\n~r~y: ~w~${pos.y}\n~b~z: ~w~${pos.z}\n~g~x: ~w~${rot.x}\n~r~y: ~w~${rot.y}\n~b~z: ~w~${rot.z}`,
        duration: 7,
    });
});
