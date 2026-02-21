alt.Utils.Chat.registerCmd({
    name: "livery",
    args: [
        {
            name: "livery",
            description: "Livery ID",
            type: "number",
            required: true,
        },
    ],
    description: "Change vehicle livery",
    permissionLevel: 3,
    execute(player, [livery]) {
        if (!player.vehicle) {
            player.sendNotification({
                imageName: "CHAR_BLOCKED",
                headerMsg: "/livery",
                message: "Vous devez être dans un véhicule.",
            });
            return;
        }

        if (isNaN(livery)) {
            player.sendNotification({
                imageName: "CHAR_BLOCKED",
                headerMsg: "/livery",
                message: "L'ID de la livrée est invalide.",
            });
            return;
        }

        player.vehicle.livery = livery;
    },
});
