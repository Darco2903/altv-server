declare module "alt-shared" {
    namespace Player {
        type opLevel = 0 | 1 | 2 | 3 | 4;
    }
}

declare module "alt-server" {
    import * as shared from "alt-shared";

    interface Player {
        getSyncedMeta(key: "op"): shared.Player.opLevel;
        setSyncedMeta(key: "op", value: shared.Player.opLevel): void;

        /**
         * Checks if the player has the required permission level.
         *
         * @param level The required permission level.
         */
        hasPermission(opLevel: shared.Player.opLevel): boolean;

        /**
         * Sends a message to the player if they are not authorized.
         */
        notAuthorized(): void;

        setOpLevel(level: shared.Player.opLevel): void;
    }
}
