import * as alt from "alt-server";

/**
 * Send a notification to all players
 * @param {alt.Player.notificationOptions} notificationOptions
 */
alt.Player.notifyAll = function (notificationOptions) {
    alt.emitAllClients("notification", notificationOptions);
};

/**
 * Send a notification to the player
 * @param {alt.Player.notificationOptions} notificationOptions
 */
alt.Player.prototype.notify = function (notificationOptions) {
    alt.emitClient(this, "notification", notificationOptions);
};

alt.Player.prototype.send = function (message) {
    alt.emitClient(this, "chat:message", null, message);
};

alt.Player.prototype.authorized = function (level) {
    return this.getSyncedMeta("op") >= level;
};

alt.Player.prototype.notAuthorized = function () {
    this.notify({
        imageName: "CHAR_BLOCKED",
        headerMsg: "Permission insuffisante",
        detailsMsg: ``,
        message: "Vous n'avez pas les permissions nécessaires pour effectuer cette action.",
    });
};
