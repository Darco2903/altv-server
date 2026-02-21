import { Entity, Vector3, VirtualEntity } from "alt-client";

type BiquadOptions = [
    type: "lowpass" | "highpass" | "bandpass" | "lowshelf" | "highshelf" | "peaking" | "notch" | "allpass",
    frequency: number,
    Q: number,
    gain: number
];

type GainOptions = [gain: number];

export default class Audio {
    static get all(): Audio[];
    static getByID(id: number): Audio | undefined;
    readonly id: number;
    readonly source: string;
    readonly duration: number;
    readonly currentTime: number;
    volume: number;
    distance: number;
    readonly isPlaying: boolean;
    readonly isPaused: boolean;
    readonly is3dEnabled: boolean;
    readonly outputsCount: number;

    async setSource(source: string): Promise<void>;
    setOutput(virtualEntity: VirtualEntity): void;
    removeOutput(virtualEntity: VirtualEntity): void;
    updateOuputPos(name: string, pos: Vector3): void;
    setOutputOnEntity(entity: Entity): void;
    removeOutputOnEntity(entity: Entity): void;
    play(): void;
    pause(): void;
    stop(): void;
    seek(time: never): void;
    setFilter(filter: "biquad", ...options: BiquadOptions): void;
    setFilter(filter: "gain", ...options: GainOptions): void;
    setFilters(Array: [filter: "biquad" | "gain", ...options: BiquadOptions | GainOptions]): void;
    removeAllFilters(): void;
    enable3d(enable: boolean): void;
    destroy(): void;
}
