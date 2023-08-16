import * as alt from "alt-server";

alt.onClient(
    "player:clothes:clothes",
    /**
     * @typedef {Object} clothes
     * @property {number} drawable
     * @property {number} texture
     * @property {number} palette
     *
     * @param {alt.Player} player
     * @param {clothes[]} clothes
     */
    (player, clothes) => {
        clothes.forEach((c, i) => {
            player.setClothes(i, c.drawable, c.texture, c.palette);
        });
    }
);

alt.onClient(
    "player:clothes:props",
    /**
     * @typedef {Object} props
     * @property {number} drawable
     * @property {number} texture
     *
     * @param {alt.Player} player
     * @param {props[]} props
     */
    (player, props) => {
        props.forEach((p, i) => {
            if (p.drawable === -1) {
                player.clearProp(i);
            } else {
                player.setProp(i, p.drawable, p.texture);
            }
        });
    }
);

alt.onClient("player:clothes:get:hair", (player) => {
    const color = player.getHairColor();
    const highlight = player.getHairHighlightColor();
    alt.emitClient(player, "player:clothes:hair", color, highlight);
});

alt.onClient("player:clothes:hair", (player, color, highlight) => {
    player.setHairColor(color);
    player.setHairHighlightColor(highlight);
});

alt.onClient("player:clothes:get:headBlend", (player) => {
    const headBlendData = player.getHeadBlendData();
    alt.emitClient(player, "player:clothes:headBlend", headBlendData);
});

alt.onClient("player:clothes:headBlend", (player, headBlendData) => {
    player.setHeadBlendData(
        headBlendData.shapeFirstID,
        headBlendData.shapeSecondID,
        headBlendData.shapeThirdID,
        headBlendData.skinFirstID,
        headBlendData.skinSecondID,
        headBlendData.skinThirdID,
        headBlendData.shapeMix,
        headBlendData.skinMix,
        headBlendData.thirdMix
    );
});

alt.onClient("player:clothes:eyeColor", (player, eyeColor) => {
    player.setEyeColor(eyeColor);
});

alt.onClient("player:clothes:get:model", (player) => {
    const model = alt.getPedModelInfoByHash(player.model);
    alt.emitClient(player, "player:clothes:model", model.name);
});
