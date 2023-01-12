import * as alt from "alt-client";
import * as native from "natives";

const color = JSON.parse(alt.File.read("./data/colors.json", "utf-8"));
const modList = JSON.parse(alt.File.read("./data/modList.json", "utf-8"));
const plateList = JSON.parse(alt.File.read("./data/plateList.json", "utf-8"));
const serverColors = JSON.parse(alt.File.read("./data/serverColors.json", "utf-8"));
const tireBrand = JSON.parse(alt.File.read("./data/tireBrand.json", "utf-8"));
const tireColor = JSON.parse(alt.File.read("./data/tireColor.json", "utf-8"));
const wheelTypeList = JSON.parse(alt.File.read("./data/wheelTypeList.json", "utf-8"));
const windowTints = JSON.parse(alt.File.read("./data/windowTints.json", "utf-8"));
const xenonColors = JSON.parse(alt.File.read("./data/xenonColors.json", "utf-8"));

alt.Vehicle.prototype.restoreData = {};

alt.Vehicle.prototype.setStock = function () {
    const n = modList.length;
    for (let modType = 0; modType < n; modType++) {
        switch (modType) {
            //  case 17: ??
            case 18:
            //  case 19: ??
            case 20:
            //  case 21: ??
            case 22:
                toogleMod([modType, false]);
                break;

            default:
                native.removeVehicleMod(this, modType);
                break;
        }
    }

    setColors({
        primary: { colorType: 0, colorNum: 0, pearl: 0 },
        secondary: { colorType: 0, colorNum: 0 },
    });
    setExtraColors({ xenon: 0, window: 0 });
    native.suppressNeonsOnVehicle(this, true);
    setPlate({ plateIndex: 0, plateText: "ALTV" });
};

alt.Vehicle.prototype.restore = function () {
    if (this.restoreData.mods) setAllMod(restoreData.mods);
    if (this.restoreData.wheels) setWheels(restoreData.wheels);
    if (this.restoreData.colors) setColors(restoreData.colors);
    if (this.restoreData.extraColors) setExtraColors(restoreData.extraColors);
    if (this.restoreData.neons) setNeons(restoreData.neons);
    if (this.restoreData.plate) setPlate(restoreData.plate);
};

alt.Vehicle.prototype.setMod = function (modType, modId) {
    console.log(modType, modId);
    native.setVehicleMod(this, modType, modId - 1, false);
};

alt.Vehicle.prototype.toogleMod = function (modType, state) {
    setCamPos(-160, 1);
    native.toggleVehicleMod(this, modType, state);
};

alt.Vehicle.prototype.getModsData = function () {
    //  let data = [];
    let modsData = {};
    for (let modType = 0; modType < 50; modType++) {
        //native.preloadVehicleMod(this, modType, 1)
        switch (modType) {
            //  case 17: //  ??
            case 18: //  Turbo
                //  case 19: //  ??
                //  case 20: //  custom tires
                //  case 21: //  ??
                //  case 22: //  xenon
                modsData[modType] = {
                    count: 0,
                    num: native.isToggleModOn(this, modType),
                };
                break;

            case 23:
                continue;
            /*
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
            case 12:
            case 13:
            case 14:
            case 15:
            case 16:
            case 25:
            case 27:
            case 28:
            case 30:
            case 33:
            case 34:
            case 35:
            case 38:
            case 48:
            case 49:
                break;
            */
            default:
                const count = native.getNumVehicleMods(this, modType);
                if (count === 0) continue;
                modsData[modType] = {
                    count: count,
                    num: native.getVehicleMod(this, modType) + 1,
                };
                break;
        }
        console.log(native.getModSlotName(this, modType));
        Object.assign(modsData[modType], { name: native.getModSlotName(this, modType) });
    }
    return modsData;
};

alt.Vehicle.prototype.setAllMod = function (modsData) {
    modsData.forEach((mod, modType) => {
        switch (modType) {
            //  case 17: ??
            case 18: //Turbo
                //  case 19: ??
                //  case 20: //Custom Tires Smoke
                //  case 21: ??
                //  case 22: //Xenon
                toogleMod(mod);
                break;

            case 48:
                native.setVehicleLivery(this, mod);
                break;

            default:
                setMod(mod);
                break;
        }
    });
};

const FRONTWHEELS = 23; // Front Wheels
const REARWHEELS = 24; // Rear Wheels (Motorcycles)

