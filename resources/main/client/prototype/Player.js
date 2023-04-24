import * as alt from "alt-client";

alt.Player.prototype.notify = function (notificationOptions) {
    alt.Utils.drawNotification(notificationOptions);
};
