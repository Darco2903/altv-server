declare module "alt-client" {
    import { Vehicle } from "alt-client";
    import { Vehicle as VehicleShared } from "alt-shared";

    namespace Vehicle {
        type modData = VehicleShared.modData;
        function isToggleMod(modType: number): boolean;
        function isSkipMod(modType: number): boolean;
    }
    interface Vehicle {
        setMod(modType: number, modId: boolean): void;
        toggleMod(modType: number, state: boolean): void;
        getModData(): VehicleShared.modData;
        getModsData(): VehicleShared.modData[];
        setMods(mods: VehicleShared.modData[]): void;
        setStockMods(): void;
    }
}
