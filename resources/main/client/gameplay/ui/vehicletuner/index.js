import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;
let controlsTick;
let isMoving = false;
let cursorPos;

let view = new alt.WebView("http://resource/client/gameplay/ui/vehicletuner/index.html");
view.isVisible = false;

function toggleControls(state) {
    if (state && !controlsTick) {
        controlsTick = alt.everyTick(() => {
            native.disableAllControlActions(0);
            native.enableControlAction(0, 86, true); // INPUT_VEH_HORN
            native.enableControlAction(0, 74, true); // INPUT_VEH_HEADLIGHT

            native.hideHudAndRadarThisFrame();
            if (alt.isKeyDown(2)) {
                if (!isMoving) {
                    isMoving = true;
                    cursorPos = alt.getCursorPos();
                    if (alt.isCursorVisible()) alt.showCursor(false);
                }
                native.enableControlAction(0, 1, true); // LookLeftRight
                native.enableControlAction(0, 2, true); // LookUpDown
            } else if (isMoving) {
                isMoving = false;
                alt.setCursorPos(cursorPos);
                if (!alt.isCursorVisible()) alt.showCursor(true);
            }
        });
    } else if (!state && controlsTick) {
        alt.clearEveryTick(controlsTick);
        controlsTick = null;
    }
}

function toggle(state) {
    if (state && player.seat !== 1) return;
    if (state !== view.isVisible) {
        view.isVisible = state;
        if (alt.isCursorVisible() !== state) alt.showCursor(state);
        toggleControls(state);
        native.freezeEntityPosition(player.vehicle, state);
        alt.emit("chat:enabled", !state);
        if (state) {
            view.focus();
            updateView();
        } else {
            view.unfocus();
        }
    }
}

function updateView() {
    const veh = player.vehicle;
    view.emit("vehicletuner:mod:reset");
    for (let i = 0; i < 50; i++) {
        const max = native.getNumVehicleMods(veh, i);
        let num;
        if (max > 0) {
            num = native.getVehicleMod(veh, i);
        } else if (i === 18) {
            num = native.isToggleModOn(veh, i);
        } else {
            continue;
        }
        view.emit("vehicletuner:mod:select", i, num, max);
    }

    const [_, type, num, pearl] = native.getVehicleModColor1(veh);
    view.emit("vehicletuner:color1", type, num, pearl);

    const [__, type2, num2] = native.getVehicleModColor2(veh);
    view.emit("vehicletuner:color2", type2, num2);

    const wheelType = native.getVehicleWheelType(veh);
    const wheelNum = native.getVehicleMod(veh, 23);
    view.emit("vehicletuner:wheel", wheelType, wheelNum);

    const [___, wheelPearl, wheelColor] = native.getVehicleExtraColours(veh);
    view.emit("vehicletuner:wheel:color", wheelColor);

    const drift = native.getDriftTyresSet(veh);
    view.emit("vehicletuner:wheel:drift", drift);

    for (let i = 0; i < 4; i++) {
        const state = native.getVehicleNeonEnabled(veh, i);
        view.emit("vehicletuner:neon:state", i, state);
    }
    const neonColor = native.getVehicleNeonColour(veh);
    view.emit("vehicletuner:neon:color", {
        r: neonColor[1],
        g: neonColor[2],
        b: neonColor[3],
    });

    const plateType = native.getVehicleNumberPlateTextIndex(veh);
    view.emit("vehicletuner:plate:type", plateType);

    const plateText = native.getVehicleNumberPlateText(veh).trim();
    view.emit("vehicletuner:plate:text", plateText);
}

alt.on("menu:option:open", (id) => {
    if (id === "vehicletuner" && player.vehicle) {
        toggle(true);
    }
});

alt.on("ui:close:all", () => {
    toggle(false);
});

alt.on("keyup", (key) => {
    if (key === 27 && view.isVisible) {
        // Escape
        toggle(false);
        save();
    }
});

