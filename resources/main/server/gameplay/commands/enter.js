import * as alt from "alt-server";

const DEFAULT_RANGE = 15;

alt.Utils.Chat.registerCmd({
    name: "enter",
    description: "Entrer dans un véhicule",
    args: [
        {
            name: "range",
            description: "La distance maximale pour entrer dans un véhicule",
            type: "number",
            required: false,
        },
    ],
    permissionLevel: 1,
    async execute(player, [range = DEFAULT_RANGE]) {
        if (player.vehicle) {
            player.sendNotification({
                imageName: "CHAR_BLOCKED",
                headerMsg: "Erreur",
                detailsMsg: "/" + this.name,
                message: "Vous êtes déjà dans un véhicule.",
                duration: 1,
            });
            alt.log("Player is already in a vehicle.");
            return;
        }

        if (range > 100) range = 100;
        const vehicle = alt.Utils.getClosestVehicle({ pos: player.pos, range });
        if (!vehicle) {
            player.sendNotification({
                imageName: "CHAR_BLOCKED",
                headerMsg: "Erreur",
                detailsMsg: "/" + this.name,
                message: "Aucun véhicule à proximité.",
                duration: 1,
            });
            alt.log("No vehicle nearby.");
            return;
        }
        alt.emitClient(player, "vehicle:enter", vehicle);
    },
});
