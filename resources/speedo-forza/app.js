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

function calcSpeed(speed) {
    if (speed >= 100) {
        let tmpSpeed = Math.floor(speed) + "";
        return '<span class="int1">' + tmpSpeed.substring(0, 1) + '</span><span class="int2">' + tmpSpeed.substr(1, 1) + '</span><span class="int3">' + tmpSpeed.substr(2, 1) + "</span>";
    } else if (speed >= 10 && speed < 100) {
        let tmpSpeed = Math.floor(speed) + "";
        return '<span class="gray int1">0</span><span class="int2">' + tmpSpeed.substring(0, 1) + '</span><span class="int3">' + tmpSpeed.substr(1, 1) + "</span>";
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
    if (gear == 0) {
        gearSpan.innerHTML = "R";
        gearDisplay.setAttribute("style", "color: #FFF;border-color:#FFF;");
    } else {
        gearSpan.innerHTML = gear;
        if (rpm > 7.5) gearDisplay.setAttribute("style", "color: rgb(235,30,76);border-color:rgb(235,30,76);");
        else gearDisplay.removeAttribute("style");

        /*
        if (rpm >= 9) {
            IsOverLoad = true;
            if (OverLoadRPM) {
                // rpm = 9;
                s_Rpm = 9;
                OverLoadRPM = false;
            } else {
                let tempRandom = Math.random();
                // rpm = 8 + tempRandom;
                s_Rpm = 8 + tempRandom;
                OverLoadRPM = true;
            }
        } else {
            IsOverLoad = false;
        }

        if (o_rpm != s_Rpm || IsOverLoad) {
            if (o_rpm - s_Rpm > 0.1 || s_Rpm - o_rpm > 0.1 || IsOverLoad) {
                if (!hasFilter) {
                    if (s_Rpm > o_rpm) {
                        if (s_Acceleration) {
                            rpmShow.style.filter = "url(#blur3)";
                            // $("#rpmshow").css("filter", "url(#blur3)");
                        } else {
                            rpmShow.style.filter = "url(#blur2)";
                            // $("#rpmshow").css("filter", "url(#blur2)");
                        }
                    } else {
                        if (s_Acceleration) {
                            rpmShow.style.filter = "url(#blur3)";
                            // $("#rpmshow").css("filter", "url(#blur3)");
                        } else {
                            console.log(rpmShow);
                            console.log(rpmShow.style);
                            rpmShow.style.filter = "url(#blur2)";
                            // $("#rpmshow").css("filter", "url(#blur2)");
                        }
                    }
                    rpmShow.style.filter = "url(#blur2)";
                    // $("#rpmshow").css('filter', 'url(#blur2)');
                    hasFilter = true;
                }
            } else {
                if (hasFilter) {
                    rpmShow.style.filter = "drop-shadow(0px 0px 4px rgba(0,0,0,0.1))";
                    // $("#rpmshow").css("filter", "drop-shadow(0px 0px 4px rgba(0,0,0,0.1))");
                    hasFilter = false;
                }
            }
            o_rpm = s_Rpm;
        } else {
            if (hasFilter) {
                rpmShow.style.filter = "drop-shadow(0px 0px 4px rgba(0,0,0,0.1))";
                // $("#rpmshow").css("filter", "drop-shadow(0px 0px 4px rgba(0,0,0,0.1))");
                hasFilter = false;
            }
        }
        */
    }
}
const absDisplay = document.querySelector(".abs");
function setAbs(state) {
    if (state) {
        absDisplay.innerHTML = "ABS";
        // $(".abs").html("ABS");
    } else {
        absDisplay.innerHTML = '<span class="gray">ABS</span>';
        // $(".abs").html('<span class="gray">ABS</span>');
    }
}

class Icon {
    /**
     * Creating a icon with the given params.
     * @param {number} offsetX Offset in px from center of circle by x-coordinate.
     * @param {number} offsetY Offset in px from center of circle by y-coordinate.
     * @param {number} spritePosX Position of icon in px in icons sprite by x-coordinate.
     * @param {number} spritePosY Position of icon in px in icons sprite by y-coordinate.
     * @param {number} width Width of icon.
     * @param {number} height Height of icon.
     * @param {2|3} states States of icon. There are only 3: 1 - Off, 2 - warning, 3 - critical/on. If 2, then only off and on.
     */
    constructor(offsetX, offsetY, spritePosX, spritePosY, width, height, states) {
        this.offset = {
            x: offsetX,
            y: offsetY,
        };
        this.position = {
            x: spritePosX,
            y: spritePosY,
        };
        this.dimensions = {
            width: width,
            height: height,
        };
        this.states = states;
    }
}

const speedoCanvas = document.querySelector("canvas");
const ctx = speedoCanvas.getContext("2d");
// console.log(handbrakeDisplay);
let handbrakeIcon = new Icon(-80, 47.5, 10, 150 * 1 + 10 * 2, 17.5, 17.5, 2);
const state = 2;

// ctx.fillStyle = "blue";
// ctx.fillRect(0, 0, speedoCanvas.width, speedoCanvas.height);

// if (state > handbrakeIcon[state]) {
//     throw `${handbrakeIcon} has unknown icon state.`;
// }

// if (state === 1 && handbrakeIcon.states === 2) {
//     state += 1;
// }

let handbrakeState;
function setHandBrake(state) {
    if (handbrakeState == state) return;
    handbrakeState = state;
    console.log("hanbrake");
    ctx.clearRect(0, 0, speedoCanvas.width, speedoCanvas.height);
    ctx.save();
    ctx.translate(185, 65);
    ctx.drawImage(
        document.getElementById("svg"),
        handbrakeIcon.position.x + 150 * state + 10 * state,
        handbrakeIcon.position.y,
        150,
        150,
        -handbrakeIcon.dimensions.width / 2 + handbrakeIcon.offset.x,
        -handbrakeIcon.dimensions.height / 2 + handbrakeIcon.offset.y,
        handbrakeIcon.dimensions.width + 3,
        handbrakeIcon.dimensions.height + 3
    );
    ctx.restore();
}

alt.on("updateHUD", (data) => {
    rpmShow.setAttribute("data-value", data.rpm);
    speedDisplay.innerHTML = calcSpeed(data.speed);
    calcGear(data.gear, data.rpm);
    // console.log(data.abs);
    setAbs(data.abs);
    setHandBrake(data.handbrake);
});

///////////////////////////////
/*
window.addEventListener("message", function (event) {
    var item = event.data;

    if (item.ShowHud) {
        inVehicle = true;
        s_PlayerID = item.PlayerID;
        s_Rpm = item.CurrentCarRPM;
        s_Speed = item.CurrentCarSpeed;
        s_Kmh = item.CurrentCarKmh;
        s_Mph = item.CurrentCarMph;
        s_Gear = item.CurrentCarGear;
        s_IL = item.CurrentCarIL;
        s_Acceleration = item.CurrentCarAcceleration;
        s_Handbrake = item.CurrentCarHandbrake;
        s_ABS = item.CurrentCarABS;
        s_LS_r = item.CurrentCarLS_r;
        s_LS_o = item.CurrentCarLS_o;
        s_LS_h = item.CurrentCarLS_h;
        CalcSpeed = s_Kmh;
        CalcRpm = s_Rpm * 9;

        if (CalcSpeed > 999) {
            CalcSpeed = 999;
        }

        // Vehicle Gear display
        if (s_Gear == 0) {
            $(".geardisplay span").html("R");
            $(".geardisplay").attr("style", "color: #FFF;border-color:#FFF;");
        } else {
            $(".geardisplay span").html(s_Gear);
            if (CalcRpm > 7.5) {
                $(".geardisplay").attr("style", "color: rgb(235,30,76);border-color:rgb(235,30,76);");
            } else {
                $(".geardisplay").removeAttr("style");
            }
            if (CalcRpm >= 9) {
                IsOverLoad = true;
                if (OverLoadRPM) {
                    CalcRpm = 9;
                    s_Rpm = 9;
                    OverLoadRPM = false;
                } else {
                    var tempRandom = Math.random();
                    CalcRpm = 8 + tempRandom;
                    s_Rpm = 8 + tempRandom;
                    OverLoadRPM = true;
                }
            } else {
                IsOverLoad = false;
            }
        }

        // Vehicle RPM display
        $("#rpmshow").attr("data-value", CalcRpm.toFixed(2));

        // Vehicle speed display
        if (CalcSpeed >= 100) {
            var tmpSpeed = Math.floor(CalcSpeed) + "";
            speedText = '<span class="int1">' + tmpSpeed.substr(0, 1) + '</span><span class="int2">' + tmpSpeed.substr(1, 1) + '</span><span class="int3">' + tmpSpeed.substr(2, 1) + "</span>";
        } else if (CalcSpeed >= 10 && CalcSpeed < 100) {
            var tmpSpeed = Math.floor(CalcSpeed) + "";
            speedText = '<span class="gray int1">0</span><span class="int2">' + tmpSpeed.substr(0, 1) + '</span><span class="int3">' + tmpSpeed.substr(1, 1) + "</span>";
        } else if (CalcSpeed > 0 && CalcSpeed < 10) {
            speedText = '<span class="gray int1">0</span><span class="gray int2">0</span><span class="int3">' + Math.floor(CalcSpeed) + "</span>";
        } else {
            speedText = '<span class="gray int1">0</span><span class="gray int2">0</span><span class="gray int3">0</span>';
        }

        // Handbrake
        if (s_Handbrake) {
            $(".handbrake").html("HBK");
        } else {
            $(".handbrake").html('<span class="gray">HBK</span>');
        }

        // Brake ABS
        if (s_ABS) {
            $(".abs").html("ABS");
        } else {
            $(".abs").html('<span class="gray">ABS</span>');
        }

        // Display speed and container
        $(".speeddisplay").html(speedText);
        $("#container").fadeIn(500);
    } else if (item.HideHud) {
        // Hide GUI
        $("#container").fadeOut(500);
        inVehicle = false;
    }
});
*/

// let hasFilter;
// let s_Acceleration;
/*
setInterval(function () {
    if (o_rpm != s_Rpm || IsOverLoad) {
        if (o_rpm - s_Rpm > 0.1 || s_Rpm - o_rpm > 0.1 || IsOverLoad) {
            if (!hasFilter) {
                if (s_Rpm > o_rpm) {
                    if (s_Acceleration) {
                        rpmShow.style.filter = "url(#blur3)";
                        // $("#rpmshow").css("filter", "url(#blur3)");
                    } else {
                        rpmShow.style.filter = "url(#blur2)";
                        // $("#rpmshow").css("filter", "url(#blur2)");
                    }
                } else {
                    if (s_Acceleration) {
                        rpmShow.style.filter = "url(#blur3)";
                        // $("#rpmshow").css("filter", "url(#blur3)");
                    } else {
                        console.log(rpmShow);
                        console.log(rpmShow.style);
                        rpmShow.style.filter = "url(#blur2)";
                        // $("#rpmshow").css("filter", "url(#blur2)");
                    }
                }
                rpmShow.style.filter = "url(#blur2)";
                // $("#rpmshow").css('filter', 'url(#blur2)');
                hasFilter = true;
            }
        } else {
            if (hasFilter) {
                rpmShow.style.filter = "drop-shadow(0px 0px 4px rgba(0,0,0,0.1))";
                // $("#rpmshow").css("filter", "drop-shadow(0px 0px 4px rgba(0,0,0,0.1))");
                hasFilter = false;
            }
        }
        o_rpm = s_Rpm;
    } else {
        if (hasFilter) {
            rpmShow.style.filter = "drop-shadow(0px 0px 4px rgba(0,0,0,0.1))";
            // $("#rpmshow").css("filter", "drop-shadow(0px 0px 4px rgba(0,0,0,0.1))");
            hasFilter = false;
        }
    }
}, 100);
*/