function save() {
    const veh = player.vehicle;

    const mods = [];
    for (let i = 0; i < 50; i++) {
        const max = native.getNumVehicleMods(veh, i);
        let num;
        if (max > 0 && ![23].includes(i)) {
            num = native.getVehicleMod(veh, i) + 1;
        } else if (i === 18) {
            num = native.isToggleModOn(veh, i);
        } else {
            continue;
        }
        mods.push({ type: i, num });
    }
    alt.emitServer("vehicletuner:mods", mods);

    const [_, primary, secondary] = native.getVehicleColours(veh);
    const [__, pearl] = native.getVehicleExtraColours(veh);
    alt.emitServer("vehicletuner:colors", primary, secondary, pearl);

    const wheelType = native.getVehicleWheelType(veh);
    const wheelNum = native.getVehicleMod(veh, 23) + 1;
    const [___, wheelPearl, wheelColor] = native.getVehicleExtraColours(veh);
    const wheelDrift = native.getDriftTyresSet(veh);
    alt.emitServer("vehicletuner:wheels", wheelType, wheelNum, wheelColor, wheelDrift);

    const neonStates = {
        left: native.getVehicleNeonEnabled(veh, 0),
        right: native.getVehicleNeonEnabled(veh, 1),
        front: native.getVehicleNeonEnabled(veh, 2),
        back: native.getVehicleNeonEnabled(veh, 3),
    };
    const [____, r, g, b] = native.getVehicleNeonColour(veh);
    const neonColor = new alt.RGBA(r, g, b);
    alt.emitServer("vehicletuner:neon", neonStates, neonColor);

    const plateType = native.getVehicleNumberPlateTextIndex(veh);
    const plateText = native.getVehicleNumberPlateText(veh).trim();
    alt.emitServer("vehicletuner:plate", plateType, plateText);
}

view.on("vehicletuner:option:exit", () => {
    toggle(false);
    save();
});

view.on("vehicletuner:option:save", () => {
    save();
});

view.on("vehicletuner:option:restore", () => {
    // alt.emitServer("vehicletuner:restore");
    // setTimeout(() => {
    //     updateView();
    // }, 1000);
});

view.on("vehicletuner:option:stock", () => {
    const veh = player.vehicle;
    for (let i = 0; i < 50; i++) {
        if (i === 18) {
            native.toggleVehicleMod(veh, i, false);
        } else {
            native.removeVehicleMod(veh, i);
        }
    }
    native.setVehicleWheelType(veh, 0);
    native.setVehicleMod(veh, 23, -1, false);
    native.setVehicleExtraColours(veh, 0, 0);
    native.setDriftTyres(veh, false);

    native.setVehicleModColor1(veh, 0, 0, 0);
    native.setVehicleModColor2(veh, 0, 0);

    for (let i = 0; i < 4; i++) {
        native.setVehicleNeonEnabled(veh, i, false);
    }
    native.setVehicleNeonColour(veh, 0, 0, 0);

    native.setVehicleNumberPlateTextIndex(veh, 0);
    native.setVehicleNumberPlateText(veh, "ALTV");

    updateView();
});

view.on("vehicletuner:mod", (type, num) => {
    native.setVehicleMod(player.vehicle, type, num, false);
});

view.on("vehicletuner:mod:toggle", (type, state) => {
    native.toggleVehicleMod(player.vehicle, type, state);
});

view.on("vehicletuner:color1", (type, color, pearl) => {
    native.setVehicleModColor1(player.vehicle, type, color, pearl);
});

view.on("vehicletuner:color2", (type, color) => {
    native.setVehicleModColor2(player.vehicle, type, color);
});

view.on("vehicletuner:wheel", (type, index) => {
    native.setVehicleWheelType(player.vehicle, type);
    native.setVehicleMod(player.vehicle, 23, index, false);
    native.setVehicleMod(player.vehicle, 24, index, false);
});

view.on("vehicletuner:wheel:color", (color) => {
    const pearl = native.getVehicleExtraColours(player.vehicle)[1];
    native.setVehicleExtraColours(player.vehicle, pearl, color);
});

view.on("vehicletuner:wheel:drift", (state) => {
    native.setDriftTyres(player.vehicle, state);
});

view.on("vehicletuner:neon:state:all", (state) => {
    for (let i = 0; i < 4; i++) {
        native.setVehicleNeonEnabled(player.vehicle, i, state);
    }
});

view.on("vehicletuner:neon:state", (index, state) => {
    native.setVehicleNeonEnabled(player.vehicle, index, state);
});

view.on("vehicletuner:neon:color", (color) => {
    native.setVehicleNeonColour(player.vehicle, color.r, color.g, color.b);
});

view.on("vehicletuner:plate:type", (type) => {
    native.setVehicleNumberPlateTextIndex(player.vehicle, type);
});

view.on("vehicletuner:plate:text", (text) => {
    native.setVehicleNumberPlateText(player.vehicle, text);
});
