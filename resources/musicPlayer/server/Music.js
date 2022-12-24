import * as alt from "alt-server";

export default class Music {
    constructor(music) {
        if (!music) music = { id: null, state: 0, time: null, timer: null, volume: 40 };
        this.volume = music.volume;
        this.id = music.id;
        this.state = music.state;
        this.time = music.time;
        this.timer = this.state == 1 ? this.startTimer() : null;
    }

    startTimer() {
        return this.timer || alt.setInterval(() => this.time++, 1000);
    }

    stopTimer() {
        alt.clearInterval(this.timer);
        this.timer = null;
    }

    load(id) {
        this.id = id;
        this.time = 0;
        this.play();
    }

    play() {
        this.state = 1;
        this.timer = this.startTimer();
    }

    pause() {
        this.state = 2;
        this.stopTimer();
    }

    stop() {
        this.state = 0;
        this.id = null;
        this.time = null;
        this.stopTimer();
    }

    seek(time) {
        this.time = time;
    }

    setVolume(volume) {
        this.volume = volume;
    }

    isPlaying() {
        return this.state > 0;
    }
}
