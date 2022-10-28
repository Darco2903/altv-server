import * as alt from 'alt';
import * as chat from 'chat';
import * as db from "database";
import { globalFunction, globalTable } from 'main';


function r (player, arg) {
    if (!globalFunction.authorized(player, 4)) {
        chat.send(player, '{ff8f00}Permissions insuffisantes')
        return
    }

    if (!arg || !arg[0]) globalFunction.restartServer()
    else globalFunction.restartResource(arg[0])

}

function kill (player, arg) {
    var toKill = player
    if (arg[0]) {
        toKill = globalFunction.findEntityInList(arg[0], alt.Player.all)
    }
    toKill.health = 0

}

function save (player) {
    db.updatePartialData(player.getSyncedMeta('id'),
        { position: JSON.stringify(player.pos), playerModel: JSON.stringify(player.model) }, 'Character', res => {});
    chat.send(player, '{00FF00}Sauvegarde effectuée')

}

function time (player, arg) {
    if (arg[0] == "day") arg[0] = 12
    else if (arg[0] == "night") arg[0] = 0
    if (arg[0] >= 0 && arg[0] < 24) {
        var time = ['time', parseInt(arg[0])]
        globalFunction.clockInteract(time)
        chat.broadcast(`{00FFFF}Changing time to ${arg[0]}h00`)
    } else {
        chat.send(player, '{ff8f00}La valeur entrée doit être comprise entre 0 et 23')
    }
}

function clock (player, action) {
    if (!action[0]) {
        return chat.send(player, '{ff8f00}Command use : /clock [action]')
    }
    const callback = globalFunction.clockInteract(action)
    if (callback) chat.send(player, callback)
}

function weather (player, arg) {
    if (!arg[0]) {
        chat.send(player, '{ff8f00}Command use : /weather [0-14] or [weatherName]')
        return
    }
    if (!isNaN(arg[0])) {
        if (arg[0] >= 0 && arg[0] <= 14) {
            return globalFunction.changeWeather(arg[0])
        }
        return chat.send(player, '{ff8f00}La valeur entrée doit être comprise entre 0 et 14')
    } 
    if (globalTable.weatherTable[arg[0].toLowerCase()]) {
        return globalFunction.changeWeather(globalTable.weatherTable[arg[0].toLowerCase()])
    }
    return chat.send(player, '{ff8f00}Unknow weather')
}

function kick (kicker, arg) {
    if (!arg[0]) {
        return chat.send(kicker, '{ff8f00}Command use : /kick [player]')
    }
    var kicked = globalFunction.findEntityInList(arg[0], alt.Player.all)
    var message = arg[1]
    globalFunction.kick(kicker, kicked, message)

}

function tp (player, arg) {
    if (!arg[0] || arg[0] === 'help') {
        return chat.send(player, '{ff8f00}Command use : /tp [playerName]/[playerID]')
    }
    var player1 = player.name
    var player2 = arg[0]
    if (arg[1]) {
        player1 = arg[0]
        player2 = arg[1]
    }
    
    const callback = globalFunction.tpPlayerToPlayer(player1, player2)
    if (callback) {
        chat.send(player, '{ff8f00}Player not found')
    }
}

function tpm (player) {
    alt.emitClient(player, 'tpm:Player')
}

function i (player) {
    //if (!player.vehicle) return
    //player.vehicle.setMeta('id', 62)
    console.log('i')
    console.log(player.getMeta('id'), player.getMeta('position'))
    //console.log(player.vehicle)
    //console.log(player.vehicle.getMeta('id'))
}


function getPos (player) {
    console.log('Coordonnées : ' + player.pos)
    chat.send(player, `{FF0000}x : {FFFF00}${player.pos.x}`)
    chat.send(player, `{00FF00}y : {FFFF00}${player.pos.y}`)
    chat.send(player, `{0000FF}y : {FFFF00}${player.pos.z}`)
}

function sethp (player , arg) {
    if (!arg || arg.lenth <= 0) {
        chat.send(player, '{ff8f00}Command use : /hp [amount]');
        return;
    }
    let amount = parseInt(arg[0]);
    if (amount < 100) {
        amount += 100;
    }
    if (isNaN(amount)) {
        chat.send(player, "{ff8f00}The amount specified was not a number ptn T con");
        return;
    }
    player.maxHealth = 200
    player.health = amount
    console.log(player.name, 'set his hp to', amount)
}


