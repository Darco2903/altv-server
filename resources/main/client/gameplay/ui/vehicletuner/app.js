import colors from "./data/colors.json" assert { type: "json" };
import lightColors from "./data/lightColors.json" assert { type: "json" };
import serverColors from "./data/serverColors.json" assert { type: "json" };

if (window.alt === undefined) {
    window.alt = {
        emit: () => {},
        on: () => {},
    };
}

document.querySelectorAll("input[type=range]").forEach((slider) => {
    slider.addEventListener("focusout", async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
        if (document.activeElement === document.body) {
            slider.focus();
        }
    });
});

const tuneCategoryButtons = document.querySelectorAll("#tune-category button");
tuneCategoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
        document.querySelector("#tune-category > button[selected]")?.removeAttribute("selected");
        button.toggleAttribute("selected");
        document.querySelector("#tune-content > div[selected]")?.removeAttribute("selected");
        document.querySelector(`#tune-content #${button.id}`).toggleAttribute("selected");
    });
});

const optionButtons = document.querySelectorAll("#options button");
optionButtons.forEach((button) => {
    button.addEventListener("click", () => {
        alt.emit(`vehicletuner:option:${button.id}`);
    });
});

////    mods    ////

// slider init
const modList = document.querySelectorAll("#mods > div");
modList.forEach((modDiv) => {
    const counter = modDiv.querySelector(".mod-counter");
    const slider = modDiv.querySelector("input[type=range]");
    const id = parseInt(slider?.dataset.type);
    slider?.addEventListener("input", () => {
        const num = parseInt(slider.value);
        counter.innerHTML = num;
        alt.emit("vehicletuner:mod", id, num - 1);
    });
});

const modCheckboxList = document.querySelectorAll("#mods > div input[type=checkbox]");
modCheckboxList.forEach((checkbox) => {
    const id = parseInt(checkbox.dataset.type);
    checkbox.addEventListener("change", () => {
        alt.emit("vehicletuner:mod:toggle", id, checkbox.checked);
    });
});

// functions
/**
 * @param {number} n Mod number
 * @param {boolean} state Selected state
 */
function toggleMod(n, state) {
    const modDiv = document.querySelector(`#mod-n${n}`);
    if (modDiv?.hasAttribute("selected") !== state) {
        modDiv?.toggleAttribute("selected");
    }
}

/**
 * @param {number} n Mod number
 * @param {number} num Mod index
 * @param {number} max Number of mods
 */
function updateMod(n, num, max) {
    const input = document.querySelector(`#mod-n${n} input`);
    if (!input) return;
    else if (input.getAttribute("type") === "range") {
        input.max = max;
        input.value = num + 1;
    } else if (input.getAttribute("type") === "checkbox") {
        input.checked = num;
    }
    input.dispatchEvent(new Event("input"));
}

////////////////////

////    colors    ////

const primarySelect = document.querySelector("#color-primary select");
const primaryLabel = document.querySelector("#color-primary .color-name");
const primarySliders = Array.from(document.querySelectorAll("#color-primary input"));

const secondarySelect = document.querySelector("#color-secondary select");
const secondaryLabel = document.querySelector("#color-secondary .color-name");
const secondarySliders = Array.from(document.querySelectorAll("#color-secondary input"));

const pearlLabel = document.querySelector("#color-pearlescent .color-name");
const pearlSlider = document.querySelector("#color-pearlescent input");

primarySelect.addEventListener("change", () => {
    primarySliders.find((slider) => primarySelect.value === slider.dataset.type).dispatchEvent(new Event("input"));
});

secondarySelect.addEventListener("change", () => {
    secondarySliders.find((slider) => secondarySelect.value === slider.dataset.type).dispatchEvent(new Event("input"));
});

// slider init
primarySliders.forEach((slider) => {
    slider.addEventListener("input", () => {
        const type = parseInt(slider.dataset.type);
        const num = parseInt(slider.value);
        const pearl = parseInt(pearlSlider.value);
        primaryLabel.innerHTML = colors[type].colors[num].name;
        alt.emit("vehicletuner:color1", type, num, pearl);
    });
});

secondarySliders.forEach((slider) => {
    slider.addEventListener("input", () => {
        const type = parseInt(slider.dataset.type);
        const num = parseInt(slider.value);
        secondaryLabel.innerHTML = colors[type].colors[num].name;
        alt.emit("vehicletuner:color2", type, num);
    });
});

pearlSlider.addEventListener("input", () => {
    pearlLabel.innerHTML = colors[2].pearlColors[pearlSlider.value].name;
    primarySliders.find((slider) => primarySelect.value === slider.dataset.type).dispatchEvent(new Event("input"));
});
////////////////////

