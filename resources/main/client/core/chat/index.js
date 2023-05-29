import * as alt from "alt-client";

let buffer = [];
let loaded = false;
let open = false;
let enabled = true;

const view = new alt.WebView("http://resource/client/core/chat/html/index.html", true);

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

view.on("chat:message", (text) => {
    alt.emitServer("chat:message", text);
    open = false;
    alt.toggleGameControls(true);
    view.unfocus();
});

function pushMessage(name, text) {
    if (!loaded) {
        buffer.push({ name, text });
    } else {
        addMessage(name, text);
    }
}

function pushLine(text) {
    pushMessage(null, text);
}

function closeChat() {
    open = false;
    view.emit("closeChat");
    alt.toggleGameControls(true);
    view.unfocus();
}

alt.onServer("chat:message", pushMessage);

alt.on("keyup", (key) => {
    if (loaded && enabled) {
        if (!open && key === 0x54 && alt.gameControlsEnabled()) {
            open = true;
            view.emit("openChat", false);
            alt.toggleGameControls(false);
            view.focus();
        } else if (!open && key === 0xbf && alt.gameControlsEnabled()) {
            open = true;
            view.emit("openChat", true);
            alt.toggleGameControls(false);
            view.focus();
        } else if (open && key === 0x1b) {
            closeChat();
        }
    }
});

alt.on("resourceStart", () => {
    const localBuffer = alt.LocalStorage.get("chatBuffer");
    if (localBuffer) {
        view.emit("restoreBuffer", localBuffer);
    }
});

view.on("chatBuffer", (updatedBuffer) => {
    alt.LocalStorage.set("chatBuffer", updatedBuffer);
    alt.LocalStorage.save();
});

alt.onServer("chat:commandsInit", (cmds) => {
    cmds = cmds.filter((cmd) => alt.Player.local.hasPermission(cmd.permissionLevel));
    view.emit("commandsInit", cmds);
});

view.on("getAllPlayers", () => {
    view.emit(
        "getAllPlayers",
        alt.Player.all.map((p) => p.name)
    );
});
