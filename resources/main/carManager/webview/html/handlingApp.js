/*const doc = {
    acceleration: [document.getElementById("acceleration"), document.getElementById("showacceleration")],
    antiRollBarBiasFront: [document.getElementById("antiRollBarBiasFront"), document.getElementById("showantiRollBarBiasFront")],
    antiRollBarBiasRear: [document.getElementById("antiRollBarBiasRear"), document.getElementById("showantiRollBarBiasRear")],
    antiRollBarForce: [document.getElementById("antiRollBarForce"), document.getElementById("showantiRollBarForce")],
    brakeBiasFront: [document.getElementById("brakeBiasFront"), document.getElementById("showbrakeBiasFront")],
    brakeBiasRear: [document.getElementById("brakeBiasRear"), document.getElementById("showbrakeBiasRear")],
    brakeForce: [document.getElementById("brakeForce"), document.getElementById("showbrakeForce")],
    camberStiffness: [document.getElementById("camberstiffness"), document.getElementById("showcamberstiffness")],
    clutchChangeRateScaleDownShift: [document.getElementById("clutchchangeratescaledownshift"), document.getElementById("showclutchchangeratescaledownshift")],
    clutchChangeRateScaleUpShift: [document.getElementById("clutchchangeratescaleupshift"), document.getElementById("showclutchchangeratescaleupshift")],
    collisionDamageMult: [document.getElementById("collisiondamagemult"), document.getElementById("showcollisiondamagemult")],
    damageFlags: [document.getElementById("damageflags"), document.getElementById("showdamageflags")],
    deformationDamageMult: [document.getElementById("deformationdamagemult"), document.getElementById("showdeformationdamagemult")],
    downforceModifier: [document.getElementById("downforcemodifier"), document.getElementById("showdownforcemodifier")],
    driveBiasFront: [document.getElementById("drivebiasfront"), document.getElementById("showdrivebiasfront")],
    driveInertia: [document.getElementById("driveinertia"), document.getElementById("showdriveinertia")],
    driveMaxFlatVel: [document.getElementById("drivemaxflatvel"), document.getElementById("showdrivemaxflatvel")],
    engineDamageMult: [document.getElementById("enginedamagemult"), document.getElementById("showenginedamagemult")],
    handbrakeForce: [document.getElementById("handbrakeForce"), document.getElementById("showhandbrakeForce")],
    initialDragCoeff: [document.getElementById("initialdragcoeff"), document.getElementById("showinitialdragcoeff")],
    initialDriveForce: [document.getElementById("initialdriveforce"), document.getElementById("showinitialdriveforce")],
    initialDriveGears: [document.getElementById("initialdrivegears"), document.getElementById("showinitialdrivegears")],
    initialDriveMaxFlatVel: [document.getElementById("initialdrivemaxflatvel"), document.getElementById("showinitialdrivemaxflatvel")],
    lowSpeedTractionLossMult: [document.getElementById("lowspeedtractionlossmult"), document.getElementById("showlowspeedtractionlossmult")],
    mass: [document.getElementById("mass"), document.getElementById("showmass")],
    oilVolume: [document.getElementById("oilvolume"), document.getElementById("showoilvolume")],
    percentSubmerged: [document.getElementById("percentsubmerged"), document.getElementById("showpercentsubmerged")],
    percentSubmergedRatio: [document.getElementById("percentsubmergedratio"), document.getElementById("showpercentsubmergedratio")],
    petrolTankVolume: [document.getElementById("petroltankvolume"), document.getElementById("showpetroltankvolume")],
    rollCentreHeightFront: [document.getElementById("rollcentreheightfront"), document.getElementById("showrollcentreheightfront")],
    rollCentreHeightRear: [document.getElementById("rollcentreheightrear"), document.getElementById("showrollcentreheightrear")],
    seatOffsetDistX: [document.getElementById("seatoffsetdistx"), document.getElementById("showseatoffsetdistx")],
    seatOffsetDistY: [document.getElementById("seatoffsetdisty"), document.getElementById("showseatoffsetdisty")],
    seatOffsetDistZ: [document.getElementById("seatoffsetdistz"), document.getElementById("showseatoffsetdistz")],
    steeringLock: [document.getElementById("steeringlock"), document.getElementById("showsteeringlock")],
    steeringLockRatio: [document.getElementById("steeringlockratio"), document.getElementById("showsteeringlockratio")],
    suspensionBiasFront: [document.getElementById("suspensionbiasfront"), document.getElementById("showsuspensionbiasfront")],
    suspensionBiasRear: [document.getElementById("suspensionbiasrear"), document.getElementById("showsuspensionbiasrear")],
    suspensionCompDamp: [document.getElementById("suspensioncompdamp"), document.getElementById("showsuspensioncompdamp")],
    suspensionForce: [document.getElementById("suspensionforce"), document.getElementById("showsuspensionforce")],
    suspensionLowerLimit: [document.getElementById("suspensionlowerlimit"), document.getElementById("showsuspensionlowerlimit")],
    suspensionRaise: [document.getElementById("suspensionraise"), document.getElementById("showsuspensionraise")],
    suspensionReboundDamp: [document.getElementById("suspensionrebounddamp"), document.getElementById("showsuspensionrebounddamp")],
    suspensionUpperLimit: [document.getElementById("suspensionupperlimit"), document.getElementById("showsuspensionupperlimit")],
    tractionBiasFront: [document.getElementById("tractionbiasfront"), document.getElementById("showtractionbiasfront")],
    tractionBiasRear: [document.getElementById("tractionbiasrear"), document.getElementById("showtractionbiasrear")],
    tractionCurveLateral: [document.getElementById("tractioncurvelateral"), document.getElementById("showtractioncurvelateral")],
    tractionCurveLateralRatio: [document.getElementById("tractioncurvelateralratio"), document.getElementById("showtractioncurvelateralratio")],
    tractionCurveMax: [document.getElementById("tractioncurvemax"), document.getElementById("showtractioncurvemax")],
    tractionCurveMaxRatio: [document.getElementById("tractioncurvemaxratio"), document.getElementById("showtractioncurvemaxratio")],
    tractionCurveMin: [document.getElementById("tractioncurvemin"), document.getElementById("showtractioncurvemin")],
    tractionCurveMinRatio: [document.getElementById("tractioncurveminratio"), document.getElementById("showtractioncurveminratio")],
    tractionLossMult: [document.getElementById("tractionlossmult"), document.getElementById("showtractionlossmult")],
    tractionSpringDeltaMax: [document.getElementById("tractionspringdeltamax"), document.getElementById("showtractionspringdeltamax")],
    tractionSpringDeltaMaxRatio: [document.getElementById("tractionspringdeltamaxratio"), document.getElementById("showtractionspringdeltamaxratio")],
    unkFloat1: [document.getElementById("unkfloat1"), document.getElementById("showunkfloat1")],
    unkFloat2: [document.getElementById("unkfloat2"), document.getElementById("showunkfloat2")],
    unkFloat4: [document.getElementById("unkfloat4"), document.getElementById("showunkfloat4")],
    unkFloat5: [document.getElementById("unkfloat5"), document.getElementById("showunkfloat5")],
    weaponDamageMult: [document.getElementById("weapondamagemult"), document.getElementById("showweapondamagemult")],

}
*/





