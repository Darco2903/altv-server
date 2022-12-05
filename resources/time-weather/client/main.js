import * as alt from "alt-client"
import * as native from "natives"


alt.onServer("time:start", () => {
    native.pauseClock(false)
    log("Clock Started")
})

alt.onServer("time:stop", () => {
    native.pauseClock(true)
    log("Clock Stopped")
})

alt.onServer("time:setTime", ({h, m}) => {
    native.setClockTime(h, m, 0)
    log(`Clock time set to ${h}:${m}`)
})

alt.onServer("time:setSpeed", (speed) => {
    alt.setMsPerGameMinute(2000 / speed)    //  2 real seconds = 1 game second
    log(`Clock speed set to ${speed}`)
})


function log (msg) {
    alt.log("~y~" + msg)
}

alt.on("resourceStop", () => {
    alt.setMsPerGameMinute(2000)    //  2 real seconds = 1 game second
    native.pauseClock(false)
})



//  setInterval(() => {
//      console.log(native.getClockHours(), native.getClockMinutes())
//  }, 2000);