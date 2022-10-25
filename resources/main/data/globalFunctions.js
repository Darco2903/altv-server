import * as alt from 'alt-server';
import * as chat from 'chat';
import * as db from "database"
import * as Table from './globalTables.js'
import fs from "fs"
import fetch from 'node-fetch';


///////////////////////////////

//AUTO

export async function saveAll () {
    savePlayers()
    saveVehicles()
    saveServer()
    alt.log(`${Table.color.FgGreen}Server saved`)
}

let saveInterval
export function startAutoSave (interval) {
    saveInterval = setInterval(saveAll, interval*60*1000);
    alt.log(`${Table.color.FgGreen}Auto save start`)
}

export function stopAutoSave () {
    clearInterval(autoSave)
    alt.log(`${Table.color.FgGreen}Auto save stop`)
}

export function savePlayers () {
    alt.Player.all.forEach(player => {
        const id = player.getSyncedMeta('id')
        if (!id) return player.kick('Data sync error')
        const pos = vectorFormat(player.pos)
        db.updatePartialData(id, { position: JSON.stringify(pos) }, 'Character', callback => {})
    })
}


export function saveVehicles () {
    alt.Vehicle.all.forEach(veh => {
        const id = veh.getSyncedMeta('id')
        //alt.log(id)
        if (!id) return alt.log(veh.model, id, 'Data sync error')
        const pos = vectorFormat(veh.pos)
        const rot = vectorFormat(veh.rot)
        //update only if veh is out garage
        if (!veh.getSyncedMeta('garage').inGarage) db.updatePartialData(id, { position: JSON.stringify(pos), rotation: JSON.stringify(rot) }, 'Vehicle', callback => {})
    });
}


export function saveServer () {
    db.updatePartialData(1, {time: JSON.stringify(clockTime), weather: weather}, "Server", callback => {})
}


function initServerData () {
    return new Promise((resolve, reject) => {
        db.selectData('Server', ['id', 'time', 'weather'], data => {
            if (!data) {
                const initTime = {h: 12, m: 0}
                const initWeather = 1
                resolve({time: initTime, weather: initWeather})
                db.upsertData({ id: 1, time: JSON.stringify(initTime), weather: initWeather }, 'Server', callback => {})
                return
            }
            data = data[0]
            resolve({time: JSON.parse(data.time), weather: data.weather})
        })
    })
}


/*
let serverTimeout = false
export function initServerTimeout (time) {
    if (time == false) serverTimeout = false
    else serverTimeout = true

    if (!serverTimeout) return
    alt.log(time)
    if (time < 2) return stopServer() //sudo service altv-server stop

    setTimeout(() => {
        time--
        initServerTimeout(time)
    }, 5000);
}
*/

let clockTime
let h
let m
let clockStarted
let clockSpeed
let weather

export async function initServer () {
    const serverData = await initServerData()
    weather = serverData.weather
    clockTime = serverData.time
    h = clockTime.h
    m = clockTime.m
    clockStarted = true
    clockSpeed = 2000
    clock()
}


export function clock () {
    m++
    if (m >= 60) {
        h++
        m = 0
        if (h >= 24) {
            h = 0
        }
    }
    clockTime = {'h': h, 'm': m}
    if (clockStarted) setTimeout(clock, clockSpeed)
}


export function clockInteract (action) {
    const [parameter, arg] = action
    switch (parameter) {
        case "speed":
            if (arg < 1 || arg > 100) return '{ff8f00}Speed must be a number in between 1 and 100'
            clockSpeed = parseInt(2000 / arg)
            chat.broadcast(`{00ffff}Clock speed at {ffff00}x${arg}`)
            break;

        case "stop":
            if (!clockStarted) return '{ff8f00}Clock already stopped'
            clockStarted = false
            chat.broadcast('{00ffff}Clock {ffff00}stopped')
            break;

        case "start":
            if (clockStarted) return '{ff8f00}Clock already running'
            clockSpeed = 2000
            clockStarted = true
            clock()
            chat.broadcast('{00ffff}Clock {ffff00}started')
            break;

        case "time":
            h = arg
            m = 0
            break;
        
        default:
            return `{ff8f00}Unknow parameter: {ff5500}${parameter}`
    }
    clockTime = {'h': h, 'm': m}
    alt.log(clockTime);
    setTime()
}


