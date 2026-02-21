declare module "alt-client" {
    import { Vehicle } from "alt-client";

    interface Vehicle {
        getRealSpeed(): number;
    }
}
