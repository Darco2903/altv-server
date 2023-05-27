import * as alt from "alt-client";
import * as native from "natives";

alt.LocalPlayer.prototype.sendNotification = function ({ imageName, headerMsg, detailsMsg, message, duration = 1 }) {
    native.beginTextCommandThefeedPost("STRING");
    native.addTextComponentSubstringPlayerName(message);
    native.endTextCommandThefeedPostMessagetextTu(imageName.toUpperCase(), imageName.toUpperCase(), false, 4, headerMsg, detailsMsg, duration * 1000, false);
    native.endTextCommandThefeedPostTicker(false, false);
};

alt.onServer("notification", (notificationOptions) => {
    alt.Player.local.sendNotification(notificationOptions);
});
