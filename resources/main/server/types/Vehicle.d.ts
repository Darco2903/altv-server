declare module "alt-server" {
    import { Player, Vehicle } from "alt-server";
    import { Vehicle as VehicleShared } from "alt-shared";

    namespace Vehicle {
        type modData = VehicleShared.modData;
        type neonData = VehicleShared.neonData;
        type plateData = VehicleShared.plateData;
        type serverColors = VehicleShared.serverColors;
        type wheelsData = VehicleShared.wheelsData;
    }

    interface Vehicle {
        setColorsData(colorsData: VehicleS.serverColors): void;
        setModsData(modsData: VehicleS.modData[]): void;
        setNeonsData(neonsData: VehicleS.neonData): void;
        setPlateData(platesData: VehicleS.plateData): void;
        setWheelsData(wheelsData: VehicleS.wheelsData): void;

        /**
         * Save the vehicle appearance to the database
         */
        saveAppearance(): Promise<void>;

        /**
         * Change the owner of the vehicle
         * @param player The new owner of the vehicle
         */
        changeOwner(player: Player): Promise<void>;

        /**
         * Get a vehicle name by its hash
         */
        getName(): string;
    }
}
