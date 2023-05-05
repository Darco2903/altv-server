declare module "alt-shared" {
    namespace Utils {
        type notificationOptions = {
            imageName: ?string;
            headerMsg: ?string;
            detailsMsg: ?string;
            message: ?string;
            duration: ?number;
        };

        type TimeData = {
            hour: number;
            minute: number;
            speed: number;
            started: boolean;
        };
    }
}
