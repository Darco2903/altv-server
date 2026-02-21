import * as alt from "alt-client";
import * as native from "natives";

const setMinus = (a) => (a < 0 ? -1 : 1);

alt.Vehicle.prototype.getRealSpeed = function () {
    const v = native.getEntitySpeedVector(this, true);
    const x = v.x ** 2 * setMinus(v.x);
    const y = v.y ** 2 * setMinus(v.y);
    const z = v.z ** 2 * setMinus(v.z);
    const speed = x + y + z;
    return speed < 0 ? -Math.sqrt(-speed) : Math.sqrt(speed);
};
