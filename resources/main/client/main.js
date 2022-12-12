import * as alt from 'alt-client'
import * as native from 'natives';
import { loadCayoPericoIsland, loadInteriors, loadtrains } from './locations';

loadInteriors()
loadCayoPericoIsland()
//  loadtrains()

alt.everyTick(() => {
    native.disableControlAction(2, 200, true)
})

alt.on("setGodMode", (bool) => {
    native.setPlayerInvincible(alt.Player.local.scriptID, bool)
})


alt.onServer('drawNotification', drawNotification);

export function drawNotification(imageName, headerMsg, detailsMsg, message) {
    native.beginTextCommandThefeedPost('STRING');
    native.addTextComponentSubstringPlayerName(message);
    native.endTextCommandThefeedPostMessagetextTu(
        imageName.toUpperCase(),
        imageName.toUpperCase(),
        false,
        4,
        headerMsg,
        detailsMsg,
        1.0,
        ''
    );
    native.endTextCommandThefeedPostTicker(false, false);
}
//  drawNotification('CHAR_AMMUNATION', 'Header', 'Small Details', 'The rest of the owl.');


alt.onServer('showHelpText', showHelpText);

export function showHelpText(text, sound, milliseconds) {
  native.beginTextCommandDisplayHelp("STRING");
  native.addTextComponentSubstringPlayerName(text);
  native.endTextCommandDisplayHelp(0, false, sound, milliseconds);
}

//showHelpText('Press ~INPUT_MOVE_UP_ONLY~ to move forward.', true, 5000);


export function drawText2d(
    msg,
    x,
    y,
    scale,
    fontType,
    r,
    g,
    b,
    a,
    useOutline = true,
    useDropShadow = true,
    layer = 0,
    align = 0
) {
    let hex = msg.match('{.*}');
    if (hex) {
        const rgb = hexToRgb(hex[0].replace('{', '').replace('}', ''));
        r = rgb[0];
        g = rgb[1];
        b = rgb[2];
        msg = msg.replace(hex[0], '');
    }

    native.beginTextCommandDisplayText('STRING');
    native.addTextComponentSubstringPlayerName(msg);
    native.setTextFont(fontType);
    native.setTextScale(1, scale);
    native.setTextWrap(0.0, 1.0);
    native.setTextCentre(true);
    native.setTextColour(r, g, b, a);
    native.setTextJustification(align);

    if (useOutline) {
        native.setTextOutline();
    }

    if (useDropShadow) {
        native.setTextDropShadow();
    }

    native.endTextCommandDisplayText(x, y, 0);
}

export function drawText3d(
    msg,
    x,
    y,
    z,
    scale,
    fontType,
    r,
    g,
    b,
    a,
    useOutline = true,
    useDropShadow = true,
    layer = 0
) {
    let hex = msg.match('{.*}');
    if (hex) {
        const rgb = hexToRgb(hex[0].replace('{', '').replace('}', ''));
        r = rgb[0];
        g = rgb[1];
        b = rgb[2];
        msg = msg.replace(hex[0], '');
    }

    native.setDrawOrigin(x, y, z, 0);
    native.beginTextCommandDisplayText('STRING');
    native.addTextComponentSubstringPlayerName(msg);
    native.setTextFont(fontType);
    native.setTextScale(1, scale);
    native.setTextWrap(0.0, 1.0);
    native.setTextCentre(true);
    native.setTextColour(r, g, b, a);

    if (useOutline) {
        native.setTextOutline();
    }

    if (useDropShadow) {
        native.setTextDropShadow();
    }

    native.endTextCommandDisplayText(0, 0, 0);
    native.clearDrawOrigin();
}

//  alt.everyTick(() => {
//      drawText2d('Hello from Top Center of Screen', 0.5, 0.05, 0.4, 4, 255, 255, 255, 255);
//  
//      const playerPos = { ...alt.Player.local.pos };
//      drawText3d(`This is You`, playerPos.x, playerPos.y, playerPos.z, 0.3, 4, 255, 255, 255, 255);
//  });