var doc = {
    acceleration: {min: 0, max: 100, step: 1},
    antiRollBarBiasFront: {min: 0, max: 1, step: 0.01},
    antiRollBarBiasRear: {min: 0, max: 1, step: 0.01},
    antiRollBarForce: {min: 0, max: 10, step: 0.1},
    brakeBiasFront: {min: 0, max: 1, step: 0.01},
    brakeBiasRear: {min: 0, max: 1, step: 0.01},
    brakeForce: {min: 0, max: 10, step: 0.1},
    camberStiffnesss: {min: -10, max: 10, step: 0.1},
    //centreOfMassOffset: {min: 0, max: 10, step: 0.1},
    clutchChangeRateScaleDownShift: {min: 0, max: 10, step: 0.1},
    clutchChangeRateScaleUpShift: {min: 0, max: 10, step: 0.1},
    collisionDamageMult: {min: 0, max: 10, step: 0.1},
    damageFlags: {min: 0, max: 10, step: 0.1},
    deformationDamageMult: {min: 0, max: 10, step: 0.1},
    downforceModifier: {min: 0, max: 10, step: 0.1},
    driveBiasFront: {min: 0, max: 1, step: 0.01},
    driveInertia: {min: 0, max: 10, step: 0.1},
    driveMaxFlatVel: {min: 0, max: 1000, step: 1},
    engineDamageMult: {min: 0, max: 10, step: 0.1},
    handBrakeForce: {min: 0, max: 10, step: 0.1},
    //handlingFlags: {min: 0, max: 10, step: 0.1},
    //handlingNameHash: {min: 0, max: 10, step: 0.1},
    //inertiaMultiplier: {min: 0, max: 10, step: 0.1},
    initialDragCoeff: {min: 0, max: 10, step: 0.1},
    initialDriveForce: {min: 0, max: 10, step: 0.1},
    initialDriveGears: {min: 0, max: 10, step: 0.1},
    initialDriveMaxFlatVel: {min: 0, max: 1000, step: 1},
    lowSpeedTractionLossMult: {min: -10, max: 10, step: 0.1},
    mass: {min: 0, max: 100000, step: 1},
    //modelFlags: {min: 0, max: 10, step: 0.1},
    //monetaryValue: {min: 0, max: 10, step: 0.1},
    oilVolume: {min: 0, max: 10, step: 0.1},
    percentSubmerged: {min: 0, max: 100, step: 1},
    percentSubmergedRatio: {min: 0, max: 10, step: 0.1},
    petrolTankVolume: {min: 0, max: 1000, step: 1},
    rollCentreHeightFront: {min: 0, max: 10, step: 0.1},
    rollCentreHeightRear: {min: 0, max: 10, step: 0.1},
    seatOffsetDistX: {min: 0, max: 10, step: 0.1},
    seatOffsetDistY: {min: 0, max: 10, step: 0.1},
    seatOffsetDistZ: {min: 0, max: 10, step: 0.1},
    steeringLock: {min: -2, max: 2, step: 0.01},
    steeringLockRatio: {min: 0, max: 10, step: 0.1},
    suspensionBiasFront: {min: 0, max: 1, step: 0.01},
    suspensionBiasRear: {min: 0, max: 1, step: 0.01},
    suspensionCompDamp: {min: 0, max: 10, step: 0.01},
    suspensionForce: {min: 0, max: 10, step: 0.01},
    suspensionLowerLimit: {min: 0, max: 10, step: 0.01},
    suspensionRaise: {min: -1, max: 1, step: 0.01},
    suspensionReboundDamp: {min: 0, max: 10, step: 0.01},
    suspensionUpperLimit: {min: 0, max: 10, step: 0.01},
    tractionBiasFront: {min: 0, max: 1, step: 0.01},
    tractionBiasRear: {min: 0, max: 1, step: 0.01},
    tractionCurveLateral: {min: 0, max: 10, step: 0.1},
    tractionCurveLateralRatio: {min: 0, max: 10, step: 0.1},
    tractionCurveMax: {min: 0, max: 10, step: 0.1},
    tractionCurveMaxRatio: {min: 0, max: 10, step: 0.1},
    tractionCurveMin: {min: 0, max: 10, step: 0.1},
    tractionCurveMinRatio: {min: 0, max: 40, step: 0.1},
    tractionLossMult: {min: -10, max: 10, step: 0.1},
    tractionSpringDeltaMax: {min: 0, max: 10, step: 0.1},
    tractionSpringDeltaMaxRatio: {min: 0, max: 10, step: 0.1},
    unkFloat1: {min: -10, max: 10, step: 0.1},
    unkFloat2: {min: -10, max: 10, step: 0.1},
    unkFloat4: {min: -10, max: 10, step: 0.1},
    unkFloat5: {min: -10, max: 10, step: 0.1},
    weaponDamageMult: {min: 0, max: 10, step: 0.1},
}

