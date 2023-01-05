import * as alt from "alt-client";

alt.on("menu:eventHandler", ({ id, checked }) => {
    switch (id) {
        case "spawner":
        case "tuner":
        case "repair":
            alt.emit("menu:toogle");
        //fall through
        case "despawner":
        case "deleter":
            alt.emit(`carManager:${id}`);
            break;

        case "nametag":
            alt.emit("nametag:toogle", checked);
            break;

        default:
            break;
    }
});
