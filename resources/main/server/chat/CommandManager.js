import * as alt from "alt-server";

/**
 * @typedef {Object} CommandOptions
 * @property {string} name
 * @property {string[]} [args]
 * @property {string} [description]
 * @property {function(alt.Player, string[])} execute
 */

class Command {
    /**
     * @param {CommandOptions} options
     * @returns {CommandManager}
     */
    constructor({ name, args, description, execute }) {
        this.name = name;
        this.execute = execute;
        this.args = args ?? [];
        this.description = description ?? "";
        this.valid = name && typeof execute === "function";
    }
}

class CommandManager {
    constructor() {}

    #Command = Command;

    /**
     * @param {CommandOptions} options
     * @returns {CommandManager}
     */
    register({ name, args, description, execute }) {
        const command = new this.#Command({ name, execute, args, description });
        if (!command.valid) {
            throw new Error("Invalid command name or execute function");
        }
        this[name] = { execute, args, description };
    }

    /**
     * @param {string} name
     * @returns {Command}
     * @throws {Error}
     */
    get(name) {
        if (!this.has(name)) {
            throw new Error(`Command ${name} not found`);
        }
        return this[name];
    }

    /**
     * @param {string} name
     * @returns {boolean}
     */
    has(name) {
        return this[name] !== undefined;
    }

    /**
     * @param {string} name
     * @returns {void}
     * @throws {Error}
     */
    delete(name) {
        if (!this.has(name)) {
            throw new Error(`Command ${name} not found`);
        }
        this[name] = undefined;
    }
}

export default CommandManager;
