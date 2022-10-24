//import * as alt from 'alt';
import * as alt from 'alt-server';
import * as chat from 'chat';


alt.onClient('w:v', (player) => {

    const pos = player.pos
    const pos2 = {x:pos.x+10, y:pos.y+10, z:pos.z}
    const color = {r: 255, g: 0, b: 0, a: 0}


    console.log(alt.CheckpointType)
    //var waypoint = new alt.Checkpoint('Cylinder', pos, taille, taille, color)
    var waypoint = new alt.Checkpoint(44, pos.x, pos.y, pos.z-1, 1, 0.1, 0, 0, 0, 100)
    //Checkpoint(type: number, x: number, y: number, z: number, radius: number, height: number, r: number, g: number, b: number, a: number): Checkpoint

    console.log(waypoint, waypoint.valid)

    setInterval(() => {
        //console.log(waypoint.isEntityIn(alt.Player.all))
        if (player.vehicle) console.log(waypoint.isEntityIn(player.vehicle))
    }, 1000);


})

let taille = 10
