declare module "alt-client" {
    import { Vehicle } from "alt-client";
    import { Vehicle as VehicleShared } from "alt-shared";

    namespace Vehicle {
        type primaryColor = {
            type: number;
            num: number;
            pearl: number;
        };
        type secondaryColor = {
            type: number;
            num: number;
        };
        type colorData = {
            primary: primaryColor;
            secondary: secondaryColor;
            xenon: number;
            window: number;
        };
        type extraColors = {
            xenon: number;
            window: number;
            tireSmoke: number;
        };
        type serverColors = VehicleShared.serverColors;
    }
    
    interface Vehicle {
        getColorsData(): Vehicle.colorData;
        getExtraColorsData(): Vehicle.extraColors;
        getServerColors(): Vehicle.serverColors;
        setColors(colorData: Vehicle.colorData): void;
        setStockColors(): void;
    }
}
