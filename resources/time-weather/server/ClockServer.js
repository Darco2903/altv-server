import Clock from "../Clock"
import * as alt from "alt-server"
import * as chat from "chat"


export default class ClockServer extends Clock {

    constructor(hour, minute) {
        super(hour, minute, true, 2000)   // Base Game Speed
        alt.emitAllClients("initClientClock", this.getTime())
    }

    start () {
        super.start()
        alt.emitAllClients("clock:start")
    }
    stop () {
        super.stop()
        alt.emitAllClients("clock:stop")
    }
    setTime (h, m) {
        super.setTime(h, m)
        alt.emitAllClients("clock:setTime", this.getTime())
    }
    setSpeed (speed) {
        super.setSpeed(speed)
        alt.emitAllClients("clock:setSpeed", this.speed)   
    }

}

function log (msg) {
    alt.log("~y~" + msg)
}