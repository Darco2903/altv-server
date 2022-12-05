import * as alt from "alt-shared"


export default class Clock {

    constructor(hour, minute, started, speed) {
        this.h = hour
        this.m = minute
        this.speed = speed || 2000  // Base Game Speed
        this.started = started
    }

    run () {
        if (!this.started)
            return
        this.m++
        if (this.m >= 60) {
            this.h++
            this.m = 0
            if (this.h >= 24)
                this.h = 0
        }
        //  log(this.h, this.m)
        setTimeout(() => {
            this.run()
        }, this.speed);
    }

    start () {
        this.started = true
        this.run()
        log("Clock Started")
    }
    
    stop () {
        this.started = false
        log("Clock Stopped")
    }

    setTime (h, m) {
        this.h = h
        this.m = m
        log(`Clock Time set to: ${h}:${m}`)
    }

    setSpeed (speed) {
        this.speed = speed
        log(`Clock Speed set to: ${speed}`)
    }

    getTime () {
        return {h: this.h, m: this.m}
    }

    getClockData () {
        return Object.assign({speed: this.speed, started: this.started}, this.getTime())
    }

}

function log (msg) {
    alt.log("~y~" + msg)
}