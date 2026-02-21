import Battery from "./Battery";

declare module "alt-client" {
    export interface Vehicle extends Battery {}
}
