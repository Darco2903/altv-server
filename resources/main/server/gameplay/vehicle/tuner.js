import * as alt from "alt-server";

// alt.onClient("vehicletuner:restore", (player) => {
//     const appearance = player.vehicle.getAppearanceDataBase64();
//     player.vehicle.primaryColor = 0;
//     setTimeout(() => {
//         player.vehicle.setAppearanceDataBase64(appearance);
//     }, 100);
// });

alt.onClient(
    "vehicletuner:mods",
    /** @param {Array<{type: number, num: number}>} mods */
    (player, mods) => {
        mods.forEach(({ type, num }) => {
            try {
                player.vehicle.setMod(type, num);
            } catch (error) {
                alt.logError(error);
            }
        });
    }
);

alt.onClient(
    "vehicletuner:colors",
    /** @param {number} primary */
    /** @param {number} secondary */
    /** @param {number} pearl */
    (player, primary, secondary, pearl) => {
        try {
            player.vehicle.primaryColor = primary;
            player.vehicle.secondaryColor = secondary;
            player.vehicle.pearlColor = pearl;
        } catch (error) {
            alt.logError(error);
        }
    }
);

alt.onClient(
    "vehicletuner:wheels",
    /** @param {number} type */
    /** @param {number} index */
    /** @param {number} color */
    /** @param {boolean} drift */
    (player, type, index, color, drift) => {
        try {
            player.vehicle.setWheels(type, index);
            player.vehicle.setRearWheels(index);
            player.vehicle.wheelColor = color;
            player.vehicle.driftModeEnabled = drift;
        } catch (error) {
            alt.logError(error);
        }
    }
);

alt.onClient(
    "vehicletuner:wheels:rear",
    /** @param {number} type */
    /** @param {number} index */
    (player, type, index) => {
        try {
            player.vehicle.setRearWheels(type, index);
        } catch (error) {
            alt.logError(error);
        }
    }
);

alt.onClient(
    "vehicletuner:wheels:track",
    /** @param {Array<number>} trackWidth */
    /** @param {Array<number>} camber */
    (player, trackWidth, camber) => {
        try {
            player.vehicle.setStreamSyncedMeta("trackWidth", trackWidth);
            player.vehicle.setStreamSyncedMeta("camber", camber);
        } catch (error) {
            alt.logError(error);
        }
    }
);

alt.onClient(
    "vehicletuner:neon",
    /** @param {Array<boolean>} states */
    /** @param {number} color */
    (player, states, color) => {
        try {
            player.vehicle.neon = states;
            player.vehicle.neonColor = color;
        } catch (error) {
            alt.logError(error);
        }
    }
);

alt.onClient(
    "vehicletuner:xenon",
    /** @param {boolean} state */
    /** @param {number} color */
    (player, state, color) => {
        try {
            player.vehicle.setMod(22, state);
            player.vehicle.headlightColor = color;
        } catch (error) {
            alt.logError(error);
        }
    }
);

alt.onClient(
    "vehicletuner:plate",
    /** @param {number} plateIndex */
    /** @param {string} plateText */
    (player, plateIndex, plateText) => {
        try {
            player.vehicle.numberPlateIndex = plateIndex;
            player.vehicle.numberPlateText = plateText;
        } catch (error) {
            alt.logError(error);
        }
    }
);
