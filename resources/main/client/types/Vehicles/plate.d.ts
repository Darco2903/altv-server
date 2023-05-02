declare module "alt-client" {
    import { Vehicle } from "alt-client";
    import { Vehicle as VehicleShared } from "alt-shared";

    namespace Vehicle {
        type plateData = VehicleShared.plateData;
    }

    interface Vehicle {
        getPlateData(): Vehicle.plateData;
        setPlate(plateData: Vehicle.plateData): void;
        setStockPlate(): void;
    }
}
