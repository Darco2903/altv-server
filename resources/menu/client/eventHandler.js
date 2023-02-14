import * as alt from "alt-client";

// const player = alt.Player.local;

alt.on("menu:eventHandler", ({ id, checked }) => {
    switch (id) {
        case "spawner":
        case "tuner":
            closeMenu();
            alt.emit(`carManager:${id}`);
            break;

        case "repair":
        case "despawn":
        case "save":
        case "delete":
            closeMenu();
            alt.emitServer(`vehicle:${id}`);
            break;

        case "model":
        case "armory":
            closeMenu();
            alt.emit(`playerManager:${id}`);
            break;

        case "nametag":
            alt.emit("nametag:toogle", checked);
            break;

        default:
            break;
    }
});

function closeMenu() {
    alt.emit("menu:toogle");
}
