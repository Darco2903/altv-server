import * as alt from "alt-client";
import * as native from "natives";



let player = alt.Player.local
let vehicle
let engine
let step = 20
let kmAge = 0
let speedo = new alt.WebView("http://resource/speedo.html", true)
let everyTickUpdate
let optionInterval


alt.on("enteredVehicle", speedoInit)
alt.on("leftVehicle", speedoRemove)

alt.on("resourceStart", () => {
    if (player.vehicle)
        speedoInit()
})
alt.on("resourceStop", clearAllUpdate)


function speedoInit () {
    speedo.emit("showSpeedo", true)
    vehicle = player.vehicle
    const maxSpeed = native.getVehicleEstimatedMaxSpeed(vehicle)
    step = maxSpeed < 50 ? step : native.floor(maxSpeed / 20) * 10
    speedo.emit("stepUpdate", step)
    kmAge = vehicle.getSyncedMeta("kmAge")
    refreshEngine()
    startAllUpdate()
}

function speedoRemove () {
    speedo.emit("showSpeedo", false)
    clearAllUpdate()
    //  console.log(vehicle);
    //  if (!vehicle)
    //      vehicle = native.getVehiclePedIsIn(player, true)
    //  console.log(vehicle);
    //  vehicle.setSyncedMeta("kmAge", kmAge)
}

function stopRealTimeUpdate () {
    console.log(everyTickUpdate);
    if (everyTickUpdate) {
        alt.clearEveryTick(everyTickUpdate)
        everyTickUpdate = null
    }
}


function clearAllUpdate () {
    stopRealTimeUpdate()
    if (optionInterval) {
        clearInterval(optionInterval)
        optionInterval = null
    }
}

function startRealtimeUpdate () {
    everyTickUpdate = alt.everyTick(speedoUpdateRealtime)
}

function startAllUpdate () {
    optionInterval = setInterval(speedoUpdateOptions, 100)
    if (!engine)
        speedoAnim()
    else
        startRealtimeUpdate()
}

function updateSpeedo (speed, tacho) {
    speedo.emit("speedoUpdate", {speed, tacho})
}

function speedoUpdateRealtime () {
    updateSpeedo((vehicle.speed*3.6)/(step*9), vehicle.rpm*0.9)
}

function gasState () {
    const gas = vehicle.fuelLevel
    if (fuelLevel == 0) return 2
    if (fuelLevel > 0.1) return 0
    else return 1
}

function oilState () {
    if (vehicle.oilLevel < 2)
        return 2
    else
        return +vehicle.oilLight
}

function engineState () {
    if (native.getVehicleEngineHealth(vehicle) == 0)
        return 2
    else
        return +(native.getVehicleEngineHealth(vehicle) < 400)
}

function speedoUpdateOptions () {

    if (!vehicle.engineOn && engine)
        engineOff()

    if (vehicle.engineOn && !engine)
        engineOn()

    const lights = native.getVehicleLightsState(vehicle, ).splice(1, 2).map(value => value ? 2 : 0)
    const stab = native.isVehicleInBurnout(vehicle) ? 2 : 0
    const speed = native.getEntitySpeed(vehicle)
    const drift = speed > 0.5 && speed+3 < vehicle.speed && !stab ? 2 : 0
    const iconsStates = {
        // main circle
        dippedBeam: lights[0],
        brake:      +(native.isControlPressed(0, 76)),
        drift:      drift,
        highBeam:   lights[1],
        lock:       vehicle.lockState == 2 ? 2 : 0,
        seatBelt:   0,
        engineTemp: +(vehicle.engineTemperature >= 110),
        stab:       stab,
        abs:        vehicle.absLight ? 2 : 0,
        // right circle
        gas:        +(vehicle.petrolLight),
        trunk:      native.getVehicleDoorAngleRatio(vehicle, 5) ? 2 : 0,
        bonnet:     native.getVehicleDoorAngleRatio(vehicle, 4) ? 2 : 0,
        doors:      +(isADoorOpen()),
        // left circle
        battery:    +(vehicle.batteryLight),
        oil:        oilState(),
        engineFail: engineState()
    }
    speedo.emit("speedoUpdateOptions", iconsStates)

    let turnSignalsStates = {
        'left':  false,
        'right': false
    }

    kmAge += vehicle.speed/10000
    kmAge = parseFloat(kmAge.toFixed(3))
    speedo.emit("kmAge", kmAge)
}

function isADoorOpen () {
    for (let doorId=0 ; doorId<4 ; doorId++)
        if (native.getVehicleDoorAngleRatio(vehicle, doorId)) return true
    return false
}

function refreshEngine () {
    engine = vehicle.engineOn
}

function engineOn () {
    refreshEngine()
    startRealtimeUpdate()
}

function engineOff () {
    console.log("engine Off");
    refreshEngine()
    stopRealTimeUpdate()
    rpm = vehicle.rpm
    speed = (vehicle.speed*3.6)/(step*9)
    rpmDown()
}

let rpm
let speed
function rpmDown () {
    console.log(speed);
    if (rpm < 0.01 && speed < 0.01) return
    if (rpm > 0.01)
        rpm -= 0.02
    if (speed > 0.01)
        speed -= 0.02
    updateSpeedo(speed, rpm)
    setTimeout(rpmDown, 15);
}



let i=-1
function speedoAnim () {
    if (i>1) {
        i=-1
        return
    }
    i+=0.03
    let angle = -Math.abs(i) +1.01
    updateSpeedo(angle, angle)
    setTimeout(speedoAnim, 15);
}




//native.setVehicleLights()

/*


vehicle.engineOn

vehicle.engineTemperature
vehicle.fuelLevel



vehicle.indicatorLights = 0


*/
