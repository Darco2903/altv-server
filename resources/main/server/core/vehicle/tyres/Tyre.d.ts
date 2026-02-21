import * as alt from "alt-server";

export type TyreData = {
    wear: number;
    wearRate: number;
    scale: number;
    pressure: number;
    temperature: number;
};

export default class Tyre extends alt.Object {
    public readonly wear;
    public readonly wearRate;
    public readonly scale;
    public readonly pressure;
    public readonly temperature;

    constructor(
        model: number | string,
        pos: alt.Vector3,
        rot: alt.Vector3,
        wear: number,
        wearRate: number,
        scale: number,
        pressure: number,
        temperature: number
    );

    static createOnProp(
        model: number | string,
        pos: alt.Vector3,
        rot: alt.Vector3,
        wear: number,
        wearRate: number,
        scale: number,
        pressure: number,
        temperature: number
    ): Tyre;
}
