import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;
/** @type {alt.WebView} */
let sceneView;

function initScreen() {
    // alt.requestIpl("v_ilev_cin_screen");
    // view = new alt.WebView(
    //     "https://www.youtube.com/embed/E1liGZpoJB8?mute=1&autoplay=1&hd=1&vq=hd1080&controls=0&cc_load_policy=0&iv_load_policy=3&fs=0&modestbranding=1",
    //     alt.hash("v_ilev_cin_screen"),
    //     "script_rt_cinscreen"
    // );
}

alt.on("resourceStart", async () => {
    // if (!alt.getSyncedMeta("eventStage:init")) return;
    // await alt.Utils.waitFor(() => player.isSpawned, 1000);
    // if (player.pos.distanceTo(new alt.Vector3(302, -1609, 30)) > 100) return;
    // sceneView = new alt.WebView("http://resource/client/gameplay/map/eventStage/index.html", alt.hash("v_ilev_cin_screen"), "script_rt_cinscreen");
});

// alt.on("resourceStop", () => {
//     if (sceneView.valid) sceneView.destroy();
// });

/**
 * @param {alt.VirtualEntity} entity
 */
function isScreen(entity) {
    return entity.type === 20 && entity.getStreamSyncedMeta("type") === "webview" && entity.getStreamSyncedMeta("name") === "eventStage:screen";
}

alt.on(
    "worldObjectStreamIn",
    /** @param {alt.VirtualEntity} entity */
    async (entity) => {
        if (!isScreen(entity) || sceneView) return;
        // console.log("Screen stream in, initializing");
        const modelHash = alt.hash("v_ilev_cin_screen");
        native.requestModel(modelHash);
        await alt.Utils.waitFor(() => native.hasModelLoaded(modelHash), 5000);
        sceneView = new alt.WebView("http://resource/client/gameplay/map/eventStage/browser/screen.html", modelHash, "script_rt_cinscreen");
        const url = entity.getStreamSyncedMeta("sourceUrl");
        const startTime = entity.getStreamSyncedMeta("startTime");
        if (url) sceneView.emit("screen:source", url, startTime);
    }
);

alt.on("worldObjectStreamOut", (entity) => {
    if (!isScreen(entity) || !sceneView) return;
    sceneView.destroy();
    sceneView = null;
});

alt.on("streamSyncedMetaChange", (entity, key, value) => {
    if (!isScreen(entity) || !sceneView) return;
    switch (key) {
        case "videoId":
            sceneView.emit("screen:source", value, entity.getStreamSyncedMeta("startTime"));
            break;
        case "startTime":
            sceneView.emit("screen:source", entity.getStreamSyncedMeta("sourceUrl"), value);
            break;
    }
});
