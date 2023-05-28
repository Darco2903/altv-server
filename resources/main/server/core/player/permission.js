import * as alt from "alt-server";

alt.Player.prototype.hasPermission = function (opLevel) {
    return this.getSyncedMeta("op") >= opLevel;
};

alt.Player.prototype.notAuthorized = function () {
    this.sendNotification({
        imageName: "CHAR_BLOCKED",
        headerMsg: "Non autorisé",
    });
};

alt.Player.prototype.setOpLevel = function (opLevel) {
    this.setSyncedMeta("op", opLevel);
    this.sendNotification({
        imageName: "CHAR_MP_FM_CONTACT",
        headerMsg: "Opérateur",
        message: `Vous êtes maintenant opérateur niveau ${opLevel}`,
    });
};