alt.Vehicle.prototype.getWheelsData = function () {
    const wheelType = native.getVehicleWheelType(this);
    const wheelNum = native.getVehicleMod(this, FRONTWHEELS) + 1;
    //  console.log(native.getVehicleMod(this, wheelsFront), native.getVehicleMod(this, wheelsRear));
    const wheelColor = native.getVehicleExtraColours(this, 1, 1)[2]; //  [void, pearl, color]
    const drift = native.getDriftTyresSet(this);

    ////  TEST
    const camber = parseFloat(this.getWheelCamber(0).toFixed(2));
    const track = [this.getWheelTrackWidth(0), this.getWheelTrackWidth(2)].map((value) => parseFloat(value.toFixed(2))); //  [Front, Rear]
    ////

    return { wheelType, wheelNum, wheelColor, drift /* TEST */, camber, track };
};

alt.Vehicle.prototype.setWheels = function ({ wheelType, wheelNum, wheelColor, drift /* TEST */, camber, track }) {
    const customWheels = native.getVehicleModVariation(this, FRONTWHEELS);
    native.setVehicleWheelType(this, wheelType);
    native.setVehicleMod(this, FRONTWHEELS, wheelNum - 1, customWheels);
    const pearl = native.getVehicleExtraColours(this, 1, 1)[1]; //  [void, pearl, color]
    native.setVehicleExtraColours(this, pearl, wheelColor);
    native.setDriftTyres(this, drift);

    ////    TEST
    console.log("camber", camber);
    console.log("wheelsCount", this.wheelsCount);
    for (let wheelId = 0; wheelId < this.wheelsCount; wheelId++) {
        console.log("wheelId", wheelId, "camber", camber, "track", track);
        this.setWheelCamber(wheelId, camber);
        const i = native.floor(wheelId / 2);
        const width = track[i] || track[i - 1];
        this.setWheelTrackWidth(wheelId, width);
    }
    ////
};

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
    let xenon = native.getVehicleXenonLightColorIndex(this) + 2;
    xenon = xenon < 15 ? xenon : 0;
    const window = native.getVehicleWindowTint(this);
    const tireSmoke = native.getVehicleTyreSmokeColor(this);

    //  data.interior = native.getVehicleInteriorColor(this,)[1]
    //  data.dash = native.getVehicleDashboardColor(this,)[1]

    //interior native.setVehicleExtraColour5()
    //dash native.setVehicleExtraColour6()
    ////

    return { primary, secondary /* Extra */, xenon, window, tireSmoke };
};

alt.Vehicle.prototype.getServerColors = function () {
    const [primary, secondary] = native.getVehicleColours(this).splice(1, 2);
    const pearl = native.getVehicleExtraColours(this)[1]; //  [void, pearl(server-side), color(wheels)]
    return { primary, secondary, pearl };
};

alt.Vehicle.prototype.setColors = function ({ primary, secondary /* Extra */, xenon, window, tireSmoke }) {
    native.setVehicleModColor1(this, primary.colorType, primary.colorNum, primary.pearl);
    native.setVehicleModColor2(this, secondary.colorType, secondary.colorNum);
    const wheelColor = native.getVehicleExtraColours(this, 1, 1)[2]; //  [void, pearl, wheelColor]
    native.setVehicleExtraColours(this, primary.pearl, wheelColor);
    console.log(typeof window);
    ////    Extra
    native.toggleVehicleMod(this, 22, xenon != 0);
    native.setVehicleXenonLightColorIndex(this, xenon - 2);
    native.setVehicleWindowTint(this, window);
    //  native.setVehicleTyreSmokeColor(this, 255, 255, 255)
    ////
};

alt.Vehicle.prototype.getNeons = function () {
    let enabled = native.getVehicleNeonEnabled(this, 0);
    let color = native.getVehicleNeonColour(this).splice(1, 3); //[void, int, int, int]
    color = new alt.RGBA(color);
    return { color, enabled };
};
alt.Vehicle.prototype.setNeons = function ({ enabled, color }) {
    native.suppressNeonsOnVehicle(this, false);
    for (let i = 0; i < 4; i++) native.setVehicleNeonEnabled(this, i, enabled);
    native.setVehicleNeonColour(this, color.r, color.g, color.b);
};
alt.Vehicle.prototype.getPlate = function () {
    let plateIndex = native.getVehicleNumberPlateTextIndex(this);
    let plateText = native.getVehicleNumberPlateText(this);
    return { plateIndex, plateText };
};
alt.Vehicle.prototype.setPlate = function ({ plateIndex, plateText }) {
    native.setVehicleNumberPlateTextIndex(this, plateIndex);
    native.setVehicleNumberPlateText(this, plateText);
};
