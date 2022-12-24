import * as alt from "alt-server";
import Music from "./Music";

alt.Vehicle.prototype.initMusic = function () {
    this.music = new Music(this.getMeta("music"));
};

alt.Vehicle.prototype.addPassenger = function (player) {
    if (!this.passengers) this.passengers = [];
    this.passengers.push(player);
};

alt.Vehicle.prototype.removePassenger = function (player) {
    if (!this.passengers) return;
    let index = this.passengers.indexOf(player);
    if (index > -1) this.passengers.splice(index, 1);
};

alt.Vehicle.prototype.playerEnter = function (player) {
    if (!this.music) this.initMusic();
    if (this.music.isPlaying()) alt.emitClient(player, "musicPlayer:init", this.music);
    this.addPassenger(player);
};

alt.Vehicle.prototype.playerLeft = function (player) {
    if (this.music.isPlaying()) alt.emitClient(player, "musicPlayer:stop");
    this.removePassenger();
};

alt.Vehicle.prototype.interaction = function (interaction, value) {
    this.passengers.forEach((player) => alt.emitClient(player, `musicPlayer:${interaction}`, value));
};

alt.Vehicle.prototype.updateMeta = function () {
    this.setMeta("music", this.music);
};

alt.Vehicle.prototype.load = function (id) {
    this.music.load(id);
    this.updateMeta();
    this.interaction("load", this.music);
};

//  alt.Vehicle.prototype.cueLoad = function (id) {
//      this.music.cueLoad(id)
//      this.interaction("cueLoad", id);
//  }

alt.Vehicle.prototype.play = function () {
    this.music.play();
    this.updateMeta();
    this.interaction("play");
};

alt.Vehicle.prototype.stop = function () {
    this.music.stop();
    this.updateMeta();
    this.interaction("stop");
};

alt.Vehicle.prototype.pause = function () {
    this.music.pause();
    this.updateMeta();
    this.interaction("pause");
};

alt.Vehicle.prototype.seek = function (time) {
    this.music.seek(time);
    this.updateMeta();
    this.interaction("seek", time);
};

alt.Vehicle.prototype.volume = function (volume) {
    this.setVolume(volume);
    this.updateMeta();
    this.interaction("volume", volume);
};
