import * as alt from "alt-server"
import { color } from "server-extended"
import SQL from './database.js'
import { Account, Character, Vehicle, Server } from './entities.js';


const Tables = [Account, Character, Vehicle, Server]

let db

alt.on("resourceStart", initConnection)


function getDataBase () {
    return db
}

function dbServer () {
    db = new SQL('mysql', 'localhost', 3306, 'altv', 'AltVDB!', 'altv', Tables)
}

function dbUniserverZ () {
    db = new SQL('mysql', 'localhost', 3306, 'root', 'abc123', 'altv', Tables)
}

function initConnection () {
    if (process.platform === "win32") dbUniserverZ()
    else dbServer()
}


function selectData (repoName, fieldNamesArray, callback) {
        db.selectData(repoName, fieldNamesArray, callback)
}

function updatePartialData (id, partialObjectData, repoName, callback) {
    db.updatePartialData(id, partialObjectData, repoName, callback)
}

function upsertData (document, repoName, callback) {
    db.upsertData(document, repoName, callback)
}

function deleteByIds (ids, repoName, callback) {
    db.deleteByIds(ids, repoName, callback)
}

function log (msg) {
    alt.log(color.FgMagenta + msg)
}

export {selectData, updatePartialData, upsertData, deleteByIds, log}
