declare module "alt-server" {
    import { Player } from "alt-server";

    namespace Utils {
        function waitForModelLoaded(players: Player[], model: string): Promise<void>;
    }
}
