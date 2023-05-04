import * as alt from "alt-shared";

export default class TrackBase {
    /**
     * @param {string} name
     * @param {alt.CheckpointData[]} checkpointsDatas
     * @returns {TrackBase}
     */
    constructor(name, checkpointsDatas) {
        this.name = name;
        this.checkpointsDatas = checkpointsDatas ?? [];
        this.checkpoints = [];
    }
}
