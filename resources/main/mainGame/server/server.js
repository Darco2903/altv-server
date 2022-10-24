import * as alt from 'alt';
import * as chat from 'chat';
//import * as Function from "/resources/main/server/data/Functions.js";
import * as Function from "main";
//import * as Function from '../../main/server/data/Functions.js';
//import * as Table from '/resources/main/server/data/Tables.js';

function spawnBullet () {

}




chat.registerCmd("gametest", (player) => {
    alt.emitClient(player, "game:test")
})