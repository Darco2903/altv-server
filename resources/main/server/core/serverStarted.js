import * as alt from "alt-server";

let errorOnStart = false;
const META_KEY = "server:started";

alt.on("anyResourceError", (resourceName) => {
    errorOnStart = true;
});

alt.on("serverStarted", () => {
    alt.setMeta(META_KEY, true);
    if (errorOnStart) alt.logWarning("--- Server started with errors ---");
    else alt.log("~g~--- Server started successfully ---");
});
