declare module "alt-shared" {
    type CheckpointData = {
        color: RGBA;
        height: number;
        nextPos?: Vector3;
        pos: Vector3;
        type: CheckpointType;
        radius: number;
    };

    declare class TrackBase {
        public name: string;
        protected checkpointDatas: CheckpointData[];
        protected abstract checkpoints: Checkpoint[];
        constructor(name: string, checkpointDatas?: CheckpointData[]);

        public static abstract load(id: number): TrackBase;
    }
}
