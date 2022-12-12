
let speed = 0;
let tacho = 0;
let gas = 1;
let mileage = 0;
let speedStep = 30

let turnSignalsStates = {
    'left':  false,
    'right': false
}

let iconsStates = {
    // main circle
    'dippedBeam': 0,
    'brake':      0,
    'drift':      0,
    'highBeam':   0,
    'lock':       0,
    'seatBelt':   0,
    'engineTemp': 0,
    'stab':       0,
    'abs':        0,
    // right circle
    'gas':        0,
    'trunk':      0,
    'bonnet':     0,
    'doors':      0,
    // left circle
    'battery':    0,
    'oil':        0,
    'engineFail': 0
}

function redraw() {
    draw(speed, tacho, gas, mileage, turnSignalsStates, iconsStates, speedStep);
}
let speedo = document.getElementById("speedometer")
alt.on("showSpeedo", enable => {
    if (enable)
        speedo.removeAttribute("hidden")
    else
        speedo.setAttribute("hidden", null)
})

alt.on("stepUpdate", (step) => {
    speedStep = step
})

alt.on("speedoUpdate", (data) => {
    speed = data.speed
    tacho = data.tacho
    redraw()
})

alt.on("speedoUpdateOptions", (data) => {
    iconsStates = data
    redraw()
})

alt.on("kmAge", (kmAge) => {
    mileage = kmAge
})

redraw()