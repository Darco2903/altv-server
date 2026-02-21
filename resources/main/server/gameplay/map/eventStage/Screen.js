import * as alt from "alt-server";

const STREAMING_DISTANCE = 1000;
const ALTV_WEB_SERVER = "http://127.0.0.1:7789";

export class Screen {
    #videoId;
    // #url;
    #startTime;
    #screen;
    constructor(videoId) {
        this.#videoId = videoId;
        this.#screen = this.#createScreen();
    }

    #createScreen() {
        let group;
        if (!alt.hasMeta("eventStageGroup")) {
            group = new alt.VirtualEntityGroup(1);
            alt.setMeta("eventStageGroup", group);
        } else group = alt.getMeta("eventStageGroup");

        return new alt.VirtualEntity(group, new alt.Vector3(311, -1620, 35), STREAMING_DISTANCE, {
            type: "webview",
            name: "eventStage:screen",
        });
    }

    async #getVideoUrl() {
        const res = await fetch(ALTV_WEB_SERVER + "/music-app/resources/scripts/getVideoLink.js", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ videoId: this.#videoId }),
        });
        if (!res.ok) {
            console.error("Failed to get video link");
            return "";
        }
        const data = await res.json();
        return data.url;
    }

    play() {
        // if (!this.#startTime) this.#startTime = alt.getNetTime();
        if (!this.#startTime) this.#startTime = Date.now();
        this.#getVideoUrl().then((url) => {
            this.#screen.setStreamSyncedMeta("sourceUrl", url);
            this.#screen.setStreamSyncedMeta("startTime", this.#startTime);
        });
    }

    seek(time) {
        this.#startTime = alt.getNetTime() - time * 1000;
        this.#screen.setStreamSyncedMeta("startTime", this.#startTime);
    }

    destroy() {
        this.#screen.destroy();
    }
}
