import * as alt from "alt-client"
import ClockClient from './ClockClient';


let clock

alt.onServer("initClientClock", initClock)

function initClock (data) {
    let {h, m, speed, started} = data
    clock = new ClockClient(h, m, started, speed)
    
    alt.onServer("clock:start", () => {clock.start()})
    alt.onServer("clock:stop", () => {clock.stop()})
    alt.onServer("clock:setTime", ({h, m}) => {clock.setTime(h, m)})
    alt.onServer("clock:setSpeed", (speed) => {clock.setSpeed(speed)})
}
