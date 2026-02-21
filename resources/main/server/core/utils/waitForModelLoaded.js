import * as alt from "alt-server";

const TIMEOUT = 2000;

alt.Utils.waitForModelLoaded =
    /**
     * @param {alt.Player[]} players
     * @param {string} model
     */
    function (players, model) {
        return new Promise((resolve, reject) => {
            let t;
            alt.emitClient(players, "model:load", model);
            const set = new Set(players);
            const f = (player, model) => {
                // console.log("model:loaded", player.name, model);
                if (set.has(player) && model === model) {
                    set.delete(player);
                    if (set.size === 0) {
                        alt.offClient("model:loaded", f);
                        alt.clearTimeout(t);
                        resolve();
                    }
                }
            };
            t = alt.setTimeout(() => {
                alt.offClient("model:loaded", f);
                // reject();
                resolve();
            }, TIMEOUT);
            alt.onClient("model:loaded", f);
        });
    };
