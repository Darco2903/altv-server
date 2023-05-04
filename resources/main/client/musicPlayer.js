import * as alt from "alt-client";

let musicPlayer = new alt.WebView("http://resource/client/musicPlayer/html/player.html", true);

let ready = false;
let player = alt.Player.local;

alt.onServer("debug", (enable) => musicPlayer.emit("debug", enable));

musicPlayer.on("musicPlayer:ready", () => {
    ready = true;
    if (player.vehicle) alt.emitServer("musicPlayer:ready");
});

alt.onServer("musicPlayer:init", init);

function init(music) {
    if (!ready) {
        music.time++;
        alt.setTimeout(() => init(music), 1000);
        return;
    }
    alt.emit("notification", "success", `Lecture ${music.id}`);
    musicPlayer.emit("init", music);
}

alt.onServer("musicPlayer:reset", () => {
    musicPlayer.emit("reset");
});

alt.onServer("musicPlayer:load", (music) => {
    alt.emit("notification", "success", `Lecture ${music.id}`);
    musicPlayer.emit("load", music);
});

alt.onServer("musicPlayer:play", () => {
    alt.emit("notification", "success", "Lecture");
    musicPlayer.emit("play");
});

alt.onServer("musicPlayer:stop", () => {
    alt.emit("notification", "success", "Arrêt lecture");
    musicPlayer.emit("stop");
});

alt.onServer("musicPlayer:pause", () => {
    alt.emit("notification", "success", "Pause");
    musicPlayer.emit("pause");
});

alt.onServer("musicPlayer:seek", (time) => {
    alt.emit("notification", "success", `Reprise à ${time} seconde`);
    musicPlayer.emit("seek", time);
});

alt.onServer("musicPlayer:volume", (volume) => {
    alt.emit("notification", "success", `Volume à ${volume}%`);
    musicPlayer.emit("volume", volume);
});
