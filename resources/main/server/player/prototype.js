import * as alt from "alt-server";

alt.Player.prototype.authorized =
    /**
     * @param {number} authRequired
     * @returns {boolean}
     */
    function (authRequired) {
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
