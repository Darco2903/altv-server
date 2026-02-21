import WebSocket from "ws";

export class AutoSocket {
    static #RECONNECT_TIMEOUT = 5000;

    /** @type {WebSocket} */
    #ws;
    /** @type {string} */
    #url;
    /** @type {boolean} */
    #initialized;
    /** @type {boolean} */
    #valid;
    /** @type {Set<[string, Function, EventListenerOptions]>} */
    #eventListeners = new Set();

    static #getProtocol() {
        return window.location.protocol === "https:" ? "wss" : "ws";
    }

    constructor(url) {
        // this.#url = `${AutoSocket.#getProtocol()}://${window.location.host}${src}`;
        this.#url = url;
        this.#ws = null;
        this.#initialized = false;
        this.#valid = false;
    }

    async #initConnection() {
        return new Promise((resolve, reject) => {
            this.#initialized = false;
            this.#ws = new WebSocket(this.#url, "echo-protocol", {
                origin: "https://dev.altv.darco2903.fr",
            });
            this.#eventListeners.forEach((args) => this.#ws.addEventListener(...args));
            this.#ws.onopen = () => {
                console.log("Connected to WebSocket server");
                this.#initialized = true;
                this.#valid = true;
                resolve();
            };
            this.#ws.onclose = () => {
                if (this.#initialized) {
                    console.log("Disconnected from WebSocket server");
                }
                console.log(`Reconnecting in ${AutoSocket.#RECONNECT_TIMEOUT / 1000} seconds...`);
                setTimeout(() => {
                    console.log("Reconnecting...");
                    resolve(this.#initConnection());
                }, AutoSocket.#RECONNECT_TIMEOUT);
            };
            this.#ws.onerror = (error) => {
                if (!this.#valid) {
                    console.error("Could not connect to WebSocket server");
                    return;
                } else if (!this.#initialized) {
                    console.error("Could not reconnect to WebSocket server");
                    return;
                }
                console.error("WebSocket error:", error);
            };
        });
    }

    async connect() {
        return this.#initConnection();
    }

    close() {
        this.#ws.close();
    }

    send(data) {
        if (this.#initialized) this.#ws.send(data);
        else console.error("WebSocket not initialized");
    }

    sendJSON(data) {
        this.send(JSON.stringify(data));
    }

    addEventListener(...args) {
        const [listener, callback, options] = args;
        this.#eventListeners.add(args);
        if (!this.#initialized) return;
        if (options?.once) {
            args[1] = () => {
                console.log("Removing event listener");
                this.#eventListeners.delete(args);
                callback();
            };
        }
        this.#ws.addEventListener(...args);
    }

    removeEventListener(...args) {
        this.#eventListeners.delete(args);
        if (!this.#initialized) return;
        this.#ws.removeEventListener(...args);
    }
}
