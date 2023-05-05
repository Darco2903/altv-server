import * as alt from "alt-server";

const syntaxe = {
    imageName: "CHAR_DEFAULT",
    headerMsg: "Help",
    detailsMsg: "/time",
    message: "/time [day | night | start | resume | stop | pause ]\n/time set [0-23]\n/time speed [1-100]",
    duration: 1,
};

const syntaxeErrorSet = {
    imageName: "CHAR_BLOCKED",
    headerMsg: "Erreur",
    detailsMsg: "/time set",
    message: "Syntaxe invalide\n/time set [0-23]",
    duration: 1,
};

const syntaxeErrorSpeed = {
    imageName: "CHAR_BLOCKED",
    headerMsg: "Erreur",
    detailsMsg: "/time speed",
    message: "Syntaxe invalide\n/time speed [1-100]",
    duration: 1,
};

alt.Utils.registerCommand({
    name: "time",
    description: "Set the time",
    permissionLevel: 2,
    args: [
        {
            name: "subcommand",
            description: "The subcommand to use",
            required: true,
        },
        {
            name: "value",
            description: "The subcommand value",
            required: false,
        },
    ],
    execute(player, [subcommand, value, minutes]) {
        console.log(subcommand, value);
        switch (subcommand) {
            case "day":
            case "night":
            case "set":
                let hour;
                console.log(!isNaN(value));
                if (!isNaN(value)) {
                    hour = parseInt(value);
                    if (hour < 0 || hour > 23) {
                        player.notify(syntaxeErrorSet);
                        return;
                    }
                } else if (value === "day") {
                    hour = 12;
                } else if (value === "night") {
                    hour = 0;
                } else {
                    player.notify(syntaxeErrorSet);
                    return;
                }
                alt.Utils.clock.setTime(hour, parseInt(minutes) || 0);
                alt.Player.notifyAll({
                    imageName: "CHAR_DEFAULT",
                    headerMsg: "Time",
                    // detailsMsg: "/time",
                    message: `Changement d'heure, il est maintenant ${hour}h00`,
                });
                break;

            case "start":
            case "resume":
                alt.Utils.clock.start();
                alt.Player.notifyAll({
                    imageName: "CHAR_DEFAULT",
                    headerMsg: "Time",
                    // detailsMsg: "/time",
                    message: `L'horloge est démarrée`,
                });
                break;

            case "stop":
            case "pause":
                alt.Utils.clock.stop();
                alt.Player.notifyAll({
                    imageName: "CHAR_DEFAULT",
                    headerMsg: "Time",
                    // detailsMsg: "/time",
                    message: `L'horloge est arrêtée`,
                });
                break;

            case "speed":
                if (isNaN(value) || value < 1 || value > 100) {
                    player.notify(syntaxeErrorSpeed);
                    return;
                }
                alt.Utils.clock.setSpeed(parseInt(value));
                alt.Player.notifyAll({
                    imageName: "CHAR_DEFAULT",
                    headerMsg: "Time",
                    // detailsMsg: "/time",
                    message: `L'horloge tourne à ${value}x sa vitesse normale`,
                });
                break;

            case "help":
            default:
                player.notify(syntaxe);
                break;
        }
    },
});
