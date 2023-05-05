declare module "alt-client" {
    import { Vehicle as VehicleShared } from "alt-shared";

    namespace Vehicle {
        type neonData = VehicleShared.neonData;
    }

    interface Vehicle {
        /**
         * Get the vehicle neons data.
         * @returns The vehicle neons data.
         */
        getNeonsData(): Vehicle.neonData;

        /**
         * Set the vehicle neons data.
         * @param neonData The vehicle neons data to set.
         */
        setNeons(neonData: Vehicle.neonData): void;

        /**
         * Set the stock vehicle neons.
         */
        setStockNeons(): void;
    }
}
