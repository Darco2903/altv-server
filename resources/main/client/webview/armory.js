import * as alt from "alt-client";

let view = new alt.WebView("http://resource/client/webview/armory/index.html", false);
view.isVisible = false;

view.on("giveAll", () => alt.emitServer("player:giveAllWeapons"));
view.on("removeAll", () => alt.emitServer("player:removeWeapons"));
view.on("giveWeapon", (hash, amount, equipNow) => {
    alt.emitServer("player:giveWeapon", hash, amount, equipNow);
});

view.toggle = function (state) {
    if (state && !view.isVisible) {
        view.centerPointer();
        view.open();
        alt.Utils.toggleOnlyMove(true);
    } else if (!state && view.isVisible) {
        view.close();
        alt.Utils.toggleOnlyMove(false);
    }
};

export default view;
