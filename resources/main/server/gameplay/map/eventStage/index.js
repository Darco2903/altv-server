import * as alt from "alt-server";
import { Screen } from "./Screen.js";
import { AudioStream } from "../../../core/audioStream/AudioStream.js";

const outputsPos = {
    mainBigR: { pos: [307.97, -1614.7, 32.22], rot: [0, 0.9, 0] },
    mainBigL: { pos: [304.9, -1618.24, 32.22], rot: [0, 0.9, 0] },
    // mainRLow: { pos: [308.67, -1615.09, 30.92], rot: [0.3, -0.05, 0] },  // removable
    // mainLLow: { pos: [305.42, -1618.78, 30.92], rot: [-0.3, 1.83, 0] },  // removable
    // mainRMid: { pos: [312.52, -1612.05, 33.78], rot: [0, 1.23, 0] }, // removable
    // mainLMid: { pos: [303.35, -1623.45, 33.78], rot: [0, 0.3, 0] },  // removable
    mainBigRLow: { pos: [312.17, -1611.87, 31.19], rot: [0, 1.29, 0] },
    mainBigLLow: { pos: [303.19, -1623.02, 31.25], rot: [0, 0.32, 0] },
    mainRHigh: { pos: [312.4, -1611.68, 38.31], rot: [-1, 0.84, 0] },
    mainLHigh: { pos: [303.26, -1622.87, 38.31], rot: [-1, 0.89, 0] },
    sideRLow: { pos: [304.85, -1589.61, 30.69], rot: [0, 2.13, 0] },
    sideLLow: { pos: [279.91, -1619.44, 30.75], rot: [0, -0.5, 0] },
    // sideRMid: { pos: [304.93, -1589.57, 32.64], rot: [0, 2.13, 0] }, // removable
    // sideLMid: { pos: [279.88, -1619.31, 32.65], rot: [0, -0.57, 0] },    // removable
    upRight: { pos: [290.21, -1599.11, 40.95], rot: [-1, -0.69, 0] },
    upLeft: { pos: [286.81, -1603.28, 40.95], rot: [1, 2.43, 0] },
    upFront: { pos: [290.33, -1602.78, 40.95], rot: [1, -2.3, 0] },
    upRear: { pos: [286.51, -1599.57, 40.95], rot: [-1, 0.84, 0] },
};

/** @type {SyncedAudio} */
let audioSet;
/** @type {Screen} */
let screenSet;

/**
 * @param {string} videoId
 * @param {number} [volume]
 * @returns {Promise<SyncedAudio>}
 */
async function createAudioSet(videoId, volume) {
    const audioStream = await AudioStream.create(videoId, volume);
    Object.entries(outputsPos).forEach(([name, { pos, rot }]) => {
        audioStream.createOutput(name, new alt.Vector3(pos), new alt.Vector3(rot));
    });
    return audioStream;
}

async function initStage() {
    alt.setSyncedMeta("eventStage:init", true);

    // video effect
    // const videoId = "E1liGZpoJB8";
    // const videoId = "c3L0fbtftRY";

    // toothless
    const videoId = "h-0EzLKCvaA";

    // 너는 나 나는 너
    // const videoId = "qNeq0aRGk9I";

    // Stranger Things Theme Song (C418 REMIX)
    // const videoId = "Jmv5pTyz--I";

    // GAS GAS GAS - Piano Tutorial
    // const videoId = "XT4oePp11jk";

    // blinding lights Coachella 2022 (The Weeknd)
    // const videoId = "L8ZoGtAQ1mw";
    // audioSet = await createAudioSet(videoId, 0.5);
    // screenSet = new Screen(videoId);
    // audioSet.seek(645);
    // screenSet.seek(645);

    audioSet = await createAudioSet(videoId, 1);
    screenSet = new Screen(videoId);
    // audioSet.seek(120);
    // screenSet.seek(120);
    // audioSet.play();
    screenSet.play();
}

alt.on("resourceStart", () => {
    if (!alt.hasResource("justmink_eventstage-davis")) return;
    alt.Utils.wait(3000).then(() => {
        // initStage();
    });
});

alt.on("resourceStop", () => {
    if (audioSet) audioSet.destroy();
    if (screenSet) screenSet.destroy();
});
