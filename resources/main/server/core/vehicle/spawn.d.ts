declare module "alt-server" {
    import { Player, Vector3, Vehicle } from "alt-server";

    function onClient(
        eventName: "vehicle:spawn",
        listener: (
            player: Player,
            model: number,
            pos: Vector3,
            rot: Vector3,
            options: {
                engineOn: boolean;
                passengers: Player[];
            }
        ) => void
    ): void;
    
    function onClient(eventName: "vehicle:replace", listener: (player: Player, vehicle: Vehicle, model: number) => void): void;
    function emitClient(player: Player, eventName: "vehicle:replace", oldVehicle: Vehicle, newVehicle: Vehicle): void;

    namespace Vehicle {
        function spawn(model: number, pos: Vector3, rot: Vector3, engineOn?: boolean): Vehicle;
        function replace(model: number): void;
    }
}
