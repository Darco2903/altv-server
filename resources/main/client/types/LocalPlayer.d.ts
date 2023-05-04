declare module "alt-client" {
    import { LocalPlayer, Utils, Vector3 } from "alt-client";

    interface LocalPlayer {
        getSyncedMeta(key: "id"): number;
        getSyncedMeta(key: "op"): number;

        /**
         * Checks if the player has the required permission level.
         *
         * @param level The required permission level.
         */
        authorized(level: number): boolean;

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
         * Toggle the player's noclip.
         * @param state The state to set the noclip to.
         */
        toggleNoclip(state: boolean): void;

        /**
         * Teleports the player to the specified position.
         *
         * @param pos The position to teleport the player to.
         * @param heading The heading to set the player to.
         */
        tp(pos: Vector3, heading: ?number): void;
    }
}
