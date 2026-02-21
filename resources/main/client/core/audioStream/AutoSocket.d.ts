export class AutoSocket {
    private static #RECONNECT_TIMEOUT: number;
    private #ws: WebSocket;
    private #url: string;
    private #initialized: boolean;
    private #valid: boolean;
    private #eventListeners: Set<[string, Function, EventListenerOptions?]>;

    private static getProtocol(): "wss" | "ws";

    constructor(path: string): AutoSocket;

    private #initConnection(): void;

    public connect(): Promise<void>;
    public close(): void;
    public send(data: string): void;
    public sendJSON(data: any): void;

    public addEventListener: WebSocket["addEventListener"];
    public removeEventListener: WebSocket["removeEventListener"];
}
