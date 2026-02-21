import * as alt from "alt-client";
import * as native from "natives";

alt.Utils.screenFadeIn = function (time = 500) {
    if (time < 0) time = 0;
    native.doScreenFadeIn(time);
    return alt.Utils.wait(time);
};

alt.Utils.screenFadeOut = function (time = 500) {
    if (time < 0) time = 0;
    native.doScreenFadeOut(time);
    return alt.Utils.wait(time);
};
