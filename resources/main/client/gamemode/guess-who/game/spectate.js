import * as alt from "alt-client";
import * as native from "natives";

const KEYS = {
    arrowLeft: 37,
    arrowRight: 39,
};
const player = alt.Player.local;
let camTick;
/** @type {alt.Player} */
let playerToFollow;
let playerToFollowIndex = 0;
let marker1;
let marker2;
/** @type {alt.WebView} */
let hudView;

function getPlayers() {
    return alt.Player.all.filter((p) => p.getStreamSyncedMeta("game") === "guesswho");
}

alt.onServer("guesswho:game:spectate", (player) => {
    alt.Utils.waitFor(() => getPlayers().length, 2000)
        .then(() => {
            playerToFollow = player ?? getPlayers()[0];
            if (!camTick) initSpecMode();
        })
        .catch(() => {});
});

async function spectatorKeyBinds(key) {
    if (!camTick) return;
    // const players = alt.Ped.streamedIn;
    const players = getPlayers();
    if (key === KEYS.arrowLeft) {
        if (playerToFollowIndex > 0) playerToFollowIndex--;
        else playerToFollowIndex = players.length - 1;
        playerToFollow = players[playerToFollowIndex];
    } else if (key === KEYS.arrowRight) {
        if (playerToFollowIndex < players.length - 1) playerToFollowIndex++;
        else playerToFollowIndex = 0;
        playerToFollow = players[playerToFollowIndex];
    }
}

function initSpecMode() {
    alt.Player.displayNametags(true);
    alt.on("keydown", spectatorKeyBinds);
    hudView = new alt.WebView("http://resource/client/gamemode/guess-who/game/browser/spectatorHUD.html");
    marker1 = new alt.Marker(3, player.pos, new alt.RGBA(200, 0, 0, 80));
    marker2 = new alt.Marker(3, player.pos, new alt.RGBA(200, 0, 0, 80));
    marker1.rot = new alt.Vector3(0, -Math.PI, 0);
    marker2.rot = new alt.Vector3(0, -Math.PI, Math.PI / 2);
    camTick = alt.everyTick(() => {
        if (!playerToFollow.valid) {
            // stopSpecMode();
            playerToFollow = getPlayers()[0];
            if (!playerToFollow) {
                stopSpecMode();
                return;
            }
        }
        native.setGameplayCamFollowPedThisUpdate(playerToFollow);
        native.hideHudAndRadarThisFrame();
        native.disableAllControlActions(0);
        native.enableControlAction(0, 1, true); // INPUT_LOOK_LR
        native.enableControlAction(0, 2, true); // INPUT_LOOK_UD
        marker1.pos = player.pos;
        marker2.pos = player.pos;
    });
}

function stopSpecMode() {
    // alt.Player.displayNametags(false);
    alt.off("keydown", spectatorKeyBinds);
    if (hudView) hudView.destroy();
    if (marker1) marker1.destroy();
    if (marker2) marker2.destroy();
    if (camTick) alt.clearEveryTick(camTick);
    marker1 = null;
    marker2 = null;
    camTick = null;
    playerToFollow = null;
    playerToFollowIndex = 0;
    alt.emit("player:revive");
}

alt.onServer("guesswho:game:stop", stopSpecMode);
alt.onServer("guesswho:game:spectate:stop", stopSpecMode);
