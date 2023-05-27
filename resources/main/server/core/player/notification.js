import * as alt from "alt-server";

alt.Player.sendNotificationAll = function (notificationOptions) {
    alt.emitAllClients("notification", notificationOptions);
};

alt.Player.prototype.sendNotification = function (notificationOptions) {
    alt.emitClient(this, "notification", notificationOptions);
};
