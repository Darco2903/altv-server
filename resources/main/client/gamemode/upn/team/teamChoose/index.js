import * as alt from "alt-client";
import * as native from "natives";

let active = false;
/** @type {alt.WebView}*/
let view;

alt.onServer("upn:init", () => {
    view = new alt.WebView("http://resource/client/gamemode/upn/team/teamChoose/browser/index.html");
    view.isVisible = false;
    view.on("upn:teamChoose", (team) => alt.emitServer("upn:team:join", team));
    view.on("upn:ready", (state) => alt.emitServer("upn:player:ready", state));
    view.on("upn:start", () => alt.emitServer("upn:game:start"));
});

alt.onServer("upn:stop", () => {
    if (!view) return;
    toggle(false);
    view.destroy();
    view = undefined;
});

alt.onServer("upn:team:update", (teams) => {
    teams = teams.map((team) => {
        team.players = team.players.map(({ player, ready }) => ({ name: player.name, ready }));
        return team;
    });
    // console.log("upn:team:update", teams);
    view?.emit("upn:team:update", teams);
});

alt.on("upn:teamChoose", (state) => {
    toggle(state);
    view?.emit("upn:enableStart");
});

function toggle(state) {
    if (!view || state === active) return;
    active = state;
    // alt.toggleGameControls(!state);
    if (alt.isCursorVisible() !== state) alt.showCursor(state);
    if (state) view.focus();
    else view.unfocus();
    view.isVisible = state;
    view.emit("upn:open", state);
}
