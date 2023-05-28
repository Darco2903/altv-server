import * as alt from "alt-server";

alt.Player.sendNotification = function (players, notificationOptions) {
    alt.emitClient(players, "notification", notificationOptions);
};

alt.Player.prototype.sendNotification = function (notificationOptions) {
    alt.emitClient(this, "notification", notificationOptions);
};
