import * as alt from "alt-server";

export default class Team {
    /** @type {Map<string, Team>} */
    static #all = new Map();
    static getByName(name) {
        return Team.#all.get(name);
    }

    /** @type {Map<alt.Player, Team>} */
    static #playerTeam = new Map();
    static getPlayerTeam(player) {
        return Team.#playerTeam.get(player);
    }

    static getAllTeams() {
        return Array.from(Team.#all.values()).map((team) => team.getData());
    }

    /** @type {string} */
    #name;
    get name() {
        return this.#name;
    }

    /** @type {Map<alt.Player, Boolean>} */
    #players = new Map();
    get players() {
        return Array.from(this.#players.keys());
    }

    get ready() {
        return Array.from(this.#players.values()).every((ready) => ready);
    }

    /**
     * @param {string} name
     */
    constructor(name) {
        if (!name) throw new Error("Team name is required.");
        if (Team.#all.has(name)) throw new Error("Team already exists.");
        this.#name = name;
        Team.#all.set(name, this);
    }

    join(player) {
        if (!player) throw new Error("Player is required.");
        if (this.#players.has(player)) throw new Error("Player is already in this team.");
        if (Team.#playerTeam.has(player)) throw new Error("Player is already in a team.");
        this.#playerJoin(player);
        alt.log(`${player.name} joined ${this.name}.`);
    }

    leave(player) {
        if (!player) throw new Error("Player is required.");
        if (!this.#players.has(player)) throw new Error("Player is not in this team.");
        this.#playerLeave(player);
        alt.log(`${player.name} left ${this.name}.`);
    }

    ready(player, state) {
        if (!player) throw new Error("Player is required.");
        if (!this.#players.has(player)) throw new Error("Player is not in this team.");
        this.#players.set(player, state);
        // alt.log(`${player.name} is ready.`);
    }

    // switch(player) {
    //     if (!player) throw new Error("Player is required.");
    //     if (!Team.#playerTeam.has(player)) throw new Error("Player is not in a team.");
    //     const team = Team.#playerTeam.get(player);
    //     if (team === this) throw new Error("Player is already in this team.");
    //     team.leave(player);
    //     this.#playerJoin(player);
    //     alt.log(`${player.name} switched to ${this.name}.`);
    // }

    /**
     * @param {alt.Player} player
     */
    #playerJoin(player) {
        this.#players.set(player, false);
        Team.#playerTeam.set(player, this);
    }

    /**
     * @param {alt.Player} player
     */
    #playerLeave(player) {
        this.#players.delete(player);
        Team.#playerTeam.delete(player);
    }

    /**
     * @param {alt.Player} player
     * @param {string} teamName
     */
    static joinTeam(player, teamName) {
        if (!teamName) throw new Error("Team name is required.");
        if (!Team.#all.has(teamName)) throw new Error("Team does not exist.");
        const team = Team.#all.get(teamName);
        team.join(player);
    }

    /**
     * @param {alt.Player} player
     */
    static leaveTeam(player) {
        if (!player) throw new Error("Player is required.");
        if (!Team.#playerTeam.has(player)) throw new Error("Player is not in a team.");
        const team = Team.#playerTeam.get(player);
        team.leave(player);
    }

    // /**
    //  * @param {alt.Player} player
    //  * @param {string} teamName
    //  * @param {boolean} state
    //  */
    // static ready(player, teamName, state) {
    //     if (!teamName) throw new Error("Team name is required.");
    //     if (!Team.#all.has(teamName)) throw new Error("Team does not exist.");
    //     const team = Team.#all.get(teamName);
    //     team.ready(player, state);
    // }

    // /**
    //  * @param {alt.Player} player
    //  * @param {string} teamName
    //  */
    // static switchTeam(player, teamName) {
    //     if (!player) throw new Error("Player is required.");
    //     if (!teamName) throw new Error("Team name is required.");
    //     if (!Team.#all.has(teamName)) throw new Error("Team does not exist.");
    //     const team = Team.#all.get(teamName);
    //     team.switch(player);
    // }

    getData() {
        return {
            name: this.#name,
            players: Array.from(this.#players.entries()).map(([player, ready]) => ({
                player,
                ready,
            })),
        };
    }

    reset() {
        this.#players.clear();
        Team.#playerTeam.clear();
    }
}
