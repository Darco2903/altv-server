import * as alt from "alt-client";
import * as native from "natives";

const META_KEY = "blackout";

alt.Utils.blackout = function (state) {
    native.setArtificialLightsState(state);
    alt.setConfigFlag("DISABLE_EMISSIVE_LIGHTS_RENDERING", state);
    alt.setConfigFlag("FORCE_HIDE_NIGHT_PROPS", state);
};

alt.on("globalSyncedMetaChange", (key, value, oldValue) => {
    if (key !== META_KEY) return;
    alt.Utils.blackout(value);
});

alt.on("connectionComplete", () => {
    alt.Utils.blackout(alt.getSyncedMeta(META_KEY));
});