export function changeWeather (weat) {
    weat = Table.weatherTable[weat]
    chat.broadcast(`{00FFFF}Changing weather to ${weat}`)
    weather = weat
    setWeather()
    //db.updatePartialData(1, { weather: weat }, 'Server', callback => {})
}

export function setWeather (player) {
    if (player) alt.emitClient(player, "weather:Set", weather)
    else alt.emitAllClients("weather:Set", weather)
} 


export function setTime (player) {
    if (player) alt.emitClient(player, 'clock:Interact', clockTime, clockSpeed, clockStarted)
    else alt.emitAllClients('clock:Interact', clockTime, clockSpeed, clockStarted)
}


function killProcess (msg) {
    alt.log(Table.color.FgMagenta + msg)
    saveAll()
    setTimeout(() => {
        alt.Player.all.forEach(player => player.kick(msg))
        setTimeout(process.exit, 100)
    }, 1000);
}

export function stopServer () {
    const msg = "Server Shutting Down"
    killProcess(msg)
}

export function restartServer () {
    const msg = "Server Restarting"
    killProcess(msg)
}


export function restartResource (res) {
    if (res == "r") alt.restartResource("chat")
    else alt.restartResource(res)
}




///////////////////////////////

//PLAYER




export function weapongive (player, weapon) {
    const weaponName = weapon.toLowerCase();
    if (Table.weaponList[weaponName] === undefined) {
        chat.send(player, '{FF0000} Weapon undefined');
        return;
    }

    player.giveWeapon(Table.weaponList[weaponName], 999, true)
}

export function playerheal (player) {
    if (player.health === 200) {
        chat.send(player, '{00FF00}Santé maximum')
        return
    }
    player.health = 200
    alt.log(player.name, 'healed himself')
}

export function playerarmor (player) {
    player.armour = 100
}


export function setNewPlayerModel (player, pm) {
    if (Table.playerModelsList[pm] === undefined) {
        chat.send(player, '{ff8f00}PlayerModel undefined');
        return;
    }

    player.model = Table.playerModelsList[pm]
    player.setSyncedMeta('clothes', null/*getPlayerClothes(player)*/)
    player.health = 200
    
    db.updatePartialData(player.getSyncedMeta('id'), { playerModel: JSON.stringify(player.model), clothes: null}, "Character", callback => {})

    const veh = player.vehicle
    if (veh) {
        setTimeout(() => {
            alt.emitClient(player, 'vehicle:SetPlayerIn', (veh))
        }, 100);
    }
}


export function setCustomPlayerModel (player, data) {
    
    var dlc = alt.hash(data.dlc)
    var clothes = []

    for (var i = 0; i < 12 ; i++) {
        clothes[i] = {dlc: dlc, drawable: 0, texture: 0, palette: 0}
    }

    clothes[12] = data.pm
    setPlayerClothes(player, clothes)
}


export function savePlayerClothes (player, index) {
    const id = player.getSyncedMeta('id')
    if (!index) {

        var clothes = getPlayerClothes(player)
        player.setSyncedMeta('clothes', clothes)

        db.updatePartialData(id, { clothes: JSON.stringify(clothes) }, "Character", callback => {})
    }

    db.selectData('Character', ['id', 'savedClothes'], data => {
        var savedClothes = data.find(char => {
            if (char.id == id) return char.savedClothes
        })

        if (!savedClothes) savedClothes = []
    
        savedClothes[index] = getPlayerClothes(player)
    
        db.updatePartialData(id, {savedClothes: JSON.stringify(savedClothes)}, "Character", callback => {})
        chat.send(player, `{00ff00}Appearance saved in ${arg[0]}`)
    })
}

