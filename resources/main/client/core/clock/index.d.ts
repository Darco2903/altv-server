declare module "alt-client" {
    function onServer(eventName: "time:run", args: boolean);
    function onServer(eventName: "time:setTime", args: ClockTime);
    function onServer(eventName: "time:setSpeed", args: number);

    function emitServer(eventName: "time:synchronize");
}
