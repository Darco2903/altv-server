declare module "alt-client" {
    import { Vehicle as VehicleShared } from "alt-shared";

    namespace Vehicle {
        type wheelsData = VehicleShared.wheelsData;
    }

    interface Vehicle {
        /**
         * Get the vehicle wheels data.
         * @returns The vehicle wheels data.
         */
        getWheelsData(): Vehicle.wheelsData;

        /**
         * Set the vehicle wheels data.
         * @param wheelsData The vehicle wheels data to set.
         */
        setWheels(wheelsData: Vehicle.wheelsData): void;

        /**
         * Set the stock vehicle wheels.
         */
        setStockWheels(): void;
    }
}
