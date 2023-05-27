import * as alt from "alt-server";

alt.Player.prototype.hasPermission = function (opLevel) {
    return this.getSyncedMeta("op") >= opLevel;
};

alt.Player.prototype.notAuthorized = function () {};
