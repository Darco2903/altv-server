import * as alt from "alt-server";

/**
 * @description Send a notification to specified player
 * @param {Object} notificationOptions
 * @param {string} [notificationOptions.imageName]
 * @param {string} [notificationOptions.headerMsg]
 * @param {string} [notificationOptions.detailsMsg]
 * @param {string} [notificationOptions.message]
 * @returns {void}
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
