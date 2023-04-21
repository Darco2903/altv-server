import * as alt from "alt-client";
import * as native from "natives";

let buffer = [];
let loaded = false;
let opened = false;

const view = new alt.WebView("http://resource/client/webviews/chat/index.html");

function addMessage(name, text) {
    if (name) {
        view.emit("addMessage", name, text);
    } else {
        view.emit("addString", text);
    }
}

view.on("chatloaded", () => {
    for (const msg of buffer) {
        addMessage(msg.name, msg.text);
    }
    loaded = true;
});

view.on("chatmessage", (text) => {
    alt.emitServer("chat:message", text);
    opened = false;
    alt.toggleGameControls(true);
    view.unfocus();
});

export function pushMessage(name, text) {
    if (!loaded) {
        buffer.push({ name, text });
    } else {
        addMessage(name, text);
    }
}

export function pushLine(text) {
    pushMessage(null, text);
}

alt.onServer("chat:message", pushMessage);

alt.on("keyup", (key) => {
    if (loaded) {
        if (!opened && key === 0x54 && alt.gameControlsEnabled()) {
            opened = true;
            view.emit("openChat", false);
            alt.toggleGameControls(false);
            view.focus();
        } else if (!opened && key === 0xbf && alt.gameControlsEnabled()) {
            opened = true;
            view.emit("openChat", true);
            alt.toggleGameControls(false);
            view.focus();
        } else if (opened && key == 0x1b) {
            opened = false;
            view.emit("closeChat");
            alt.toggleGameControls(true);
            view.unfocus();
        }
    }
});

/**
 * @param {Object} options
 * @param {string} [options.imageName]
 * @param {string} [options.headerMsg]
 * @param {string} [options.detailsMsg]
 * @param {string} [options.message]
 */
export function drawNotification({ imageName = "CHAR_DEFAULT", headerMsg = "", detailsMsg = "", message = "" }) {
    native.beginTextCommandThefeedPost("STRING");
    native.addTextComponentSubstringPlayerName(message);
    native.endTextCommandThefeedPostMessagetextTu(imageName.toUpperCase(), imageName.toUpperCase(), false, 4, headerMsg, detailsMsg, 0.5);
    native.endTextCommandThefeedPostTicker(false, false);
}

alt.Player.prototype.drawNotification = drawNotification;
alt.onServer("notification", drawNotification);
