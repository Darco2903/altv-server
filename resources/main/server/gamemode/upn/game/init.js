import * as alt from "alt-server";

alt.on("resourceStop", () => {
    alt.emit("upn:stop");
});

alt.on("upn:stop", async () => {
    if (alt.getMeta("upn:game:starting")) {
        await alt.Utils.waitFor(() => !alt.getMeta("upn:game:starting"), 10000);
    }
    alt.emit("upn:team:reset");
    alt.emitAllClients("upn:stop");
    alt.setMeta("upn:game:init", false);
    alt.setMeta("upn:game:started", false);
});

alt.Utils.Chat.registerCmd({
    name: "upnInit",
    permissionLevel: 3,
    execute: (player) => {
        if (alt.getMeta("upn:game:started") || alt.getMeta("upn:game:init")) return;
        alt.setMeta("upn:game:init", true);
        alt.emitAllClients("upn:init");
    },
});

alt.Utils.Chat.registerCmd({
    name: "upnStop",
    permissionLevel: 3,
    execute: (player) => {
        alt.emit("upn:stop");
    },
});
