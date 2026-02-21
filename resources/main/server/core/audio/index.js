import * as alt from "alt-server";
import SyncedAudio from "./SyncedAudio.js";
import CarRadio from "./CarRadio.js";
// import "./audioStream.js";

alt.on("resourceStop", () => {
    // alt.log("resourceStop");
    // console.log(CarRadio.all);
    CarRadio.all.forEach((radio) => radio.destroy);
    SyncedAudio.all.forEach((audio) => audio.destroy());
});

alt.on("resourceStart", () => {
    // console.log("Ped", alt.Ped.all.length);
    // alt.Ped.all.forEach((ped) => {
    //     ped.destroy();
    // });
    // alt.Vehicle.all.forEach((veh) => {
    //     veh.destroy();
    // });
    // console.log("VirtualEntity", alt.VirtualEntity.all.length);
    // alt.VirtualEntity.all.forEach((entity) => {
    //     entity.destroy();
    // });
    // init();
    // const veh = alt.Vehicle.all[0] ?? new alt.Vehicle("adder", new alt.Vector3(180, -1030, 29), alt.Vector3.zero, 20);
    // console.log(veh.getStreamSyncedMetaKeys());
    // setTimeout(() => {
    //     // const audio = new SyncedAudio({ source: "https://darco2903.fr/altv/mina-mintip.mp3", volume: 0.5 });
    //     // const audio = new SyncedAudio({ source: "https://darco2903.fr/altv/test.mp3", volume: 0.8 });
    //     // const audio = new SyncedAudio({ source: "http://assets/data-pack/content/sounds/soundboards/", volume: 1 });
    //     audio.setOutputOnEntity(alt.Player.all.find((p) => p.name === "Isaction"));
    //     audio.play();
    // }, 2000);
});

alt.on("removeEntity", (entity) => {
    if (entity instanceof alt.Vehicle) {
        entity.radio?.destroy();
    }
});

async function init() {
    setTimeout(() => {
        // const audio = new SyncedAudio({ source: "https://darco2903.fr/altv/cats-eye.mp3" });
        const audio = new SyncedAudio({ source: "https://darco2903.fr/altv/i-wanna-be-down.mp3" });
        // audio.addOutput("test", new alt.Vector3(180, -1030, 29));
        audio.addOutput("test", new alt.Vector3(180, -1030, 29), new alt.Vector3(0, -0.31, 0));
        // const ped = new alt.Ped("a_f_m_bevhills_01", new alt.Vector3(180, -1000, 29), alt.Vector3.zero, 20);
        // audio.setOutputOnEntity(ped);
        // const veh = alt.Vehicle.all[0] ?? new alt.Vehicle("adder", new alt.Vector3(180, -1030, 29), alt.Vector3.zero, 20);
        // audio.setOutputOnEntity(veh);
        // audio.seek(90);
        audio.volume = 1;
        audio.distance = 100;
        audio.play();

        // let switcher = true;
        // setInterval(() => {
        //     console.log(audio.volume, switcher);
        //     if (audio.volume + 0.1 >= 1 || audio.volume - 0.1 <= 0) switcher = !switcher;
        //     if (switcher) audio.volume += 0.1;
        //     else audio.volume -= 0.1;
        // }, 500);
        // const veh = alt.Vehicle.all[0] ?? new alt.Vehicle("adder", new alt.Vector3(180, -1030, 29), alt.Vector3.zero, 20);
        // const veh = alt.Vehicle.all[0] ?? new alt.Vehicle("adder", new alt.Vector3(180, -1030, 29), alt.Vector3.zero);
        // const radio = new CarRadio(veh, { source: "https://darco2903.fr/altv/cats-eye.mp3" });
        // const radio = new CarRadio(veh, { source: "https://darco2903.fr/altv/succumb.mp3" });
        // const radio = new CarRadio(veh, { source: "https://darco2903.fr/altv/calabria.mp3" });
        // const radio = new CarRadio(veh, { source: "https://darco2903.fr/altv/mina-mintip.mp3" });
        // const radio = new CarRadio(veh, { source: "https://darco2903.fr/altv/la-porsche-ou-la-rue.mp3" });
        // radio.volume = 0.5;
        // radio.play();
        // radio.seek(20);
        // setTimeout(() => {
        //     radio.source = "https://darco2903.fr/altv/cats-eye.mp3";
        //     // radio.stop()
        //     // radio.play()
        // }, 5000);
    }, 2000);
}

alt.onClient("player:play", async (player, source, title, volume) => {
    if (!player.vehicle.radio) {
        const radio = new CarRadio(player.vehicle, { source, title, volume });
        // radio.volume = 0.5;
        // radio.seek(20);
    } else {
        if (player.vehicle.radio.isPlaying) player.vehicle.radio.stop();
        await alt.Utils.wait(100);
        player.vehicle.radio.source = source;
        player.vehicle.radio.title = title;
        player.vehicle.radio.volume = volume;
    }
    await new Promise((resolve, reject) => {
        let timeout;
        const f = (p) => {
            if (player !== p) return;
            resolve();
            alt.clearTimeout(timeout);
            alt.offClient("player:sourceSet", f);
        };
        alt.onClient("player:sourceSet", f);
        timeout = alt.setTimeout(() => {
            console.log("Waited for client sourceSet but timed out");
            resolve();
            alt.offClient("player:sourceSet", f);
        }, 10000);
    });
    player.vehicle.radio.play();
    player.vehicle.radio.volume = volume;
});

alt.onClient("player:pause", (player) => {
    if (player.vehicle.radio && player.vehicle.radio.isPlaying) player.vehicle.radio.pause();
});

alt.onClient("player:resume", (player) => {
    if (player.vehicle.radio?.isPaused || player.vehicle.radio?.ended) {
        player.vehicle.radio.play();
    }
});

alt.onClient("player:seek", (player, time) => {
    if (player.vehicle.radio) player.vehicle.radio.seek(time);
});

alt.onClient("player:volume", (player, volume) => {
    if (player.vehicle.radio) player.vehicle.radio.volume = volume;
});

// const player = alt.Player.all[0];
// // console.log(player.vehicle.getAppearanceDataBase64());
// // player.vehicle.setAppearanceDataBase64("3028_jgAiAAAAACAAAIYWAQkjSIAAAAEAGJqu1EAY8+JakzJkEAAAAAAAAAAA");
// const vehicle = alt.Vehicle.all[1];
// console.log(vehicle.getAppearanceDataBase64());

// alt.onClient("audioEnded", (player, id) => {
//     console.log("audioEnded", id);
//     // const audio = SyncedAudio.getByRemoteID(id);
// });
