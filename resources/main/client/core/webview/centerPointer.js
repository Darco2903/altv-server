import * as alt from "alt-client";

alt.WebView.prototype.centerPointer = function () {
    const pos = this.size.div(2).add(this.pos);
    alt.setCursorPos(pos, false);
};
