if (window.alt === undefined) {
    window.alt = {
        emit: () => {},
        on: () => {},
    };
}

document.querySelectorAll("input[type=range]").forEach((slider, i, arr) => {
    slider.addEventListener("focusout", async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
        if (document.activeElement === document.body) {
            slider.focus();
        }
    });
    slider.addEventListener("keydown", (e) => {
        if (e.code === "ArrowUp") {
            arr[i - 1]?.focus();
        } else if (e.code === "ArrowDown") {
            arr[i + 1]?.focus();
        } else return;
        e.preventDefault();
    });
});

window.addEventListener("load", () => {
    document.querySelector(`#clothes-content div[selected] input[type=range]`)?.focus();
});

const clothesCategoryButtons = document.querySelectorAll("#clothes-category button");
clothesCategoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
        document.querySelector("#clothes-category > button[selected]")?.removeAttribute("selected");
        button.toggleAttribute("selected");
        document.querySelector("#clothes-content > div[selected]")?.removeAttribute("selected");
        document.querySelector(`#clothes-content #${button.id}`).toggleAttribute("selected");

        document.querySelector(`#clothes-content div[selected] input[type=range]`)?.focus();
    });
});

const exitButton = document.querySelector("#exit");
const saveButton = document.querySelector("#save");
const randomButton = document.querySelector("#random");
const modelSelect = document.querySelector("#model");

[exitButton, saveButton, randomButton].forEach((button) => {
    button.addEventListener("click", () => {
        alt.emit(`player:clothes:${button.id}`);
    });
});

modelSelect.addEventListener("change", () => {
    alt.emit("player:clothes:model", modelSelect.value);
});

// ---- HEAD ---- //

const headShapeFirstSlider = document.querySelector("#shape-first input[type=range]");
const headShapeFirstCounter = document.querySelector("#shape-first input[type=number]");
const headShapeSecondSlider = document.querySelector("#shape-second input[type=range]");
const headShapeSecondCounter = document.querySelector("#shape-second input[type=number]");
const headSkinFirstSlider = document.querySelector("#skin-first input[type=range]");
const headSkinFirstCounter = document.querySelector("#skin-first input[type=number]");
const headSkinSecondSlider = document.querySelector("#skin-second input[type=range]");
const headSkinSecondCounter = document.querySelector("#skin-second input[type=number]");
const headShapeMixSlider = document.querySelector("#shape-mix input[type=range]");
const headShapeMixCounter = document.querySelector("#shape-mix input[type=number]");
const headSkinMixSlider = document.querySelector("#skin-mix input[type=range]");
const headSkinMixCounter = document.querySelector("#skin-mix input[type=number]");

[
    [headShapeFirstSlider, headShapeFirstCounter],
    [headShapeSecondSlider, headShapeSecondCounter],
    [headSkinFirstSlider, headSkinFirstCounter],
    [headSkinSecondSlider, headSkinSecondCounter],
    [headShapeMixSlider, headShapeMixCounter],
    [headSkinMixSlider, headSkinMixCounter],
].forEach(([slider, counter]) => {
    slider.addEventListener("input", () => {
        counter.value = slider.value;
        alt.emit(
            "player:clothes:head",
            parseInt(headShapeFirstSlider.value),
            parseInt(headShapeSecondSlider.value),
            parseInt(headSkinFirstSlider.value),
            parseInt(headSkinSecondSlider.value),
            parseFloat(headShapeMixSlider.value),
            parseFloat(headSkinMixSlider.value)
        );
    });

    counter.addEventListener("input", () => {
        if (!counter.value) return;
        const value = parseInt(counter.value);
        counter.value = value > counter.max ? counter.max : value < counter.min ? counter.min : value;
        slider.value = counter.value;
        slider.dispatchEvent(new Event("input"));
    });
});

const eyeColorSlider = document.querySelector("#eye-color input[type=range]");
const eyeColorCounter = document.querySelector("#eye-color input[type=number]");
eyeColorSlider.addEventListener("input", () => {
    eyeColorCounter.value = eyeColorSlider.value;
    alt.emit("player:clothes:eyeColor", parseInt(eyeColorSlider.value) - 1);
});

// ---- CLOTHES ---- //

const clothesList = document.querySelectorAll("#clothes-content > div");
clothesList.forEach((clothesDiv) => {
    const type = clothesDiv.dataset.type;
    const index = parseInt(clothesDiv.dataset.index);

    if (type === "clothes" && index === 0) return; // skip head

    const drawableSlider = clothesDiv.querySelector(".drawable input[type=range]");
    const textureSlider = clothesDiv.querySelector(".texture input[type=range]");
    const paletteSlider = clothesDiv.querySelector(".palette input[type=range]");

    clothesDiv.querySelectorAll(".sub-category").forEach((div) => {
        const counter = div.querySelector("input[type=number]");
        const slider = div.querySelector("input[type=range]");

        slider.addEventListener("input", () => {
            slider.setAttribute("value", slider.value);
            counter.value = slider.value;
            if (type === "clothes") {
                alt.emit("player:clothes:clothes", index, parseInt(drawableSlider.value), parseInt(textureSlider.value), parseInt(paletteSlider.value));
            } else {
                alt.emit("player:clothes:props", index, parseInt(drawableSlider.value) - 1, parseInt(textureSlider.value));
            }
        });

        counter.addEventListener("input", () => {
            if (!counter.value) return;
            const value = parseInt(counter.value);
            counter.value = value > counter.max ? counter.max : value < counter.min ? counter.min : value;
            slider.value = counter.value;
            slider.dispatchEvent(new Event("input"));
        });
    });

    drawableSlider.addEventListener("input", () => {
        alt.emit("player:clothes:update", type, index, parseInt(drawableSlider.value));
    });
});

