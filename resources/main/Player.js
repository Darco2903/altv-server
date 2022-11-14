import * as alt from 'alt-server';
import * as chat from 'chat';
import * as db from "database"
import { color } from "server-extended";
//import {globalFunction, globalTable} from "exports"

export function Player (player) {
    player.heal = function () {
        if (player.health == player.maxHealth) {
            chat.send(player, '{00FF00}Santé maximum')
            return
        }
        player.health = player.maxHealth
        alt.log(player.name, 'healed himself')
    }

    player.test = function () {
        alt.log("THIS IS TEST")
    }
}


//  export class Player extends alt.Player {
//      constructor(player) {
//          super()
//          player.test = this.test
//          return player
//      }
//  
//      test () {
//          alt.log("THIS IS TEST")
//      }
//  }