import * as alt from "alt-client";
import * as native from "natives";
import { colors, serverColors, tireColors, windowTints, xenonColors } from "../../data/index.js";

/**
 * @returns {colorData}
 */
alt.Vehicle.prototype.getColors = function () {
    let [serverPrimary, serverSecondary] = native.getVehicleColours(this).splice(1, 2);
    let [type1, color1] = native.getVehicleModColor1(this).splice(1, 2); //  [void, paintType, color, pearl(client-side)]
    let [type2, color2] = native.getVehicleModColor2(this).splice(1, 2); //  [void, paintType, color]
    const pearl = native.getVehicleModColor1(this)[3]; //  [void, colorType, colorNum, pearl(client-side)]
    if (type1 == 7 || color1 == -1) {
        [type1, color1] = serverColors[serverPrimary].client;
        [type2, color2] = serverColors[serverSecondary].client;
    }
    const primary = { colorType: type1, colorNum: color1, pearl };
    const secondary = { colorType: type2, colorNum: color2 };

    ////   Extra
    const { xenon, window, tireSmoke } = this.getExtraColors();
    ////

    return { primary, secondary /* Extra */, xenon, window, tireSmoke };
};

/**
 * @typedef {Object} extraColors
 * @property {number} xenon
 * @property {number} window
 * @property {number} tireSmoke
 */

/**
 * @returns {extraColors}
 */
alt.Vehicle.prototype.getExtraColors = function () {
    let xenon = native.getVehicleXenonLightColorIndex(this) + 2;
    xenon = xenon < 15 ? xenon : 0;
    const window = native.getVehicleWindowTint(this);
    const tireSmoke = native.getVehicleTyreSmokeColor(this);

    //  data.interior = native.getVehicleInteriorColor(this,)[1]
    //  data.dash = native.getVehicleDashboardColor(this,)[1]

    //interior native.setVehicleExtraColour5()
    //dash native.setVehicleExtraColour6()
    return { xenon, window, tireSmoke };
};

/**
 * @returns {serverColors}
 */
alt.Vehicle.prototype.getServerColors = function () {
    const [primary, secondary] = native.getVehicleColours(this).splice(1, 2);
    const pearl = native.getVehicleExtraColours(this)[1]; //  [void, pearl(server-side), color(wheels)]

    ////   Extra
    const { xenon, window, tireSmoke } = this.getExtraColors();
    ////

    return { primary, secondary, pearl /* Extra */, xenon, window, tireSmoke };
};

/**
 * @param {colorData} colorData
 */
alt.Vehicle.prototype.setColors = function ({ primary, secondary /* Extra */, xenon, window, tireSmoke }) {
    native.setVehicleModColor1(this, primary.colorType, primary.colorNum, primary.pearl);
    native.setVehicleModColor2(this, secondary.colorType, secondary.colorNum);
    const wheelColor = native.getVehicleExtraColours(this, 1, 1)[2]; //  [void, pearl, wheelColor]
    native.setVehicleExtraColours(this, primary.pearl, wheelColor);
    ////    Extra
    native.toggleVehicleMod(this, 22, true);
    if (xenon >= 2) native.setVehicleXenonLightColorIndex(this, 5);

    native.setVehicleWindowTint(this, window);
    // native.setVehicleTyreSmokeColor(this, ...tireSmoke.toArray());
    ////
};

alt.Vehicle.prototype.setStockColors = function () {
    this.setColors({
        primary: { colorType: 0, colorNum: 0, pearl: 0 },
        secondary: { colorType: 0, colorNum: 0 },
        xenon: 0,
        window: 0,
    });
};
