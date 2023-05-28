import * as alt from "alt-client";

alt.on("anyResourceStart", (resourceName) => {
    const player = alt.Player.local;
    if (player.hasPermission(4)) {
        player.sendNotification({
            imageName: "CHAR_MP_FM_CONTACT",
            headerMsg: resourceName,
            detailsMsg: `La ressource a bien redémarré.`,
            message: "",
            duration: 3,
        });
    }
});

alt.on("anyResourceStop", () => {
    alt.LocalStorage.save;
});

alt.on("disconnect", () => {
    alt.LocalStorage.save;
});
