declare module "alt-server" {
    namespace Vehicle {
        function spawn(model: number, pos: alt.Vector3, rot: alt.Vector3, engineOn?: boolean): Vehicle;
    }
}
