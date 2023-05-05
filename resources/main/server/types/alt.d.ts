declare module "alt-server" {
    function hasMeta(key: "time"): boolean;
    function getMeta(key: "time"): Utils.TimeData;
    function setMeta(key: "time", value: Utils.TimeData): void;

    // function hasMeta(key: "weather"): boolean;
    // function getMeta(key: "weather"): Utils.WeatherData;
    // function setMeta(key: "weather", value: Utils.WeatherData): void;

    function hasMeta(key: "serverStarted"): boolean;
    function getMeta(key: "serverStarted"): boolean;
    function setMeta(key: "serverStarted", value: boolean): void;
}
