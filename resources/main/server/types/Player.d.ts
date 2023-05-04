declare module "alt-server" {
    import { Player, Utils } from "alt-shared";
    namespace Player {}
    interface Player {
        getSyncedMeta(key: "id"): number;
        getSyncedMeta(key: "op"): number;

        /**
         * Checks if the player has the required permission level.
         *
         * @param level The required permission level.
         */
        authorized(level: number): boolean;

        /**
         * Sends a notification to the player that they are not authorized to use a command.
         */
        notAuthorized(): void;

        /**
         * Sends a notification to the player.
         *
         * @param notificationOptions The notification options.
         * @example
         * player.notify({
         *   imageName: "CHAR_BLOCKED",
         *   headerMsg: "Test",
         *   detailsMsg: "Test",
         *   message: "Test"
         * });
         */
        notify(notificationOptions: Utils.notificationOptions): void;

        /**
         * Sends a chat message to the player.
         *
         * @param message The message to send.
         */
        send(message: string): void;
    }
}
