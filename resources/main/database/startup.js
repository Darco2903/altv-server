import SQL from './database.js'
import { Account, Character, Vehicle, Server } from './entities.js';


let db
const Tables = [Account, Character, Vehicle, Server]

export function getDataBase () {
    return db
}

function dbServer () {
    db = new SQL('mysql', 'localhost', 3306, 'altv', 'AltVDB!', 'altv', Tables)
}

function dbUniserverZ () {
    db = new SQL('mysql', 'localhost', 3306, 'root', 'abc123', 'altv', Tables)
}

export function initConnection () {
    if (process.platform === "win32") dbUniserverZ()
    else dbServer()
}
