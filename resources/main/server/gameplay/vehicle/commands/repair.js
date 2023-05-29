import * as alt from "alt-server";

alt.Utils.Chat.registerCmd({
    name: "repair",
    description: "Réparer le véhicule",
    execute(player) {
        if (!player.vehicle) {
            player.sendNotification({
                imageName: "CHAR_BLOCKED",
                headerMsg: "Erreur",
                detailsMsg: "/repair",
                message: "Vous devez être dans un véhicule pour utiliser cette commande.",
            });
            return;
        }
        player.vehicle.repair();
        player.sendNotification({
            imageName: "CHAR_CARSITE",
            message: "Votre véhicule a été réparé.",
        });
    },
});
