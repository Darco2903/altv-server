import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;

let isEnable = false;
let isActive = false;
let speed;

let throttle = 0;

const speedControllerMinSpeed = 30;
const speedControllerMargin = 3;
let speed1 = 0;
let speed2 = 0;

const keyTimeout = 500;
const keyInterval = 50;
let speedControllerKeyUpTimeout = null;
let speedControllerKeyUpInterval = null;
let speedControllerKeyDownTimeout = null;
let speedControllerKeyDownInterval = null;

const defaultKeys = {
    set: 97, // 1
    unset: 96, // 0
    add: 107, // +
    reduce: 109, // -
};
const inputKeys = Object.assign({}, defaultKeys);
const APP_NAME = "speedController";

alt.on("keydown", (key) => {
    if (!isEnable) return;
    switch (key) {
        case inputKeys.set:
            if (isActive) return;
            if (!speed) {
                const currentSpeed = parseInt(player.vehicle.speed * 3.6);
                speed = currentSpeed < 50 ? 50 : currentSpeed;
            }
            isActive = true;
            alt.emit("speedController:active", isActive);
            alt.emit("speedController:speed", speed);
            break;

        case inputKeys.unset:
            isActive = false;
            alt.emit("speedController:active", isActive);
            break;

        case inputKeys.add:
            if (speed >= 999) return;
            speed++;
            alt.emit("speedController:speed", speed);
            speedControllerKeyUpTimeout = alt.setTimeout(() => {
                speedControllerKeyUpTimeout = null;
                speedControllerKeyUpInterval = alt.setInterval(() => {
                    if (speed < 999) {
                        speed++;
                        alt.emit("speedController:speed", speed);
                    } else {
                        alt.clearInterval(speedControllerKeyUpInterval);
                        speedControllerKeyUpInterval = null;
                    }
                }, keyInterval);
            }, keyTimeout);
            break;

        case inputKeys.reduce:
            if (speed <= speedControllerMinSpeed) return;
            speed--;
            alt.emit("speedController:speed", speed);
            speedControllerKeyDownTimeout = alt.setTimeout(() => {
                speedControllerKeyDownTimeout = null;
                speedControllerKeyDownInterval = alt.setInterval(() => {
                    if (speed > 0) {
                        speed--;
                        alt.emit("speedController:speed", speed);
                    } else {
                        alt.clearInterval(speedControllerKeyDownInterval);
                        speedControllerKeyDownInterval = null;
                    }
                }, keyInterval);
            }, keyTimeout);
            break;
    }
});

alt.on("keyup", (key) => {
    switch (key) {
        case inputKeys.add:
            if (speedControllerKeyUpTimeout) alt.clearTimeout(speedControllerKeyUpTimeout);
            if (speedControllerKeyUpInterval) alt.clearInterval(speedControllerKeyUpInterval);
            speedControllerKeyUpTimeout = null;
            speedControllerKeyUpInterval = null;
            break;

        case inputKeys.reduce:
            if (speedControllerKeyDownTimeout) alt.clearTimeout(speedControllerKeyDownTimeout);
            if (speedControllerKeyDownInterval) alt.clearInterval(speedControllerKeyDownInterval);
            speedControllerKeyDownTimeout = null;
            speedControllerKeyDownInterval = null;
            break;
    }
});

function main() {
    switch (true) {
        case native.isControlPressed(0, 72):
        case native.isControlPressed(0, 76):
            isActive = false;
            alt.emit("speedController:active", isActive);
        case !isEnable:
        case !isActive:
            return;
    }

    speed2 = player.vehicle.speed * 3.6;
    const speedDiffRelative = speed2 - speed1;
    const speedDiffController = speed2 - speed;

    if (speedDiffController > 0 && speedDiffController < speedControllerMargin && speedDiffRelative > 0 && throttle > 0) throttle -= 0.01;
    else if (speedDiffController < 0 && speedDiffController > -speedControllerMargin && speedDiffRelative < 0 && throttle < 1) throttle += 0.01;
    else if (speedDiffController > 1 && speedDiffRelative > 0 && throttle > 0) throttle -= 0.05;
    else if (speedDiffController < -1 && speedDiffRelative < 0 && throttle < 1) throttle += 0.05;

    native.setControlValueNextFrame(0, 71, throttle);
    speed1 = speed2;
}

function set(state) {
    isEnable = state;
    isActive = false;
    alt.emit("speedController:enable", state);
    alt.emit("speedController:active", isActive);
    alt.LocalStorage.set("speedController:enable", state);
    alt.LocalStorage.save();
}

alt.on("resourceStart", () => {
    const speedController = alt.LocalStorage.get("speedController:enable") ?? false;
    set(speedController);

    // input-manager keys init
    Object.keys(defaultKeys).forEach((name) => {
        inputKeys[name] = alt.LocalStorage.get(`${APP_NAME}:key:${name}`) ?? defaultKeys[name];
        alt.emit("input-manager:keyInit", APP_NAME, name, inputKeys[name]);
    });
});

alt.on("input-manager:keyUpdate", (app, name, key) => {
    if (app !== APP_NAME) return;
    inputKeys[name] = key;
    alt.LocalStorage.set(`${APP_NAME}:key:${name}`, key);
    alt.LocalStorage.save();
});

alt.on("input-manager:keyReset", (app, name) => {
    if (app !== APP_NAME) return;
    inputKeys[name] = defaultKeys[name];
    alt.emit("input-manager:keyInit", APP_NAME, name, inputKeys[name]);
    alt.LocalStorage.delete(`${APP_NAME}:key:${name}`);
    alt.LocalStorage.save();
});

alt.on("electronics:speedController:toggle", set);
alt.onServer("electronics:speedController:toggle", set);

export { main, set, isEnable, isActive, speed };
