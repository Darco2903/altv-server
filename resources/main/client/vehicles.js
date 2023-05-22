import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;

native.setPedConfigFlag(player, 429, true);
native.setPedConfigFlag(player, 241, true);

alt.on("enteredVehicle", (vehicle, seat) => {
    if (vehicle.model === 3096296255) {
        native.setPedConfigFlag(player, 32, false);
        native.setEntityInvincible(player, true);
        native.setEntityInvincible(vehicle, true);
    }
});

alt.on("leftVehicle", (vehicle, seat) => {
    if (vehicle.model === 3096296255) {
        native.setPedConfigFlag(player, 32, true);
        native.setEntityInvincible(player, false);
        native.setEntityInvincible(vehicle, false);
    }
});

alt.onServer("vehicle:replace", async (oldVeh, newVeh) => {
    try {
        native.networkFadeOutEntity(oldVeh, false, true);
        await alt.Utils.waitFor(() => newVeh.isSpawned, 2000);
        native.setEntityVisible(oldVeh, false, 0);
        native.setEntityVisible(newVeh, false, 0);
        native.networkFadeInEntity(newVeh, false, 0);

        if (player.vehicle === oldVeh) {
            native.setPedIntoVehicle(player, newVeh, -player.seat);
        }
        native.setEntityCollision(oldVeh, false, false);

        if (player.seat === 1) {
            // driver
            const speed = native.getEntitySpeed(oldVeh);
            native.setVehicleForwardSpeed(newVeh, speed);
            // await alt.Utils.wait(50);
            native.setEntityCoords(newVeh, ...oldVeh.pos.toArray(), ...oldVeh.rot.toArray(), true);
        }
    } catch (error) {
        alt.logError(error);
        native.networkFadeInEntity(oldVeh, false, 0);
        player.notify({
            imageName: "CHAR_BLOCKED",
            headerMsg: "Erreur",
            detailMsg: "Spawn",
            message: "Une erreur est survenue",
        });
    }
});

alt.on("keydown", (key) => {
    if (!player.vehicle || !alt.gameControlsEnabled()) return;
    switch (key) {
        case 49: //  key: & = 49  alt.KeyCode.Key1
            const running = native.getIsVehicleEngineRunning(player.vehicle);
            native.setVehicleEngineOn(player.vehicle, !running, false, true);
            break;
    }
});

alt.onServer("vehicle:setSpeed", async (vehicle, speed) => {
    try {
        await alt.Utils.waitFor(() => player.vehicle, 2000);
        native.setVehicleForwardSpeed(vehicle, parseFloat(speed));
    } catch (error) {}
});

// alt.onServer("vehicle:nearest-get", (range) => {
//     let vehId = native.getClosestVehicle(...player.pos.toArray(), range || 20, 0, 70);
//     let veh = alt.Vehicle.getByScriptID(vehId);
//     alt.emitServer(`vehicle:nearest-${player.id}`, veh);
// });

//  if (player.vehicle) {
//      const speed = 4000;
//      native.setVehicleMaxSpeed(player.vehicle, speed);
//      native.setVehicleForwardSpeed(player.vehicle, speed);
//      native.setPlayerVehicleDamageModifier(player.vehicle, 0);
//      native.setVehicleDamageScale(player.vehicle, 0);
//      native.isVehicleStopped(player.vehicle);
//  }

//  native.isVehicleInGarageArea(garageName, veh)
//  native.setVehicleStrong(veh, bool)
//  native.setVehicleForwardSpeed(veh, speed)
//  native.setVehicleTyreBurst(veh, index, onRim, ?)
//  native.setVehicleDoorsShut(veh, instant)
//  native.setVehicleDoorOpen(veh, doorId, loose, instant)
//  native.setVehicleTyresCanBurst(veh, toogle)    //get
//  native.setVehicleTyreFixed(veh, index)
//  native.setVehicleCanBeVisiblyDamaged(veh, bool)
//  native.setVehicleHasUnbreakableLights(veh, bool)
//  native.setVehicleRespectsLocksWhenHasDriver(veh, bool)
//  native.setVehicleDirtLevel(player.vehicle, 15) 0-15 //get
//  native.getVehicleDoorLockStatus(veh)
//  native.setAllowVehicleExplodesOnContact(veh, bool)
//  native.setVehicleUseAlternateHandling(veh, bool)
//  native.setVehicleHandlingOverride(veh, hash)
//  native.setVehicleGravity(veh, bool)

//  native.requestVehicleHighDetailModel(veh)
//  native.removeVehicleHighDetailModel(veh)
//  native.isVehicleHighDetail(veh)

//  native.setVehicleIndicatorLights()

//native.setVehicleKeepEngineOnWhenAbandoned(player.vehicle, false)
//  native.setVehicleStartupRevSound()
//  native.resetVehicleStartupRevSound()

//  function checkDoors(vehicle) {
//      let nbDoor = native.getNumberOfVehicleDoors(vehicle);
//      for (let doorId = 0; doorId < nbDoor; doorId++) {
//          if (native.getVehicleDoorAngleRatio(vehicle, doorId) != 0) {
//              console.log(doorId, true);
//              native.setVehicleDoorShut(vehicle, doorId, false);
//          }
//      }
//  }

//  native.playVehicleDoorOpenSound(player.vehicle, 0)
//  setTimeout(() => {
//      native.playVehicleDoorCloseSound(player.vehicle, 0)
//  }, 1000);

//  for (let wheelIndex=0 ; wheelIndex<player.vehicle.wheelsCount ; wheelIndex++) {
//      player.vehicle.setWheelCamber(wheelIndex, -0.25)
//      player.vehicle.setWheelTrackWidth(wheelIndex, 1)
//  }
//  player.vehicle.setWheelTrackWidth(0, 0.95)
//  player.vehicle.setWheelTrackWidth(1, 0.95)
