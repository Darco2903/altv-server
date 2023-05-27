import * as alt from "alt-client";

alt.LocalPlayer.prototype.hasPermission = function (opLevel) {
    return this.getSyncedMeta("op") >= opLevel;
};

alt.LocalPlayer.prototype.notAuthorized = function () {};
