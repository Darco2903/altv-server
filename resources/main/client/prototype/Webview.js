import * as alt from "alt-client";

alt.WebView.prototype.centerPointer = function () {
    const cursosPos = alt.getScreenResolution().div(2);
    alt.setCursorPos(cursosPos);
};

alt.WebView.prototype.close = function () {
    if (this.isVisible) {
        this.isVisible = false;
        alt.showCursor(false);
        this.unfocus();
    }
};

alt.WebView.prototype.open = function () {
    if (!this.isVisible) {
        this.isVisible = true;
        alt.showCursor(true);
        this.focus();
    }
};

alt.WebView.prototype.toggle = function (state) {
    if (state) {
        this.open();
    } else {
        this.close();
    }
};
