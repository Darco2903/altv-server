declare module "alt-shared" {
    import { Vehicle, RGBA } from "alt-shared";

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
    }
}
