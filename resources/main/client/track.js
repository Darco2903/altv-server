import * as alt from "alt-client";

let track;
const player = alt.Player.local;

alt.onServer("track:new", (name) => {
    alt.log(`Track: ${name}`);
    // track = new Track(name);
    // for (let i = 0; i <= 42; i++) {
    //     new alt.Marker(i, player.pos.add(0, i * 2, 0), new alt.RGBA(255, 0, 0, 255), true, 300);
    //     new alt.Checkpoint(i, player.pos.add(10, i * 2, 0), player.pos.add(i, 1, 0), 1, 2, new alt.RGBA(255, 0, 0, 255), 300);
    // }
});

alt.onServer("track:addCheckpoint", () => {
    track.addCheckpoint(player.pos.sub(0, 0, 1), 3);
});

alt.onServer("track:removeCheckpoint", (index) => {
    alt.log(`Track: ${index}`);
    track.removeCheckpoint(index);
});

alt.onServer("track:editCheckpoint", (index, options) => {
    alt.log(`Track: ${index}, ${options}`);
    track.editCheckpoint(index, options);
});
