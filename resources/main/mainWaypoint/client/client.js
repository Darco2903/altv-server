import * as alt from 'alt';
import * as client from 'alt-client'
import * as natives from 'natives';

alt.onServer("waypoint:Cmd", (cmd) => {
    console.log(cmd)
    if (cmd == 'c') {
        const pos = alt.Player.local.pos
        const pos2 = {x:pos.x+10, y:pos.y+10, z:pos.z}
        const color = {r: 255, g: 0, b: 0, a: 0}



        
        alt.everyTick(() => {
            //natives.setNewWaypoint(0, 0)
            natives.drawMarker(23, pos.x, pos.y, pos.z-1, 0, 0, 0, 0, 0, 0, taille, taille, taille, 255, 0, 0, 255, false, true, 2, false, undefined, undefined, false);
            natives.drawMarker(23, pos2.x, pos2.y, pos2.z, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 255, 255, false, true, 2, false, undefined, undefined, false);
        })

    }

    if (cmd == 'v') {
        alt.emitServer('w:v', (alt.Player.local))
    }
})


let taille = 10
/*false,
        true,
        2,
        false,
        undefined,
        undefined,
        false*/