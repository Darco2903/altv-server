import Team from "./team/Team.js";

declare module "alt-server" {
    interface Player {
        team: Team | null;
    }
}
