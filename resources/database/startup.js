import DataBase from "darco2903-db";
import entities from "./entities.js";
import config from "./config.json" assert { type: "json" };
const { type, host, port, username, password, database } = config;

const db = new DataBase(type, host, port, username, password, database, entities);

async function connect() {
    return await db.connect();
}

async function disconnect() {
    return await db.disconnect();
}

function isConnected() {
    return db.isConnected();
}

async function insertData(data, repoName) {
    return await db.insertData(data, repoName);
}

async function insertDatsa(datas, repoName) {
    return await db.insertDatas(datas, repoName);
}

async function updateDataByIds(ids, data, repoName) {
    return await db.updateDataByIds(ids, data, repoName);
}

async function deleteByIds(ids, repoName) {
    return await db.deleteByIds(ids, repoName);
}

async function fetchById(ids, repoName) {
    return await db.fetchById(ids, repoName);
}

async function fetchByIds(ids, repoName) {
    return await db.fetchByIds(ids, repoName);
}

async function fetchAllRepo(repoName) {
    return await db.fetchAllRepo(repoName);
}

async function fetchAllByFields(fieldsNames, repoName) {
    return await db.fetchAllByFields(fieldsNames, repoName);
}

async function fetchAllByValue(fieldName, fieldValue, repoName) {
    return await db.fetchAllByValue(fieldName, fieldValue, repoName);
}

export {
    connect,
    disconnect,
    isConnected,
    insertData,
    insertDatsa,
    updateDataByIds,
    deleteByIds,
    fetchById,
    fetchByIds,
    fetchAllRepo,
    fetchAllByFields,
    fetchAllByValue,
};
