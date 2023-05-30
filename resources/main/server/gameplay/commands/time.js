import * as alt from "alt-server";

const syntaxe = {
    imageName: "CHAR_DEFAULT",
    headerMsg: "Help",
    detailsMsg: "/time",
    message: "/time [day | night | start | resume | stop | pause ]\n/time set [0-23]\n/time speed [1-100]",
    duration: 10,
};

const syntaxeErrorSet = {
    imageName: "CHAR_BLOCKED",
    headerMsg: "Erreur",
    detailsMsg: "/time set",
    message: "Syntaxe invalide\n/time set [0-23]",
    duration: 10,
};

const syntaxeErrorSpeed = {
    imageName: "CHAR_BLOCKED",
    headerMsg: "Erreur",
    detailsMsg: "/time speed",
    message: "Syntaxe invalide\n/time speed [1-100]",
    duration: 10,
};

alt.Utils.Chat.registerCmd({
    name: "time",
    description: "Set the time",
    permissionLevel: 2,
    args: [
        {
            name: "subcommand",
            description: "The subcommand to use",
            required: true,
            values: ["day", "night", "set", "get", "start", "resume", "stop", "pause", "speed", "help"],
        },
        {
            name: "value",
            description: "The subcommand value",
            required: false,
        },
    ],
    execute(player, [subcommand, value, minutes]) {
        switch (subcommand) {
            case "day":
            case "night":
            case "set":
                let hour;
                if (!isNaN(value)) {
                    hour = parseInt(value);
                    if (hour < 0 || hour > 23) {
                        player.sendNotification(syntaxeErrorSet);
                        return;
                    }
                } else if (subcommand === "day") {
                    hour = 12;
                } else if (subcommand === "night") {
                    hour = 0;
                } else {
                    player.sendNotification(syntaxeErrorSet);
                    return;
                }
                alt.Utils.Clock.setTime(hour, parseInt(minutes) || 0);
                alt.Player.sendNotification(alt.Player.all, {
                    imageName: "CHAR_DEFAULT",
                    headerMsg: "Time",
                    message: `Changement d'heure, il est maintenant ${hour}h00`,
                    duration: 3,
                });
                break;

            case "start":
            case "resume":
                alt.Utils.Clock.start();
                alt.Player.sendNotification(alt.Player.all, {
                    imageName: "CHAR_DEFAULT",
                    headerMsg: "Time",
                    message: `L'horloge est démarrée`,
                    duration: 3,
                });
                break;

            case "stop":
            case "pause":
                alt.Utils.Clock.stop();
                alt.Player.sendNotification(alt.Player.all, {
                    imageName: "CHAR_DEFAULT",
                    headerMsg: "Time",
                    message: `L'horloge est arrêtée`,
                    duration: 3,
                });
                break;

            case "speed":
                if (isNaN(value) || value < 1 || value > 100) {
                    player.sendNotification(syntaxeErrorSpeed);
                    return;
                }
                alt.Utils.Clock.speed = parseInt(value);
                alt.Player.sendNotification(alt.Player.all, {
                    imageName: "CHAR_DEFAULT",
                    headerMsg: "Time",
                    message: `L'horloge tourne à ${value}x sa vitesse normale`,
                    duration: 3,
                });
                break;

            case "get":
                player.sendNotification({
                    imageName: "CHAR_DEFAULT",
                    headerMsg: "Time",
                    message: `Il est actuellement ${alt.Utils.Clock.hour}h${alt.Utils.Clock.minute}m`,
                    duration: 5,
                });
                break;

            case "help":
            default:
                player.sendNotification(syntaxe);
                break;
        }
    },
});
