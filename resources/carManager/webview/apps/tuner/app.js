import colors from "./data/colors.json" assert { type: "json" };
import modList from "./data/modList.json" assert { type: "json" };
import plateList from "./data/plateList.json" assert { type: "json" };
// import serverColors from "./data/serverColors.json" assert { type: "json" };
// import tireBrand from "./data/tireBrand.json" assert { type: "json" };
// import tireColor from "./data/tireColor.json" assert { type: "json" };
import wheelTypeList from "./data/wheelTypeList.json" assert { type: "json" };
import windowTints from "./data/windowTints.json" assert { type: "json" };
import xenonColors from "./data/xenonColors.json" assert { type: "json" };

let appLoaded;

let htmlGenerated = document.querySelector("generated");
const nodeList = document.querySelectorAll("button");
const buttonList = Array.prototype.slice.call(nodeList);
const lookSide = document.getElementById("lookSide");
const lookHeight = document.getElementById("lookHeight");

if (window.alt === undefined) {
    window.alt = {
        emit: () => {},
        on: () => {},
    };
}

for (const button of buttonList) {
    button.onclick = function () {
        const id = button.id;
        switch (id) {
            case "stock":
            case "restore":
                alt.emit(id, appLoaded);
                break;

            default:
                alt.emit("startApp", id);
                break;
        }
    };
}

[lookSide, lookHeight].forEach((look) => {
    look.oninput = function () {
        alt.emit("look", parseFloat(lookSide.value), -parseFloat(lookHeight.value));
    };
});

alt.on("lookUpdate", (side, height) => {
    lookSide.value = side;
    lookHeight.value = height;
});

alt.on("app", appManager);

function appManager(app, data) {
    //  const [app, data] = res;
    //  if (app == appLoaded) return
    htmlGenerated.replaceChildren();
    appLoaded = null;
    for (const but of buttonList) but.className = "unselected";
    document.getElementById(app).className = "selected";
    switch (app) {
        case "mods":
            initMods(data);
            break;

        case "colors":
            initColors(data);
            break;

        case "wheels":
            initWheels(data);
            break;

        case "neons":
            initNeons(data);
            break;

        case "plate":
            initPlate(data);
            break;

        default:
            break;
    }
}

let divSlider = document.getElementById("divSlider");
let labelCheckbox = document.getElementById("labelCheckbox");

function createSlider(value, max, min, step) {
    let div = divSlider.cloneNode(true);
    //  div.removeAttribute("hidden");
    let slider = div.childNodes[1];
    slider.min = min || 0;
    slider.max = max;
    slider.value = value;
    slider.step = step || 1;
    if (slider.min == 0) {
        updateSliderFill(slider);
        slider.addEventListener("change", () => updateSliderFill(slider));
        slider.addEventListener("mousemove", () => updateSliderFill(slider));
    } else slider.style.background = "rgba(0, 0, 0, 0.25)";
    return [div, slider];
}

//  function createShow (value) {
//      lethtmlShowDiv = document.createElement("")
//      let htmlShow = document.createElement('strong')
//      htmlShow.className = "show"
//      htmlShow.innerHTML = value
//  }

function updateSliderFill(slider) {
    let x = (slider.value / slider.max) * 100;
    let color = "linear-gradient(90deg, rgb(223, 200, 0)" + x + "%, rgba(0, 0, 0, 0.25)" + x + "%)";
    slider.style.background = color;
}

function createCheckbox(value) {
    let label = labelCheckbox.cloneNode(true);
    //  label.removeAttribute("hidden");
    let checkbox = label.childNodes[1];
    checkbox.checked = value;
    return [label, checkbox];
}

function createSeparator() {
    let htmlSeparator = document.createElement("separator");
    let separator = document.createElement("strong");
    htmlSeparator.append(separator);
    htmlGenerated.append(htmlSeparator);
}

