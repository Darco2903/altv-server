declare module "alt-client" {
    import { Vehicle } from "alt-client";
    import { Vehicle as VehicleShared } from "alt-shared";

    namespace Vehicle {
        type wheelsData = VehicleShared.wheelsData;
    }

    interface Vehicle {
        getWheelsData(): Vehicle.wheelsData;
        setWheels(wheelsData: Vehicle.wheelsData): void;
        setStockWheels(): void;
    }
}
