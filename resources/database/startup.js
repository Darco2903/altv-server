import * as alt from "alt-server";
import orm from "typeorm";
import config from "./config.js";

import * as entities from "./entities.js";
const Tables = Object.values(entities);

let connection;

alt.on("serverStarted", async () => {
    connection = await SQL(config.type, config.host, config.port, config.username, config.password, "altv", Tables);
});

async function SQL(type, host, port, username, password, dbName, entities) {
    log(`Starting Database Connection`);
    try {
        const conn = await orm.createConnection({
            type,
            host,
            port,
            username,
            password,
            database: `${dbName}`,
            entities,
            cache: true,
        });
        await conn.synchronize();
        log("Database Connected Successfully");
        setTimeout(() => alt.emit("ConnectionComplete"), 500);
        return conn;
    } catch (error) {
        alt.logError("Unable to make database connection");
        throw error;
    }
}

export function log(msg) {
    alt.log("~m~" + msg);
}

export function isReady() {
    return !!connection;
}

/**
 * Look up a document by the fieldName and fieldValue in a repo by name.
 * @param fieldName String of the field name.
 * @param fieldValue String of the field value.
 * @param repoName ie. "Account"
 * @param callback undefined | document
 */
export function fetchData(fieldName, fieldValue, repoName, callback) {
    const repo = connection.getRepository(repoName);
    repo.findOne({ where: { [fieldName]: fieldValue } })
        .then((res) => {
            return callback(res);
        })
        .catch((err) => {
            console.error(err);
            return callback(undefined);
        });
}

/**
 * Async Version
 * Look up a document by the fieldName and fieldValue in a repo by name.
 * @param fieldName String of the field name.
 * @param fieldValue String of the field value.
 * @param repoName ie. "Account"
 */
export async function fetchDataAsync(fieldName, fieldValue, repoName) {
    return new Promise((resolve, reject) => {
        const repo = connection.getRepository(repoName);

        repo.findOne({ where: { [fieldName]: fieldValue } })
            .then((res) => {
                return resolve(res);
            })
            .catch((err) => {
                console.error(err);
                return reject(undefined);
            });
    });
}

/**
 * Look up document with the highest id in repo
 * @param repoName ie "Account"
 * @param callback undefined | document
 */
export function fetchLastId(repoName, callback) {
    const repo = connection.getRepository(repoName);
    repo.findOne({ order: { id: "DESC" } })
        .then((res) => {
            callback(res);
        })
        .catch((err) => {
            alt.logError(err);
            callback(undefined);
        });
}

/**
 * Async Version
 * Look up document with the highest id in repo.
 * @param repoName ie "Account"
 */
export async function fetchLastIdAsync(repoName) {
    return new Promise((resolve, reject) => {
        const repo = connection.getRepository(repoName);
        repo.findOne({ order: { id: "DESC" } })
            .then((res) => {
                return resolve(res);
            })
            .catch((err) => {
                alt.logError(err);
                return reject(undefined);
            });
    });
}

/**
 *
 * @param fieldName The name of the field.
 * @param fieldValue The value of that field.
 * @param repoName The reponame where to look.
 * @param callback Result is an array or undefined.
 */
export function fetchAllByField(fieldName, fieldValue, repoName, callback) {
    const repo = connection.getRepository(repoName);

    repo.find({ where: { [fieldName]: fieldValue } })
        .then((res) => {
            return callback(res);
        })
        .catch((err) => {
            console.error(err);
            return callback(undefined);
        });
}

/**
 *
 * @param fieldName The name of the field.
 * @param fieldValue The value of that field.
 * @param repoName The reponame where to look.
 */
export async function fetchAllByFieldAsync(fieldName, fieldValue, repoName) {
    return new Promise((resolve, reject) => {
        const repo = connection.getRepository(repoName);

        repo.find({ where: { [fieldName]: fieldValue } })
            .then((res) => {
                return resolve(res);
            })
            .catch((err) => {
                console.error(err);
                return reject(undefined);
            });
    });
}