function initMods(modsData) {
    appLoaded = "mods";
    Object.entries(modsData).forEach(([modType, { count, name, num }]) => {
        modType = parseInt(modType);
        name = name ? name : modList[modType];

        const htmlMod = document.createElement("mod");
        const htmlName = document.createElement("strong");
        htmlName.className = "name";
        htmlName.innerHTML = name;
        htmlMod.append(htmlName);

        switch (modType) {
            //  case 17:
            case 18: //  Turbo
                //  case 19:
                //  case 20:
                //  case 21:
                //  case 22:
                const [label, checkbox] = createCheckbox(!!num);
                checkbox.onchange = function () {
                    const modId = checkbox.checked;
                    alt.emit("toogleMod", modType, modId);
                };
                htmlMod.append(label);
                break;

            default:
                num++;
                const [htmlSliderDiv, htmlSlider] = createSlider(num, count);
                const htmlShow = document.createElement("strong");
                htmlShow.className = "show";
                htmlShow.innerHTML = num;

                htmlSlider.oninput = function () {
                    htmlShow.innerHTML = this.value;
                    alt.emit("setMod", modType, parseInt(this.value) - 1);
                    //  alt.emit("camPos", name.toLowerCase());
                };
                htmlMod.append(htmlSliderDiv, htmlShow);
                break;
        }
        htmlGenerated.append(htmlMod);
    });
}

///////////////////////////////////////////////////////////////////////////

