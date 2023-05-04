import * as alt from "alt-client";
import TrackBase from "../../shared/class/TrackBase.js";

export default class TrackEditor extends TrackBase {
    /**
     * @param {string} name
     * @param {alt.CheckpointData[]} datas
     * @returns {alt.TrackEditor}
     */
    constructor(name, datas) {
        super(name, datas);
        this.visible = true;
        datas?.forEach((data, index) => {
            this.insertCheckpoint(index, data);
        });
    }

    /**
     * @param {number} id
     * @returns {Promise<alt.TrackEditor>}
     */
    static async load(id) {
        alt.emitServer("track:load", id);
        alt.onceServer("track:load", (name, data) => {
            return Promise.resolve(new TrackEditor(name, data));
        });
    }

    /**
     * @param {alt.CheckpointData} data
     * @returns {alt.Checkpoint}
     */
    #createCheckpoint(data) {
        const checkpoint = new alt.Checkpoint(data.type, data.pos, data.nextPos ?? data.pos, data.radius, data.height, data.color, 200);
        checkpoint.visible = this.visible;
        return checkpoint;
    }

    /**
     * @param {number} index
     * @returns {alt.Checkpoint}
     */
    getCheckpoint(index) {
        return this.checkpoints[index];
    }

    /**
     * @param {number} index
     * @param {alt.CheckpointData} data
     * @returns {number}
     */
    insertCheckpoint(index, data) {
        if (index > this.checkpoints.length) {
            index = this.checkpoints.length;
        } else {
            data.nextPos = this.getCheckpoint(index)?.pos;
        }

        const checkpoint = this.#createCheckpoint(data);
        this.checkpoints.splice(index, 0, checkpoint);
        this.#updateNextPos(index - 1);
        return index;
    }

    /**
     * @param {alt.CheckpointData} data
     * @returns {number}
     */
    addCheckpoint(data) {
        return this.insertCheckpoint(this.checkpoints.length, data);
    }

    /**
     * @param {number} index
     */
    removeCheckpoint(index) {
        this.checkpoints.splice(index, 1);
        this.#updateNextPos(index - 1);
    }

    /**
     * @param {number} index
     * @param {alt.Vector3} pos
     */
    moveCheckpoint(index, pos) {
        this.getCheckpoint(index).pos = pos;
        this.#updateNextPos(index - 1);
        this.#updateCheckpoint(index);
    }

    #updateNextPos(index) {
        const toUpdate = this.getCheckpoint(index);
        if (toUpdate) {
            console.log("updating nextPos");
            const newPos = this.getCheckpoint(index + 1)?.pos ?? toUpdate.pos;
            toUpdate.nextPos = newPos;
            this.#updateCheckpoint(index);
        }
    }

    /**
     * @param {number} index
     * @param {number} radius
     */
    resizeCheckpoint(index, radius) {
        this.getCheckpoint(index).radius = radius;
        this.#updateCheckpoint(index);
    }

    /**
     * @param {number} index
     * @param {alt.RGBA} color
     */
    changeCheckpointColor(index, color) {
        this.getCheckpoint(index).color = color;
        this.#updateCheckpoint(index);
    }

    /**
     * @param {number} index
     * @param {alt.CheckpointType} type
     */
    changeCheckpointType(index, type) {
        this.getCheckpoint(index).type = type;
        this.#updateCheckpoint(index);
    }

    /**
     * @param {number} index
     * @param {number} height
     */
    changeCheckpointHeight(index, height) {
        this.getCheckpoint(index).height = height;
        this.#updateCheckpoint(index);
    }

    /**
     * @param {number} index
     * @param {number} height
     */
    changeCheckpointRadius(index, radius) {
        this.getCheckpoint(index).radius = radius;
        this.#updateCheckpoint(index);
    }

    /**
     * @param {number} dimension
     */
    setDimension(dimension) {
        this.checkpoints.forEach((checkpoint) => {
            checkpoint.dimension = dimension;
        });
    }

    /**
     * @param {number} index
     */
    async #updateCheckpoint(index) {
        if (this.visible) {
            const checkpoint = this.getCheckpoint(index);
            checkpoint.visible = false;
            await alt.Utils.wait(100);
            checkpoint.visible = true;
        }
    }

    /**
     * @param {boolean} state
     */
    setVisibility(state) {
        this.checkpoints.forEach((checkpoint) => {
            checkpoint.visible = state;
        });
        this.visible = state;
    }

    /**
     * @returns {boolean}
     */
    isVisible() {
        return this.visible;
    }

    getNbCheckpoints() {
        return this.checkpoints.length;
    }
}
