import Clock from "../Clock"
import * as alt from "alt-client"
import * as native from "natives"


export default class ClockClient extends Clock {

    constructor(hour, minute, started, speed) {
        super(hour, minute, started, speed)
        if (started)
            this.start()
        alt.setMsPerGameMinute(speed)
        native.setClockTime(hour, minute, 0)
    }

    start () {
        super.start()
        native.pauseClock(false)
    }

    stop () {
        super.stop()
        native.pauseClock(true)
    }

    setTime (h, m) {
        super.setTime(h, m)
        native.setClockTime(h, m, 0)
    }

    setSpeed (speed) {
        super.setSpeed(speed)
        alt.setMsPerGameMinute(speed)
    }
}
