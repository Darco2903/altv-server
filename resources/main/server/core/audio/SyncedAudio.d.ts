import { Entity, Vector3, VirtualEntity, VirtualEntityGroup } from "alt-server";

export default class SyncedAudio {
    private static #staticId: number;
    private static #minVolume: number;
    private static #maxVolume: number;
    private static #minDistance: number;

    private static #all: Map<number, SyncedAudio>;
    public static get all(): SyncedAudio[];
    public static getByID(id: number): SyncedAudio;

    protected _id: number;
    public readonly id: number;

    private #source: string;
    public readonly source: string;
    private #volumes: number;
    public volume: number;
    private #distance: number;
    public distance: number;
    private #isPlaying: boolean;
    public readonly isPlaying: boolean;
    private #isPaused: boolean;
    public readonly isPaused: boolean;
    private #virtualEntityGroup: VirtualEntityGroup;
    private #outputs: Map<number, VirtualEntity>;
    private #startTime: number;
    private #currentTime: number;
    private #duration: number;
    public readonly duration: number;
    // private #autoPlay: boolean;
    // public readonly autoPlay: boolean;
    private #autoDestroy: boolean;
    public readonly autoDestroy: boolean;
    private #ended: boolean;
    public readonly ended: boolean;

    constructor({
        distance,
        source,
        streamingDistance,
        time,
        title,
        volume,
        autoPlay,
        autoDestroy,
    }: {
        distance?: number;
        source: string;
        streamingDistance?: number;
        time?: number;
        title: string;
        volume?: number;
        autoPlay: boolean;
        autoDestroy: boolean;
    });

    private #getOutputData(): {};

    public addOutput(name: string, pos: Vector3): void;
    public removeOutput(name: string): void;

    private #getEntityName(entity: Entity): string;

    public setOutputOnEntity(entity: Entity): void;
    public removeOutputOnEntity(entity: Entity): void;
    public play(): void;
    public pause(): void;
    public stop(): void;
    public seek(time: number): void;
    public destroy(): void;
}
