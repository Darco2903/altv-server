import * as alt from "alt-server"
import SQL from './database.js'
import { Account, Character, Vehicle, Server } from './entities.js';


const Tables = [Account, Character, Vehicle, Server]

let db
let ready = false

alt.on("resourceStart", initConnection)

alt.on("ConnectionComplete", () => ready = true)

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

export function isReady () {
    return ready
}

export function selectData (repoName, fieldNamesArray, callback) {
        db.selectData(repoName, fieldNamesArray, callback)
}

export function updatePartialData (id, partialObjectData, repoName, callback) {
    db.updatePartialData(id, partialObjectData, repoName, callback)
}

export function upsertData (document, repoName, callback) {
    db.upsertData(document, repoName, callback)
}

export function deleteByIds (ids, repoName, callback) {
    db.deleteByIds(ids, repoName, callback)
}

export function fetchData (fieldName, fieldValue, repoName, callback) {
    db.fetchData(fieldName, fieldValue, repoName, callback)
}

export function fetchAllData (repoName, callback) {
    db.fetchAllData(repoName, callback)
}

export function fetchByIds (ids, repoName, callback) {
    db.fetchByIds(ids, repoName, callback)
}

export function log (msg) {
    db.log(msg)
}

