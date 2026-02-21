import * as alt from "alt-server";
import Team from "./Team.js";

const hunters = new Team("hunters");
const survivors = new Team("survivors");
const spectators = new Team("spectators");

Object.defineProperty(alt.Player.prototype, "team", {
    get() {
        return Team.getPlayerTeam(this);
    },
    set(value) {
        throw new Error("Cannot set team.");
    },
});

alt.onClient("upn:team:join", (player, teamName) => {
    if (player.team) player.team.leave(player);
    Team.joinTeam(player, teamName);
    alt.emitAllClients("upn:team:update", Team.getAllTeams());
});

alt.onClient("upn:player:ready", (player, state) => {
    player.team.ready(player, state);
    alt.emitAllClients("upn:team:update", Team.getAllTeams());
});

alt.on("playerDisconnect", (player, reason) => {
    if (player.team) player.team.leave(player);
    alt.emitAllClients("upn:team:update", Team.getAllTeams());
});

alt.on("upn:team:reset", () => {
    hunters.reset();
    survivors.reset();
    spectators.reset();
    alt.emitAllClients("upn:team:update", Team.getAllTeams());
});

export { hunters, survivors, spectators };
