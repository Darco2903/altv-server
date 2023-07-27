declare module "alt-client" {
    import { Vector3, Vehicle } from "alt-client";

    function emitServer(
        eventName: "vehicle:spawn",
        model: number,
        pos: Vector3,
        rot: Vector3,
        options: {
            engineOn: boolean;
            passengers: Player[];
        }
    ): void;

    function emitServer(eventName: "vehicle:replace", oldVehicle: Vehicle, newVehicle: Vehicle): void;
    function onServer(eventName: "vehicle:replace", listener: (oldVehicle: Vehicle, newVehicle: Vehicle) => void): void;

    interface Vehicle {
        replace(vehicle: Vehicle): void;
    }
}
