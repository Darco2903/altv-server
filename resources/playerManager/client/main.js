import * as alt from "alt-client"
import * as native from "natives";

const player = alt.Player.local

if (!player.hasSyncedMeta("id"))
    native.doScreenFadeOut(0)
else
    native.doScreenFadeIn(1500)

alt.once("spawned", () => {
    setTimeout(() => {
        native.doScreenFadeIn(1500)
    }, 2000)
})

alt.on("resourceStop", () => native.doScreenFadeOut(1000))


alt.onServer('playerDeath', (killer, weapon) => {
    console.log(player, killer, weapon);
});

alt.on("keyup", (key) => {
    if(key === 112) {
        alt.emit("NoClip:Toggle")
        //alt.emitServer('NoClip:Request')
    }
});

//  native.setPlayerMaxArmour(player, 100)

alt.onServer("player:TP", (pos) => {
    const heading = native.getEntityHeading(player)
    const floor = pos.z || native.getApproxFloorForPoint(pos.x, pos.y) +15
    //const floor = pos.z || native.getApproxFloorForArea(pos.x-2, pos.y-2, pos.z+2, pos.y+2)
    console.log(floor);
    native.startPlayerTeleport(player, pos.x, pos.y, floor, heading, null, true, null)
})

//  native.taskJump(player, false, true, false)
//  native.taskHandsUp(player, 5000, -1, -1, -1)
//  let ped = native.clonePed(player, false, false, false)
//  native.setEnableHandcuffs(ped, true)

//  setTimeout(() => {
//      native.setEnableHandcuffs(player, true)
//      native.taskArrestPed(player, ped)
//  }, 100);