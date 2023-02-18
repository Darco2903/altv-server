import * as alt from "alt-server";
import * as db from "database";
import * as chat from "chat";
import Clock from "./Clock";

let clock;

alt.on("resourceStart", initClock);
alt.on("ConnectionComplete", initTimeWeather);
alt.on("save", saveServerData);

alt.on("resourceStop", () => {
    alt.setMeta("time", clock.getTime());
    //alt.setMeta("weather", )
});

alt.on("playerConnect", (player) => {
    alt.emitClient(player, "time:setTime", clock.getTime());
    alt.emitClient(player, "time:setSpeed", clock.speed);
    if (clock.started) alt.emitClient(player, "time:start");
    else alt.emitClient(player, "time:stop");
});

function saveLog(msg) {
    alt.log("~g~" + msg);
}

function initClock() {
    clock = new Clock();
    clock.start();
    if (db.isReady()) initTimeWeather();
}

async function initTimeWeather() {
    const time = alt.getMeta("time");
    if (time) clock.setTime(time.h, time.m);
    else setDatabaseData();
}

function setDatabaseData() {
    db.fetchData("id", 1, "Server", (server) => {
        if (!server) {
            registerServerData();
            return;
        }
        const { time, weather } = server;
        const { h, m } = JSON.parse(time);
        clock.setTime(h, m);
        //weather
    });
}

function registerServerData() {
    const time = { h: 12, m: 0 };
    const weather = 1;
    db.upsertData({ id: 1, time: JSON.stringify(time), weather: weather }, "Server", (callback) => {});
    clock.setTime(time.h, time.m);
}

function saveServerData() {
    db.updatePartialData(1, { time: JSON.stringify(clock.getTime()), weather: 1 }, "Server", (callback) => {
        saveLog("Time and Weather saved");
    });
}

function timeCommand(player, time) {
    let hour;
    switch (!isNaN(time) || time) {
        case time >= 0 && time < 24:
            hour = time;
            break;

        case "day":
            hour = 12;
            break;

        case "night":
            hour = 0;
            break;

        default:
            alt.emitClient(player, "notification", "command", "Entier compris entre 0 et 23 attendu");
            return;
    }
    clock.setTime(hour, 0);
    alt.emitAllClients("notification", "success", `Changement d'heure, il est actuellement ${hour}h`);
}

chat.registerCmd("time", (player, [parameter, value]) => {
    if (value != undefined && isNaN(value)) {
        alt.emitClient(player, "notification", "command", "/time [parameter] [value]");
        return;
    }
    value = parseInt(value);

    switch (parameter) {
        case "set":
            timeCommand(player, value);
            break;

        case "start":
        case "resume":
            if (clock.started) {
                alt.emitClient(player, "notification", "command", "L'horloge est déjà en marche");
                return;
            }
            clock.start();
            alt.emitAllClients("notification", "success", "L'horloge a démarré");
            break;

        case "stop":
        case "pause":
            if (!clock.started) {
                alt.emitClient(player, "notification", "command", "L'horloge est déjà en pause");
                return;
            }
            clock.stop();
            alt.emitAllClients("notification", "success", "L'horloge s'est arrêtée");
            break;

        case "speed":
            if (value < 1 || value > 100) {
                alt.emitClient(player, "notification", "command", "La vitesse doit être un nombre entre 1 et 100");
                return;
            }
            clock.setSpeed(value);
            alt.emitAllClients("notification", "success", `Vitesse de l'horloge x${value}`);
            break;

        case "help":
            alt.emitClient(player, "notification", "success", "/time [param]\n/time start\n/time stop\n/time speed [1-100]\n");
            break;

        default:
            alt.emitClient(player, "notification", "command", "Mauvais usage\n/time help pour plus d'info");
            return;
    }
});