////    wheels    ////

// select init
const wheelSelect = document.querySelector("#wheels-type select");
const wheelTireColorSelect = document.querySelector("#wheels-tirecolor select");
const wheelTireBrandSelect = document.querySelector("#wheels-tirebrand select");

const wheelModelSliders = document.querySelectorAll("#wheels-model input[type=range]");
const wheelModelCounter = document.querySelector("#wheels-model .wheel-counter");
const wheelColorSlider = document.querySelector("#wheels-color input[type=range]");
const wheelColorLabel = document.querySelector("#wheels-color .color-name");
const wheelDriftCheckbox = document.querySelector("#wheels-drift input[type=checkbox]");

wheelSelect.addEventListener("change", () => {
    document.querySelector(`#wheels-model [data-type="${wheelSelect.value}"]`).dispatchEvent(new Event("input"));
});

wheelTireColorSelect.addEventListener("change", () => {
    document.querySelector(`#wheels-model [data-type="${wheelSelect.value}"]`).dispatchEvent(new Event("input"));
});

wheelTireBrandSelect.addEventListener("change", () => {
    document.querySelector(`#wheels-model [data-type="${wheelSelect.value}"]`).dispatchEvent(new Event("input"));
});

wheelDriftCheckbox.addEventListener("change", () => {
    alt.emit("vehicletuner:wheel:drift", wheelDriftCheckbox.checked);
});

// slider init

wheelModelSliders.forEach((slider) => {
    slider.addEventListener("input", () => {
        wheelModelCounter.innerHTML = slider.value;
        const type = parseInt(slider.dataset.type);
        let num = parseInt(slider.value);
        const sliderMax = parseInt(slider.max) + 1;

        if ([8, 9].includes(type)) {
            num += wheelTireColorSelect.value * sliderMax;
        } else if ([10, 11, 12].includes(type)) {
            num += wheelTireBrandSelect.value * sliderMax;
        }
        alt.emit("vehicletuner:wheel", type, num);
    });
});

wheelColorSlider.addEventListener("input", () => {
    const color = parseInt(wheelColorSlider.value);
    wheelColorLabel.innerHTML = serverColors[color].name;
    alt.emit("vehicletuner:wheel:color", parseInt(color));
});

const wheelTrack = document.querySelectorAll("#wheels-track > div");
wheelTrack.forEach((track) => {
    const counter = track.querySelector(".mod-counter");
    const slider = track.querySelector("input[type=range]");
    const wheelsIndexes = JSON.parse(slider.dataset.ids);
    slider.addEventListener("input", () => {
        counter.innerHTML = slider.value;
        wheelsIndexes.forEach((wheelIndex) => {
            alt.emit("vehicletuner:wheel:trackWidth", wheelIndex, parseFloat(slider.value));
        });
    });
});

const wheelCamber = document.querySelectorAll("#wheels-camber > div");
wheelCamber.forEach((camber) => {
    const counter = camber.querySelector(".mod-counter");
    const slider = camber.querySelector("input[type=range]");
    const wheelsIndexes = JSON.parse(slider.dataset.ids);
    slider.addEventListener("input", () => {
        counter.innerHTML = slider.value;
        wheelsIndexes.forEach((wheelIndex) => {
            alt.emit("vehicletuner:wheel:camber", wheelIndex, parseFloat(slider.value));
        });
    });
});

////////////////////

////    lights    ////

// checkbox init
const neonAll = document.querySelector(".neon-select#neon-all input[type=checkbox]");
const neonList = Array.from(document.querySelectorAll(".neon-select:not(#neon-all) input[type=checkbox]"));

neonAll.addEventListener("change", () => {
    neonList.forEach((neonCheckbox) => {
        neonCheckbox.checked = neonAll.checked;
        alt.emit("vehicletuner:neon:state:all", neonCheckbox.checked);
    });
});

neonList.forEach((neonCheckbox) => {
    neonCheckbox.addEventListener("change", () => {
        neonAll.checked = neonList.every((nc) => nc.checked);
        alt.emit("vehicletuner:neon:state", parseInt(neonCheckbox.dataset.index), neonCheckbox.checked);
    });
});

const neonColor = document.querySelector("#neons-color input[type=color]");
neonColor.addEventListener("input", () => {
    const hex = neonColor.value.replace("#", "");
    const color = {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16),
    };
    alt.emit("vehicletuner:neon:color", color);
});

const xenonCheckbox = document.querySelector("#xenons-state input[type=checkbox]");
xenonCheckbox.addEventListener("change", () => {
    alt.emit("vehicletuner:xenon:state", xenonCheckbox.checked);
});

