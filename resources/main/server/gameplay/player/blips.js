import * as alt from "alt-server";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const vehicles = require("../../../../data-pack/content/vehicle/vehicles.json");
const vehiclesMod = require("../../../../data-pack/content/vehicle/vehiclesMod.json");

/** @type {Map<number, number>} */
const vehiclesCategories = new Map();

function indexVehicles() {
    // const addVeh = (veh) => vehiclesCategories.set(veh.Hash ?? alt.hash(veh.Name), veh.Class);
    // vehicles.forEach(addVeh);
    // vehiclesMod.forEach(addVeh);
    vehicles.forEach((veh) => vehiclesCategories.set(veh.Hash, veh.Class));
}

function createPlayerBlip(player, color = 3) {
    const blip = new alt.PointBlip(player.pos, true);
    blip.addTarget(player);
    blip.gxtName = "Player";
    blip.setMeta("type", "player");
    blip.name = player.name;
    blip.setMeta("name", player.name);
    blip.sprite = 1;
    blip.setMeta("color", color);
    blip.color = color;
    blip.blipType = 1;
    blip.shrinked = true;
    return blip;
}

function getPlayerBlip(player) {
    return alt.Blip.all.find((blip) => blip.targets[0] === player);
}

/**
 * @param {alt.Vehicle} vehicle
 * @returns {number}
 */
function getVehicleBlipSprite(vehicle) {
    const info = alt.getVehicleModelInfoByHash(vehicle.model);
    // console.log("veh", info.title, info.type);
    switch (info.title.toLowerCase()) {
        case "rhino":
            return 421;
        case "lazer":
        case "hydra":
            return 424;
        case "insurgent":
        case "insurgent2":
        case "insurgent3":
            return 426;
        case "limo2":
            return 460;
        case "seashark":
        case "seashark2":
        case "seashark3":
            return 471;
        case "blazer":
        case "blazer2":
        case "blazer3":
        case "blazer4":
        case "blazer5":
            return 512;
        case "airbus":
        case "bus":
        case "pbus":
        case "coach":
            return 513;
        case "phantom2":
            return 528;
        case "boxville5":
            return 529;
        case "ruiner2":
            return 530;
        case "dune4":
        case "dune5":
            return 531;
        case "wastelander":
            return 532;
        case "voltic2":
            return 533;
        case "technical2":
            return 534;
        case "apc":
            return 558;
        case "oppressor":
            return 559;
        case "halftrack":
            return 560;
        case "dune3":
            return 561;
        case "tampa3":
            return 562;
        case "trailersmall2":
            return 563;
        case "havok":
            return 574;
        case "howard":
            return 575;
        case "hunter":
            return 576;
        case "microlight":
            return 577;
        case "mogul":
            return 578;
        case "molotok":
            return 579;
        case "nokota":
            return 580;
        case "pyro":
            return 581;
        case "rogue":
            return 582;
        case "starling":
            return 583;
        case "seabreeze":
            return 584;
        case "tula":
            return 585;
        case "avenger":
            return 589;
        case "deluxo":
            return 596;
        case "thruster":
            return 597;
        case "khanjali":
            return 598;
        case "volatol":
            return 600;
        case "barrage":
            return 601;
        case "akula":
            return 602;
        case "chernobog":
            return 603;
        case "seasparrow":
            return 612;
        case "caracara":
            return 613;
        case "pbus2":
            return 631;
        case "terbyte":
            return 632;
        case "menacer":
            return 633;
        case "scramjet":
            return 634;
        case "pounder2":
            return 635;
        case "mule4":
            return 636;
        case "speedo4":
            return 637;
        case "oppressor2":
            return 639;
        case "strikeforce":
            return 640;
        case "stretch":
            return 724;
        case "dune":
            return 735;
        case "zhaba":
            return 737;
        case "minitank":
            return 742;
        case "submersible":
        case "submersible2":
            return 746;
        case "veto":
            return 747;
        case "veto2":
            return 748;
        case "seasparrow2":
        case "seasparrow3":
            return 753;
        case "squaddie":
            return 757;
        case "alkonost":
            return 758;
        case "valkyrie":
        case "valkyrie2":
            return 759;
        case "slamvan":
        case "slamvan2":
        case "slamvan3":
        case "slamvan4":
        case "slamvan5":
        case "slamvan6":
            return 799;
        case "crusader":
            return 800;
        case "jubilee":
            return 820;
        case "deity":
            return 823;
        case "champion":
            return 824;
        case "buffalo4":
            return 825;
    }
    const vehClass = vehiclesCategories.get(vehicle.model);
    switch (vehClass) {
        case "SUPER":
            return 523;
        case "SPORT":
            return 523;
        case "SPORT_CLASSIC":
            return 756;
        case "SUV":
            return 812;
        case "HELICOPTER":
            return 422;
        case "PLANE":
            return 423;
        case "BOAT":
            return 427;
        case "MILITARY":
            return 800;
        default:
            return 227;
    }
}

