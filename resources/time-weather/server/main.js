import * as alt from "alt-server"
import * as db from "database"
import * as chat from "chat"
import Clock from "./Clock"


let clock

alt.on("serverStarted", initClock)
alt.on("ConnectionComplete", initTimeWeather)
//alt.on("resourceStop", saveServerData)

alt.on("playerConnect", (player) => {
    alt.emitClient(player, "time:setTime", clock.getTime())
    alt.emitClient(player, "time:setSpeed", clock.speed)
    if (clock.started) 
        alt.emitClient(player, "time:start")
    else
        alt.emitClient(player, "time:stop")
})


function initClock () {
    clock = new Clock()
    clock.start()

    if (db.isReady()) 
        setTimeout(initTimeWeather, 100);
}

async function initTimeWeather () {
    let {time: {h, m}, weather} = await getServerData()
    clock.setTime(h, m)
}

function getServerData () {
    return new Promise((resolve, reject) => {
        db.fetchData("id", 1, "Server", server => {
            const time = server.time != undefined ? JSON.parse(server.time) : {h: 12, m: 0}
            const weather = server.weather != undefined ? server.weather : 1
            if (!server)
                db.upsertData({ id: 1, time: JSON.stringify(time), weather: weather }, 'Server', callback => {})
            resolve({time, weather})
        })
    })
}

function saveServerData () {
    db.updatePartialData(1, {time: JSON.stringify(clock.getTime()), weather: 1}, "Server", callback => {
        db.log("Time and Weather successfully saved")
    })
}

function timeCommand (time) {
    let hour
    switch (!isNaN(time) || time) {

        case time >= 0 && time < 24:
            hour = time
            break;

        case "day":
            hour = 12
            break;

        case "night":
            hour = 0
            break;
    
        default:
            chat.send(player, '{ff8f00}Entier compris entre 0 et 23 attendu')
            return
    }
    clock.setTime(hour, 0)
    chat.broadcast(`{00FFFF}Changement d'heure, il est actuellement ${hour}h`)
}

chat.registerCmd("time", (player, [parameter, value]) => {
    if (value != undefined && isNaN(value)) {
        chat.send(player, "{555555}/clock [parameter] [value]")
        return
    }
    value = parseInt(value)

    switch (parameter) {

        case "set":
            timeCommand(value)
            break;

        case "start":
        case "resume":
            if (clock.started) {
                chat.send(player, "{ff8f00}Clock already running")
                return
            }
            clock.start()
            chat.broadcast('{00ffff}Clock {ffff00}started')
            break;
        
        case "stop":
        case "pause":
            if (!clock.started) {
                chat.send(player, "{ff8f00}Clock already stopped")
                return
            }
            clock.stop()
            chat.broadcast('{00ffff}Clock {ffff00}stopped')
            break;
        
        case "speed":
            if (value < 1 || value > 100) {
                chat.send(player, "{ff8f00}Speed must be a number in between 1 and 100")
                return
            }
            clock.setSpeed(value)
            chat.broadcast(`{00ffff}Clock speed at {ffff00}x${value}`)
            break;
        
        case "help":
        case undefined:
            chat.send(player, "{555555} /clock [param]")
            chat.send(player, "{555555} /clock start")
            chat.send(player, "{555555} /clock stop")
            chat.send(player, "{555555} /clock speed [1-100]")
            break;

        default:
            chat.send(player, "{ff8f00} Wrong usage")
            return

    }

})



//  setInterval(() => {
//      console.log(clock.getTime());
//  }, 2000);