const xenonColor = document.querySelector("#xenons-color input[type=range]");
const xenonColorLabel = document.querySelector("#xenons-color .color-name");
xenonColor.addEventListener("input", () => {
    const color = parseInt(xenonColor.value);
    xenonColorLabel.innerHTML = lightColors[color]?.name ?? "Default";
    alt.emit("vehicletuner:xenon:color", color);
});

////////////////////

////    plate    ////

const plateSelect = document.querySelector("#plate-type select");
const plateText = document.querySelector("#plate-text input");

plateSelect.addEventListener("change", () => {
    alt.emit("vehicletuner:plate:type", parseInt(plateSelect.value));
});

plateText.addEventListener("input", () => {
    alt.emit("vehicletuner:plate:text", plateText.value);
});

////////////////////

alt.on("vehicletuner:mod:reset", () => {
    for (let i = 0; i < 50; i++) {
        toggleMod(i, false);
    }
});

alt.on("vehicletuner:mod:select", (n, mod, num) => {
    toggleMod(n, true);
    updateMod(n, mod, num);
});

alt.on("vehicletuner:color1", (type, num, pearl) => {
    if (type !== 7 || num !== -1 || pearl !== -1) {
        primarySelect.value = type;
        const slider = primarySliders.find((slider) => primarySelect.value === slider.dataset.type);
        slider.value = num;
        pearlSlider.value = pearl;
        pearlSlider.dispatchEvent(new Event("input"));
    }
});

alt.on("vehicletuner:color2", (type, num) => {
    if (type !== 7 || num !== -1) {
        secondarySelect.value = type;
        const slider = secondarySliders.find((slider) => secondarySelect.value === slider.dataset.type);
        slider.value = num;
        slider.dispatchEvent(new Event("input"));
    }
});

alt.on("vehicletuner:wheel", (type, num) => {
    if (num === -1) {
        type = -1;
    }

    const slider = document.querySelector(`#wheels-model input[data-type="${type}"]`);
    const sliderMax = parseInt(slider.max) + 1;
    if ([8, 9].includes(type)) {
        wheelTireColorSelect.value = Math.floor(num / sliderMax);
    } else if ([10, 11, 12].includes(type)) {
        wheelTireBrandSelect.value = Math.floor(num / sliderMax);
    }
    slider.value = num % sliderMax;
    wheelSelect.value = type;
    slider.dispatchEvent(new Event("input"));
});

alt.on("vehicletuner:wheel:color", (color) => {
    wheelColorSlider.value = color;
    wheelColorSlider.dispatchEvent(new Event("input"));
});

alt.on("vehicletuner:wheel:drift", (state) => {
    wheelDriftCheckbox.checked = state;
});

alt.on("vehicletuner:wheel:trackWidth", (trackWidth) => {
    const trackWidthFront = document.querySelector("#wheels-trackwidth-front input");
    const trackWidthRear = document.querySelector("#wheels-trackwidth-rear input");
    trackWidthFront.value = trackWidth[0];
    trackWidthRear.value = trackWidth[1];
    trackWidthFront.dispatchEvent(new Event("input"));
    trackWidthRear.dispatchEvent(new Event("input"));
});

alt.on("vehicletuner:wheel:camber", (camber) => {
    const camberFront = document.querySelector("#wheels-camber-front input");
    const camberRear = document.querySelector("#wheels-camber-rear input");
    camberFront.value = camber[0];
    camberRear.value = camber[1];
    camberFront.dispatchEvent(new Event("input"));
    camberRear.dispatchEvent(new Event("input"));
});

alt.on("vehicletuner:neon:state", (n, state) => {
    const neonCheckbox = document.querySelector(`.neon-select input[data-index="${n}"]`);
    neonCheckbox.checked = state;
    neonCheckbox.dispatchEvent(new Event("change"));
});

alt.on("vehicletuner:neon:color", (color) => {
    const hex = "#" + ((1 << 24) + (color.r << 16) + (color.g << 8) + color.b).toString(16).slice(1);
    const neonColor = document.querySelector("#neons-color input[type=color]");
    neonColor.value = hex;
});

alt.on("vehicletuner:xenon:state", (state) => {
    const xenonCheckbox = document.querySelector("#xenons-state input[type=checkbox]");
    xenonCheckbox.checked = state;
    xenonCheckbox.dispatchEvent(new Event("change"));
});

alt.on("vehicletuner:xenon:color", (color) => {
    const xenonColor = document.querySelector("#xenons-color input[type=range]");
    xenonColor.value = color;
    xenonColor.dispatchEvent(new Event("input"));
});

alt.on("vehicletuner:plate:type", (type) => {
    plateSelect.value = type;
});

alt.on("vehicletuner:plate:text", (text) => {
    plateText.value = text;
});
