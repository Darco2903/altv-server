if (window.alt === undefined) {
    window.alt = {
        emit: () => {},
        on: () => {},
    };
}

const container = document.getElementById("container");
const rpmShow = document.getElementById("rpmshow");
const speedDisplay = document.querySelector(".speeddisplay");
const gearDisplay = document.querySelector(".geardisplay");
const gearSpan = gearDisplay.querySelector("span");

const absDisplay = document.querySelector("#abs");
const tcDisplay = document.querySelector("#tc");
const escDisplay = document.querySelector("#esc");
const handbrakeDisplay = document.querySelector("#handbrake");
const speedControllerDisplay = document.querySelector("#speed-controller");
const speedControllerSpeed = document.querySelector("#speed-controller-speed");

function calcSpeed(speed) {
    if (speed >= 100) {
        let tmpSpeed = Math.floor(speed) + "";
        return (
            '<span class="int1">' +
            tmpSpeed.substring(0, 1) +
            '</span><span class="int2">' +
            tmpSpeed.substr(1, 1) +
            '</span><span class="int3">' +
            tmpSpeed.substr(2, 1) +
            "</span>"
        );
    } else if (speed >= 10 && speed < 100) {
        let tmpSpeed = Math.floor(speed) + "";
        return (
            '<span class="gray int1">0</span><span class="int2">' + tmpSpeed.substring(0, 1) + '</span><span class="int3">' + tmpSpeed.substr(1, 1) + "</span>"
        );
    } else if (speed > 0.1 && speed < 10) {
        return '<span class="gray int1">0</span><span class="gray int2">0</span><span class="int3">' + Math.floor(speed) + "</span>";
    } else {
        return '<span class="gray int1">0</span><span class="gray int2">0</span><span class="gray int3">0</span>';
    }
}

let s_Rpm;
let o_rpm;
let IsOverLoad;
let OverLoadRPM;
function calcGear(gear, rpm) {
    if (gear == -1) {
        gearSpan.innerHTML = "N";
        gearDisplay.setAttribute("gear", "neutral");
    } else if (gear == 0) {
        gearSpan.innerHTML = "R";
        gearDisplay.setAttribute("gear", "reverse");
    } else {
        gearSpan.innerHTML = gear;
        gearDisplay.removeAttribute("gear");
    }
    if (rpm > 7.5) gearDisplay.setAttribute("redline", "");
    else gearDisplay.removeAttribute("redline");
}

/**
 * @param {HTMLElement} dashboardElem
 * @param {boolean} state
 */
function setDashboardLightEnable(dashboardElem, state) {
    if (state !== dashboardElem.hasAttribute("disabled")) return;
    if (state) dashboardElem.removeAttribute("disabled");
    else dashboardElem.setAttribute("disabled", "");
}

/**
 * @param {HTMLElement} dashboardElem
 * @param {boolean} active
 */
function setDashboardLightActive(dashboardElem, active) {
    if (active === dashboardElem.hasAttribute("glowing")) return;
    if (active) dashboardElem.setAttribute("glowing", "");
    else dashboardElem.removeAttribute("glowing");
}

alt.on("updateHUD", (data) => {
    rpmShow.setAttribute("data-value", data.rpm);
    speedDisplay.innerHTML = calcSpeed(data.speed);
    calcGear(data.gear, data.rpm);
    setDashboardLightActive(handbrakeDisplay, data.handbrake);
});

alt.on("abs:enable", (state) => {
    setDashboardLightEnable(absDisplay, state);
});

alt.on("abs:active", (active) => {
    setDashboardLightActive(absDisplay, active);
});

alt.on("esc:enable", (state) => {
    setDashboardLightEnable(escDisplay, state);
});

alt.on("esc:active", (active) => {
    setDashboardLightActive(escDisplay, active);
});

alt.on("tc:enable", (state) => {
    setDashboardLightEnable(tcDisplay, state);
});

alt.on("tc:active", (active) => {
    setDashboardLightActive(tcDisplay, active);
});

alt.on("speedController:enable", (state) => {
    setDashboardLightEnable(speedControllerDisplay, state);
    setDashboardLightEnable(speedControllerSpeed, state);
});

alt.on("speedController:active", (active) => {
    setDashboardLightActive(speedControllerDisplay, active);
    setDashboardLightEnable(speedControllerSpeed, active);
});

let speedControllerSpeedTimeout;
alt.on("speedController:speed", (speed) => {
    speedControllerSpeed.innerHTML = speed;
    speedControllerSpeed.setAttribute("display", "");
    if (speedControllerSpeedTimeout) clearTimeout(speedControllerSpeedTimeout);
    speedControllerSpeedTimeout = setTimeout(() => {
        speedControllerSpeed.removeAttribute("display");
        speedControllerSpeedTimeout = null;
    }, 1000);
});
