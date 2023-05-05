declare module "alt-client" {
    import { Vehicle as VehicleShared } from "alt-shared";

    namespace Vehicle {
        type plateData = VehicleShared.plateData;
    }

    interface Vehicle {
        /**
         * Get the vehicle plate data.
         * @returns The vehicle plate data.
         */
        getPlateData(): Vehicle.plateData;

        /**
         * Set the vehicle plate data.
         * @param plateData The vehicle plate data to set.
         */
        setPlate(plateData: Vehicle.plateData): void;

        /**
         * Set the stock vehicle plate.
         */
        setStockPlate(): void;
    }
}
