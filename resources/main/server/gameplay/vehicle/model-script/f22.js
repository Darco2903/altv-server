import * as alt from "alt-server";
import SyncedAudio from "../../../core/audio/SyncedAudio.js";

const MAX_DISTANCE = 9999;

function randomBoomLink() {
    const random = Math.floor(Math.random() * 3) + 1;
    return `http://assets/data-pack/content/vehicle/sonic-boom/boom_${random}.wav`;
}

alt.onClient("f22:sonicBang", async (player) => {
    console.log("sonic bang");
    const pos = player.vehicle.pos;
    const bang = new SyncedAudio({
        source: randomBoomLink(),
        volume: 1,
        streamingDistance: MAX_DISTANCE,
        distance: 9999,
        autoPlay: true,
        autoDestroy: true,
    });
    // bang.setOutputOnEntity(f22);
    bang.addOutput("bang", pos);
});

alt.on("resourceStart", () => {
    // setInterval(() => {
    //     // const pos = alt.Player.all[0]?.vehicle?.pos;
    //     // const pos = alt.Player.all[0]?.pos;
    //     const pos = new alt.Vector3(1114, 571, 98);
    //     console.log(pos);
    //     if (!pos) return;
    //     console.log("sonic bang");
    //     const bang = new SyncedAudio({
    //         source: randomBoomLink(),
    //         volume: 1,
    //         streamingDistance: MAX_DISTANCE,
    //         distance: 9999,
    //         autoPlay: true,
    //         autoDestroy: true,
    //     });
    //     bang.addOutput("bang", pos);
    //     console.log("bang", pos);
    //     //         const bang = new SyncedAudio({
    //     //             source: randomBoomLink(),
    //     //             volume: 1,
    //     //             streamingDistance: MAX_DISTANCE,
    //     //             distance: 9999,
    //     //             autoPlay: true,
    //     //             autoDestroy: true,
    //     //         });
    //     //         bang.addOutput("test", new alt.Vector3(684.11, 1823.48, 1147.69));
    //     //         // setTimeout(() => {
    //     //         //     bang.play();
    //     //         //     setTimeout(() => {
    //     //         //         bang.destroy();
    //     //         //     }, 1000);
    //     //         // }, 1000);
    //     //         // alt.Utils.waitFor(() => bang.ended, 15000)
    //     //         //     .then(() => {
    //     //         //         console.log("ended");
    //     //         //         console.log("destroyed", !SyncedAudio.all.includes(bang));
    //     //         //     })
    //     //         //     .catch(() => {
    //     //         //         console.log("not ended");
    //     //         //     });
    // }, 5000);
    //     // setTimeout(() => {
    //     //     alt.emitAllClients("f22:bang", randomBoomLink(), new alt.Vector3(684.11, 1823.48, 1147.69));
    //     // }, 5000);
});

// alt.setInterval(async () => {
//     console.log("sonic bang");
//     const bang = new SyncedAudio({
//         source: randomBoomLink(),
//         volume: 1,
//         streamingDistance: MAX_DISTANCE,
//         distance: 1000,
//     });
//     // bang.setOutputOnEntity(f22);
//     bang.addOutput("bang", alt.Player.all[0].pos);
//     await alt.Utils.wait(2000);
//     bang.play();
//     await alt.Utils.wait(2000);
//     bang.destroy();
// }, 5000);
