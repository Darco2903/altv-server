/**
 * @param {import("alt-server").Vehicle} vehicle
 */
export default function wheelsCountFix(vehicle) {
    if (!vehicle.hasStreamSyncedMeta("wheelCount")) vehicle.setStreamSyncedMeta("wheelCount", vehicle.wheelsCount);
    Object.defineProperty(vehicle, "wheelsCount", {
        get() {
            return this.getStreamSyncedMeta("wheelCount");
        },
    });
}
