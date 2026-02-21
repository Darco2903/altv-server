declare module "alt-client" {
    interface WebSocketClient {
        sendJSON(data: any): void;
    }
}
