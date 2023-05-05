declare module "alt-client" {
    import { Vector3 } from "alt-client";
    import { Utils as UtilsShared } from "alt-shared";

    namespace Utils {
        type notificationOptions = UtilsShared.notificationOptions;

        type TimeData = UtilsShared.TimeData;

        function enableChat(state: boolean): void;
        function isChatEnabled(): boolean;
        function isChatOpen(): boolean;

        /**
         * Draws a notification on the screen.
         *
         * @param notificationOptions The notification options.
         * @example
         * drawNotification({
         *  imageName: "CHAR_BLOCKED",
         *  headerMsg: "Test",
         *  detailsMsg: "Test",
         *  message: "Test"
         * });
         */
        function drawNotification(notificationOptions: notificationOptions): void;

        /**
         * Get the current waypoint position.
         */
        function getWaypointPos(): Vector3;

        /**
         * Player can only move.
         *
         * @param state The state to set the controls to.
         */
        function toggleOnlyMove(state: boolean): void;

        /**
         * Player can only look around.
         *
         * @param state The state to set the controls to.
         */
        function toggleTunerControls(state: boolean): void;
    }
}