/**
 * Update or Insert a new document.
 * @param document Document pulled down from table.
 * @param repoName The name of the table.
 * @param callback Returns Updated/Inserted document with id or UNDEFINED.
 */
export function upsertData(document, repoName, callback) {
    const repo = connection.getRepository(repoName);

    repo.save(document)
        .then((res) => {
            return callback(res);
        })
        .catch((err) => {
            console.error(err);
            return callback(undefined);
        });
}

/**
 * Async Version
 * Update or Insert a new document.
 * @param document Document pulled down from table.
 * @param repoName The name of the table.
 */
export async function upsertDataAsync(document, repoName) {
    return new Promise((resolve, reject) => {
        const repo = connection.getRepository(repoName);

        repo.save(document)
            .then((res) => {
                return resolve(res);
            })
            .catch((err) => {
                console.error(err);
                return reject(undefined);
            });
    });
}

/**
 * Update or Insert a new document.
 * @param document Document pulled down from table.
 * @param repoName The name of the table.
 * @param callback Returns Updated/Inserted document with id.
 */
export function insertData(document, repoName, callback) {
    const repo = connection.getRepository(repoName);

    repo.insert(document)
        .then((res) => {
            return callback(res);
        })
        .catch((err) => {
            console.error(err);
            return callback(undefined);
        });
}

/**
 * Async Version
 * @param document Document pulled down from table.
 * @param repoName The name of the table.
 */
export async function insertDataAsync(document, repoName) {
    return new Promise((resolve, reject) => {
        const repo = connection.getRepository(repoName);

        repo.insert(document)
            .then((res) => {
                return resolve(res);
            })
            .catch((err) => {
                console.error(err);
                return reject(undefined);
            });
    });
}

/**
 * Update partial data for a document; based on object data based.
 * @param id ID of Document
 * @param partialObjectData Object
 * @param repoName The name of the table.
 * @param callback Result is undefined | object if updated
 */
export function updatePartialData(id, partialObjectData, repoName, callback) {
    const repo = connection.getRepository(repoName);

    repo.findByIds([id])
        .then((res) => {
            if (res.length <= 0) return callback(undefined);
            // Results after currentConnection.

            repo.update(id, partialObjectData)
                .then((res) => {
                    return callback(res);
                })
                .catch((err) => {
                    console.error(err);
                    return callback(undefined);
                });
        })
        .catch((err) => {
            console.error(err);
            return callback(undefined);
        });
}

/**
 * Async Version
 * Update partial data for a document; based on object data based.
 * @param id ID of Document
 * @param partialObjectData Object
 * @param repoName The name of the table.
 */
export async function updatePartialDataAsync(id, partialObjectData, repoName) {
    return new Promise((resolve, reject) => {
        const repo = connection.getRepository(repoName);

        repo.findByIds([id])
            .then((res) => {
                // Resolve undefined if no documents found
                if (res.length <= 0) return resolve(undefined);

                repo.update(id, partialObjectData)
                    .then((res) => {
                        return resolve(res);
                    })
                    .catch((err) => {
                        alt.logError(err);
                        return reject(undefined);
                    });
            })
            .catch((err) => {
                alt.logError(err);
                return reject(undefined);
            });
    });
}

/**
 * Fetch documents by ID or IDs.
 * @param ids
 * @param repoName The name of the table.
 * @param callback Returns undefined | Array<documents>
 */
export function fetchByIds(ids, repoName, callback) {
    const repo = connection.getRepository(repoName);
    let idRef = ids;

    if (!Array.isArray(ids)) {
        idRef = [ids];
    }

    repo.findByIds(idRef)
        .then((res) => {
            if (res.length <= 0) return callback(undefined);
            return callback(res);
        })
        .catch((err) => {
            console.error(err);
            return callback(undefined);
        });
}

