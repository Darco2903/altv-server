declare module "alt-client" {
    function hasMeta(key: "display:nametags"): boolean;
    function getMeta(key: "display:nametags"): boolean;
    function setMeta(key: "display:nametags", value: boolean): void;
}
