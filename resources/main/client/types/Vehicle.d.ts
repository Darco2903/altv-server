declare module "alt-client" {
    import { Vehicle } from "alt-client";

    namespace Vehicle {
        type allMods = {
            colors: Vehicle.colorData;
            mods: Vehicle.modData;
            neons: Vehicle.neonData;
            plate: Vehicle.plateData;
            wheels: Vehicle.wheelsData;
        };
    }

    interface Vehicle {
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