const presets = {
    drift: {acceleration: 7,antiRollBarBiasFront: 1.2,antiRollBarBiasRear: 0.8,antiRollBarForce: 0.6,brakeBiasFront: 1.3,brakeBiasRear: 0.7,brakeForce: 1.2,camberStiffness: 0,clutchChangeRateScaleDownShift: 2.5,clutchChangeRateScaleUpShift: 3,driveBiasFront: 0,driveInertia: 1,handbrakeForce: 2,initialDriveForce: 0.8,initialDriveGears: 6,initialDriveMaxFlatVel: 200,lowSpeedTractionLossMult: 1,steeringLock: 1.45,steeringLockRatio: 1,suspensionBiasFront: 1,suspensionBiasRear: 1,suspensionCompDamp: 0.11,suspensionForce: 2,suspensionLowerLimit: -0.15,suspensionRaise: 0,suspensionReboundDamp: 0.2,suspensionUpperLimit: 0.1}
}


const html = document.querySelector('div')
var table = document.createElement('table')
html.append(table)
for (const elem in doc) {

    var tdName = document.createElement('td')
    var Name = document.createElement('h2')
    Name.innerHTML = elem[0].toUpperCase() + elem.slice(1)
    tdName.appendChild(Name)

    var tdSlider = document.createElement('td')
    var slider = document.createElement('input')
    slider.className = "slider"
    slider.type = "range"
    slider.id = elem
    slider.min = doc[elem].min
    slider.max = doc[elem].max
    slider.step = doc[elem].step

    var show = document.createElement('h3')
    show.id = 'show' + elem
    
    tdSlider.appendChild(slider)
    tdSlider.appendChild(show)


    var tr = document.createElement('tr')
    tr.appendChild(tdName)
    tr.appendChild(tdSlider)

    table.appendChild(tr)

    doc[elem] = [document.getElementById(elem), document.getElementById("show" + elem)]

}



