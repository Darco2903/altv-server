declare module "alt-server" {
    import * as shared from "alt-shared";

    namespace Utils.Chat {
        type commandData = {
            name: string;
            args?: {
                name: string;
                description?: string;
                type: "string" | "number" | "boolean";
                values?: string[];
                required?: boolean;
            }[];
            description?: string;
            permissionLevel?: Player;
            execute: (player: Player, args: string[]) => Promise<void>;
        };

        function broadcast(msg: string): void;
        function mutePlayer(player: Player, state: boolean): void;
        function registerCmd(commandData: commandData): void;
        function send(player: Player, msg: string, senderName: string): void;
    }
}
