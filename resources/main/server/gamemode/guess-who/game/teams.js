import * as alt from "alt-server";

const TEAM_RATIO = 1 / 5;

export default class Teams {
    /** @type {Set<alt.Player>} */
    static #hiders = new Set();
    /** @type {Set<alt.Player>} */
    static #hunters = new Set();
    /** @type {Set<alt.Player>} */
    static #spectators = new Set();

    static get hiders() {
        return Array.from(Teams.#hiders);
    }

    static get hunters() {
        return Array.from(Teams.#hunters);
    }

    static get spectators() {
        return Array.from(Teams.#spectators);
    }

    static get players() {
        return [...Teams.#hiders, ...Teams.#hunters, ...Teams.#spectators];
    }

    static get remainingHiders() {
        return Array.from(Teams.#hiders).filter((player) => player.valid && !player.getStreamSyncedMeta("guesswho:spectate")).length;
    }

    static get remainingHunters() {
        return Array.from(Teams.#hunters).filter((player) => player.valid && !player.getStreamSyncedMeta("guesswho:spectate")).length;
    }

    /**
     * @param {alt.Player[]} players
     */
    static createRandomTeams(players) {
        // if (players.length < 2) throw new Error("Not enough players to create teams.");

        const shuffled = players.sort(() => Math.random() - 0.5);
        // const shuffled = [alt.Player.all[0], alt.Player.all[1]];
        // const shuffled = [alt.Player.all[1], alt.Player.all[0]];
        const hunterCount = Math.ceil(players.length * TEAM_RATIO);
        // const hunterCount = 0;

        players.forEach((player) => {
            player.setStreamSyncedMeta("game", "guesswho");
            player.deleteStreamSyncedMeta("guesswho:spectate");
        });

        Teams.#hunters = new Set(shuffled.slice(0, hunterCount));
        Teams.#hunters.forEach((player) => player.setStreamSyncedMeta("guesswho:team", "hunter"));
        Teams.#hiders = new Set(shuffled.slice(hunterCount));
        Teams.#hiders.forEach((player) => player.setStreamSyncedMeta("guesswho:team", "hider"));
        Teams.#spectators = new Set();
        // console.log("Hunters:", Teams.#hunters.length);
        // console.log("Hiders:", Teams.#hiders.length);
    }

    static removePlayer(player) {
        if (Teams.#hunters.has(player)) {
            Teams.#hunters.delete(player);
        } else if (Teams.#hiders.has(player)) {
            Teams.#hiders.delete(player);
        } else if (Teams.#spectators.has(player)) {
            Teams.#spectators.delete(player);
        }
    }

    static deleteTeams() {
        Teams.players.forEach((player) => {
            if (!player.valid) return;
            player.deleteStreamSyncedMeta("game");
            player.deleteStreamSyncedMeta("guesswho:team");
            player.deleteStreamSyncedMeta("guesswho:spectate");
        });
        Teams.#hunters.clear();
        Teams.#hiders.clear();
        Teams.#spectators.clear();
    }

    static newSpectator(player) {
        player.setStreamSyncedMeta("guesswho:spectate", true);
        Teams.#spectators.add(player);
        player.emit("guesswho:game:spectate");
    }
}

// test code
// for (let i = 0; i < 20; i++) {
//     try {
//         console.log("number of players:", i);
//         Teams.createRandomTeams(new Array(i).fill(0));
//     } catch (error) {
//         console.log(error.message);
//     }
//     console.log("=====");
// }