function setarmor (player, arg) {
    if (!arg || arg.lenth <= 0) {
        chat.send(player, '{ff8f00}/armor [amount]');
        return;
    }
    let amount = parseInt(arg[0]);
    if (amount < 100) {
        amount += 100;
    }
    if (isNaN(amount)) {
        chat.send(player, "{ff8f00}The amount specified was not a number ptn T con");
        return;
    }
    player.armour = amount
    console.log(player.name, 'set his armor to', amount)
}

function heal (player) {
    globalFunction.playerheal(player)
}

function armor (player) {
    globalFunction.playerarmor(player)
}

function respawn (player) {
    player.spawn(player.pos.x, player.pos.y, player.pos.z + 2)
    console.log(player.name, 'respawned')
    chat.send(player, '{FF00FF}Vous avez respawn')
}

function weapon (player, arg) {
    if (!arg[0]) {
        alt.emitClient(player, 'weaponWebview:load')
        return;
    }
    globalFunction.weapongive(player, arg[0])
}

function pm (player, arg) {
    if (!arg[0]) {
        alt.emitClient(player, 'pmWebview:load')
        return;
    }
    globalFunction.setNewPlayerModel(player, arg[0])
}

function pmraw (player, arg) {
    player.model = arg[0]
}

function clothes (player) {
    alt.emitClient(player, 'clothesWebview:load')
}

function clothesmenu (player) {
    alt.emitClient(player, 'clothesMenu')
}


function setclothes (player, arg) {
    const index = arg[0]
    if (!index || isNaN(index)) return 'error'
    const id = player.getSyncedMeta('id')
    //db.selectData('Character', ['id', 'savedClothes'], data => {
    globalFunction.selectDataDB("Character", ["id", "savedClothes"]).then((data) => {
        const savedClothesData = data.find(res => {
            if (res.id == id) return res
        })
        const clothes = JSON.parse(savedClothesData.savedClothes)[index]
        if (!clothes) return 'error'
        globalFunction.setPlayerClothes(player, clothes)
        chat.send(player, (`{00ff00}Appearance set ${index}`))
    })
}

function goto (player, arg) {
    if (!arg) {
        chat.send(player, '{ff8f00}Command use : /goto [location]');
        return
    }

    const locationName = arg[0].toLowerCase();
    if (globalTable.locationsList[locationName] === undefined) {
        chat.send(player, '{ff8f00}Location undefined');
        return;
    }
    player.spawn(globalTable.locationsList[locationName].x, globalTable.locationsList[locationName].y, globalTable.locationsList[locationName].z)
    alt.log(player.name, 'going to', arg)
    chat.send(player, '{00ff00}Arrived to location')
}

function coords (player, arg) {
    if (!arg || !arg[1]) {
        chat.send(player, '{ff8f00}Command use : /coords [x] [y] [z]')
        return;
    }
    player.spawn(arg[0], arg[1], arg[2])
    chat.send(player, 'Arrived to ' + arg)
}

function vannish (player) {
    globalFunction.visibility(player)
}

function ping (player) {
    if (player.ping >= 150) {
        chat.broadcast('{00FFFF}' + player.name + '{FFFFFF}ce con il a {00FF00}'+ player.ping + 'ms')
    }
    chat.send(player, '{00FF00}Ping : {FFFFFF}' + player.ping + 'ms')
}

function clone (player) {
    alt.emitClient(player, 'clone')
}

function godmode (player) {
    if (!globalFunction.authorized(player, 2)) {
        return chat.send(player, "{ff8f00}Permissions insuffisantes")
    }

    var bool = !player.getSyncedMeta('godmode')
    player.setSyncedMeta('godmode', bool)
    //alt.emitClient(player, 'godmode', (bool))

    player.maxHealth = 1999
    player.health = 1999

    if (bool){
        chat.send(player, '{00FF00}Godmode Enabled')
    } else {
        chat.send(player, '{FF0000}Godmode Disabled')
    }
}

function info (player) {
    chat.send(player, `{ffc100}[${player.getSyncedMeta('id')}] {00ffff}${player.name}`)
}

function command (player) {
    alt.emitClient(player, 'command:Webview')
}

function op (player, arg) {
    if(!isNaN(arg[0]) && globalFunction.authorized(player)){
        player.setSyncedMeta('op', arg[0])
        db.updatePartialData(player.getSyncedMeta('id'), { op: arg[0]}, 'Character', res => {});
    }
}