export function setPlayerClothes (player, clothes) {
    if (!clothes) {
        chat.send(player, '{ff0000}Clothes undefined')
        return
    }
    const veh = player.vehicle
    if (veh) {
        setTimeout(() => {
            alt.emitClient(player, 'vehicle:SetPlayerIn', (veh))
        }, 100);

    }

    player.model = clothes[12]

    for (var i = 0; i < 12; i++) {
        
        var dlc = clothes[i].dlc
        var drawable = clothes[i].drawable
        var texture = clothes[i].texture
        var palette = clothes[i].palette

        if (drawable > 127) {
            player.setClothes(i, drawable, texture, palette)
        } else {
            player.setDlcClothes(dlc, i, drawable, texture, palette)
        }
    }
    db.updatePartialData(player.getSyncedMeta("id"), {playerModel: clothes[12], clothes: JSON.stringify(clothes)}, "Character", callback => {})
}


export function editPlayerClothes (player, arg) {
    
    var n = arg[0]
    var b = arg[1]
    var c = arg[2]
    var d = arg[3]

    player.setClothes(n, b, c, d)
   
}

export function getPlayerClothes (player) {
    var clothes = []

    for (var i = 0; i < 12; i++) {
        clothes[i] = player.getDlcClothes(i)
    }
    clothes[12] = player.model
    return clothes
}



export function visibility (entity) {
    if (entity.visible === true) entity.visible = false
    else entity.visible = true
}


export function getAllPlayers () {
    return alt.Player.all
}



export function findEntityInList (entityToFind, entityList) { //find an entity in a list by name or id and return the entity
    for (var entity of entityList) {
        if (entityToFind.toLowerCase() == entity.name.toLowerCase()) return entity
        else if (entityToFind == entity.getSyncedMeta('model')) return entity
        else if (entityToFind == entity.getSyncedMeta('id')) return entity
    }
    return null
}



export function kick (kicker, kicked, message) {
    if (!kicked){
        chat.send(kicker, '{ff8f00}Player not found')
        return
    } else {
        if (!message) message = 'Tépa bo désl'
        kicked.kick(`Kicked by ${kicker.name} : ${message}`)
        chat.broadcast(`${kicked.name} was kicked by ${kicker.name} - Reason : ${message}`)
    }
}


export function tpPlayerToPlayer (player1, player2) {     //teleport player1 to player2
    player1 = findEntityInList(player1, alt.Player.all)
    player2 = findEntityInList(player2, alt.Player.all)

    if (player1 && player2) player1.spawn(player2.pos)
    else return 'notfound'
}





//////////////////////////////////////////

//Player Connection


export function AuthPlayer(player) {      //get Player id with RSID or create an Account if not found
    db.selectData('Account', ['id', 'name', 'rsid', 'ip'], data => {
        if (!data) return accountcreation(player)
        data.find(acc => {
            if (acc.rsid == player.socialID) {
                db.updatePartialData(acc.id, { name: player.name, ip: player.ip }, 'Account', callback => {})
                login(player, acc.id)
            }
        })        
    });
};


function login(player, id) {
    db.selectData('Character', ['id', 'op', 'position', 'playerModel', 'clothes'], data => {
        if (!data) {
            alt.log(`${id} ${player.socialID} ${player.name} kicked, Reason: login error`)
            player.kick(`Login error : ${player.socialID}`)
            return
        }

        const account = data.find(acc => {
            if (acc.id === id)
                return acc;
        });

        for (const meta in account) {
            let toSync
            try {
                toSync = JSON.parse(account[meta])
            } catch{
                toSync = account[meta]
            }

            player.setSyncedMeta(meta, toSync)
        }

        player.setSyncedMeta('noclip', false)
        player.setSyncedMeta('godmode', false)

        alt.log(`${Table.color.FgYellow}${player.name} connected to the server`)
        chat.broadcast(`{00FFFF}${player.name} {FFFFFF}le best est arrivé`)
        
        spawn(player)

    });
};


