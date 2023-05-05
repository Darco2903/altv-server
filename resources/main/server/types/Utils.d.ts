import * as clock from "./Clock";

declare module "alt-server" {
    import { Utils as UtilsShared } from "alt-shared";

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

        type notificationOptions = UtilsShared.notificationOptions;

        type TimeData = UtilsShared.TimeData;

        /**
         * Registers a chat command.
         * @param commandData The command data.
         */
        function registerCommand(commandData: commandData): void;

        let clock: clock.Clock;
    }
}
