import * as alt from "alt-client";

export default class InputManager {
    /** @type {Map<string, InputManager>} */
    static #all = new Map();

    static getApp(appName) {
        return InputManager.#all.get(appName);
    }

    /** @type {string} */
    #name;
    get name() {
        return this.#name;
    }

    /** @type {import("./InputManager").InputKeys} */
    #defaultKeys;

    /** @type {import("./InputManager").InputKeys} */
    #keys;
    get keys() {
        return Object.assign({}, this.#keys);
    }

    constructor(name, defaultKeys) {
        this.#name = name;
        this.#defaultKeys = defaultKeys;
        this.#keys = Object.assign({}, defaultKeys);
        InputManager.#all.set(name, this);
        this.#init();
    }

    #getKeyName(name) {
        return `${this.#name}:key:${name}`;
    }

    #init() {
        Object.keys(this.#defaultKeys).forEach((name) => {
            this.#keys[name] = alt.LocalStorage.get(`${this.#getKeyName(name)}`) ?? this.#defaultKeys[name];
            this.update(name, this.#keys[name]);
        });
        alt.emit("input-manager:init", this.name);
    }

    #save() {
        alt.LocalStorage.save();
    }

    update(keyName, keyCode) {
        this.#keys[keyName] = keyCode;
        alt.LocalStorage.set(this.#getKeyName(keyName), keyCode);
        this.#save();
    }

    reset(keyName) {
        this.update(keyName, this.#defaultKeys[keyName]);
        alt.LocalStorage.delete(this.#getKeyName(keyName));
        this.#save();
    }
}
