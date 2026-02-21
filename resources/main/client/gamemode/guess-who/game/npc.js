import * as alt from "alt-client";
import * as native from "natives";
import * as anim from "./animations.js";

const CTaskComplexControlMovement = 35;
const CTaskMoveAchieveHeading = 206;
const CTaskJump = 422;

const player = alt.Player.local;

alt.on("gameEntityCreate", async (entity) => {
    if (!entity.hasStreamSyncedMeta("guesswho:npc")) return;
    await alt.Utils.waitFor(() => entity.netOwner, 10000);
    if (entity.netOwner !== player) return;
    // console.log("new npc: apply settings");
    native.setBlockingOfNonTemporaryEvents(entity, true);
    native.setRagdollBlockingFlags(entity, 262143);
});

alt.onServer(
    "guesswho:npc:goto",
    /**
     * @param {alt.Ped} ped
     * @param {number} distance
     */
    async (ped, distance, speed, backwards) => {
        // console.log("guesswho:npc:goto", ped, distance);
        if (!ped?.valid) return;
        if (backwards) distance = -distance;
        const goto = native.getOffsetFromEntityInWorldCoords(ped, 0, distance, 0);
        native.taskGoToCoordAnyMeans(ped, goto.x, goto.y, goto.z, speed, 0, false, 0, 0);

        alt.Utils.waitFor(() => ped.valid && !native.getIsTaskActive(ped, CTaskComplexControlMovement), 10000)
            .then(() => {
                // console.log("goForward done");
                alt.emitServer("guesswho:npc:goto:done", ped);
            })
            .catch(() => {});
    }
);

alt.onServer("guesswho:npc:heading", async (ped, heading) => {
    // console.log("guesswho:npc:heading", ped, heading);
    if (!ped?.valid) return;
    native.taskAchieveHeading(ped, heading, -1);
    // console.log(native.getIsTaskActive(ped, CTaskMoveAchieveHeading));
    // alt.Utils.waitFor(() => !native.getIsTaskActive(ped, CTaskMoveAchieveHeading), 3000).finally(() => {
    await alt.Utils.wait(1500);
    if (!ped?.valid) return;
    // console.log("heading done");
    alt.emitServer("guesswho:npc:heading:done", ped);
});

alt.onServer("guesswho:npc:faceEntity", async (ped, entity) => {
    // console.log("guesswho:npc:faceEntity", ped, entity);
    if (!ped?.valid) return;
    const lookTime = 5000;
    native.taskTurnPedToFaceEntity(ped, entity, 1000);
    native.taskLookAtEntity(ped, entity, lookTime, 2048, 3);
    await alt.Utils.wait(lookTime);
    if (!ped?.valid) return;
    // console.log("faceEntity done");
    alt.emitServer("guesswho:npc:faceEntity:done", ped);
});

alt.onServer("guesswho:npc:jump", async (ped) => {
    // console.log("guesswho:npc:jump", ped);
    if (!ped?.valid) return;
    native.taskJump(ped, true, false, false);
    await alt.Utils.wait(300);
    if (!ped?.valid) return;
    alt.Utils.waitFor(() => !native.getIsTaskActive(ped, CTaskJump), 2000).finally(() => {
        if (!ped?.valid) return;
        // console.log("jump done");
        alt.emitServer("guesswho:npc:jump:done", ped);
    });
});

alt.onServer("guesswho:npc:wave", async (ped) => {
    // console.log("guesswho:npc:wave", ped);
    if (!ped?.valid) return;
    await anim.wave(ped);
    if (!ped?.valid) return;
    alt.emitServer("guesswho:npc:wave:done", ped);
});

alt.onServer("guesswho:npc:phone", async (ped) => {
    // console.log("guesswho:npc:phone", ped);
    if (!ped?.valid) return;
    await anim.takePhone(ped);
    if (!ped?.valid) return;
    alt.emitServer("guesswho:npc:phone:done", ped);
});
