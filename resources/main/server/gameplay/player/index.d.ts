declare module "alt-server" {
    import alt from "alt-server";

    function emitClient(player: alt.Player, eventName: "menu:enabled"): void;
    function emitAllClients(eventName: "menu:enabled"): void;
    function emitClient(player: alt.Player, eventName: "noclip:enabled"): void;
    function emitAllClients(eventName: "noclip:enabled"): void;
    function emitClient(player: alt.Player, eventName: "player:revive"): void;
    function emitAllClients(eventName: "player:revive"): void;
    function emitClient(player: alt.Player, eventName: "respawn:enabled"): void;
    function emitAllClients(eventName: "respawn:enabled"): void;
}