/*

alt.onServer('load:Locations', () => {
    load.loadInteriors()
    load.loadCayoPericoIsland()
    //load.loadtrains()
})



alt.onServer('playerDeath', () => {
    native.setPlayerControl(alt.Player.local.scriptID, true, 10000000)
})


alt.onServer('clone', () => {
    native.clonePed(alt.Player.local.scriptID, true, true, true)
})


alt.on('keydown', (key) => {
    
    //µ
    if (key == 192) {
        native.setPedToRagdoll(alt.Player.local.scriptID, 1, 10000, 0, false, false, false)            
        native.setPlayerControl(alt.Player.local.scriptID, true, 1)
    }

    //A
    if (key == 65) {

    }
    //F
    if (key == 70) {
        
    }
    
    
    //Z
    //  if (key == 90) {
    //      
    //      var vehicle = alt.Player.local.vehicle
    //      var engine = vehicle.getMeta('engine')
    //      
    //      if (!engine) {
    //          
    //      }
    //      
    //  }

});


alt.onServer('vehicle:AllExit', () => {
    native.taskEveryoneLeaveVehicle(alt.Player.local.vehicle.scriptID)
    native.taskLeaveVehicle(alt.Player.local.scriptID, alt.Player.local.vehicle.scriptID, 0)
})


alt.onServer('tpm:Player', () => {
    const veh = alt.Player.local.vehicle
    var waypoint = native.getFirstBlipInfoId(8);
    var coords = undefined
    if (waypoint != 0) {
        coords = native.getBlipInfoIdCoord(waypoint);
        var res = native.getGroundZFor3dCoord(coords.x, coords.y, coords.z + 100, undefined, undefined);
        console.log("ground: " + res)
        if (res[0] == false) {
            alt.emitServer('tpm:PlayerTPM', coords, false)
            setTimeout(() => {
                res = native.getGroundZFor3dCoord(coords.x, coords.y, coords.z + 100, undefined, undefined);
                coords = {x: coords.x, y: coords.y, z: res[1]}
                alt.emitServer('tpm:PlayerTPM', coords, veh)
            }, 200);
        } else {
            res = native.getGroundZFor3dCoord(coords.x, coords.y, coords.z + 100, undefined, undefined);
            coords = {x: coords.x, y: coords.y, z: res[1]}
            alt.emitServer('tpm:PlayerTPM', coords, veh)
        }
        
    }
})



alt.onServer('vehicle:Request', () => {
    //getClosestVehicle
    alt.emitServerRaw('vehicle:Found', vehicleNearRequest())
})


alt.onServer('vehicle:Repair', () => {
    var veh = vehicleNearRequest()
    alt.emitServer('vehicle:ToRepair', veh)
})

alt.onServer('vehicle:Enter', () => {
    var vehicle = vehicleNearRequest()
    native.setPedIntoVehicle(alt.Player.local.scriptID, vehicle, -1)
})

alt.onServer('vehicleToGarage:Request', () => {
    alt.emitServerRaw('vehicleToGarage:Found', vehicleNearRequest())
})



alt.onServer('getPlayers:PlayersList', () => {
    var playersList = alt.Player.all
    alt.emitServer('players:PlayersList', playersList)
})



function vehicleNearRequest () {        // Get vehicles near the player
    var vehList = alt.Vehicle.streamedIn
    const pos = alt.Player.local.pos

    for (var i = 0; i < vehList.length; i++) {
        vehList[i].distance = Math.sqrt((vehList[i].pos.x - pos.x)**2 + (vehList[i].pos.y - pos.y)**2 + (vehList[i].pos.z - pos.z)**2)
    }

    vehList.sort(function(a, b) {
        return a.distance - b.distance
    })
    if (vehList[0].distance < 50) {
        return vehList[0]
    }
    return
}
*/