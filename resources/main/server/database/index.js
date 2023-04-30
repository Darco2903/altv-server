import * as alt from "alt-server";
import DataBase from "../../../..//node_modules/darco2903-db/src/index.js";
import * as tables from "./tables/index.js";
import config from "./config.json" assert { type: "json" };

const { type, host, port, username, password, database } = config;

const db = new DataBase(type, host, port, username, password, database, tables);

alt.once("serverStarted", () => {
    alt.setMeta("started", true);
    initConnection();
});

alt.once("resourceStart", () => {
    if (alt.hasMeta("started")) {
        initConnection();
    }
});

async function initConnection() {
    try {
        await db.connect();
        alt.log("Database connected");
        alt.emit("database:ready");
    } catch (err) {
        alt.log(err);
    }
}

export { db, tables };
