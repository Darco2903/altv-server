import * as alt from "alt-client";
import * as native from "natives";

/**
 * @param {alt.Ped} ped
 */
export async function wave(ped) {
    const animDict = "friends@frj@ig_1";
    const animName = "wave_e";
    await alt.Utils.requestAnimDict(animDict);
    const animDuration = native.getAnimDuration(animDict, animName) * 1000;
    // console.log("duration", animDuration);

    native.taskPlayAnim(ped, animDict, animName, 1, 1, 2400, 0, 0, false, false, false);
    await alt.Utils.wait(animDuration);
    // console.log("wave done");
}

/**
 * @param {alt.Ped} player
 */
export async function takePhone(ped) {
    const phone = new alt.LocalObject("xm_prop_x17_phone_01", ped.pos, alt.Vector3.zero, false, false, true, 100);
    const bone = native.getPedBoneIndex(ped, 28422);
    phone.visible = false;
    phone.attachToEntity(ped, bone, alt.Vector3.zero, alt.Vector3.zero, false, false, true);

    const animDict = "cellphone@";
    const animName1 = "cellphone_text_in";
    const animName2 = "cellphone_text_read_base";
    const animName3 = "cellphone_text_out";
    await alt.Utils.requestAnimDict(animDict);
    const animDuration1 = native.getAnimDuration(animDict, animName1) * 1000;
    const animDuration2 = native.getAnimDuration(animDict, animName2) * 500;
    const animDuration3 = native.getAnimDuration(animDict, animName3) * 300;
    // console.log("duration", animDuration1, animDuration2, animDuration3, animDuration1 + animDuration2 + animDuration3);

    native.taskPlayAnim(ped, animDict, animName1, 1, 1, -1, 18, 0, false, false, false);
    alt.setTimeout(() => (phone.visible = true), 500);
    await alt.Utils.wait(animDuration1);
    // console.log("animDict done");
    if (!ped?.valid) return;
    native.taskPlayAnim(ped, animDict, animName2, 1, 1, animDuration2, 18, 0, false, false, false);
    await alt.Utils.wait(animDuration2);
    // console.log("animDict done");
    if (!ped?.valid) return;
    native.taskPlayAnim(ped, animDict, animName3, 1, 1, animDuration3, 16, 0, false, false, false);
    alt.setTimeout(() => phone.destroy(), 500);
    await alt.Utils.wait(animDuration3);
    // console.log("animDict done");
    // console.log("phone done");
}
