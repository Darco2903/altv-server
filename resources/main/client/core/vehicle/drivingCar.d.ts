declare module "alt-client" {
    function emit(eventName: "drivingCar", state: boolean): void;
    function on(eventName: "drivingCar", listener: (state: boolean) => void): void;
}
