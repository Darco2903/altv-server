import * as alt from "alt-client";
import * as native from "natives";

const LOADING_TIMEOUT = 5000;

alt.Utils.loadModel = function (model) {
    return new Promise((resolve, reject) => {
        if (native.hasModelLoaded(model)) {
            resolve();
            return;
        } else if (!native.isModelValid(model)) {
            reject();
            return;
        }
        native.requestModel(model);
        let timeout;
        const tick = alt.everyTick(() => {
            if (native.hasModelLoaded(model)) {
                alt.clearEveryTick(tick);
                alt.clearTimeout(timeout);
                resolve();
            }
        });
        timeout = alt.setTimeout(() => {
            alt.clearEveryTick(tick);
            reject();
        }, LOADING_TIMEOUT);
    });
};

alt.onServer("model:load", (model) => {
    alt.log(`Requesting model ${model}`);
    alt.Utils.loadModel(model)
        .then(() => {
            alt.log(`Model ${model} loaded`);
            // alt.emitServer("model:loaded", model);
        })
        .catch(() => {
            alt.logWarning(`Model ${model} not loaded`);
            // alt.emitServer("model:load:failed", model);
        })
        .finally(() => {
            alt.emitServer("model:loaded", model);
        });
});