function accountcreation (player) {
    db.upsertData({ name: player.name, rsid: player.socialID, ip: player.ip }, 'Account', acc => {
        db.upsertData({ id: acc.id, op: 0 }, 'Character', callback => {})
        alt.log('Account and Character created')
    })
    setTimeout(AuthPlayer, 100, player);
}


export function spawn (player) {
    const playerPos = player.getSyncedMeta('position')
    if (!playerPos) player.spawn(180, -1030, 28, 0);
    else player.spawn(playerPos)
    
    const playerModel = player.getSyncedMeta('playerModel')
    if (!playerModel) player.model = 'mp_m_freemode_01'
    else player.model = playerModel
    
    const playerClothes = player.getSyncedMeta('clothes')
    if (playerClothes) {
        setPlayerClothes(player, playerClothes)
    }

    //player.setWeather(weather)
    setWeather(player)
    player.visible = true
    player.health = 200

}

export function authorized (player, authRequired) {       //return a boolean if player get op authorization
    return (player.getSyncedMeta('op') >= authRequired)
}















//////////////////////////////////////////

//  Other


export function vectorFormat (vec) {
    let formatedVec = {
        x: parseInt(vec.x.toFixed(2)),
        y: parseInt(vec.y.toFixed(2)),
        z: parseInt(vec.z.toFixed(2))
    }
    return formatedVec
}


export function getVehColor (vehicle) {
    let appearance = vehicle.getSyncedMeta('appearance')
    let color = appearance.substr(5, 4)
    return convertBase64toDecimal(color)
}


export function convertBase64toDecimal (base64) {
    let binary_string = Buffer.from(base64, 'base64').toString()
    let len = binary_string.length;
    let bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes
}


export function dbUpdateBuild (version) {
    db.selectData("Vehicle", ["id", "appearance"]).then((dataList) => {
        if (dataList === undefined) return
        dataList.forEach(vehData => {
            let appearance = JSON.parse(vehData.appearance)
            const newAppearance = JSON.stringify(`${version}_${appearance.split('_')[1]}`)
            db.updatePartialData(vehData.id, { appearance: newAppearance }, "Vehicle")
            //db.updatePartialData(vehData.id, { garage: JSON.stringify({inGarage: false}) }, "Vehicle")
        })
        //alt.log(`${Table.color.FgYellow}DataBase updated build succesfully`)
    })
}


export function update () {
    getVersion().then(last => {
        fs.readFile("version", 'utf8', function (err, data) {
            const server = JSON.parse(data)
            if (server.version != last.version) {
                fs.writeFile("version", JSON.stringify(last), function (err) {})
                dbUpdateBuild(last.buildnumber)
                alt.log(`${Table.color.FgYellow}Updated successfully`)
                setTimeout(restartServer, 1000)
                return
            }
            alt.emit("initDataBase")
        })
    })
}


function parseObject (str) {
    [' ', '{', '}', '"'].forEach(symbol => {str = str.replaceAll(symbol, '')})
    const arr = str.split(',')
    let obj = {}
    arr.forEach(elem => {
        let [key, value] = elem.split(':')
        if (!isNaN(value)) value = parseFloat(value)
        obj[key] = value
    })
    return obj
}


function getVersion () {
    return new Promise((resolve, reject) => {
        const url = "https://raw.githubusercontent.com/altmp/altv-docs-gta/master/articles/references/versions.md"
        fetch(url)
        .then(response => response.text())
        .then(str => {
            str = str.split("```js\n")[1]
            str = str.split("```\n")[0]
            str = str.replaceAll(",\n", '\n')
            let arr = []
            let versions = []
            for (const line of str.split('\n')) if (line.includes("version:")) arr.push(line) 
            arr.forEach(ver => {
                const obj = parseObject(ver)
                versions.push(obj)
            })
            let n = versions.length -1
            resolve(versions[n])
        })
    })
}


function checkDbConnection () {
    setTimeout(() => {
        if (db.connection) return
        alt.log(`${Table.color.FgRed}DB Connection Error`)
        setTimeout(restartServer, 1000)
    }, 5000);
}

export function multipleExist(arr, values) {
    return values.every(value => {
      return arr.includes(value)
    })
}