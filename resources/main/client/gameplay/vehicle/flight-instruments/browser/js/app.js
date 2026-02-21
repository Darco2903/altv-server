if (window.alt === undefined) {
    window.alt = {
        emit: () => {},
        on: () => {},
    };

    // window.addEventListener("load", (e) => {
    //     console.log(e.clientX, e.clientY);
    //     updateAccelerations({
    //         x: 1,
    //         y: 1,
    //         z: 1,
    //     });
    //     updateOrientations({
    //         y: 0,
    //     });
    // });
}

const HALF_PI = Math.PI / 2;
const KAPPA = 0.5522847498;
let radius_mul_kappa;

const GROUND_COLOR = "#72cde4";
const LINE_COLOR = "#ffffff";
const SKY_COLOR = "#323232";

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const engineSpan = document.querySelector("div#engine .unit");
const gearSpan = document.querySelector("div#gear .unit");
const speedSpan = document.querySelector("div#speed .value");
const altitudeSpan = document.querySelector("div#altitude .value");
const topImage = new Image();
topImage.src = "images/tool_320.png";

let diameter = 0;
let radius = 0;

let pitch = 0;
let roll = 0;

let horizon;
let aspectRatio = 0;

// let _rawRoll = 0;

let aX = 0;
let aY = 0;
let aZ = 0;
let rot = {
    x: 0,
    y: 0,
    z: 0,
};
let rotationCorrection = 0;

function draw() {
    aspectRatio = document.body.clientWidth / document.body.clientHeight;

    if (rotationCorrection !== 0 && rotationCorrection % HALF_PI == 0 && rotationCorrection / HALF_PI !== 1) {
        aspectRatio = document.body.clientHeight / document.body.clientWidth;
    }

    diameter = Math.min(canvas.width, canvas.height);
    radius = diameter / 2;

    radius_mul_kappa = radius * KAPPA;

    // calculate pitch and roll
    // roll = Math.atan2(aX, aY);
    // pitch = -Math.atan2(aZ, aX * Math.sin(roll) + aY * Math.cos(roll));

    // if (-rot.x > 0) {
    //     rot.y = rot.x;
    //     rot.x = -rot.y;
    // } else if (-rot.x <= 0) {
    //     rot.y = -rot.x;
    //     rot.x = rot.y;
    // } else {
    //     rot.x = -rot.x;
    // }

    // if (rot.x > 1) {
    //     rot.y = -1;
    // }

    roll = -rot.y;
    // roll = Math.atan2(rot.y, rot.x);

    pitch = rot.x;

    // calculate horizon
    horizon = getHorizon(pitch);

    // repaint
    repaint();

    requestAnimationFrame(draw);
}

function repaint() {
    context.save();

    context.translate(radius, radius);
    context.rotate(roll - rotationCorrection);

    context.fillStyle = GROUND_COLOR;
    context.strokeStyle = LINE_COLOR;
    context.lineWidth = 3;

    // draw ground
    context.beginPath();
    context.arc(0, 0, radius, 0, 2 * Math.PI, false);
    context.fill();

    context.fillStyle = SKY_COLOR;

    // draw sky
    context.beginPath();
    context.moveTo(-radius, 0);
    context.arcTo(0, -radius * 2, radius, 0, radius);
    context.bezierCurveTo(radius, horizon * KAPPA, radius_mul_kappa, horizon, 0, horizon);
    context.bezierCurveTo(-radius_mul_kappa, horizon, -radius, horizon * KAPPA, -radius, 0);
    context.closePath();
    context.stroke();
    context.fill();

    context.lineWidth = 2;

    // draw scale
    drawScale(36, radius * 0.8);
    drawScale(30, radius * 0.1);
    drawScale(24, radius * 0.6);
    drawScale(18, radius * 0.1);
    drawScale(12, radius * 0.4);
    drawScale(6, radius * 0.1);

    context.restore();
}

function drawScale(offset, scaleWidth) {
    context.save();

    context.beginPath();
    context.rect(-scaleWidth / 2, -diameter, scaleWidth, 2 * diameter);
    context.clip();

    horizon = getHorizon(pitch + (offset * Math.PI) / 180);
    context.beginPath();
    context.moveTo(radius, 0);
    context.bezierCurveTo(radius, horizon * KAPPA, radius_mul_kappa, horizon, 0, horizon);
    context.bezierCurveTo(-radius_mul_kappa, horizon, -radius, horizon * KAPPA, -radius, 0);
    context.stroke();

    horizon = getHorizon(pitch - (offset * Math.PI) / 180);
    context.beginPath();
    context.moveTo(radius, 0);
    context.bezierCurveTo(radius, horizon * KAPPA, radius_mul_kappa, horizon, 0, horizon);
    context.bezierCurveTo(-radius_mul_kappa, horizon, -radius, horizon * KAPPA, -radius, 0);
    context.stroke();

    context.restore();
}

function updateAccelerations(evt) {
    // if (!evt || !evt.accelerationIncludingGravity) {
    //     return;
    // }
    // const accelData = evt;
    // console.log(evt);
    // var accelData = evt.accelerationIncludingGravity;
    // var _aX = accelData.x;
    // var _aY = accelData.y;
    // var _aZ = accelData.z;
    // if (aspectRatio > 1 && _rawRoll > 0) {
    //     aX = _aY;
    //     aY = -_aX;
    // } else if (aspectRatio > 1 && _rawRoll <= 0) {
    //     aX = -_aY;
    //     aY = _aX;
    // } else {
    //     aX = _aX;
    //     aY = _aY;
    // }
    // aZ = _aZ;
}

// function updateOrientations(evt) {
//     if (!evt || evt.gamma == null) {
//         return;
//     }

//     _rawRoll = evt.gamma;

//     // _rawRoll = evt.y;
//     // console.log(_rawRoll);
// }

function getHorizon(pitch) {
    return Math.sin(pitch) * radius;
}

function drawRotationCorrectionButton() {
    var rotationCorrectButton = document.createElement("div");
    rotationCorrectButton.style.position = "fixed";
    rotationCorrectButton.style.display = "block";
    rotationCorrectButton.style.top = "10px";
    rotationCorrectButton.style.right = "10px";
    rotationCorrectButton.style.width = "32px";
    rotationCorrectButton.style.height = "32px";
    rotationCorrectButton.style.padding = "10px";
    rotationCorrectButton.textContent = "Rotate";
    rotationCorrectButton.style.backgroundImage = "url('images/rotate.png')";
    rotationCorrectButton.style.backgroundPosition = "center";
    rotationCorrectButton.style.backgroundRepeat = "no-repeat";
    rotationCorrectButton.style.border = "3px solid #030303";
    rotationCorrectButton.style.textIndent = "-9999px";

    rotationCorrectButton.addEventListener(
        "click",
        function (e) {
            rotationCorrection -= HALF_PI;
        },
        true
    );

    document.body.appendChild(rotationCorrectButton);
}

alt.on("updateHorizon", (r) => (rot = r));

alt.on("updateEngine", (state) => {
    engineSpan.setAttribute("state", state);
});

alt.on("updateGear", (gear) => {
    gearSpan.setAttribute("state", gear);
});

alt.on("updateSpeed", (speed) => {
    speedSpan.innerHTML = speed;
});

alt.on("updateAltitude", (altitude) => {
    altitudeSpan.innerHTML = altitude;
});

draw();
