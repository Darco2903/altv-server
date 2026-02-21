export type InputKeys = {
    [key: string]: number;
};

export default class InputManager {
    private static all;
    public static getApp(name: string): InputManager;

    public readonly name: string;
    private defaultKeys: InputKeys;
    public readonly keys: InputKeys;

    constructor(name: string, defaultKeys: InputKeys);

    update(keyName: string, keyCode: number): void;
    reset(keyName: string): void;
}
