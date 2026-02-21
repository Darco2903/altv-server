declare module "alt-client" {
    function getMeta(key: "respawn:enabled"): boolean;
    function setMeta(key: "respawn:enabled", value: boolean): void;
    function emit(eventName: "player:revive"): void;
}
