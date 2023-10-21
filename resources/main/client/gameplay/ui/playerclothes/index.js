import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;
let controlsTick;
let isMoving = false;
let cursorPos;

let hairColor;
let hairHighlight;

/**
 * @typedef {Object} HeadBlendData
 * @property {number} shapeFirstID
 * @property {number} shapeSecondID
 * @property {number} shapeThirdID
 * @property {number} skinFirstID
 * @property {number} skinSecondID
 * @property {number} skinThirdID
 * @property {number} shapeMix
 * @property {number} skinMix
 * @property {number} thirdMix
 */
/** @type {HeadBlendData}*/
let headBlendData;

const view = new alt.WebView("http://resource/client/gameplay/ui/playerclothes/browser/index.html");
view.isVisible = false;

function toggleControls(state) {
    if (state && !controlsTick) {
        controlsTick = alt.everyTick(() => {
            native.disableAllControlActions(0);
            native.enableControlAction(0, 0, true); // INPUT_NEXT_CAMERA

            native.hideHudAndRadarThisFrame();
            if (alt.isKeyDown(2)) {
                if (!isMoving) {
                    isMoving = true;
                    cursorPos = alt.getCursorPos();
                    if (alt.isCursorVisible()) alt.showCursor(false);
                }
                native.enableControlAction(0, 1, true); // INPUT_LOOK_LR
                native.enableControlAction(0, 2, true); // INPUT_LOOK_UD
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
    if (state !== view.isVisible) {
        view.isVisible = state;
        if (alt.isCursorVisible() !== state) alt.showCursor(state);
        toggleControls(state);
        alt.setConfigFlag("DISABLE_IDLE_CAMERA", state);
        alt.emit("chat:enabled", !state);
        if (state) {
            view.focus();
            updateView();
        } else {
            view.unfocus();
        }
    }
}

alt.on("menu:option:open", (id) => {
    if (id === "playerclothes") {
        if (player.seat === 1) {
            alt.logWarning("You cannot change clothes while driving");
            player.sendNotification({
                imageName: "CHAR_DEFAULT",
                headerMsg: "Magasin de vêtements",
                message: "Vous ne pouvez pas changer de vêtements en conduisant",
                duration: 4,
            });
        } else toggle(true);
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

alt.on("spawned", () => {
    // used to initialize the player model (hairs)
    setHeadBlendData(player, 0, 0, 0, 0, 0, 0, 0, 0, 0, false);
    alt.emitServer("player:clothes:headBlend", headBlendData);
});

/**
 * @param {alt.Player} player
 * @param {number} shapeFirstID
 * @param {number} shapeSecondID
 * @param {number} shapeThirdID
 * @param {number} skinFirstID
 * @param {number} skinSecondID
 * @param {number} skinThirdID
 * @param {number} shapeMix
 * @param {number} skinMix
 * @param {number} thirdMix
 * @param {boolean} isParent
 */
function setHeadBlendData(player, shapeFirstID, shapeSecondID, shapeThirdID, skinFirstID, skinSecondID, skinThirdID, shapeMix, skinMix, thirdMix, isParent) {
    native.setPedHeadBlendData(
        player,
        shapeFirstID,
        shapeSecondID,
        shapeThirdID,
        skinFirstID,
        skinSecondID,
        skinThirdID,
        shapeMix,
        skinMix,
        thirdMix,
        isParent
    );
    headBlendData = {
        shapeFirstID,
        shapeSecondID,
        shapeThirdID,
        skinFirstID,
        skinSecondID,
        skinThirdID,
        shapeMix,
        skinMix,
        thirdMix,
    };
}

function updateView() {
    for (let i = 1; i < 12; i++) {
        const drawable = native.getPedDrawableVariation(player, i);
        const drawableCount = native.getNumberOfPedDrawableVariations(player, i);
        const texture = native.getPedTextureVariation(player, i);
        const textureCount = native.getNumberOfPedTextureVariations(player, i, drawable);
        const palette = native.getPedPaletteVariation(player, i);
        view.emit("player:clothes:clothes:drawable", i, drawable, drawableCount);
        view.emit("player:clothes:clothes:texture", i, texture, textureCount);
        view.emit("player:clothes:clothes:palette", i, palette);
    }

    [0, 1, 2, 6, 7].forEach((i) => {
        const drawable = native.getPedPropIndex(player, i, 0);
        const drawableCount = native.getNumberOfPedPropDrawableVariations(player, i);
        const texture = native.getPedPropTextureIndex(player, i);
        const textureCount = native.getNumberOfPedPropTextureVariations(player, i, drawable);
        view.emit("player:clothes:props:drawable", i, drawable, drawableCount);
        view.emit("player:clothes:props:texture", i, texture, textureCount);
    });

    alt.emitServer("player:clothes:get:hair");
    alt.emitServer("player:clothes:get:headBlend");

    const eyeColor = native.getHeadBlendEyeColor(player);
    view.emit("player:clothes:eyeColor", eyeColor);

    switch (player.model) {
        case alt.hash("mp_m_freemode_01"):
            view.emit("player:clothes:model", "mp_m_freemode_01");
            break;

        case alt.hash("mp_f_freemode_01"):
            view.emit("player:clothes:model", "mp_f_freemode_01");
            break;

        default:
            alt.emitServer("player:clothes:get:model");
            view.emit("player:clothes:model", "Custom");
    }
}

alt.onServer("player:clothes:model", (modelName) => {
    view.emit("player:clothes:model", modelName);
});

function save() {
    const clothes = new Array(12).fill(0).map((_, i) => {
        const drawable = native.getPedDrawableVariation(player, i);
        const texture = native.getPedTextureVariation(player, i);
        const palette = native.getPedPaletteVariation(player, i);
        return { drawable, texture, palette };
    });
    alt.emitServer("player:clothes:clothes", clothes);

    const props = new Array(8).fill(0).map((_, i) => {
        const drawable = native.getPedPropIndex(player, i, 0);
        const texture = native.getPedPropTextureIndex(player, i);
        return { drawable, texture };
    });
    alt.emitServer("player:clothes:props", props);

    alt.emitServer("player:clothes:hair", hairColor, hairHighlight);
    alt.emitServer("player:clothes:headBlend", headBlendData);

    const eyeColor = native.getHeadBlendEyeColor(player);
    alt.emitServer("player:clothes:eyeColor", eyeColor);
}

alt.onServer("player:clothes:hair", (color, highlight) => {
    hairColor = color;
    hairHighlight = highlight;
    view.emit("player:clothes:hair", color, highlight);
});

alt.onServer("player:clothes:headBlend", (data) => {
    headBlendData = data;
    view.emit("player:clothes:head", data);
});

view.on("player:clothes:exit", () => {
    toggle(false);
    save();
});

view.on("player:clothes:save", () => {
    save();
});

view.on("player:clothes:random", () => {
    native.setPedRandomComponentVariation(player, false);
    updateView();
});

view.on("player:clothes:reset", () => {
    native.setPedDefaultComponentVariation(player);
    native.clearAllPedProps(player);
    updateView();
});

view.on("player:clothes:model", async (model) => {
    const hash = alt.hash(model);
    const camHeading = native.getGameplayCamRelativeHeading();
    alt.emitServer("playermodel:set", hash);
    await alt.Utils.waitFor(() => player.model === hash, 1000);
    await new Promise((resolve) => alt.nextTick(resolve));
    const heading = native.getEntityHeading(player);
    native.startPlayerTeleport(player, player.pos.x, player.pos.y, player.pos.z + 1, heading, true, true, true);
    native.setGameplayCamRelativeHeading(camHeading);

    updateView();
});

view.on("player:clothes:head", (shapeFirst, shapeSecond, skinFirst, skinSecond, shapeMix, skinMix) => {
    setHeadBlendData(player, shapeFirst, shapeSecond, 0, skinFirst, skinSecond, 0, shapeMix, skinMix, 0, false);
});

view.on("player:clothes:eyeColor", (color) => {
    native.setHeadBlendEyeColor(player, color);
});

view.on("player:clothes:clothes", (index, drawable, texture, palette) => {
    native.setPedComponentVariation(player, index, drawable, texture, palette);
});

view.on("player:clothes:props", (index, drawable, texture) => {
    if (drawable === -1) {
        native.clearPedProp(player, index, 0);
    } else {
        native.setPedPropIndex(player, index, drawable, texture, true, 0);
    }
});

view.on("player:clothes:hair:color", (color, highlight) => {
    hairColor = color;
    hairHighlight = highlight;
    native.setPedHairTint(player, color, highlight);
});

view.on("player:clothes:update", (type, index, drawable) => {
    if (type === "clothes") {
        const textureCount = native.getNumberOfPedTextureVariations(player, index, drawable);
        view.emit("player:clothes:clothes:texture", index, 0, textureCount);
    } else if (type === "props") {
        const textureCount = native.getNumberOfPedPropTextureVariations(player, index, drawable);
        view.emit("player:clothes:props:texture", index, 0, textureCount);
    }
});
