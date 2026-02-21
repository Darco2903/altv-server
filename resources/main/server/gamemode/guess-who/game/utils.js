import * as alt from "alt-server";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const npcModels = require("./npcModels.json");
const npcSpawnPoints = require("./npcSpawnPoints.json");

export function randomModel() {
    return npcModels[Math.floor(Math.random() * npcModels.length)];
}

export function randomSpawnPoint() {
    return new alt.Vector3(npcSpawnPoints[Math.floor(Math.random() * npcSpawnPoints.length)]);
}
