import * as alt from 'alt-server';
import * as chat from 'chat';
import * as db from "database"
//import * as Table from './Tables.js'
import fs from "fs"
import fetch from 'node-fetch';

///////////////////////////////

export function log (msg) {
    alt.log("~y~" + msg)
}

//AUTO

function saveLog (msg) {
    alt.log("~g~" + msg)
}

export async function saveAll () {
    //  savePlayers()
    //  saveServer()
    //  saveVehicles()
    //  saveLog("Server saved")
}

let saveInterval
export function startAutoSave (interval) {
    saveInterval = setInterval(saveAll, interval*60*1000);
    saveLog("Auto save start")
}

export function stopAutoSave () {
    clearInterval(autoSave)
    saveLog("Auto save stop")
}


let saveVehicles = function () {return}
alt.on("anyResourceStart", (resource) => {
    if (resource == "carManager") {
        import("carManager").then(res => {
            saveVehicles = res.saveVehicles
        })
        
    }
})

export function saveServer () {
    const time = JSON.stringify(time)
    db.updatePartialData(1, {time, weather}, "Server", callback => {})
}


let weather
function changeWeather (weat) {
    weat = Table.weatherTable[weat]
    chat.broadcast(`{00FFFF}Changing weather to ${weat}`)
    weather = weat
    setWeather()
    //db.updatePartialData(1, { weather: weat }, 'Server', callback => {})
}

function setWeather (player) {
    if (player)
        alt.emitClient(player, "weather:Set", weather)
    else
        alt.emitAllClients("weather:Set", weather)
} 


///////////////////////////////

//PLAYER




function weapongive (player, weapon) {
    const weaponName = weapon.toLowerCase();
    if (Table.weaponList[weaponName] === undefined) {
        chat.send(player, '{FF0000} Weapon undefined');
        return;
    }

    player.giveWeapon(Table.weaponList[weaponName], 999, true)
}

function playerheal (player) {
    if (player.health === 200) {
        chat.send(player, '{00FF00}Santé maximum')
        return
    }
    player.health = 200
    alt.log(player.name, 'healed himself')
}

function playerarmor (player) {
    player.armour = 100
}


function setNewPlayerModel (player, pm) {
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


function setCustomPlayerModel (player, data) {
    
    var dlc = alt.hash(data.dlc)
    var clothes = []

    for (var i = 0; i < 12 ; i++) {
        clothes[i] = {dlc: dlc, drawable: 0, texture: 0, palette: 0}
    }

    clothes[12] = data.pm
    setPlayerClothes(player, clothes)
}


function savePlayerClothes (player, index) {
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

function setPlayerClothes (player, clothes) {
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


function editPlayerClothes (player, arg) {
    
    var n = arg[0]
    var b = arg[1]
    var c = arg[2]
    var d = arg[3]

    player.setClothes(n, b, c, d)
   
}

function getPlayerClothes (player) {
    var clothes = []

    for (var i = 0; i < 12; i++) {
        clothes[i] = player.getDlcClothes(i)
    }
    clothes[12] = player.model
    return clothes
}



function visibility (entity) {
    if (entity.visible === true) entity.visible = false
    else entity.visible = true
}


function getAllPlayers () {
    return alt.Player.all
}



function findEntityInList (entityToFind, entityList) { //find an entity in a list by name or id and return the entity
    for (var entity of entityList) {
        if (entityToFind.toLowerCase() == entity.name.toLowerCase()) return entity
        else if (entityToFind == entity.getSyncedMeta('model')) return entity
        else if (entityToFind == entity.getSyncedMeta('id')) return entity
    }
    return null
}


function tpPlayerToPlayer (player1, player2) {     //teleport player1 to player2
    player1 = findEntityInList(player1, alt.Player.all)
    player2 = findEntityInList(player2, alt.Player.all)

    if (player1 && player2) player1.spawn(player2.pos)
    else return 'notfound'
}




export function authorized (player, authRequired) {       //return a boolean if player get op authorization
    if (player.getSyncedMeta('op') >= authRequired)
        return true
    chat.send(player, '{ff8f00}Permissions insuffisantes')
    return false
}




//////////////////////////////////////////

//  Other


function dbUpdateBuild (version) {
    db.selectData("Vehicle", ["id", "appearance"], dataList => {
        dataList.forEach(vehData => {
            let oldAppearance = JSON.parse(vehData.appearance)
            const appearance = JSON.stringify(`${version}_${oldAppearance.split('_')[1]}`)
            db.updatePartialData(vehData.id, { appearance }, "Vehicle", veh => {})
        })
        log("DataBase build updated succesfully")
    })
}


export function update () {
    getVersion().then(last => {
        fs.readFile("version", 'utf8', function (err, data) {
            const server = JSON.parse(data)
            if (server.version != last.version) {
                fs.writeFile("version", JSON.stringify(last), function (err) {})
                dbUpdateBuild(last.buildnumber)
                alt.log("Updated successfully")
                setTimeout(alt.stopServer, 200)
            }
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
        alt.log(`${color.FgRed}DB Connection Error`)
        setTimeout(restartServer, 1000)
    }, 5000);
}

export function multipleExist(arr, values) {
    return values.every(value => {
      return arr.includes(value)
    })
}