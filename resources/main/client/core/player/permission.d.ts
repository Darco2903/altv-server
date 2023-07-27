declare module "alt-client" {
    import * as shared from "alt-shared";

    interface Player {
        /**
         * Checks if the player has the required permission level.
         *
         * @param level The required permission level.
         */
        hasPermission(opLevel: shared.Player.opLevel): boolean;
    }
}
