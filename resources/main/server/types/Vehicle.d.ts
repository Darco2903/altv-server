declare module "alt-server" {
    import { Vehicle as VehicleShared } from "alt-shared";

    namespace Vehicle {
        type modData = VehicleShared.modData;
        type neonData = VehicleShared.neonData;
        type plateData = VehicleShared.plateData;
        type serverColors = VehicleShared.serverColors;
        type wheelsData = VehicleShared.wheelsData;
        type allMods = VehicleShared.allModsServer;
    }

    interface Vehicle {
        getSyncedMeta(key: "id"): number;
        hasSyncedMeta(key: "id"): boolean;
        setSyncedMeta(key: "id", value: number);

        getMeta(key: "owner"): number;
        hasMeta(key: "owner"): boolean;
        setMeta(key: "owner", value: number);

        setColorsData(colorsData: Vehicle.serverColors): void;
        setModsData(modsData: Vehicle.modData[]): void;
        setNeonsData(neonsData: Vehicle.neonData): void;
        setPlateData(platesData: Vehicle.plateData): void;
        setWheelsData(wheelsData: Vehicle.wheelsData): void;

        /**
         * Get a vehicle name by its hash
         */
        getModelName(): string;

        /**
         * Delete the vehicle from the database
         * @returns The id of the vehicle removed from the database
         */
        delete(): Promise<number>;

        /**
         * Register a vehicle in the database
         * @param owner The owner of the vehicle
         * @returns The id of the vehicle in the database
         */
        register(owner: Player): Promise<number>;

        /**
         * Save the vehicle appearance in the database
         */
        saveAppearance(): Promise<void>;

        /**
         * Change the owner of the vehicle
         * @param player The new owner of the vehicle
         */
        changeOwner(player: Player): Promise<void>;
    }
}
