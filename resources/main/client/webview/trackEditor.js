import * as alt from "alt-client";
import TrackEditor from "../class/TrackEditor.js";

const player = alt.Player.local;
/** @type {TrackEditor} */
let track;

const view = new alt.WebView("http://resource/client/webview/trackEditor/index.html");
view.isVisible = false;

view.on("event", (id, state) => {
    console.log("event:", id, state);
    switch (id) {
        case "newTrack":
            track = new TrackEditor();
            view.emit("editor", true);
            break;

        case "checkpointVisibility":
            track.setVisibility(state);
            break;

        case "setPoint":
            track.addCheckpoint({ color: new alt.RGBA(255, 0, 0, 255), pos: player.pos.sub(0, 0, 1), radius: 5, type: 1, height: 2 });
            // console.log(track.getNbCheckpoints());
            // if (track.getNbCheckpoints() < 2) {
            //     track.addCheckpoint({ color: new alt.RGBA(255, 0, 0, 255), pos: player.pos.sub(0, 0, 1), radius: 5, type: 1, height: 2 });
            // } else {
            //     track.moveCheckpoint(1, player.pos.sub(0, 0, 1));
            //     console.log(track.getCheckpoint(0).nextPos);
            // }
            break;
    }
});

view.toggle = (state) => {
    if (state && !view.isVisible) {
        alt.Utils.toggleOnlyMove(true);
        view.open();
    } else if (!state && view.isVisible) {
        view.close();
        alt.Utils.toggleOnlyMove(false);
    }
};

export default view;
