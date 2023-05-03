// declare module "TrackEditor" {
import { Checkpoint, CheckpointType, Vector3 } from "alt-server";
import { CheckpointData, TrackBase } from "alt-shared";

// type CheckpointData = CheckpointData;

export default class TrackEditor extends TrackBase {
    private checkpoints: Checkpoint[];
    private visible: boolean;
    constructor(name: string, checkpointPos?: Vector3[]);

    public static async load(id: number): TrackBase;

    private createCheckpoint(data: CheckpointData): Checkpoint;
    public getCheckpoint(index: number): Checkpoint;
    public insertCheckpoint(index: number, data: CheckpointData);
    public addCheckpoint(data: CheckpointData);
    public removeCheckpoint(index: number);
    public moveCheckpoint(index: number, pos: Vector3);
    private updateNextPos(index: number, pos: Vector3);
    public resizeCheckpoint(index: number, radius: number);
    public changeCheckpointColor(index: number, color: RGBA);
    public changeCheckpointType(index: number, type: CheckpointType);
    public changeCheckpointHeight(index: number, height: number);
    public setDimension(dimension: number);
    public setVisibility(visible: boolean);
    public isVisible(): boolean;
    public getNbCheckpoints(): number;
}
// }
