import * as alt from "alt-client";

/**
 * @param {string} hex
 * @returns {alt.RGBA}
 */
alt.RGBA.fromHex = function (hex) {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    return new alt.RGBA(r, g, b, 255);
};

/**
 * @returns {string}
 */
alt.RGBA.prototype.toHex = function () {
    return "#" + this.r.toString(16).padStart(2, "0") + this.g.toString(16).padStart(2, "0") + this.b.toString(16).padStart(2, "0");
};
