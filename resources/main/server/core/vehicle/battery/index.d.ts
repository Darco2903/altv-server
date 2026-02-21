import BatteryPrototype from "./BatteryPrototype";

declare module "alt-server" {
    export interface Vehicle extends BatteryPrototype {}
}
