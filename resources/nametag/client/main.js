import * as alt from "alt-client"
import { drawText3d } from "./draw3DText"


let display = false
let displayName


updateDisplayState()
function updateDisplayState () {
    alt.setMeta("displayNametag", display)
}

alt.on("resourceStart", updateDisplayState)
alt.on("nametag:toogle", toogle)
alt.on("gameEntityCreate", startDisplay)
alt.on("gameEntityDestroy", (entity) => {
    if ((entity instanceof alt.Player) && alt.Vehicle.streamedIn.length <= 0)
        stopDisplay()
})

function toogle (enable) {
    display = enable
    updateDisplayState()
    if (display) 
        startDisplay()
    else
        stopDisplay()
}

function startDisplay () {
    if (isDisplayName() || !display) return
    displayName = alt.everyTick(() => alt.Player.streamedIn.forEach(setName))
}

function stopDisplay () {
    if (!isDisplayName) return
    alt.clearEveryTick(displayName)
    displayName = undefined
}

function isDisplayName () {
    return displayName != undefined
}

function setName (player) {
    const pos = player.pos
    const dist = alt.Player.local.pos.distanceTo(pos)
    if (dist > 50) return
    const scale = dist < 6.8 ? 0.3 : 2/dist
    drawText3d(`${player.name}`, pos.x, pos.y, pos.z+1, scale, 0, 255, 255, 255, 255);
}