function initWheels({ type, num, color, drift /* TEST , camber, track: [trackFront, trackRear] */ }) {
    appLoaded = "wheels";
    num++;

    function emitWheels() {
        alt.emit("setWheels", { type, num: (num === 0 ? num : num + extra) - 1, color, drift /* TEST , camber, track: [trackFront, trackRear] */ });
    }

    let range = wheelTypeList[type].range;
    let brand = Math.floor(num / wheelTypeList[type].range);
    let extra = range * brand;
    num = num % range;

    let htmlWheelType = document.createElement("wheel");
    let htmlNameType = document.createElement("strong");
    htmlNameType.innerHTML = "Type";
    let htmlSelectorWheelType = document.createElement("select");

    wheelTypeList.forEach((type, index) => {
        const option = new Option(type.name, index, false, index == type);
        htmlSelectorWheelType.options.add(option);
    });

    let htmlWheelNum = document.createElement("wheel");
    let htmlNameNum = document.createElement("strong");
    htmlNameNum.innerHTML = "Num";
    let [htmlSliderNumDiv, htmlSliderNum] = createSlider(num, wheelTypeList[type].range);
    let htmlShowNum = document.createElement("strong");
    htmlShowNum.className = "show";
    htmlShowNum.innerHTML = origine();

    let htmlWheelColor = document.createElement("wheel");
    let htmlNameColor = document.createElement("strong");
    htmlNameColor.innerHTML = "Couleur";
    let [htmlSliderColorDiv, htmlSliderColor] = createSlider(color, 160);
    let htmlShowColor = document.createElement("strong");
    htmlShowColor.className = "show";
    htmlShowColor.innerHTML = color;

    htmlSelectorWheelType.onchange = function () {
        type = parseInt(this.value);
        const max = wheelTypeList[type].range;
        if (htmlSliderNum.value > max) {
            htmlSliderNum.value = max;
            htmlShowNum.innerHTML = max;
            num = max;
        }
        htmlSliderNum.max = max;
        updateSliderFill(htmlSliderNum);
        setExtra();
        emitWheels();
    };

    htmlSliderNum.oninput = function () {
        num = parseInt(this.value);
        if (num === 0) setOrigine();
        htmlShowNum.innerHTML = origine();
        emitWheels();
    };

    htmlSliderColor.oninput = function () {
        color = parseInt(this.value);
        htmlShowColor.innerHTML = color;
        emitWheels();
    };

    let htmlWheelTireExtra = document.createElement("wheel");
    let htmlTireExtraName = document.createElement("strong");
    htmlTireExtraName.innerHTML = "Marque";
    let htmlTireExtraSelector = document.createElement("select");

    htmlTireExtraSelector.clearOptions = function () {
        for (let index in this.options) this.options.remove(0);
    };

    htmlTireExtraSelector.setOptions = function (arr) {
        arr.forEach((extra, index) => {
            const option = new Option(extra, index, false, index == brand);
            this.options.add(option);
        });
    };

    htmlTireExtraSelector.onchange = function () {
        brand = parseInt(this.value);
        extra = brand * wheelTypeList[type].range;
        updateSliderFill(htmlSliderNum);
        emitWheels();
    };

    setExtra();
    htmlWheelTireExtra.append(htmlTireExtraName, htmlTireExtraSelector);

    let htmlWheelBut = document.createElement("wheel");
    let htmlOrigineBut = document.createElement("button");
    htmlOrigineBut.innerHTML = "Jantes d'origine";
    htmlOrigineBut.onclick = setOrigine;

    htmlWheelType.append(htmlNameType, htmlSelectorWheelType);
    htmlWheelNum.append(htmlNameNum, htmlSliderNumDiv, htmlShowNum);
    htmlWheelColor.append(htmlNameColor, htmlSliderColorDiv, htmlShowColor);
    htmlWheelBut.append(htmlOrigineBut);
    htmlGenerated.append(htmlWheelType, htmlWheelNum, htmlWheelColor, htmlWheelTireExtra, htmlWheelBut);

    function setOrigine() {
        //  alt.emit("setStockWheels")
        num = 0;
        color = 0;
        htmlSliderNum.value = num;
        htmlSliderColor.value = color;
        htmlShowNum.innerHTML = "Origine";
        htmlShowColor.innerHTML = color;
        updateSliderFill(htmlSliderNum);
        updateSliderFill(htmlSliderColor);
        emitWheels();
    }

    function origine() {
        return num == 0 ? "Origine" : num;
    }

    function setExtra() {
        htmlTireExtraSelector.clearOptions();
        const extra = wheelTypeList[type].extra;
        if (extra) {
            htmlTireExtraSelector.setOptions(extra);
            htmlWheelTireExtra.style.visibility = "visible";
        } else {
            htmlWheelTireExtra.style.visibility = "hidden";
        }
    }

    let htmlWheelDrift = document.createElement("wheel");
    let htmlNameDrift = document.createElement("strong");
    htmlNameDrift.innerHTML = "Drift";
    let [htmlDriftLabel, htmlDriftCheckbox] = createCheckbox(drift);
    htmlDriftCheckbox.onchange = function () {
        drift = this.checked;
        emitWheels();
    };
    htmlWheelDrift.append(htmlNameDrift, htmlDriftLabel);
    htmlGenerated.append(htmlWheelDrift);

    //  console.log(camber, trackFront, trackRear);

    ////    TEST
    /*
    let htmlWheelCamber = document.createElement("wheel");
    let htmlNameCamber = document.createElement("strong");
    htmlNameCamber.innerHTML = "Camber";
    let [htmlSliderCamberDiv, htmlSliderCamber] = createSlider(camber, 0.5, -0.5, 0.01);
    let htmlShowCamber = document.createElement("strong");
    htmlShowCamber.className = "show";
    htmlShowCamber.innerHTML = camber * 100;

    htmlSliderCamber.oninput = function () {
        htmlShowCamber.innerHTML = parseInt(this.value * 100);
        camber = parseFloat(this.value);
        emitWheels();
        //  alt.emit("setWheelsExtra", { camber, track: [trackFront, trackRear] });
    };

    htmlWheelCamber.append(htmlNameCamber, htmlSliderCamberDiv, htmlShowCamber);
    htmlGenerated.append(htmlWheelCamber);

    let htmlWheelTrackFront = document.createElement("wheel");
    let htmlNameTrackFront = document.createElement("strong");
    htmlNameTrackFront.innerHTML = "TrackFront";
    let [htmlSliderTrackFrontDiv, htmlSliderTrackFront] = createSlider(trackFront, 1, 0.5, 0.01);
    let htmlShowTrackFront = document.createElement("strong");
    htmlShowTrackFront.className = "show";
    htmlShowTrackFront.innerHTML = trackFront * 100;

    htmlSliderTrackFront.oninput = function () {
        htmlShowTrackFront.innerHTML = parseInt(this.value * 100);
        trackFront = parseFloat(this.value);
        alt.emit("setWheelsExtra", { camber, track: [trackFront, trackRear] });
    };

    htmlWheelTrackFront.append(htmlNameTrackFront, htmlSliderTrackFrontDiv, htmlShowTrackFront);
    htmlGenerated.append(htmlWheelTrackFront);

    let htmlWheelTrackRear = document.createElement("wheel");
    let htmlNameTrackRear = document.createElement("strong");
    htmlNameTrackRear.innerHTML = "TrackRear";
    let [htmlSliderTrackRearDiv, htmlSliderTrackRear] = createSlider(trackRear, 1, 0.5, 0.01);
    let htmlShowTrackRear = document.createElement("strong");
    htmlShowTrackRear.className = "show";
    htmlShowTrackRear.innerHTML = trackRear * 100;

    htmlSliderTrackRear.oninput = function () {
        htmlShowTrackRear.innerHTML = parseInt(this.value * 100);
        trackRear = parseFloat(this.value);
        emitWheels();
        //  alt.emit("setWheelsExtra", { camber, track: [trackFront, trackRear] });
    };

    htmlWheelTrackRear.append(htmlNameTrackRear, htmlSliderTrackRearDiv, htmlShowTrackRear);
    htmlGenerated.append(htmlWheelTrackRear);
    ////
    */
}

