declare module "alt-shared" {
    namespace Vehicle {
        type serverColors = {
            primary: number;
            secondary: number;
            pearl: number;
            xenon: number;
            window: number;
            tireSmoke: number;
        };

        type modData = {
            count: number;
            modType: number;
            name: string;
            num: number;
        };

        type neonData = {
            color: RGBA;
            enabled: boolean;
        };

        type plateData = {
            plateIndex: number;
            plateText: string;
        };

        type wheelsData = {
            type: number;
            num: number;
            color: number;
            drift: boolean;
        };

        type allModsServer = {
            colors: serverColors;
            mods: modData[];
            neons: neonData;
            plate: plateData;
            wheels: wheelsData;
        };
    }
}
