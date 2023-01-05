import * as alt from "alt-client";
import * as native from "natives";
import { modList, serverColors } from "./data/tables";

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
                native.setVehicleLivery(veh, mod);
                break;

            default:
                setMod(mod);
                break;
        }
    });
};

alt.Vehicle.prototype.getWheelsData = function () {
    const wheelType = native.getVehicleWheelType(this);
    const wheelNum = native.getVehicleMod(this, wheelsFront) + 1;
    //  console.log(native.getVehicleMod(this, wheelsFront), native.getVehicleMod(this, wheelsRear));
    const wheelColor = native.getVehicleExtraColours(this, 1, 1)[2]; //  [void, pearl, color]
    const drift = native.getDriftTyresSet(this);
    return { wheelType, wheelNum, wheelColor, drift };
};
