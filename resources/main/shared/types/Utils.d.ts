declare module "alt-shared" {
    import { Utils } from "alt-shared";

    namespace Utils {
        type notificationOptions = {
            imageName: ?string;
            headerMsg: ?string;
            detailsMsg: ?string;
            message: ?string;
        };

        export type TimeData = {
            hour: number;
            minute: number;
            speed: number;
            started: boolean;
        };
    }
}
