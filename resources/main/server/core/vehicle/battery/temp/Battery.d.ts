import * as alt from "alt-server";

export default abstract class Battery {
    public static readonly all: Set<Battery>;

    public readonly capacity: number;
    public readonly charge: number;
    // public readonly health: number;
    public readonly isCharging: boolean;
    public readonly isFull: boolean;
    // public readonly isDead: boolean;
    public readonly chargePercentage: number;

    constructor(entity: alt.Entity, capacity: number, charge: number);

    public swapEntity(entity: alt.Entity): void;
    public destroy(): void;
}
