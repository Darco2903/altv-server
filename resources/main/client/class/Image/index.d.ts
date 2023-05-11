import { Image as Img } from "./Image";

declare module "alt-client" {
    namespace Utils {
        declare class Image extends Img {}
    }
}
