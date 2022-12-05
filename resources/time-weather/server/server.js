import * as alt from "alt-server"
import * as db from "database"
import * as chat from "chat"
import ClockServer from "./ClockServer"


alt.on("initTimeWeather", initTimeWeather)

if (db.isReady()) 
    initTimeWeather()

let clock
async function initTimeWeather () {
    let {time, weather} = await getServerData()
    let {h, m} = time
    clock = new ClockServer(h, m)
    clock.start()
}

function getServerData () {
    return new Promise((resolve, reject) => {
        db.fetchData("id", 1, "Server", server => {
            const time = !server.time ? {h: 12, m: 0} : JSON.parse(server.time)
            const weather = !server.weather ? 1 : server.weather
            if (!server)
                db.upsertData({ id: 1, time: JSON.stringify(time), weather: weather }, 'Server', callback => {})
            resolve({time, weather})
        })
    })
}

alt.on("playerConnect", (player) => {
    alt.emitClient(player, "initClientClock", clock.getClockData())
})

chat.registerCmd("time", (player, arg) => {
    let hour = isNaN(arg[0]) ? arg[0] : parseInt(arg[0])
    console.log(hour);
    console.log(typeof(hour));
    console.log(hour >= 0 && hour < 24);
    switch (true) {
        
        case "day":
        case "jour":
            hour = 12
            break;

        case "night":
        case "nuit":
            hour = 0
            break;
    
        default:
            if (hour >= 0 && hour < 24)
                break;
            chat.send(player, '{ff8f00}Entier compris entre 0 et 23 attendu')
            return
    }
    clock.setTime(hour, 0)
    chat.broadcast(`{00FFFF}Changement d'heure, il est actuellement ${hour}h`)
})

chat.registerCmd("clock", (player, [parameter, value]) => {
    console.log(parameter);
    switch (parameter) {

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
            clock.setSpeed(parseInt(2000 / value))
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
