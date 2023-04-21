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

/**
 * @description Send a message to specified player
 * @param {string} msg
 * @returns {void}
 */
alt.Player.prototype.send = function (msg) {
    alt.emitClient(this, "chat:message", null, msg);
};

/**
 * @param {number} authRequired
 * @returns {boolean}
 */
alt.Player.prototype.authorized = function (authRequired) {
    return this.getMeta("op") >= authRequired;
};

alt.Player.prototype.notAuthorized = function () {
    this.sendNotification({
        imageName: "CHAR_BLOCKED",
        headerMsg: "Permission insuffisante",
        detailsMsg: ``,
        message: "Vous n'avez pas les permissions nécessaires pour effectuer cette action.",
    });
};
