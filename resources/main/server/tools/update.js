import alt from "alt-server";
import fs from "fs";
import path from "path";
import * as db from "alt:database";

const VERSION_FILE = path.join(alt.Resource.current.path, "version");

function dbUpdateBuild(version) {
    db.selectData("Vehicle", ["id", "appearance"], (dataList) => {
        dataList.forEach((vehData) => {
            let oldAppearance = JSON.parse(vehData.appearance);
            const appearance = JSON.stringify(`${version}_${oldAppearance.split("_")[1]}`);
            db.updatePartialData(vehData.id, { appearance }, "Vehicle", (veh) => {});
        });
        alt.log("DataBase build updated succesfully");
    });
}

function parseObject(str) {
    [" ", "{", "}", '"'].forEach((symbol) => {
        str = str.replaceAll(symbol, "");
    });
    const arr = str.split(",");
    let obj = {};
    arr.forEach((elem) => {
        let [key, value] = elem.split(":");
        if (!isNaN(value)) {
            value = parseFloat(value);
        }
        obj[key] = value;
    });
    return obj;
}

async function getVersion() {
    try {
        const url = "https://raw.githubusercontent.com/altmp/altv-docs-gta/master/articles/references/versions.md";
        const response = await fetch(url);
        let str = await response.text();
        str = str.split("```js\n")[1];
        str = str.split("```\n")[0];
        str = str.replaceAll(",\n", "\n");
        let arr = [];
        let versions = [];
        for (const line of str.split("\n")) {
            if (line.includes("version:")) {
                arr.push(line);
            }
        }
        arr.forEach((ver) => {
            const obj = parseObject(ver);
            versions.push(obj);
        });
        const n = versions.length - 1;
        return Promise.resolve(versions[n]);
    } catch (error) {
        alt.logError(error);
        Promise.reject(error);
    }
}

async function update() {
    const last = await getVersion();
    fs.readFile(VERSION_FILE, "utf8", function (err, data) {
        const server = JSON.parse(data);
        if (server.version != last.version) {
            fs.writeFile(VERSION_FILE, JSON.stringify(last), function (err) {});
            dbUpdateBuild(last.buildnumber);
            alt.log("Updated successfully");
            alt.setTimeout(alt.stopServer, 200);
        }
    });
}

export default update;