let nodeList = document.querySelectorAll("button")
buttonList = Array.prototype.slice.call(nodeList)

/*
function keydown(e) {
    if (e.key === 'Escape') {
        if ('alt' in window) {
            alt.emit('close:Webview');
        } else {
            console.log('Closing Window')
        }
    }
}
*/
var btn = []
var i = 0

for (var i = 0; i < buttonList.length; i++) {

    if (buttonList[i].addEventListener){
        buttonList[i].addEventListener("click", function(event){
            var btn = event.target || event.srcElement;
            btnSelector(btn.id, btn.name)
        })
    }
}

function btnSelector (action, name) {
    if (action == 'close') {
        alt.emit('close:Webview')
        return
    }

    if (action == 'reset') {
        alt.emit('handling:Set', 'reset')
    }

    if (action == 'drift') {
        alt.emit('handling:Set', presets['drift'])
    }
    
}




alt.on('handlingData', (data) => {
    if (!doc[data[0]]) return

    var val = data[1]
    const htmlInner = doc[data[0]]
    
    if (!Number.isInteger(val)) {
        if (val < 10) {
            val = val.toFixed(2)
        } else {
            val = parseInt(val)
        }
    }
    
    htmlInner[1].innerHTML = val
    htmlInner[0].value = val
    
})



for (const elem in doc) {
    doc[elem][1].innerHTML = doc[elem][0].value
    doc[elem][0].oninput = function() {
    doc[elem][1].innerHTML = this.value
    var handling = [elem, this.value]
    alt.emit('handling:Set', handling)
    }
}
