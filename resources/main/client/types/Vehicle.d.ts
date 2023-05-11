declare module "alt-client" {
    import { Vehicle as VehicleShared } from "alt-shared";

    namespace Vehicle {
        type allMods = {
            colors: Vehicle.colorData;
            mods: Vehicle.modData[];
            neons: Vehicle.neonData;
            plate: Vehicle.plateData;
            wheels: Vehicle.wheelsData;
        };

        type allModsServer = VehicleShared.allModsServer;
    }

    interface Vehicle {
        getSyncedMeta(key: "id"): number;
        hasSyncedMeta(key: "id"): boolean;
        setSyncedMeta(key: "id", value: number);

        /**
         * Restore the vehicle to its original state.
         */
        restore(): void;

        /**
         * Set the vehicle stock.
         */
        setStock(): void;

        /**
         * Get the vehicle mods.
         */
        getAllMods(): Vehicle.allMods;

        /**
         * Get the vehicle mods formatted for the server.
         */
        getAllModsServer(): Vehicle.allMods;
    }
}
