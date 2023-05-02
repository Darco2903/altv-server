declare module "alt-client" {
    import { Vehicle } from "alt-client";
    import { Vehicle as VehicleShared } from "alt-shared";

    namespace Vehicle {
        type neonData = VehicleShared.neonData;
    }

    interface Vehicle {
        getNeonsData(): Vehicle.neonData;
        setNeons(neonData: Vehicle.neonData): void;
        setStockNeons(): void;
    }
}
