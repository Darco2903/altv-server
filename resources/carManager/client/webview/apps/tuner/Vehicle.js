import * as alt from "alt-client";
import * as native from "natives";

// const color = JSON.parse(alt.File.read("./data/colors.json", "utf-8"));
const modList = JSON.parse(alt.File.read("./data/modList.json", "utf-8"));
// const plateList = JSON.parse(alt.File.read("./data/plateList.json", "utf-8"));
const serverColors = JSON.parse(alt.File.read("./data/serverColors.json", "utf-8"));
// const tireBrand = JSON.parse(alt.File.read("./data/tireBrand.json", "utf-8"));
// const tireColor = JSON.parse(alt.File.read("./data/tireColor.json", "utf-8"));
// const wheelTypeList = JSON.parse(alt.File.read("./data/wheelTypeList.json", "utf-8"));
// const windowTints = JSON.parse(alt.File.read("./data/windowTints.json", "utf-8"));
// const xenonColors = JSON.parse(alt.File.read("./data/xenonColors.json", "utf-8"));

const FRONTWHEELS = 23; // Front Wheels
const REARWHEELS = 24; // Rear Wheels (Motorcycles)

alt.Vehicle.prototype.storeData = function () {
    this.storedData = this.getAllMods("client");
    this.storeData.lightsState = native.getVehicleLightsState(this)[1];
};

alt.Vehicle.prototype.restore = function () {
    this.setAllMod(this.storedData.mods);
    this.setWheels(this.storedData.wheels);
    this.setColors(this.storedData.colors);
    this.setNeons(this.storedData.neons);
    this.setPlate(this.storedData.plate);
};

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
                this.toogleMod(modType, false);
                break;

            default:
                native.removeVehicleMod(this, modType);
                break;
        }
    }

    this.setWheels({ wheelType: 0, wheelNum: 0, wheelColor: 0, drift: false });
    this.setColors({
        primary: { colorType: 0, colorNum: 0, pearl: 0 },
        secondary: { colorType: 0, colorNum: 0 },
        xenon: 0,
        window: 0,
    });
    //  this.setExtraColors({ xenon: 0, window: 0 });
    native.suppressNeonsOnVehicle(this, true);
    this.setPlate({ plateIndex: 0, plateText: "ALTV" });
};

alt.Vehicle.prototype.getAllMods = function (side) {
    const mods = this.getModsData();
    return {
        mods:
            side === "client"
                ? mods
                : Object.entries(mods).map(([key, { num }]) => {
                      key = parseInt(key);
                      if (key != 18) num++;
                      return [key, num];
                  }), //  +1 client to server conversion
        wheels: this.getWheelsData(),
        colors: side === "client" ? this.getColors() : this.getServerColors(),
        //  extraColors: this.getExtraColors(),
        neons: this.getNeons(),
        plate: this.getPlate(),
    };
};

alt.Vehicle.prototype.setMod = function (modType, modId) {
    console.log(modType, modId);
    native.setVehicleMod(this, modType, modId, false);
};

alt.Vehicle.prototype.toogleMod = function (modType, state) {
    native.toggleVehicleMod(this, modType, state);
};

alt.Vehicle.prototype.getMod = function (modType) {
    const count = native.getNumVehicleMods(this, modType);

    switch (modType) {
        case 18:
            //  Turbo
            return {
                count: 0,
                num: native.isToggleModOn(this, modType),
            };

        case FRONTWHEELS:
        case REARWHEELS:
            return;

        default:
            if (count === 0) return;
            return {
                count: count,
                num: native.getVehicleMod(this, modType),
            };
    }
};

alt.Vehicle.prototype.getModsData = function () {
    let modsData = {};
    for (let modType = 0; modType < 50; modType++) {
        //native.preloadVehicleMod(this, modType, 1)
        const modData = this.getMod(modType);
        if (!modData) continue;
        modsData[modType] = Object.assign(modData, { name: native.getModSlotName(this, modType) });
    }
    return modsData;
};

alt.Vehicle.prototype.setAllMod = function (modsData) {
    Object.entries(modsData).forEach(([modType, { num }]) => {
        modType = parseInt(modType);
        switch (modType) {
            //  case 17: ??
            case 18: //Turbo
                //  case 19: ??
                //  case 20: //Custom Tires Smoke
                //  case 21: ??
                //  case 22: //Xenon
                this.toogleMod(modType, num);
                break;

            case 48:
                native.setVehicleLivery(this, num);
                break;

            default:
                this.setMod(modType, num);
                break;
        }
    });
};

alt.Vehicle.prototype.getWheelsData = function () {
    const type = native.getVehicleWheelType(this);
    const num = native.getVehicleMod(this, FRONTWHEELS);
    //  console.log(native.getVehicleMod(this, wheelsFront), native.getVehicleMod(this, wheelsRear));
    const color = native.getVehicleExtraColours(this, 1, 1)[2]; //  [void, pearl, color]
    const drift = native.getDriftTyresSet(this);

    ////  TEST
    const camber = parseFloat(this.getWheelCamber(0).toFixed(2));
    const track = [this.getWheelTrackWidth(0), this.getWheelTrackWidth(2)].map((value) => parseFloat(value.toFixed(2))); //  [Front, Rear]
    ////

    return { type, num, color, drift /* TEST */, camber, track };
};

alt.Vehicle.prototype.setWheels = function ({ type, num, color, drift /* TEST */, camber, track }) {
    const customWheels = native.getVehicleModVariation(this, FRONTWHEELS);
    native.setVehicleWheelType(this, type);
    native.setVehicleMod(this, FRONTWHEELS, num, customWheels);
    const pearl = native.getVehicleExtraColours(this, 1, 1)[1]; //  [void, pearl, color]
    native.setVehicleExtraColours(this, pearl, color);
    native.setDriftTyres(this, drift);

    ////    TEST
    if (!camber || !track) return;
    //  console.log("camber", camber);
    //  console.log("wheelsCount", this.wheelsCount);
    for (let wheelId = 0; wheelId < this.wheelsCount; wheelId++) {
        //  console.log("wheelId", wheelId, "camber", camber, "track", track);
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
    const { xenon, window, tireSmoke } = this.getExtraColors();
    ////

    return { primary, secondary /* Extra */, xenon, window, tireSmoke };
};

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

alt.Vehicle.prototype.getServerColors = function () {
    const [primary, secondary] = native.getVehicleColours(this).splice(1, 2);
    const pearl = native.getVehicleExtraColours(this)[1]; //  [void, pearl(server-side), color(wheels)]

    ////   Extra
    const { xenon, window, tireSmoke } = this.getExtraColors();
    ////

    return { primary, secondary, pearl /* Extra */, xenon, window, tireSmoke };
};

alt.Vehicle.prototype.setColors = function ({ primary, secondary /* Extra */, xenon, window, tireSmoke }) {
    native.setVehicleModColor1(this, primary.colorType, primary.colorNum, primary.pearl);
    native.setVehicleModColor2(this, secondary.colorType, secondary.colorNum);
    const wheelColor = native.getVehicleExtraColours(this, 1, 1)[2]; //  [void, pearl, wheelColor]
    native.setVehicleExtraColours(this, primary.pearl, wheelColor);
    //  console.log(typeof window);
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
