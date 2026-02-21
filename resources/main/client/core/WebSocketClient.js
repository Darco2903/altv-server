import * as alt from "alt-client";

alt.WebSocketClient.prototype.sendJSON = function (data) {
    this.send(JSON.stringify(data));
};
