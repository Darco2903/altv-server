import { Clock, ClockData, ClockTime } from "./Clock";

declare module "alt-server" {
    function getMeta(key: "time"): ClockData;
    function hasMeta(key: "time"): boolean;
    function setMeta(key: "time", ClockData: ClockData);

    function emitClient(player: Player, eventName: "time:run", args: boolean);
    function emitClient(player: Player, eventName: "time:setTime", args: ClockTime);
    function emitClient(player: Player, eventName: "time:setSpeed", args: number);

    function onClient(eventName: "time:synchronize", listener: (player: Player) => void);

    namespace Utils {
        const Clock: Clock;
    }
}
