import * as alt from "alt-client";
import * as native from "natives";

alt.on("notification", notifHandler);
alt.onServer("notification", notifHandler);
function notifHandler(notif, name) {
    console.log(notif, name);
    switch (notif) {
        case "restartResource":
            notifRestartResource(name);
            break;

        case "command":
            notifError("Commande", name);
            break;

        case "success":
            notifSuccess("Commande", name);
            break;

        default:
            break;
    }
}
function notifError(type, error) {
    drawNotification("CHAR_BLOCKED", "Erreur", type, error);
}

function notifSuccess(type, content) {
    drawNotification("CHAR_DEFAULT", "Succès", type, content);
}

function notifRestartResource(name) {
    if (name == "ERROR") notifError("Resource", "Not found");
    else drawNotification("CHAR_DEFAULT", "Resource restarted", name, "Reloaded successfully!");
}

alt.on("notificationRaw", drawNotification);
alt.onServer("notificationRaw", drawNotification);

function drawNotification(imageName, headerMsg, detailsMsg, message) {
    native.beginTextCommandThefeedPost("STRING");
    native.addTextComponentSubstringPlayerName(message);
    native.endTextCommandThefeedPostMessagetextTu(imageName.toUpperCase(), imageName.toUpperCase(), false, 4, headerMsg, detailsMsg, 0.5);
    native.endTextCommandThefeedPostTicker(false, false);
}
