import * as alt from "alt-client";

alt.on("menu:eventHandler", ({ id, checked }) => {
    switch (id) {
        case "spawner":
        case "tuner":
        case "repair":
        case "despawn":
            alt.emit("menu:toogle");
        //fall through
        case "deleter":
            alt.emit(`carManager:${id}`);
            console.log(`carManager:${id}`);
            break;

        case "armory":
            alt.emit("menu:toogle");
            alt.emit(`playerManager:${id}`);
            break;

        case "nametag":
            alt.emit("nametag:toogle", checked);
            break;

        default:
            break;
    }
});