// ----------------- //

// ---- HAIR ---- //

const hairColorSlider = document.querySelector("#hair-color input[type=range]");
const hairColorCounter = document.querySelector("#hair-color input[type=number]");
const hairHighlightSlider = document.querySelector("#hair-highlight input[type=range]");
const hairHighlightCounter = document.querySelector("#hair-highlight input[type=number]");

hairColorSlider.addEventListener("input", () => {
    hairColorCounter.value = hairColorSlider.value;
    alt.emit("player:clothes:hair:color", parseInt(hairColorSlider.value), parseInt(hairHighlightSlider.value));
});

hairColorCounter.addEventListener("input", () => {
    if (!hairColorCounter.value) return;
    const value = parseInt(hairColorCounter.value);
    hairColorCounter.value = value > hairColorCounter.max ? hairColorCounter.max : value < hairColorCounter.min ? hairColorCounter.min : value;
    hairColorSlider.value = hairColorCounter.value;
    hairColorSlider.dispatchEvent(new Event("input"));
});

hairHighlightSlider.addEventListener("input", () => {
    hairHighlightCounter.value = hairHighlightSlider.value;
    alt.emit("player:clothes:hair:color", parseInt(hairColorSlider.value), parseInt(hairHighlightSlider.value));
});

hairHighlightCounter.addEventListener("input", () => {
    if (!hairHighlightCounter.value) return;
    const value = parseInt(hairHighlightCounter.value);
    hairHighlightCounter.value =
        value > hairHighlightCounter.max ? hairHighlightCounter.max : value < hairHighlightCounter.min ? hairHighlightCounter.min : value;
    hairHighlightSlider.value = hairHighlightCounter.value;
    hairHighlightSlider.dispatchEvent(new Event("input"));
});

// -------------- //

// ---- UPDATE ---- //

alt.on("player:clothes:head", (data) => {
    headShapeFirstSlider.value = data.shapeFirstID;
    headShapeFirstCounter.value = data.shapeFirstID;
    headShapeSecondSlider.value = data.shapeSecondID;
    headShapeSecondCounter.value = data.shapeSecondID;
    headSkinFirstSlider.value = data.skinFirstID;
    headSkinFirstCounter.value = data.skinFirstID;
    headSkinSecondSlider.value = data.skinSecondID;
    headSkinSecondCounter.value = data.skinSecondID;
    headShapeMixSlider.value = data.shapeMix;
    headShapeMixCounter.value = data.shapeMix;
    headSkinMixSlider.value = data.skinMix;
    headSkinMixCounter.value = data.skinMix;
});

alt.on("player:clothes:eyeColor", (color) => {
    eyeColorSlider.value = color + 1;
    eyeColorCounter.value = color + 1;
});

alt.on("player:clothes:clothes:drawable", (index, drawable, drawableCount) => {
    const drawableSlider = document.querySelector(`div[data-type=clothes][data-index="${index}"] .drawable input[type=range]`);
    const drawableCounter = document.querySelector(`div[data-type=clothes][data-index="${index}"] .drawable input[type=number]`);
    if (!drawableSlider || !drawableCounter) return;
    drawableSlider.max = drawableCount - 1;
    drawableCounter.max = drawableCount - 1;
    drawableSlider.setAttribute("value", drawable);
    drawableCounter.value = drawable;
});

alt.on("player:clothes:clothes:texture", (index, texture, textureCount) => {
    const textureSlider = document.querySelector(`div[data-type=clothes][data-index="${index}"] .texture input[type=range]`);
    const textureCounter = document.querySelector(`div[data-type=clothes][data-index="${index}"] .texture input[type=number]`);
    textureSlider.max = textureCount - 1;
    textureCounter.max = textureCount - 1;
    textureSlider.value = texture;
    textureCounter.value = texture;
});

alt.on("player:clothes:clothes:palette", (index, palette) => {
    const paletteSlider = document.querySelector(`div[data-type=clothes][data-index="${index}"] .palette input[type=range]`);
    const paletteCounter = document.querySelector(`div[data-type=clothes][data-index="${index}"] .palette input[type=number]`);
    paletteSlider.value = palette;
    paletteCounter.value = palette;
    paletteSlider.max = 63;
    paletteCounter.max = 63;
});

alt.on("player:clothes:props:drawable", (index, drawable, drawableCount) => {
    const drawableSlider = document.querySelector(`div[data-type=props][data-index="${index}"] .drawable input[type=range]`);
    const drawableCounter = document.querySelector(`div[data-type=props][data-index="${index}"] .drawable input[type=number]`);
    drawableSlider.max = drawableCount - 1;
    drawableCounter.max = drawableCount - 1;
    drawableSlider.setAttribute("value", drawable + 1);
    drawableCounter.value = drawable + 1;
});

alt.on("player:clothes:props:texture", (index, texture, textureCount) => {
    const textureSlider = document.querySelector(`div[data-type=props][data-index="${index}"] .texture input[type=range]`);
    const textureCounter = document.querySelector(`div[data-type=props][data-index="${index}"] .texture input[type=number]`);
    if (!textureSlider || !textureCounter) return;
    textureSlider.max = textureCount - 1;
    textureCounter.max = textureCount - 1;
    textureSlider.value = texture;
    textureCounter.value = texture;
});

alt.on("player:clothes:model", (modelName) => {
    const options = Array.from(modelSelect.options);
    let option = options.find((option) => option.value === modelName);
    if (!option) {
        option = options.find((option) => option.value === "custom");
        option.innerText = modelName;
    }
    option.selected = true;
});

// ---------------- //