alt.on("resourceStart", () => {
    indexVehicles();

    alt.everyTick(() => {
        alt.Blip.all.forEach((blip) => {
            const target = blip.targets[0];
            if (!target) return;
            blip.pos = target.pos;
        });
    });
});

// alt.on("blips:update:players", () => {
//     alt.Blip.all.forEach((blip) => {
//         if (blip.getMeta("type") !== "player") return;
//         const player = blip.targets[0];
//         blip.sprite = player.vehicle ? getVehicleBlipSprite(player.vehicle) : player.health === 0 ? 274 : 1;
//         blip.color = blip.getMeta("color");
//         blip.name = blip.getMeta("name");
//     });
// });

alt.on("playerConnect", (player) => {
    createPlayerBlip(player);
});

alt.on("playerDisconnect", (player) => {
    const blip = getPlayerBlip(player);
    if (blip) blip.destroy();
    else alt.log("Blip not found.");
});

alt.on("playerDeath", (player) => {
    const blip = getPlayerBlip(player);
    blip.sprite = 274;
});

alt.on("playerHeal", (player, oldHealth, newHealth, oldArmour, newArmour) => {
    // console.log("heal", oldHealth, newHealth, oldArmour, newArmour);
    if (oldHealth === 0) {
        const blip = getPlayerBlip(player);
        blip.sprite = 1;
        blip.color = blip.getMeta("color");
        blip.name = blip.getMeta("name");
    }
});

alt.on("playerEnteredVehicle", (player, vehicle, seat) => {
    const blip = getPlayerBlip(player);
    if (seat === 1) {
        blip.sprite = getVehicleBlipSprite(vehicle);
        blip.color = blip.getMeta("color");
        blip.name = blip.getMeta("name");
    } else {
        blip.visible = false;
    }
});

alt.on("playerChangedVehicleSeat", (player, vehicle, oldSeat, seat) => {
    const blip = getPlayerBlip(player);
    if (seat === 1) {
        blip.sprite = getVehicleBlipSprite(vehicle);
        blip.color = blip.getMeta("color");
        blip.name = blip.getMeta("name");
        blip.visible = true;
    } else {
        blip.visible = false;
    }
});

alt.on("playerLeftVehicle", (player, vehicle, seat) => {
    const blip = getPlayerBlip(player);
    blip.sprite = 1;
    blip.color = blip.getMeta("color");
    blip.name = blip.getMeta("name");
    blip.visible = true;
});

// let point = alt.Blip.all.find((blip) => blip.name === "test");

// alt.Utils.Chat.registerCmd({
//     name: "blip",
//     args: [
//         {
//             name: "sprite",
//             type: "number",
//             required: true,
//         },
//         {
//             name: "color",
//             type: "number",
//             required: false,
//         },
//     ],
//     execute: (player, [sprite, color = point?.color ?? 3]) => {
//         if (!point) {
//             // point = new alt.PointBlip(player.pos.add(5, 5, 0), true);
//             point = new alt.PointBlip(player.pos.add(5, 5, 0), true);
//             point.name = "test";
//             // point.addTarget(player);
//         }
//         // point.heading = 0;
//         point.sprite = sprite;
//         // point.isFriendly = true;
//         // console.log(point.isAttached, point.isGlobal, point.targets);
//         // point.tickVisible = true;
//         // point.shrinked = true;
//     },
// });

// 274 - dead
// 354 - boost
// 357 - garage
// 359 - hangar
// 360 - helipad
// 361 - jerryCan
// 390 - aim
// 402 - repair
// 403 - pils
// 407 - info
// 410 - boat
// 417 - LevelInside (in house)
// 432 - targetBig
// 432 - targetSmall
// 439 - playerKing
// 455 - yatch
// 459 - Sightseer (network icon)
// 460 - TurretedLimo
// 473 - Warehouse
// 521 - laptop
// 604 - CCTV
// 627 - drone
// 629 - CCTV BIG
// 728 - swap car
// 752 - UFO
// 777 - car meet
// 795 - train
// 809 - rockstar

// 421 - tank
// 422 - playerHeli
// 423 - playerPlane
// 424 - playerJet
// 426 - playerGunCar (insurgent)
// 427 - playerBoat
// 471 - Seashark (jet ski)
// 512 - quad
// 513 - bus
// 523 - sportsCar
// 756 - retro sport car
// 820 - Mulitary

// special vehicles 528 - 534
// special vehicles 558 - 563
// special vehicles 572 - 585
// 589 - avenger
// special vehicles 596 - 603
// special vehicles 612 - 613
// 631 - festivalBus
// special vehicles 632 - 637
// 639 - opressor mk2
// 640 - special plane
// 724 - limo
// 734 - snow truck //
// 735 - buggy1
// 736 - buggy2
// 737 - Zhaba
// 742 - rc tank
// 746 - mini sub
// 747 - kart retro
// 748 - kart modern
// 753 - Seasparrow2
// 757 - Squadee
// 758 - FoldingWingJet
// 759 - Valkyrie2
// 760 - Sub2 (kosatka)
// 799 - Slamvan2
// 800 - Crusader
// 821 - Jubilee
// 823 - Deity
// 824 - DChampion
// 825 - Buffalo4
