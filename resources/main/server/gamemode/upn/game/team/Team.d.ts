import { Player } from "alt-server";

type TeamData = {
    name: string;
    // color: string;
    players: Player[];
};

export default class Team {
    static getByName(name: string): Team | null;
    static getPlayerTeam(player: Player): Team | null;
    static getAllTeams(): TeamData[];

    get players(): Player[];
    get ready(): boolean;

    public readonly name: string;

    constructor(name: string);

    public join(player: Player): void;
    public leave(player: Player): void;
    public ready(player: Player, state: boolean): void;
    private #playerJoin(player: Player): void;
    private #playerLeave(player: Player): void;

    static joinTeam(player: Player, team: Team): void;
    static leaveTeam(player: Player): void;
    // static readyTeam(player: Player, team: Team, state: boolean): void;

    getData(): TeamData;
    reset(): void;
}
