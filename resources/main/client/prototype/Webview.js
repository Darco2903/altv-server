import * as alt from "alt-client";

alt.WebView.prototype.toggle = function (state) {
    this.isVisible = state;
    alt.showCursor(state);
    if (state) {
        this.focus();
    } else {
        this.unfocus();
    }
};

alt.WebView.prototype.centerPointer = function () {
    const cursosPos = alt.getScreenResolution().div(2);
    alt.setCursorPos(cursosPos);
};
