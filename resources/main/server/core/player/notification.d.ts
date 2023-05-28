declare module "alt-server" {
    import * as shared from "alt-shared";

    function emitClient(player: Player | Player[], eventName: "notification", notificationOptions: shared.Player.notificationOptions): void;

    namespace Player {
        /**
         * Send a notification to all players.
         * @param notificationOptions The notification options.
         */
        function sendNotification(players: Player[], notificationOptions: shared.Player.notificationOptions): void;
    }

    interface Player {
        /**
         * Sends a notification to the player.
         *
         * @param notificationOptions The notification options.
         * @example
         * player.sendNotification({
         *  imageName: "CHAR_BLOCKED",
         * headerMsg: "Test",
         * detailsMsg: "Test",
         * message: "Test"
         * });
         */
        sendNotification(notificationOptions: shared.Player.notificationOptions): void;
    }
}
