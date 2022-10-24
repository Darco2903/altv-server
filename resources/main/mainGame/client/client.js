import * as alt from 'alt';
//import * as client from 'alt-client'
//import * as native from 'natives';


alt.onServer("game:test", () => {
    console.log("game:test START")
    var player = alt.Player.local
    console.log(player.pos)
    console.log(Function.vectorFormat(player.pos))
})

function test (player) {
    console.log(calcDistance(player.pos, {x:0, y:0, z:0}))
    setTimeout(() => {
       test(player)
    }, 1000);
}


function entityDistance (entity1, entity2) {

}


function calcDistance (pos1, pos2) {
    var x = (pos2.x - pos1.x)**2
    var y = (pos2.y - pos1.y)**2
    var z = (pos2.z - pos1.z)**2
    return Math.sqrt(x+y+z)
}

function test_calcDistance () {
    var a = {x: -35, y: 46, z: -12}
    var b = {x: 120, y: 13, z: 67}
    console.time("2")
    console.log(calcDistance(a,b))
    console.timeEnd("2")
}