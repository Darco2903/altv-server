declare module "alt-client" {
    function on(eventName: "input-manager:keyUpdate", listener: (app: string, name: string, key: number) => void): void;
    // function emit(eventName: "input-manager:keyUpdate", key: number, state: boolean): void;
    function on(eventName: "input-manager:keyReset", listener: (app: string, name: string) => void): void;
    // function emit(eventName: "input-manager:keyReset", key: number): void;
    // function on(eventName: "input-manager:keyInit", listener: (name: string, key: number) => void): void;
    function emit(eventName: "input-manager:keyInit", app: string, name: string, key: number): void;
}