///////////////////////////////////////////////////////////////////////////

function initColors(data) {
    appLoaded = "colors";

    let { primary, secondary } = data;

    function emitColors() {
        alt.emit("setColors", { primary, secondary, xenon, window, tireSmoke });
    }

    let htmlColorPrimaryType = document.createElement("color");
    let htmlColorPrimaryNum = document.createElement("color");
    let htmlNamePrimaryType = document.createElement("strong");
    htmlNamePrimaryType.className = "name";
    htmlNamePrimaryType.innerHTML = "Primary";
    let htmlSelectorPrimaryType = document.createElement("select");

    htmlSelectorPrimaryType.onchange = function () {
        primary.colorType = parseInt(this.value);
        const max = colors[this.value].count - 1;
        if (primary.colorNum > max) {
            primary.colorNum = max;
            htmlSliderPrimaryNum.value = max;
        }
        htmlSliderPrimaryNum.max = max;
        updateSliderFill(htmlSliderPrimaryNum);
        const name = colors[this.value].colors[primary.colorNum].name;
        htmlShowPrimaryNum.innerHTML = formatColorName(name);
        pearlVisibility();
        emitColors();
    };

    let htmlNamePrimaryNum = document.createElement("strong");
    htmlNamePrimaryNum.innerHTML = "Num";
    let [htmlSliderPrimaryNumDiv, htmlSliderPrimaryNum] = createSlider(primary.colorNum, colors[primary.colorType].count - 1);
    let htmlShowPrimaryNum = document.createElement("strong");
    htmlShowPrimaryNum.className = "show";
    const name1 = colors[primary.colorType].colors[primary.colorNum].name;
    htmlShowPrimaryNum.innerHTML = formatColorName(name1);

    htmlSliderPrimaryNum.oninput = function () {
        primary.colorNum = parseInt(this.value);
        let name = colors[primary.colorType].colors[this.value].name;
        htmlShowPrimaryNum.innerHTML = formatColorName(name);
        emitColors();
    };

    htmlColorPrimaryType.append(htmlNamePrimaryType, htmlSelectorPrimaryType);
    htmlColorPrimaryNum.append(htmlSliderPrimaryNumDiv, htmlShowPrimaryNum);
    htmlGenerated.append(htmlColorPrimaryType, htmlColorPrimaryNum);

    let htmlColorSecondaryType = document.createElement("color");
    let htmlColorSecondaryNum = document.createElement("color");
    let htmlNameSecondaryType = document.createElement("strong");
    htmlNameSecondaryType.className = "name";
    htmlNameSecondaryType.innerHTML = "Secondary";
    let htmlSelectorSecondaryType = document.createElement("select");

    htmlSelectorSecondaryType.onchange = function () {
        secondary.colorType = parseInt(this.value);
        const max = colors[this.value].count - 1;
        if (secondary.colorNum > max) {
            secondary.colorNum = max;
            htmlSliderSecondaryNum.value = max;
            secondary.colorNum = max;
        }
        htmlSliderSecondaryNum.max = max;
        updateSliderFill(htmlSliderSecondaryNum);
        const name = colors[this.value].colors[secondary.colorNum].name;
        htmlShowSecondaryNum.innerHTML = formatColorName(name);
        emitColors();
    };

    let htmlNameSecondaryNum = document.createElement("strong");
    htmlNameSecondaryNum.innerHTML = "Num";
    let [htmlSliderSecondaryNumDiv, htmlSliderSecondaryNum] = createSlider(secondary.colorNum, colors[secondary.colorType].count - 1);
    let htmlShowSecondaryNum = document.createElement("strong");
    htmlShowSecondaryNum.className = "show";
    const name2 = colors[secondary.colorType].colors[secondary.colorNum].name;
    htmlShowSecondaryNum.innerHTML = formatColorName(name2);

    htmlSliderSecondaryNum.oninput = function () {
        secondary.colorNum = parseInt(this.value);
        let name = colors[secondary.colorType].colors[this.value].name;
        htmlShowSecondaryNum.innerHTML = formatColorName(name);
        emitColors();
    };

    htmlColorSecondaryType.append(htmlNameSecondaryType, htmlSelectorSecondaryType);
    htmlColorSecondaryNum.append(htmlSliderSecondaryNumDiv, htmlShowSecondaryNum);
    htmlGenerated.append(htmlColorSecondaryType, htmlColorSecondaryNum);

    colors.forEach(({ name, index }) => {
        const option1 = new Option(name, index, false, index == primary.colorType);
        htmlSelectorPrimaryType.options.add(option1);
        if (name == "Pearl") return;
        const option2 = new Option(name, index, false, index == secondary.colorType);
        htmlSelectorSecondaryType.options.add(option2);
    });

    let htmlColorPearlDiv = document.createElement("div");
    let htmlColorPearl = document.createElement("color");
    let htmlNamePearl = document.createElement("strong");
    htmlNamePearl.innerHTML = "Pearl";
    let [htmlSliderPearlDiv, htmlSliderPearl] = createSlider(primary.pearl, colors[2].colors.length - 1);
    let htmlShowPearl = document.createElement("strong");
    htmlShowPearl.className = "show";
    if (primary.pearl == -1) primary.pearl = 0;
    const namePearl = colors[2].pearlColors[primary.pearl].name;
    htmlShowPearl.innerHTML = formatColorName(namePearl);

    function pearlVisibility() {
        if (primary.colorType == 2) {
            //  Pearl
            htmlColorPearlDiv.style.visibility = "visible";
        } else {
            htmlColorPearlDiv.style.visibility = "hidden";
        }
    }

    htmlSliderPearl.oninput = function () {
        primary.pearl = parseInt(this.value);
        let name = colors[primary.colorType].colors[this.value].name;
        name = formatColorName(name);
        htmlShowPearl.innerHTML = name;
        emitColors();
    };

    pearlVisibility();
    htmlColorPearl.append(htmlNamePearl, htmlShowPearl);
    htmlColorPearlDiv.append(htmlColorPearl, htmlSliderPearlDiv);
    htmlGenerated.append(htmlColorPearlDiv);

    createSeparator();

    function emitExtra() {
        alt.emit("setExtraColors", { xenon, window, tireSmoke });
    }

    let { xenon } = data;
    let htmlXenon = document.createElement("extra");
    let htmlXenonName = document.createElement("strong");
    htmlXenonName.className = "name";
    htmlXenonName.innerHTML = "Xenon";
    let [htmlXenonSliderDiv, htmlXenonSlider] = createSlider(xenon, xenonColors.length - 1);
    let htmlXenonShow = document.createElement("strong");
    htmlXenonShow.className = "show";
    htmlXenonShow.innerHTML = xenonColors[xenon];

    htmlXenonSlider.oninput = function () {
        xenon = parseInt(this.value);
        htmlXenonShow.innerHTML = xenonColors[xenon];
        updateSliderFill(this);
        emitColors();
        //  emitExtra();
    };

    htmlXenon.append(htmlXenonName, htmlXenonSliderDiv, htmlXenonShow);
    htmlGenerated.append(htmlXenon);

    let { window } = data;
    let nTints = windowTints.length;
    let htmlWindow = document.createElement("extra");
    let htmlWindowName = document.createElement("strong");
    htmlWindowName.className = "name";
    htmlWindowName.innerHTML = "Window";
    let [htmlWindowSliderDiv, htmlWindowSlider] = createSlider(window, nTints - 1);
    let htmlWindowShow = document.createElement("strong");
    htmlWindowShow.className = "show";
    htmlWindowShow.innerHTML = windowTints[window];

    htmlWindowSlider.oninput = function () {
        window = parseInt(this.value);
        htmlWindowShow.innerHTML = windowTints[window];
        updateSliderFill(this);
        emitColors();
        //  emitExtra();
    };

    htmlWindow.append(htmlWindowName, htmlWindowSliderDiv, htmlWindowShow);
    htmlGenerated.append(htmlWindow);

    let { tireSmoke } = data;
    let htmltireSmoke = document.createElement("tireSmoke");

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function formatColorName(name) {
        name = name.toLowerCase();
        name = name.replaceAll("_", " ");
        name = capitalizeFirstLetter(name);
        return name;
    }
}

