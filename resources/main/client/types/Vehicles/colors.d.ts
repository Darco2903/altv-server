declare module "alt-client" {
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
        /**
         * Get the vehicle colors data.
         * @returns The vehicle colors data.
         */
        getColorsData(): Vehicle.colorData;

        /**
         * Get the vehicle extra colors data.
         * @returns The vehicle extra colors data.
         */
        getExtraColorsData(): Vehicle.extraColors;

        /**
         * Get the vehicle server colors data.
         * @returns The vehicle server colors data.
         */
        getServerColors(): Vehicle.serverColors;

        /**
         * Set the vehicle colors data.
         * @param colorData The vehicle colors data to set.
         */
        setColors(colorData: Vehicle.colorData): void;

        /**
         * Set the stock vehicle colors.
         */
        setStockColors(): void;
    }
}
