const DataBase = require("../node_modules/darco2903-db/src/index.js");
const config = require("../resources/main/server/database/config.json");
const { type, host, port, username, password, database } = config;

const build = process.argv[2];
if (!build) {
    console.log("Please specify a build number");
    process.exit(1);
} else if (build.length !== 4 || isNaN(build)) {
    console.log("Please specify a valid build number");
    process.exit(1);
}

(async () => {
    const tables = await import("../resources/main/server/database/tables/index.js");
    const db = new DataBase(type, host, port, username, password, database, tables);
    try {
        await db.connect();
        console.log("Database connected");
        const datas = await db.fetchAllByFields(["id", "appearance"], tables.vehicle);
        for (const data of datas) {
            const appearance = build + data.appearance.substring(4);
            await db.updateDataByIds(data.id, { appearance }, tables.vehicle);
        }
        console.log(`Database updated to build ${build}`);
    } catch (err) {
        console.log(err);
    }
    await db.disconnect();
})();
