import * as clock from "./Clock";

declare module "alt-server" {
    import { Player, Utils } from "alt-server";
    import { register } from "../chat";

    namespace Utils {
        type commandArgs = {
            name: string;
            description?: string;
            required: boolean;
        };
        type commandData = {
            name: string;
            args?: commandArgs[];
            description?: string;
            permissionLevel?: number;
            execute: (player: Player, args: string[]) => void;
        };

        function registerCommand(commandData: Utils.commandData): void;
    }
}
