import DataBase from "../../../../node_modules/darco2903-db/src/index.js";
import tables from "./tables/index.js";
import config from "./config.json" assert { type: "json" };

const { type, host, port, username, password, database } = config;

const db = new DataBase(type, host, port, username, password, database, tables);

export { db, tables };
