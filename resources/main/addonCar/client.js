import * as alt from 'alt'
import * as native from 'natives'


/*
alt.onServer('player:EnterVehicle', () => {
    var rpmInterval = alt.everyTick(() => {
        if (!alt.Player.local.vehicle) {
            alt.clearEveryTick(rpmInterval)
        }
        alt.emitServer('vehicle:RPM', alt.Player.local.vehicle.rpm)
    })
})
*/










////////////////    Keep engine running when leaving the vehicle





let vehicle
let engine
let interval

alt.on('keydown', (key) => {
    if (key === 'F'.charCodeAt(0)) {
        if (alt.Player.local.vehicle) { // If the player is in a vehicle
            vehicle = alt.Player.local.vehicle.scriptID // Get the vehicle script ID
            engine = native.getIsVehicleEngineRunning(vehicle)
            if (!engine) { // If the engine is running
                return
            }
            interval = alt.everyTick(() =>{
                if (!native.getIsVehicleEngineRunning(vehicle)) {
                    native.setVehicleEngineOn(vehicle, true, true, true)
                    alt.clearEveryTick(interval)
                }
            })
        }
    }
    
    if (key === 'A'.charCodeAt(0)) {
        /*
        console.log('door')
        const ped = alt.Player.local.scriptID
        const veh = alt.Player.local.vehicle
        //native.setVehicleEngineHealth(veh, -999.90002441406)
        native.taskOpenVehicleDoor(ped, veh, 1, 0, 0)
        //native.setPlayerControl(alt.Player.local.scriptID, false, 1000)
        */
    }
})



alt.onServer("playerEnterVehicle", (vehicle) => {
    var engine = vehicle.getMeta('engine')
    native.setVehicleUndriveable(vehicle, !engine)

})









////////////////    Speedometer





let view = new alt.WebView("http://resources/addonCar/client/html/index.html");

let speedoShown = false;

let playerVehicle = false;


alt.setInterval(() => {
    if (!playerVehicle) return;
    if (speedoShown) {
        var rpm = playerVehicle.rpm
        if (!native.getIsVehicleEngineRunning(playerVehicle)) {            
            rpm = 0
        }
        view.emit('drawSpeedo', playerVehicle.speed, playerVehicle.gear, rpm)
    }
}, 1);


view.on('speedoLoaded', () => {
    speedoShown = true;
});

view.on('speedoUnloaded', () => {
    speedoShown = false;
})


alt.onServer("playerEnterVehicle", (vehicle, seat) => {
    playerVehicle = vehicle;
    if (seat == 1) { //driver
        if (!speedoShown) {
            view.emit('showSpeedo', true);
        }
    }
})

alt.onServer("playerLeftVehicle", (seat) => {
    playerVehicle = false;
    if (seat == 1) { //driver
        if (speedoShown) {
            view.emit('showSpeedo', false);
        }
    }
})

alt.onServer("playerChangedVehicleSeat", (vehicle, seat) => {
    playerVehicle = vehicle;
    if (seat == 1) { //driver
        if (!speedoShown) {
            view.emit('showSpeedo', true);
        }
    }
})