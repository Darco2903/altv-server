import * as alt from "alt-client";
import * as native from "natives";
import TrackEditor from "../class/TrackEditor.js";

const player = alt.Player.local;
/** @type {TrackEditor} */
let track;
let hudTick;

const view = new alt.WebView("http://resource/client/webview/trackEditor/index.html");
view.isVisible = false;

view.on("event", (id, state) => {
    console.log("event:", id, state);
    switch (id) {
        case "newTrack":
            if (track) return;
            track = new TrackEditor();
            view.emit("editor", true);
            editorHud(true);
            // player.toggleNoclip(true);
            break;

        case "checkpointVisibility":
            track.setVisibility(state);
            break;

        case "setPoint":
            const data = {
                color: new alt.RGBA(255, 255, 255),
                pos: player.pos.sub(0, 0, 1).toFixed(1),
                radius: 2,
                type: 1,
                height: 1,
            };
            const id = track.addCheckpoint(data);
            data.color = data.color.toHex();
            view.emit("addCheckpoint", id, data);
            break;
    }
});

/**
 * @param {boolean} state
 */
function editorHud(state) {
    if (state && !hudTick) {
        hudTick = alt.everyTick(() => {
            const scale = native.requestScaleformMovie("INSTRUCTIONAL_BUTTONS");

            native.beginScaleformMovieMethod(scale, "CLEAR_ALL");
            native.endScaleformMovieMethod();

            native.beginScaleformMovieMethod(scale, "SET_DATA_SLOT");
            native.scaleformMovieMethodAddParamInt(0);
            native.scaleformMovieMethodAddParamTextureNameString("[F1] Toggle Noclip");
            native.endScaleformMovieMethod();

            native.beginScaleformMovieMethod(scale, "SET_DATA_SLOT");
            native.scaleformMovieMethodAddParamInt(1);
            native.scaleformMovieMethodAddParamTextureNameString("~INPUT_AIM~");
            native.scaleformMovieMethodAddParamTextureNameString("Unlock Camera");
            native.endScaleformMovieMethod();

            native.beginScaleformMovieMethod(scale, "DRAW_INSTRUCTIONAL_BUTTONS");
            native.scaleformMovieMethodAddParamInt(0);
            native.endScaleformMovieMethod();
            native.drawScaleformMovieFullscreen(scale, 255, 255, 255, 255, 0);
        });
    } else if (!state && hudTick) {
        alt.clearEveryTick(hudTick);
        hudTick = null;
    }
}

view.on("changePos", (id, pos) => {
    pos = pos.map((v) => parseFloat(v));
    track.moveCheckpoint(id, new alt.Vector3(pos));
});

view.on("changeRadius", (id, radius) => {
    track.changeCheckpointRadius(id, radius);
});

view.on("changeHeight", (id, height) => {
    track.changeCheckpointHeight(id, height);
});

view.on("changeColor", (id, color) => {
    track.changeCheckpointColor(id, alt.RGBA.fromHex(color));
});

// let camBlock = false;
// alt.on("keyup", (key) => {
//     if (key === 2) {
//         camBlock = !camBlock;
//         if (camBlock) {
//             view.focus();
//         } else {
//             view.unfocus();
//         }
//         alt.showCursor(camBlock);
//         alt.Utils.toggleOnlyMove(camBlock);
//     }
// });
alt.Permission.
view.toggle = (state) => {
    if (state && !view.isVisible) {
        // alt.Utils.toggleOnlyMove(true);
        view.isVisible = true;
        // view.open();
        if (track) {
            editorHud(true);
        }
    } else if (!state && view.isVisible) {
        view.isVisible = false;
        // view.close();
        alt.Utils.toggleOnlyMove(false);
        editorHud(false);
    }
};

export default view;
