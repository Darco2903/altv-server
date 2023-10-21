declare module "alt-client" {
    function on(listener: "menu:option:open", listener: (id: string) => void): void;
    // function emit(eventName: "menu:option:open", id: string): void;
}
