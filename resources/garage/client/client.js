import * as alt from 'alt';
import * as native from 'natives';
import { garageList } from '../garageList';




let player = alt.Player.local
let garage
let interactionKey = 'E'.charCodeAt(0)
let readyPos


alt.onServer("garage:EnterGarage", (garageName) => garage = garageList[garageName])
alt.onServer("garage:LeaveGarage", () => garage = null)

alt.onServer("garage:EnterColshape", ([id, name, {enabled, pos}]) => {  
    //  console.log(id, name, enabled, pos);
    if (enabled)
        askTP(name, pos)
})

alt.onServer("garage:LeaveColshape", unAskTp)


function askTP (name, pos) {
    const action = name == "in" ? "exit" : "enter"
    showHelpText(`Press E to ${action} garage`)
    readyPos = pos
}

function unAskTp () {
    readyPos = null
    removeHelpText()
}

function tp (pos) {
    console.log(pos);
    if (player.vehicle) {
        native.setPedCoordsKeepVehicle(player, pos.x, pos.y, pos.z)
        native.setEntityHeading(player.vehicle, pos.h)
    } else {
        native.startPlayerTeleport(player, pos.x, pos.y, pos.z, pos.h, null, true, null)
    }
    native.setGameplayCamRelativeHeading(pos.h)
}

alt.on("keydown", (key) => {
    if (key != interactionKey || !readyPos) return
    tp(readyPos)
})


function showHelpText(text) {
    native.beginTextCommandDisplayHelp("STRING");
    native.addTextComponentSubstringPlayerName(text);
    native.endTextCommandDisplayHelp(0, false, true, 5000)
}

function removeHelpText () {
    native.clearHelp(true)
}

console.log(native.getEntityHeading(player))
