declare module "alt-client" {
    function getMeta(key: "display:nametags"): boolean;
    function hasMeta(key: "display:nametags"): boolean;
    function setMeta(key: "display:nametags", value: boolean): void;

    namespace Player {
        function displayNametags(): void;
    }
}