/**
 * Async Version
 * Fetch documents by ID or IDs.
 * @param ids
 * @param repoName The name of the table.
 */
export async function fetchByIdsAsync(ids, repoName) {
    return new Promise((resolve, reject) => {
        const repo = connection.getRepository(repoName);
        let idRef = ids;

        if (!Array.isArray(ids)) {
            idRef = [ids];
        }

        repo.findByIds(idRef)
            .then((res) => {
                if (res.length <= 0) return resolve(undefined);
                return resolve(res);
            })
            .catch((err) => {
                console.error(err);
                return reject(undefined);
            });
    });
}

/**
 * Delete documents from the database by ID.
 * @param ids Can be array or single id.
 * @param repoName The name of the table.
 * @param callback
 */
export function deleteByIds(ids, repoName, callback) {
    const repo = connection.getRepository(repoName);

    let idRef = ids;

    if (!Array.isArray(ids)) {
        idRef = [ids];
    }

    repo.delete(idRef)
        .then((res) => {
            return callback(res);
        })
        .catch((err) => {
            console.error(err);
            return callback(undefined);
        });
}

/**
 * Async Version
 * Delete documents from the database by ID.
 * @param ids Can be array or single id.
 * @param repoName The name of the table.
 */
export async function deleteByIdsAsync(ids, repoName) {
    return new Promise((resolve, reject) => {
        const repo = connection.getRepository(repoName);

        let idRef = ids;

        if (!Array.isArray(ids)) {
            idRef = [ids];
        }

        repo.delete(idRef)
            .then((res) => {
                return resolve(res);
            })
            .catch((err) => {
                console.error(err);
                return reject(undefined);
            });
    });
}

/**
 * Fetch all documents by repo name.
 * @param repoName The name of the table.
 * @param callback returns undefined | array of results
 */
export function fetchAllData(repoName, callback) {
    const repo = connection.getRepository(repoName);

    repo.find()
        .then((res) => {
            if (res.length <= 0) return callback(undefined);
            return callback(res);
        })
        .catch((err) => {
            console.error(err);
            return callback(undefined);
        });
}

/**
 * Fetch all documents by repo name.
 * @param repoName The name of the table.
 */
export async function fetchAllDataAsync(repoName) {
    return new Promise((resolve, reject) => {
        const repo = connection.getRepository(repoName);

        repo.find()
            .then((res) => {
                if (res.length <= 0) return reject(undefined);
                return resolve(res);
            })
            .catch((err) => {
                console.error(err);
                return reject(undefined);
            });
    });
}

/**
 * Select a table by fieldNames that apply.
 * @param repoName
 * @param fieldNamesArray
 * @param callback Returns undefined | Array of documents
 */
export function selectData(repoName, fieldNamesArray, callback) {
    const repo = connection.getRepository(repoName);

    let selectionRef = fieldNamesArray;

    if (!Array.isArray(fieldNamesArray)) {
        selectionRef = [selectionRef];
    }

    repo.find({ select: selectionRef })
        .then((res) => {
            if (res.length <= 0) return callback(undefined);
            return callback(res);
        })
        .catch((err) => {
            console.error(err);
            return callback(undefined);
        });
}

/**
 * Async Version
 * Select a table by fieldNames that apply.
 * @param repoName
 * @param fieldNamesArray
 */
export async function selectDataAsync(repoName, fieldNamesArray) {
    return new Promise((resolve, reject) => {
        const repo = connection.getRepository(repoName);

        let selectionRef = fieldNamesArray;

        if (!Array.isArray(fieldNamesArray)) {
            selectionRef = [selectionRef];
        }

        repo.find({ select: selectionRef })
            .then((res) => {
                if (res.length <= 0) return reject(undefined);
                return resolve(res);
            })
            .catch((err) => {
                console.error(err);
                return reject(undefined);
            });
    });
}
