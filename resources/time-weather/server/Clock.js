import * as alt from "alt-server"


export default class Clock {

    constructor(hour, minute, speed) {
        this.h = hour || 12
        this.m = minute || 0
        this.speed = speed || 1
        this.started = false
    }

    //  run () {
    //      if (!this.started)
    //          return
    //      this.m++
    //      if (this.m >= 60) {
    //          this.h++
    //          this.m = 0
    //          if (this.h >= 24)
    //              this.h = 0
    //      }
    //      setTimeout(() => this.run(), this.speed);
    //  }
    
    run () {
        if (!this.started)
        return
        this.m += this.speed
        if (this.m >= 60) {
            this.h += Math.floor(this.m /60)
            this.h = this.h < 24 ? this.h : this.h %24
            this.m = this.m %60
        }
        setTimeout(() => this.run(), 2000);     //  2 real seconds = 1 game second
    }

    start () {
        this.started = true
        this.run()
        alt.emitAllClients("time:start")
        log("Clock Started")
    }
    
    stop () {
        this.started = false
        alt.emitAllClients("time:stop")
        log("Clock Stopped")
    }

    getTime () {
        return {h: this.h, m: this.m}
    }

    setTime (h, m) {
        this.h = h
        this.m = m
        alt.emitAllClients("time:setTime", this.getTime())
        log(`Clock Time set to: ${h}:${m}`)
    }

    setSpeed (speed) {
        this.speed = speed
        alt.emitAllClients("time:setSpeed", speed)   
        log(`Clock Speed set to: ${speed}`)
    }
}

function log (msg) {
    alt.log("~y~" + msg)
}