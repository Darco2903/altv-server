import { Entity, Vector3, VirtualEntity, WebView } from "alt-client";

type BiquadOptions = [
    type: "lowpass" | "highpass" | "bandpass" | "lowshelf" | "highshelf" | "peaking" | "notch" | "allpass",
    frequency: number,
    Q: number,
    gain: number
];

type GainOptions = [gain: number];

export default class AudioBase {
    private static #SOURCE_TIMEOUT: number;
    private static #VIEW_URL: string;
    private static #view: WebView;
    private static #staticId: number;
    private static #all: Map<number, AudioBase>;
    public static get all(): AudioBase[];
    public static getByID(id: number): AudioBase;
    public readonly id: number;
    public readonly source: string;
    public readonly duration: number;
    public readonly currentTime: number;
    public volume: number;
    public distance: number;
    public readonly isPlaying: boolean;
    public readonly isPaused: boolean;
    public readonly is3dEnabled: boolean;
    private #outputs: Map<number, Entity | VirtualEntity>;
    public readonly outputsPosCount: number;
    private #entityOutputUpdateTick: number;

    private static #degToRad(deg: number): number;
    private static #rotationToDirection(deg: number): Vector3;
    public static async init(): void;

    constructor({ distance: number, support2dAudio: boolean, volume: number }): AudioBase;

    public async setSource(source: string): Promise<void>;
    public setOutput(virtualEntity: VirtualEntity): void;
    public removeOutput(virtualEntity: VirtualEntity): void;
    public updateOuputPos(name: string, pos: Vector3): void;
    private #startEntityOutputUpdate(): void;
    private #stopEntityOutputUpdate(): void;
    public setOutputOnEntity(entity: Entity): void;
    public removeOutputOnEntity(entity: Entity): void;
    public play(): void;
    public pause(): void;
    public stop(): void;
    protected _seek(time: number): void;
    public setFilter(filter: "biquad", ...options: BiquadOptions): void;
    public setFilter(filter: "gain", ...options: GainOptions): void;
    public setFilters(Array: [filter: "biquad" | "gain", ...options: BiquadOptions | GainOptions]): void;
    public removeAllFilters(): void;
    protected _enable3d(enable: boolean): void;
    public destroy(): void;
}
