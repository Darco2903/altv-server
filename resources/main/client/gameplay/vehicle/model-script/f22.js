import * as alt from "alt-client";
import AudioBase from "../../../core/audio/base/AudioBase.js";

const player = alt.Player.local;
const f22 = alt.hash("f22a");
const mach1 = 200;

let sonicBang = false;
let speedCheckTick;

alt.on("enteredVehicle", (vehicle, seat) => {
    if (vehicle.model !== f22 || seat !== 1) return;
    toggle(true);
});

alt.on("leftVehicle", (vehicle, seat) => {
    if (vehicle.model !== f22 || seat !== 1) return;
    toggle(false);
});

alt.on("resourceStart", () => {
    if (player.vehicle?.model === f22 && player.seat === 1) {
        toggle(true);
    }
});

function toggle(state) {
    if (state && !speedCheckTick) {
        // console.log("f22 toggle on");
        speedCheckTick = alt.everyTick(() => {
            if (player.vehicle.getRealSpeed() > mach1 && !sonicBang) {
                console.log("sonic bang");
                sonicBang = true;
                alt.emitServer("f22:sonicBang", player.vehicle);
            } else if (player.vehicle.getRealSpeed() < mach1 - 30 && sonicBang) {
                console.log("sonic bang reset");
                sonicBang = false;
            }
        });
    } else if (!state && speedCheckTick) {
        // console.log("f22 toggle off");
        alt.clearEveryTick(speedCheckTick);
        speedCheckTick = null;
    }
}

// alt.onServer("f22:bang", async (source, pos) => {
//     console.log("f22:bang");
//     const bang = new AudioBase({
//         distance: 5000,
//     });
//     const group = new alt.VirtualEntityGroup(1);
//     const bangEntity = new alt.VirtualEntity(group, pos, 10000);
//     bang.setOutput(bangEntity);
//     await bang.setSource(source);
//     bang.play();
// });
