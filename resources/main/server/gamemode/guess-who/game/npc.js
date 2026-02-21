import * as alt from "alt-server";

export default class NPC {
    static #GOTO_MAX_DISTANCE = 5;
    static #GOTO_TIMEOUT = 10000;
    static #HEADING_TIMEOUT = 5000;
    static #FACE_ENTITY_TIMEOUT = 7000;
    static #JUMP_TIMEOUT = 4000;
    static #WAVE_TIMEOUT = 5000;
    static #PHONE_TIMEOUT = 7000;

    /** @type {Set<NPC>} */
    static #all = new Set();
    static get all() {
        return Array.from(NPC.#all);
    }

    /** @type {alt.Ped} */
    #ped;
    get ped() {
        return this.#ped;
    }

    /** @type {boolean} */
    #isReady = false;

    constructor(model, pos, rot = alt.Vector3.zero) {
        this.#ped = new alt.Ped(model, pos, rot);
        this.#ped.setStreamSyncedMeta("guesswho:npc", "");
        alt.Utils.waitFor(() => this.#ped.netOwner, 2000)
            .then(() => {
                this.#isReady = true;
                NPC.#all.add(this);
                // console.log("Ped is ready", this.#ped.netOwner.name);
            })
            .catch(() => {
                this.destroy();
                console.log("Ped is not ready", this.#ped.netOwner.name ?? "no owner");
            });
    }

    async ready() {
        await alt.Utils.waitFor(() => this.#isReady, 10000);
    }

    async destroy() {
        // npc.#destroyRequested = true;
        // await alt.Utils.waitFor(() => !this.#isBusy, 10000);
        this.#ped.destroy();
        NPC.#all.delete(this);
    }

    #randomAction() {
        const actions = [
            "goto",
            "goto",
            "goto",
            "goto",
            "goto",
            "goto",
            "goto",
            "goto",
            "goto",
            "goto",
            "goto",
            "goto",
            "goto",
            "goto",
            "goto",
            "heading",
            "heading",
            "heading",
            "heading",
            "heading",
            "heading",
            // "faceEntity",
            // "faceEntity",
            // "jump",
            "wave",
            "wave",
            "phone",
            "phone",
        ].sort(() => Math.random() - 0.5);

        switch (actions[0]) {
            case "goto":
                const randomDistance = Math.floor(Math.random() * 10) + 1;
                const randomSpeed = Math.floor(Math.random() * 5) > 3 ? 2 : 1;
                const backwards = Math.random() < 0.8;
                return this.goto(randomDistance, randomSpeed, backwards);
            case "heading":
                const randomHeading = Math.floor(Math.random() * 360);
                return this.heading(randomHeading);
            // case "faceEntity":
            // const randomPlayer = alt.Player.all[Math.floor(Math.random() * alt.Player.all.length)];
            // return this.faceEntity(randomPlayer);
            // case "jump":
            //     return this.jump();
            case "wave":
                return this.wave();
            case "phone":
                return this.phone();
        }
    }

    static startRandomAction() {
        this.#all.forEach(async (npc) => {
            // while (npc.#ped.valid && !npc.#destroyRequested) {
            while (npc.#ped.valid) {
                // npc.#isBusy = true;
                await npc.#randomAction();
                // npc.#isBusy = false;
                // await alt.Utils.wait(100);
            }
        });
    }

    static clear() {
        NPC.#all.forEach((npc) => npc.destroy());
    }

    async waitForOwner() {
        while (!this.#ped.netOwner) {
            await alt.Utils.wait(1000);
        }
    }

    goto(distance, speed = 1, backwards = false) {
        return new Promise(async (resolve, reject) => {
            if (Math.abs(distance) > NPC.#GOTO_MAX_DISTANCE || (speed !== 1 && speed !== 2)) {
                // reject(`Distance must be between 0 and ${NPC.#GOTO_MAX_DISTANCE}`);
                resolve();
                return;
            }
            await this.waitForOwner();
            const owner = this.#ped.netOwner;
            owner.emit("guesswho:npc:goto", this.#ped, distance, speed, backwards);

            let timeout;
            const r = (player, ped) => {
                if (player !== owner || ped !== this.#ped) return;
                resolve();
                alt.offClient("guesswho:npc:goto:done", r);
                alt.clearTimeout(timeout);
                // console.log("goto done");
            };
            timeout = alt.setTimeout(() => {
                alt.offClient("guesswho:npc:goto:done", r);
                // reject("goto timeout");
                resolve();
            }, NPC.#GOTO_TIMEOUT);
            alt.onClient("guesswho:npc:goto:done", r);
        });
    }

    heading(heading) {
        return new Promise(async (resolve, reject) => {
            await this.waitForOwner();
            const owner = this.#ped.netOwner;
            owner.emit("guesswho:npc:heading", this.#ped, heading);

            let timeout;
            const r = (player, ped) => {
                if (player !== owner || ped !== this.#ped) return;
                resolve();
                alt.offClient("guesswho:npc:heading:done", r);
                alt.clearTimeout(timeout);
                // console.log("heading done");
            };
            timeout = alt.setTimeout(() => {
                alt.offClient("guesswho:npc:heading:done", r);
                // reject("heading timeout");
                resolve();
            }, NPC.#HEADING_TIMEOUT);
            alt.onClient("guesswho:npc:heading:done", r);
        });
    }

    faceEntity(entity) {
        return new Promise(async (resolve, reject) => {
            if (!entity || !entity.valid) {
                // reject("Invalid entity");
                resolve();
                return;
            }
            await this.waitForOwner();
            const owner = this.#ped.netOwner;
            owner.emit("guesswho:npc:faceEntity", this.#ped, entity);

            let timeout;
            const r = (player, ped) => {
                if (player !== owner || ped !== this.#ped) return;
                resolve();
                alt.offClient("guesswho:npc:faceEntity:done", r);
                alt.clearTimeout(timeout);
                // console.log("faceEntity done");
            };
            timeout = alt.setTimeout(() => {
                alt.offClient("guesswho:npc:faceEntity:done", r);
                // reject("faceEntity timeout");
                resolve();
            }, NPC.#FACE_ENTITY_TIMEOUT);
            alt.onClient("guesswho:npc:faceEntity:done", r);
        });
    }

    jump() {
        return new Promise(async (resolve, reject) => {
            await this.waitForOwner();
            const owner = this.#ped.netOwner;
            owner.emit("guesswho:npc:jump", this.#ped);

            let timeout;
            const r = (player, ped) => {
                if (player !== owner || ped !== this.#ped) return;
                resolve();
                alt.offClient("guesswho:npc:jump:done", r);
                alt.clearTimeout(timeout);
                // console.log("jump done");
            };
            timeout = alt.setTimeout(() => {
                alt.offClient("guesswho:npc:jump:done", r);
                // reject("jump timeout");
                resolve();
            }, NPC.#JUMP_TIMEOUT);
            alt.onClient("guesswho:npc:jump:done", r);
        });
    }

    wave() {
        return new Promise(async (resolve, reject) => {
            await this.waitForOwner();
            const owner = this.#ped.netOwner;
            owner.emit("guesswho:npc:wave", this.#ped);

            let timeout;
            const r = (player, ped) => {
                if (player !== owner || ped !== this.#ped) return;
                resolve();
                alt.offClient("guesswho:npc:wave:done", r);
                alt.clearTimeout(timeout);
                // console.log("wave done");
            };
            timeout = alt.setTimeout(() => {
                alt.offClient("guesswho:npc:wave:done", r);
                // reject("wave timeout");
                resolve();
            }, NPC.#WAVE_TIMEOUT);
            alt.onClient("guesswho:npc:wave:done", r);
        });
    }

    phone() {
        return new Promise(async (resolve, reject) => {
            await this.waitForOwner();
            const owner = this.#ped.netOwner;
            owner.emit("guesswho:npc:phone", this.#ped);

            let timeout;
            const r = (player, ped) => {
                if (player !== owner || ped !== this.#ped) return;
                resolve();
                alt.offClient("guesswho:npc:phone:done", r);
                alt.clearTimeout(timeout);
                // console.log("phone done");
            };
            timeout = alt.setTimeout(() => {
                alt.offClient("guesswho:npc:phone:done", r);
                // reject("phone timeout");
                resolve();
            }, NPC.#PHONE_TIMEOUT);
            alt.onClient("guesswho:npc:phone:done", r);
        });
    }
}
