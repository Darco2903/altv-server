import * as alt from "alt-client";
import * as native from "natives";
import AudioBase from "./base/AudioBase.js";
import SyncedAudio from "./SyncedAudio.js";

const player = alt.Player.local;

export default class SyncedCarRadio extends SyncedAudio {
    static #DEFAULT_DISTANCE = 100;

    /** @type {Map<number, SyncedCarRadio>} */
    static #all = new Map();
    static get all() {
        return this.#all;
    }

    static getByRemoteID(id) {
        return this.#all.get(id);
    }

    /** @type {alt.Vehicle} */
    #vehicle;
    get vehicle() {
        return this.#vehicle;
    }

    /** @type {boolean} */
    #isInteriorMuffled = false;
    get isInteriorMuffled() {
        return this.#isInteriorMuffled;
    }

    /**
     * @param {alt.Vehicle} vehicle
     */
    constructor(id, vehicle) {
        // console.log("SyncedCarRadio");
        super(id, { support2dAudio: true });
        SyncedCarRadio.#all.set(id, this);
        this.#vehicle = vehicle;
        vehicle.radio = this;
        this.setOutputOnEntity(vehicle);
        this.enable3d(player.vehicle !== vehicle);
    }

    interiorMuffle(enable) {
        // console.log("interior MUFFLE", enable);
        if (enable === this.#isInteriorMuffled) return;
        this.#isInteriorMuffled = enable;
        this.#isInteriorMuffled = enable;
        if (enable) this.addMuffle();
        else this.lessMuffle();
    }

    enable3d(enable) {
        this._enable3d(enable);
    }

    destroy() {
        // console.log("destroy SyncedCarRadio");
        SyncedCarRadio.#all.delete(this._remoteId);
        // this.removeOutputOnEntity(this.#vehicle);
        this.#vehicle.radio = null;
        super.destroy();
    }
}

alt.on("enteredVehicle", (vehicle, seat) => {
    // console.log("ENTERED VEHICLE", !!vehicle.radio);
    vehicle.radio?.enable3d(false);
});

alt.on("leftVehicle", (vehicle, seat) => {
    // console.log("LEFT VEHICLE", !!vehicle.radio);
    vehicle.radio?.enable3d(true);
});

alt.setInterval(() => {
    alt.Vehicle.streamedIn.forEach((vehicle) => {
        const windowsIntact = native.areAllVehicleWindowsIntact(vehicle);
        const doorsStates = new Array(native.getNumberOfVehicleDoors(vehicle)).fill(0).map((_, i) => native.getVehicleDoorAngleRatio(vehicle, i) !== 0);
        const doorsOpen = doorsStates.some((v) => v);

        if (player.vehicle === vehicle) return;
        if (windowsIntact && !doorsOpen && vehicle.radio && !vehicle.radio.isInteriorMuffled) {
            vehicle.radio.interiorMuffle(true);
        } else if ((!windowsIntact || doorsOpen) && vehicle.radio?.isInteriorMuffled) {
            vehicle.radio.interiorMuffle(false);
        }

        // if (vehicle.netOwner === player) {
        //     // console.log("doorsStates", doorsStates, vehicle.getStreamSyncedMeta("doorStates"));
        //     if (doorsStates.toString() !== vehicle.getStreamSyncedMeta("doorStates")?.toString()) {
        //         alt.emitServer("vehicle:doorState", vehicle, doorsStates);
        //     }
        // }
    });

    const hasHelmet = native.isPedWearingHelmet(player);
    const vehicleWithHelmet = player.vehicle && native.getVehicleClass(player.vehicle) === 8;

    if (player.vehicle && !vehicleWithHelmet) {
        const windowsIntact = native.areAllVehicleWindowsIntact(player.vehicle);
        const doorsOpen = new Array(native.getNumberOfVehicleDoors(player.vehicle))
            .fill(0)
            .map((_, i) => native.getVehicleDoorAngleRatio(player.vehicle, i) !== 0)
            .some((v) => v);
        if (windowsIntact && !doorsOpen) {
            // alt.Vehicle.streamedIn
            //     .filter((v) => v !== player.vehicle && v.radio?.isPlaying && !v.radio.isExteriorMuffled)
            //     .forEach((v) => v.radio.exteriorMuffle(true));
            AudioBase.all
                // .filter((audio) => audio.id !== player.vehicle.radio?.id && audio.isPlaying && !audio.isExteriorMuffled)
                .filter((audio) => audio.id !== player.vehicle.radio?.id && !audio.isExteriorMuffled)
                .forEach((audio) => audio.exteriorMuffle(true));
        } else if (!windowsIntact || doorsOpen) {
            // alt.Vehicle.streamedIn
            //     .filter((v) => v !== player.vehicle && v.radio?.isPlaying && v.radio?.isExteriorMuffled)
            //     .forEach((v) => v.radio.exteriorMuffle(false));
            AudioBase.all
                // .filter((audio) => audio.id !== player.vehicle.radio?.id && audio.isPlaying && audio.isExteriorMuffled)
                .filter((audio) => audio.id !== player.vehicle.radio?.id && audio.isExteriorMuffled)
                .forEach((audio) => audio.exteriorMuffle(false));
        }
    } else {
        if (hasHelmet) {
            AudioBase.all.filter((audio) => audio.isPlaying && !audio.isExteriorMuffled).forEach((audio) => audio.exteriorMuffle(true));
        } else {
            AudioBase.all.filter((audio) => audio.isPlaying && audio.isExteriorMuffled).forEach((audio) => audio.exteriorMuffle(false));
        }
    }
}, 100);