function msg (player, arg) {
    if (!arg[0] || !arg[1]) {
        return chat.send(player, '{ff8f00}Command use : /msg [player] [message]')
    }
    var receiver = globalFunction.findEntityInList(arg[0], alt.Player.all)
    chat.send(receiver, arg[1])
}

function help (player) {
    alt.emitClient(player, 'helpWebview:load')
}

function garage (player, arg) {
    //globalFunction.vehicleToGarage(player)
    //alt.emitClient(player, 'vehicleToGarage:Request')
    alt.emit('garage', player, arg)
}








chat.registerCmd('r', (player, arg) => {
    r(player, arg)
})


chat.registerCmd('kill', (player, arg) => {
    kill(player, arg)
})

chat.registerCmd('save', (player) => {
    save(player)
});

chat.registerCmd('time', (player, arg) => {
    time(player, arg)
})

chat.registerCmd('clock', (player, action) => {
    clock(player, action)
})

chat.registerCmd('weather', (player, arg) => {
    weather(player, arg)
})

chat.registerCmd('kick', (kicker, arg) => {
    kick(kicker, arg)
})

chat.registerCmd('tp', (player, arg) => {
    tp(player, arg)
});


chat.registerCmd('tpm', (player) => {
    tpm(player)
})


chat.registerCmd('getpos', (player) => {
    getPos(player)
});


chat.registerCmd('sethp', (player, arg) => {
    sethp(player, arg)
});


chat.registerCmd('setarmor', (player, arg) => {
    setarmor(player, arg)
});


chat.registerCmd('heal', (player) => {
    heal(player)
});

chat.registerCmd('armor', (player) => {
    armor(player)
});


chat.registerCmd('respawn', (player) => {
    respawn(player)
});

chat.registerCmd('weapon', (player, arg) => {
    weapon(player, arg)
})

chat.registerCmd('pm', (player, arg) => {
    pm(player, arg)
});

chat.registerCmd('pmraw', (player, arg) => {
    pmraw(player, arg)
});


chat.registerCmd('clothes', (player) => {
    clothes(player)
})

chat.registerCmd('clothesmenu', (player) => {
    clothesmenu(player)
})

chat.registerCmd('saveclothes', (player, arg) => {
    if (!arg || !arg[0] || isNaN(arg[0])) {
        chat.send(player, '{fff800}Command use : /saveclothes [index]')
        return
    }
    globalFunction.savePlayerClothes(player, arg[0])
});


chat.registerCmd('setclothes', (player, arg) => {
    setclothes(player, arg)
});


chat.registerCmd('goto', (player, arg) => {
    goto(player, arg)
});


chat.registerCmd('coords', (player, arg) => {
    coords(player, arg)
});




//////////////////////////////////

//MISC


chat.registerCmd('v', (player) => {
    vannish(player)
});

chat.registerCmd('ping', (player) => {
    ping(player)
});

chat.registerCmd('clone', (player) => {
    clone(player)
})

chat.registerCmd('godmode', (player) => {
    godmode(player)
})

chat.registerCmd('info', (player) => {
    info(player)
})

chat.registerCmd('command', (player) => {
    command(player)
})    

chat.registerCmd('op', (player, arg) => {
    op(player, arg)
})

chat.registerCmd('msg', (player, arg) => {
    msg(player, arg)
})

chat.registerCmd('help', (player) => {
    help(player)
})

chat.registerCmd('g', (player, arg) => {    
    garage(player, arg)
})


chat.registerCmd("w", (player, cmd) => {
    if (!cmd || !cmd[0]) return
    alt.emitClient(player, "waypoint:Cmd", (cmd[0]))
    return
})

chat.registerCmd("dimension", (player, n) => {
    if (!n || !n[0]) return
    player.dimension = parseInt(n[0])
})



chat.registerCmd('game', (player, state) => {
    console.log(player.vehicle.getGamestateDataBase64())
    //player.vehicle.setGamestateDataBase64()
})
chat.registerCmd('sgame', (player, state) => {
    player.vehicle.setGamestateDataBase64(state)
})

chat.registerCmd('damage', (player, state) => {
    console.log(player.vehicle.getDamageStatusBase64(state))
})
chat.registerCmd('sdamage', (player, state) => {
    player.vehicle.setDamageStatusBase64(state)
})







chat.registerCmd('test', (player) => {
    if (player.vehicle) player.vehicle.spawn(0, 0, 100)
    
})

