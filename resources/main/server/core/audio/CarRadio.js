import * as alt from "alt-server";
import SyncedAudio from "./SyncedAudio.js";

export default class CarRadio extends SyncedAudio {
    static #DEFAULT_DISTANCE = 100;

    /** @type {Map<number, CarRadio>} */
    static #all = new Map();
    static get all() {
        return Array.from(this.#all.values());
    }

    static getByID(id) {
        return this.#all.get(id);
    }

    /** @type {alt.Vehicle} */
    #vehicle;
    get vehicle() {
        return this.#vehicle;
    }

    /**
     * @param {alt.Vehicle} vehicle
     */
    constructor(vehicle, options = {}) {
        super({
            ...options,
            distance: CarRadio.#DEFAULT_DISTANCE,
        });
        CarRadio.#all.set(this._id, this);
        this.#vehicle = vehicle;
        vehicle.radio = this;
        vehicle.setStreamSyncedMeta("radio", true);
        this.setOutputOnEntity(vehicle);
    }

    destroy() {
        console.log("destroy");
        this.#vehicle.deleteStreamSyncedMeta("radio");
        this.#vehicle.radio = undefined;
        CarRadio.#all.delete(this._id);
        super.destroy();
    }
}



alt.onClient("vehicle:doorState", (player, veh, doorStates) => {
    // console.log(doorStates);
    veh.setStreamSyncedMeta("doorStates", doorStates);
});