///////////////////////////////////////////////////////////////////////////

function initNeons(data) {
    appLoaded = "neons";
    let { color, enabled } = data;
    let htmlColorInput = document.createElement("input");
    htmlColorInput.type = "color";
    htmlColorInput.value = rgbToHex(color);
    htmlColorInput.oninput = function () {
        color = hexToRgb(this.value);
        alt.emit("setNeons", { enabled, color });
    };

    let [label, checkbox] = createCheckbox(enabled);
    checkbox.onchange = function () {
        enabled = this.checked;
        alt.emit("setNeons", { enabled, color });
    };

    //htmlNeonType.append(htmlNeonTypeName, htmlSliderTypeDiv, htmlShowType)
    htmlGenerated.append(label, htmlColorInput);
    //htmlGenerated.append(htmlNeonType, htmlNeonNum)
    //htmlGenerated.append(htmlNeonNum)
}

///////////////////////////////////////////////////////////////////////////

function initPlate(data) {
    appLoaded = "plate";

    let { plateIndex, plateText } = data;

    function emitPlate() {
        alt.emit("setPlate", { plateIndex, plateText });
    }

    let htmlPlateIndex = document.createElement("plate");
    let htmlPlateIndexName = document.createElement("strong");
    htmlPlateIndexName.innerHTML = "Color";
    let htmlSelectorPlateIndex = document.createElement("select");

    plateList.forEach((name, index) => {
        const option = new Option(name, index, false, index == plateIndex);
        htmlSelectorPlateIndex.options.add(option);
    });

    htmlSelectorPlateIndex.onchange = function () {
        plateIndex = parseInt(this.value);
        emitPlate();
    };

    let htmlPlateText = document.createElement("plate");
    let htmlPlateTextName = document.createElement("strong");
    htmlPlateTextName.innerHTML = "Text";
    let htmlInputPlateText = document.createElement("input");

    plateText = plateFormat(plateText);
    htmlInputPlateText.value = plateText;

    htmlInputPlateText.oninput = function () {
        if (this.value.length > 8 || !onlyLettersNumbersSpace(this.value)) {
            this.value = plateText;
            return;
        }
        this.value = this.value.toUpperCase();
        plateText = this.value;
        emitPlate();
    };

    htmlPlateIndex.append(htmlPlateIndexName, htmlSelectorPlateIndex);
    htmlPlateText.append(htmlPlateTextName, htmlInputPlateText);
    htmlGenerated.append(htmlPlateIndex, htmlPlateText);

    function onlyLettersNumbersSpace(str) {
        return /^[a-zA-Z0-9 ]+$/.test(str);
    }

    function plateFormat(str) {
        let i, j;
        for (i = 0; i < str.length; i++) {
            if (str[i] != " ") break;
        }
        for (j = str.length - 1; j > 0; j--) {
            if (str[j] != " ") break;
        }
        return str.substring(i, j + 1);
    }
}

///////////////////////////////////////////////////////////////////////////

function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
          }
        : null;

    //return result ? {
    //  r: parseInt(result[1], 16),
    //  g: parseInt(result[2], 16),
    //  b: parseInt(result[3], 16)
    //} : null;
}

function componentToHex(c) {
    let hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(rgb) {
    return "#" + componentToHex(rgb.r) + componentToHex(rgb.g) + componentToHex(rgb.b);
}
