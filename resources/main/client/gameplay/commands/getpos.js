import * as alt from "alt-client";

const player = alt.Player.local;

alt.onServer("command:getpos", () => {
    const pos = (player.vehicle?.pos ?? player.pos).toFixed(2);
    alt.copyToClipboard(pos.toArray().toString());
    player.sendNotification({
        imageName: "CHAR_MP_FM_CONTACT",
        headerMsg: "Position",
        detailsMsg: "Voici votre position actuelle",
        message: `~g~x: ~w~${pos.x}\n~r~y: ~w~${pos.y}\n~b~z: ~w~${pos.z}\n\n~c~Copié dans le presse-papier`,
        duration: 7,
    });
});
