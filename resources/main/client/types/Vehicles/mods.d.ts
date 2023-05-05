declare module "alt-client" {
    import { Vehicle as VehicleShared } from "alt-shared";

    namespace Vehicle {
        type modData = VehicleShared.modData;

        /**
         * Get if the modType is a toggle mod.
         * @param modType The modType to check.
         */
        function isToggleMod(modType: number): boolean;

        /**
         * Get if the modType is a mod to skip.
         * @param modType The modType to check.
         */
        function isSkipMod(modType: number): boolean;
    }

    interface Vehicle {
        /**
         * Set the vehicle mod.
         * @param modType The modType to set.
         * @param modId The modId to set.
         */
        setMod(modType: number, modId: boolean): void;

        /**
         * Toggle the vehicle mod.
         * @param modType The modType to set.
         * @param state The state to set.
         */
        toggleMod(modType: number, state: boolean): void;

        /**
         * Get the vehicle mod data for the modType.
         * @param modType The modType to get.
         * @returns The mod data.
         */
        getModData(modType: number): Vehicle.modData;

        /**
         * Get all the vehicle mod data.
         * @returns All the mod data.
         */
        getModsData(): Vehicle.modData[];

        /**
         * Set all the vehicle mods.
         * @param mods The mods data list to set.
         */
        setMods(mods: Vehicle.modData[]): void;

        /**
         * Set the vehicle stock mods.
         */
        setStockMods(): void;
    }
}
