
let appLoaded

let htmlGenerated = document.querySelector("generated")
const nodeList = document.querySelectorAll("button")
const buttonList = Array.prototype.slice.call(nodeList)

for (const button of buttonList) {
    button.onclick = function () {
        const id = button.id
        switch (id) {
            case "stock":
            case "restore":
                alt.emit(id)
                break;
        
            default:
                alt.emit("startApp", id)
                break;
        }
    }
}

alt.on("app", appManager)

function appManager (res) {
    const [app, data] = res
    if (app == appLoaded) return
    htmlGenerated.replaceChildren()
    appLoaded = null
    for (const but of buttonList)
        but.className = "unselected"
    const button = document.getElementById(app)
    button.className = "selected"
    switch (app) {
        case "mods":
            initMods(data)
            break;
            
        case "colors":
            initColors(data)
            break;

        case "wheels":
            initWheels(data)
            break;

        case "neons":
            initNeons(data)
            break;

        default:
            console.log("cant load: ", app);
            break;
    }
}


function createSlider (value, max) {
    let div = document.getElementById("divSlider").cloneNode(true)
    div.removeAttribute("hidden")
    let slider = div.childNodes[1]
    slider.max = max
    slider.value = value
    updateSliderFill(slider)
    slider.addEventListener("mousemove", function () {
        updateSliderFill(slider)
    })
    return [div, slider]
}

function updateSliderFill (slider) {
    let x = (slider.value/slider.max)*100
    let color = "linear-gradient(90deg, rgb(223, 200, 0)" + x + "%, rgba(0, 0, 0, 0)" + x + "%)"
    slider.style.background = color
}


function createCheckbox () {
    let label = document.getElementById("labelCheckbox").cloneNode(true)
    label.removeAttribute("hidden")
    let checkbox = label.childNodes[1]
    return [label, checkbox]
}


function initMods (data) {
    appLoaded = "mods"

    for (const mod of data) {
        const [modType, num, count] = mod
        const modName = modList[modType]
        let htmlMod = document.createElement("mod")
        let htmlName = document.createElement('strong')
        htmlName.innerHTML = modName
        htmlMod.append(htmlName)

        switch (modType) {
            //  case 17: ??
            case 18:
            //  case 19: ??
            case 20:
            //  case 21: ??
            case 22:
                let [label, checkbox] = createCheckbox()
                checkbox.checked = !!num
                checkbox.onchange = function () {
                    const bool = checkbox.checked
                    console.log(bool);
                    alt.emit("toogleMod", [modType, bool])
                }
                htmlMod.append(label)
                break;
        
            default:
                if (count == 0) continue
                let [htmlSliderDiv, htmlSlider] = createSlider(num, count)
                let htmlShow = document.createElement('strong')
                htmlShow.className = "show"
                htmlShow.innerHTML = num

                htmlSlider.oninput = function () {
                    let modNum = parseInt(this.value)
                    htmlShow.innerHTML = modNum
                    alt.emit("setMod", [modType, modNum])
                }
                htmlMod.append(htmlSliderDiv, htmlShow)
                break;
        }
        htmlGenerated.append(htmlMod)
    }
}


///////////////////////////////////////////////////////////////////////////

function initWheels (data) {
    appLoaded = "wheels"

    let {typeIndex, wheelNum, wheelColor} = data.restore
    let wheelTypeCount = wheelTypeList.length
    
    let htmlWheelType = document.createElement("wheel")
    let htmlWheelNum = document.createElement("wheel")
    let htmlWheelColor = document.createElement("wheel")

    let htmlNameType = document.createElement('strong')
    htmlNameType.innerHTML = "Type"
    let [htmlSliderTypeDiv, htmlSliderType] = createSlider(typeIndex, wheelTypeCount)
    let htmlShowType = document.createElement('strong')
    htmlShowType.className = "show"
    htmlShowType.innerHTML = wheelTypeList[typeIndex]

    let htmlNameNum = document.createElement('strong')
    htmlNameNum.innerHTML = "Num"
    let [htmlSliderNumDiv, htmlSliderNum] = createSlider(wheelNum, data[typeIndex])
    let htmlShowNum = document.createElement('strong')
    htmlShowNum.className = "show"
    htmlShowNum.innerHTML = origine(wheelNum)

    let htmlNameColor = document.createElement('strong')
    htmlNameColor.innerHTML = "Color"
    let [htmlSliderColorDiv, htmlSliderColor] = createSlider(wheelColor, data.colorCount)
    let htmlShowColor = document.createElement('strong')
    htmlShowColor.className = "show"
    htmlShowColor.innerHTML = wheelColor

    htmlSliderType.oninput = function () {
        typeIndex = parseInt(this.value)
        htmlShowType.innerHTML = wheelTypeList[typeIndex]
        const max = data[typeIndex]
        htmlSliderNum.max = max
        if (htmlSliderNum.value > max) {
            htmlSliderNum.value = max
            htmlShowNum.innerHTML = max
        }
        alt.emit("setWheels", {typeIndex, wheelNum, wheelColor})
    }
    
    htmlSliderNum.oninput = function () {
        wheelNum = parseInt(this.value)
        htmlShowNum.innerHTML = origine(wheelNum)
        alt.emit("setWheels", {typeIndex, wheelNum, wheelColor})
    }
    
    htmlSliderColor.oninput = function () {
        wheelColor = parseInt(this.value)
        htmlShowColor.innerHTML = wheelColor
        alt.emit("setWheels", {typeIndex, wheelNum, wheelColor})
    }
    
    let htmlWheelBut = document.createElement("wheel")
    let htmlOrigineBut = document.createElement("button")
    htmlOrigineBut.innerHTML = "Jantes d'origine"
    htmlOrigineBut.onclick = function () {
        wheelNum = 0
        htmlSliderNum.value = wheelNum
        htmlShowNum.innerHTML = "Origine"
        wheelColor = data.restore.wheelColor
        htmlSliderColor.value = wheelColor
        htmlShowColor.innerHTML = wheelColor
        alt.emit("setWheels", {typeIndex, wheelNum: wheelNum, wheelColor})
    }

    htmlWheelType.append(htmlNameType, htmlSliderTypeDiv, htmlShowType)
    htmlWheelNum.append(htmlNameNum, htmlSliderNumDiv, htmlShowNum)
    htmlWheelColor.append(htmlNameColor, htmlSliderColorDiv, htmlShowColor)
    htmlWheelBut.append(htmlOrigineBut)
    htmlGenerated.append(htmlWheelType, htmlWheelNum, htmlWheelColor, htmlWheelBut)
}

function origine (wheelNum) {
    if (wheelNum == 0)
        return "Origine"
    return wheelNum
}


///////////////////////////////////////////////////////////////////////////


function initColors (data) {
    appLoaded = "colors"

    let {primary, secondary} = data.restore //pearl

    let htmlColorPrimaryType = document.createElement("color")
    let htmlColorSecondaryType = document.createElement("color")
    let htmlColorPrimaryNum = document.createElement("color")
    let htmlColorSecondaryNum = document.createElement("color")
    let htmlColorPearl = document.createElement("colorPearl")
    let htmlColorPearlNum = document.createElement("color")

    function pearlVisibility () {
        if (primary.colorType == 2) {    //  Pearl
            htmlColorPearl.style.visibility = "visible"
        } else {
            htmlColorPearl.style.visibility = "hidden"
        }
    }

    pearlVisibility()

    let htmlNamePrimaryType = document.createElement('strong')
    htmlNamePrimaryType.innerHTML = "Primary"
    let htmlSelectorPrimaryType = document.createElement("select")
    //  htmlSelectorPrimaryType.class = "selector"
    let htmlNameSecondaryType = document.createElement('strong')
    htmlNameSecondaryType.innerHTML = "Secondary"
    let htmlSelectorSecondaryType = document.createElement("select")
    //  htmlSelectorSecondaryType.class = "selector"
    
    colors.forEach(({name, index}) => {
        const option1 = new Option(name, index, false, index == primary.colorType);
        htmlSelectorPrimaryType.options.add(option1)
        if (name != "Pearl") {
            const option2 = new Option(name, index, false, index == secondary.colorType);
            htmlSelectorSecondaryType.options.add(option2)
        }
    })

    let htmlNamePrimaryNum = document.createElement('strong')
    htmlNamePrimaryNum.innerHTML = "Num"
    let [htmlSliderPrimaryNumDiv, htmlSliderPrimaryNum] = createSlider(primary.colorNum, colors[primary.colorType].count -1)
    let htmlShowPrimaryNum = document.createElement('strong')
    htmlShowPrimaryNum.className = "show"
    //  console.log(primary.colorNum);
    //  if (!colors[primary.colorType].colors[primary.colorNum])
    //      primary.colorNum = colors[primary.colorType].colors.length -1
    //  console.log(primary.colorNum);
    const name1 = colors[primary.colorType].colors[primary.colorNum].name
    htmlShowPrimaryNum.innerHTML = formatColorName(name1)

    let htmlNameSecondaryNum = document.createElement('strong')
    htmlNameSecondaryNum.innerHTML = "Num"
    let [htmlSliderSecondaryNumDiv, htmlSliderSecondaryNum] = createSlider(secondary.colorNum, colors[secondary.colorType].count -1)
    let htmlShowSecondaryNum = document.createElement('strong')
    htmlShowSecondaryNum.className = "show"
    //  console.log(secondary.colorNum);
    //  if (!colors[secondary.colorType].colors[secondary.colorNum]) 
    //      secondary.colorNum = colors[secondary.colorType].colors.length -1
    //  console.log(secondary.colorNum);
    const name2 = colors[secondary.colorType].colors[secondary.colorNum].name
    htmlShowSecondaryNum.innerHTML = formatColorName(name2)
    
    console.log(primary.colorNum, secondary.colorNum, primary.pearl);   

    let htmlNamePearl = document.createElement('strong')
    htmlNamePearl.innerHTML = "Pearl"
    let [htmlSliderPearlDiv, htmlSliderPearl] = createSlider(primary.pearl, colors[2].colors.length -1)
    let htmlShowPearl = document.createElement('strong')
    htmlShowPearl.className = "show"
    if (primary.pearl == -1)
        primary.pearl = 0
    const namePearl = colors[2].colors[primary.pearl].name
    htmlShowPearl.innerHTML = formatColorName(namePearl)

    htmlSelectorPrimaryType.onchange = function () {
        primary.colorType = parseInt(this.value)
        let colorIndex = parseInt(htmlSliderPrimaryNum.value)
        const max = colors[this.value].count -1
        htmlSliderPrimaryNum.max = max
        if (colorIndex > max) {
            colorIndex = max
            htmlSliderPrimaryNum.value = max
            primary.colorNum = max
        }
        const name = colors[this.value].colors[colorIndex].name
        htmlShowPrimaryNum.innerHTML = formatColorName(name)
        pearlVisibility()
        alt.emit("setColors", {primary, secondary})
    }

    htmlSelectorSecondaryType.onchange = function () {
        secondary.colorType = parseInt(this.value)
        let colorIndex = parseInt(htmlSliderSecondaryNum.value)
        const max = colors[this.value].count -1
        htmlSliderSecondaryNum.max = max
        if (colorIndex > max) {
            colorIndex = max
            htmlSliderSecondaryNum.value = max
            secondary.colorNum = max
        }
        const name = colors[this.value].colors[colorIndex].name
        htmlShowSecondaryNum.innerHTML = formatColorName(name)
        alt.emit("setColors", {primary, secondary})
    }

    htmlSliderPrimaryNum.oninput = function () {
        primary.colorNum = parseInt(this.value)
        let name = colors[primary.colorType].colors[this.value].name
        htmlShowPrimaryNum.innerHTML = formatColorName(name)
        alt.emit("setColors", {primary, secondary})
    }

    htmlSliderSecondaryNum.oninput = function () {
        secondary.colorNum = parseInt(this.value)
        let name = colors[secondary.colorType].colors[this.value].name
        htmlShowSecondaryNum.innerHTML = formatColorName(name)
        alt.emit("setColors", {primary, secondary})
    }
    
    htmlSliderPearl.oninput = function () {
        primary.pearl = parseInt(this.value)
        let name = colors[primary.colorType].colors[this.value].name
        name = formatColorName(name)
        htmlShowPearl.innerHTML = name
        alt.emit("setColors", {primary, secondary})
    }
    
    htmlColorPrimaryType.append(htmlNamePrimaryType, htmlSelectorPrimaryType)
    htmlColorPrimaryNum.append(htmlSliderPrimaryNumDiv, htmlShowPrimaryNum)
    htmlColorSecondaryType.append(htmlNameSecondaryType, htmlSelectorSecondaryType)
    htmlColorSecondaryNum.append(htmlSliderSecondaryNumDiv, htmlShowSecondaryNum)
    htmlColorPearlNum.append(htmlSliderPearlDiv, htmlShowPearl)
    htmlColorPearl.append(htmlNamePearl, htmlColorPearlNum)

    htmlGenerated.append(htmlColorPrimaryType, htmlColorPrimaryNum, htmlColorSecondaryType, htmlColorSecondaryNum, htmlColorPearl)

}


///////////////////////////////////////////////////////////////////////////


function initNeons (data) {
    appLoaded = "neons"
    console.log(data)

    let htmlNeonType = document.createElement("neon")
    let htmlNeonNum = document.createElement("neon")
    
    let htmlNeonTypeName = document.createElement('strong')
    htmlNeonTypeName.innerHTML = "Type"
    let [htmlSliderTypeDiv, htmlSliderType] = createSlider(type, typeMax)
    let htmlShowType = document.createElement('strong')
    htmlShowType.className = "show"
    htmlShowType.innerHTML = data[typeIndex].name

    let htmlNameNum = document.createElement('strong')
    htmlNameNum.innerHTML = "Num"
    let [htmlSliderNumDiv, htmlSliderNum] = createSlider(num, numMax)
    let htmlShowNum = document.createElement('strong')
    htmlShowNum.className = "show"
    htmlShowNum.innerHTML = num

    htmlSliderType.oninput = function () {
        alt.emit("setNeons", null)
    }
    
    htmlSliderNum.oninput = function () {
        alt.emit("setNeons", null)
    }

    htmlNeonType.append(htmlNeonTypeName, htmlSliderTypeDiv, htmlShowType)
    htmlNeonNum.append(htmlNameNum, htmlSliderNumDiv, htmlShowNum)
    htmlGenerated.append(htmlNeonType, htmlNeonNum)

}


//alt.on('initNeon:return', data => {
//    neonData = data
//    restoreData.neon = data
//
//    initNeon()
//})

/*
function initNeon () {

    appLoaded = "neon"

    var tr = document.createElement('tr')
    var td = document.createElement('td')

    const h2Color = document.createElement('h2')
    h2Color.innerHTML = "Color"

    const color = document.createElement('input')
    color.type = "color" ; color.id = "type" ; color.value = rgbToHex(neonData)
        
    tr.append(td) ; td.append(h2Color, color) ; html.append(tr)

    var tr = document.createElement('tr')
    var td = document.createElement('td')

    const onBut = document.createElement('button')
    const offBut = document.createElement('button')
    onBut.innerHTML = "On" ; offBut.innerHTML = "Off"
    tr.append(td) ; td.append(offBut, onBut) ; html.append(tr)




    color.oninput = function () {
        neonData = hexToRgb(this.value)
        //alt.emit("client:SetNeon", neonData)
    }

    onBut.addEventListener("click", function(event){
        neonData = {r: 255, g: 255, b: 255}
        updateColorInput(color)
        //neonData.on = "enable"
        //alt.emit('client:SetNeon', neonData)

    })

    offBut.addEventListener("click", function(event){
        neonData = {r: 0, g: 0, b: 0}
        updateColorInput(color)
        //neonData.on = "disable"
        //alt.emit('client:SetNeon', neonData)

    })


}
*/

/*
function updateColorInput (input) {
    input.value = rgbToHex(neonData)
}
*/

function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}

function componentToHex(c) {
    let hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(rgb) {
    return "#" + componentToHex(rgb.r) + componentToHex(rgb.g) + componentToHex(rgb.b);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatColorName (name) {
    name = name.toLowerCase()
    name = name.replaceAll  ('_', ' ')
    name = capitalizeFirstLetter(name)
    return name
}


const modList = [
    "Spoilers",
    "Front Bumper",
    "Rear Bumper",
    "Side skirt",
    "Exhaust",
    "Frame",
    "Grille",
    "Bonnet",
    "Left Wing",
    "Right wing",
    "Roof",
    "Engine",
    "Brakes",
    "Transmission",
    "Horns",
    "Suspension",
    "Armor",
    "",
    "Turbo",
    "",
    "Custom tire smoke",
    "",
    "Xenon",
    "Front Wheels",
    "Back Wheels",
    "Plate holders",
    "Plate vanity",
    "Trim Design",
    "Ornaments",
    "",
    "Dial Design",
    "Door interior",
    "Seats",
    "Steering Wheel",
    "Shift Lever",
    "Plaques",
    "Rear shelf",
    "Trunk",
    "Hydraulics",
    "Engine block",
    "Air filter",
    "Strut bar",
    "Arch Cover",
    "Antenna",
    "Exterior parts",
    "Tank",
    "Door",
    "WHEELS_REAR_OR_HYDRAULICS",
    "Livery",
]

const wheelTypeList = ["Sport", "Muscle", "Lowrider", "SUV", "Tout Terrain", "Tuner", "Moto", /*"Haut de Gamme"*/"Luxe", "Rue", /*"Rue Rouillés"*/"Rue", "Circuit", "Tunning 1", "Tunning 2"]
//const colorTypeList = ["Normal", "Metallic", "Pearl", "Matte", "Metal", "Chrome", "Chameleon"]

const colors = [
    {
        index: 0,
        name: "Normal",
        count: 75,
        colors: [
            {index: 0, name: "BLACK"},
            {index: 1, name: "BLACK_GRAPHITE"},
            {index: 2, name: "GRAPHITE"},
            {index: 3, name: "ANTHR_BLACK"},
            {index: 4, name: "BLACK_STEEL"},
            {index: 5, name: "DARK_SILVER"},
            {index: 6, name: "SILVER"},
            {index: 7, name: "BLUE_SILVER"},
            {index: 8, name: "ROLLED_STEEL"},
            {index: 9, name: "SHADOW_SILVER"},
            {index: 10, name: "STONE_SILVER"},
            {index: 11, name: "MIDNIGHT_SILVER"},
            {index: 12, name: "CAST_IRON_SIL"},
            {index: 13, name: "RED"},
            {index: 14, name: "TORINO_RED"},
            {index: 15, name: "FORMULA_RED"},
            {index: 16, name: "LAVA_RED"},
            {index: 17, name: "BLAZE_RED"},
            {index: 18, name: "GRACE_RED"},
            {index: 19, name: "GARNET_RED"},
            {index: 20, name: "SUNSET_RED"},
            {index: 21, name: "CABERNET_RED"},
            {index: 22, name: "WINE_RED"},
            {index: 23, name: "CANDY_RED"},
            {index: 24, name: "HOT_PINK"},
            {index: 25, name: "PINK"},
            {index: 26, name: "SALMON_PINK"},
            {index: 27, name: "SUNRISE_ORANGE"},
            {index: 28, name: "ORANGE"},
            {index: 29, name: "BRIGHT_ORANGE"},
            {index: 30, name: "GOLD"},
            {index: 31, name: "BRONZE"},
            {index: 32, name: "YELLOW"},
            {index: 33, name: "RACE_YELLOW"},
            {index: 34, name: "FLUR_YELLOW"},
            {index: 35, name: "DARK_GREEN"},
            {index: 36, name: "RACING_GREEN"},
            {index: 37, name: "SEA_GREEN"},
            {index: 38, name: "OLIVE_GREEN"},
            {index: 39, name: "BRIGHT_GREEN"},
            {index: 40, name: "PETROL_GREEN"},
            {index: 41, name: "LIME_GREEN"},
            {index: 42, name: "MIDNIGHT_BLUE"},
            {index: 43, name: "GALAXY_BLUE"},
            {index: 44, name: "DARK_BLUE"},
            {index: 45, name: "SAXON_BLUE"},
            {index: 46, name: "BLUE"},
            {index: 47, name: "MARINER_BLUE"},
            {index: 48, name: "HARBOR_BLUE"},
            {index: 49, name: "DIAMOND_BLUE"},
            {index: 50, name: "SURF_BLUE"},
            {index: 51, name: "NAUTICAL_BLUE"},
            {index: 52, name: "RACING_BLUE"},
            {index: 53, name: "ULTRA_BLUE"},
            {index: 54, name: "LIGHT_BLUE"},
            {index: 55, name: "CHOCOLATE_BROWN"},
            {index: 56, name: "BISON_BROWN"},
            {index: 57, name: "CREEK_BROWN"},
            {index: 58, name: "UMBER_BROWN"},
            {index: 59, name: "MAPLE_BROWN"},
            {index: 60, name: "BEECHWOOD_BROWN"},
            {index: 61, name: "SIENNA_BROWN"},
            {index: 62, name: "SADDLE_BROWN"},
            {index: 63, name: "MOSS_BROWN"},
            {index: 64, name: "WOODBEECH_BROWN"},
            {index: 65, name: "STRAW_BROWN"},
            {index: 66, name: "SANDY_BROWN"},
            {index: 67, name: "BLEECHED_BROWN"},
            {index: 68, name: "PURPLE"},
            {index: 69, name: "SPIN_PURPLE"},
            {index: 70, name: "MIGHT_PURPLE"},
            {index: 71, name: "BRIGHT_PURPLE"},
            {index: 72, name: "CREAM"},
            {index: 73, name: "WHITE"},
            {index: 74, name: "FROST_WHITE"}
        ]
    },
    
    {
        index: 1,
        name: "Metallic",
        count: 75,
        colors: [
            {index: 0, name: "BLACK"},
            {index: 1, name: "BLACK_GRAPHITE"},
            {index: 2, name: "GRAPHITE"},
            {index: 3, name: "ANTHR_BLACK"},
            {index: 4, name: "BLACK_STEEL"},
            {index: 5, name: "DARK_SILVER"},
            {index: 6, name: "SILVER"},
            {index: 7, name: "BLUE_SILVER"},
            {index: 8, name: "ROLLED_STEEL"},
            {index: 9, name: "SHADOW_SILVER"},
            {index: 10, name: "STONE_SILVER"},
            {index: 11, name: "MIDNIGHT_SILVER"},
            {index: 12, name: "CAST_IRON_SIL"},
            {index: 13, name: "RED"},
            {index: 14, name: "TORINO_RED"},
            {index: 15, name: "FORMULA_RED"},
            {index: 16, name: "LAVA_RED"},
            {index: 17, name: "BLAZE_RED"},
            {index: 18, name: "GRACE_RED"},
            {index: 19, name: "GARNET_RED"},
            {index: 20, name: "SUNSET_RED"},
            {index: 21, name: "CABERNET_RED"},
            {index: 22, name: "WINE_RED"},
            {index: 23, name: "CANDY_RED"},
            {index: 24, name: "HOT_PINK"},
            {index: 25, name: "PINK"},
            {index: 26, name: "SALMON_PINK"},
            {index: 27, name: "SUNRISE_ORANGE"},
            {index: 28, name: "ORANGE"},
            {index: 29, name: "BRIGHT_ORANGE"},
            {index: 30, name: "GOLD"},
            {index: 31, name: "BRONZE"},
            {index: 32, name: "YELLOW"},
            {index: 33, name: "RACE_YELLOW"},
            {index: 34, name: "FLUR_YELLOW"},
            {index: 35, name: "DARK_GREEN"},
            {index: 36, name: "RACING_GREEN"},
            {index: 37, name: "SEA_GREEN"},
            {index: 38, name: "OLIVE_GREEN"},
            {index: 39, name: "BRIGHT_GREEN"},
            {index: 40, name: "PETROL_GREEN"},
            {index: 41, name: "LIME_GREEN"},
            {index: 42, name: "MIDNIGHT_BLUE"},
            {index: 43, name: "GALAXY_BLUE"},
            {index: 44, name: "DARK_BLUE"},
            {index: 45, name: "SAXON_BLUE"},
            {index: 46, name: "BLUE"},
            {index: 47, name: "MARINER_BLUE"},
            {index: 48, name: "HARBOR_BLUE"},
            {index: 49, name: "DIAMOND_BLUE"},
            {index: 50, name: "SURF_BLUE"},
            {index: 51, name: "NAUTICAL_BLUE"},
            {index: 52, name: "RACING_BLUE"},
            {index: 53, name: "ULTRA_BLUE"},
            {index: 54, name: "LIGHT_BLUE"},
            {index: 55, name: "CHOCOLATE_BROWN"},
            {index: 56, name: "BISON_BROWN"},
            {index: 57, name: "CREEK_BROWN"},
            {index: 58, name: "UMBER_BROWN"},
            {index: 59, name: "MAPLE_BROWN"},
            {index: 60, name: "BEECHWOOD_BROWN"},
            {index: 61, name: "SIENNA_BROWN"},
            {index: 62, name: "SADDLE_BROWN"},
            {index: 63, name: "MOSS_BROWN"},
            {index: 64, name: "WOODBEECH_BROWN"},
            {index: 65, name: "STRAW_BROWN"},
            {index: 66, name: "SANDY_BROWN"},
            {index: 67, name: "BLEECHED_BROWN"},
            {index: 68, name: "PURPLE"},
            {index: 69, name: "SPIN_PURPLE"},
            {index: 70, name: "MIGHT_PURPLE"},
            {index: 71, name: "BRIGHT_PURPLE"},
            {index: 72, name: "CREAM"},
            {index: 73, name: "WHITE"},
            {index: 74, name: "FROST_WHITE"}
        ]
    },

    {
        index: 2,
        name: "Pearl",
        count: 74,
        colors: [
            //{index: 0, name: "BLACK"},
            {index: 1, name: "BLACK_GRAPHITE"},
            {index: 2, name: "GRAPHITE"},
            {index: 3, name: "ANTHR_BLACK"},
            {index: 4, name: "BLACK_STEEL"},
            {index: 5, name: "DARK_SILVER"},
            {index: 6, name: "SILVER"},
            {index: 7, name: "BLUE_SILVER"},
            {index: 8, name: "ROLLED_STEEL"},
            {index: 9, name: "SHADOW_SILVER"},
            {index: 10, name: "STONE_SILVER"},
            {index: 11, name: "MIDNIGHT_SILVER"},
            {index: 12, name: "CAST_IRON_SIL"},
            {index: 13, name: "RED"},
            {index: 14, name: "TORINO_RED"},
            {index: 15, name: "FORMULA_RED"},
            {index: 16, name: "LAVA_RED"},
            {index: 17, name: "BLAZE_RED"},
            {index: 18, name: "GRACE_RED"},
            {index: 19, name: "GARNET_RED"},
            {index: 20, name: "SUNSET_RED"},
            {index: 21, name: "CABERNET_RED"},
            {index: 22, name: "WINE_RED"},
            {index: 23, name: "CANDY_RED"},
            {index: 24, name: "HOT_PINK"},
            {index: 25, name: "PINK"},
            {index: 26, name: "SALMON_PINK"},
            {index: 27, name: "SUNRISE_ORANGE"},
            {index: 28, name: "ORANGE"},    //red
            {index: 29, name: "BRIGHT_ORANGE"},
            {index: 30, name: "GOLD"},
            {index: 31, name: "BRONZE"},
            {index: 32, name: "YELLOW"},
            {index: 33, name: "RACE_YELLOW"},
            {index: 34, name: "FLUR_YELLOW"},
            {index: 35, name: "DARK_GREEN"},
            {index: 36, name: "RACING_GREEN"},
            {index: 37, name: "SEA_GREEN"},
            {index: 38, name: "OLIVE_GREEN"},
            {index: 39, name: "BRIGHT_GREEN"},
            {index: 40, name: "PETROL_GREEN"},
            {index: 41, name: "LIME_GREEN"},
            {index: 42, name: "MIDNIGHT_BLUE"},
            {index: 43, name: "GALAXY_BLUE"},
            {index: 44, name: "DARK_BLUE"},
            {index: 45, name: "SAXON_BLUE"},
            {index: 46, name: "BLUE"},
            {index: 47, name: "MARINER_BLUE"},
            {index: 48, name: "HARBOR_BLUE"},
            {index: 49, name: "DIAMOND_BLUE"},
            {index: 50, name: "SURF_BLUE"}, //blue
            {index: 51, name: "NAUTICAL_BLUE"},
            {index: 52, name: "RACING_BLUE"},
            {index: 53, name: "ULTRA_BLUE"}, //Bright purple
            {index: 54, name: "LIGHT_BLUE"},
            {index: 55, name: "CHOCOLATE_BROWN"},
            {index: 56, name: "BISON_BROWN"},
            {index: 57, name: "CREEK_BROWN"},
            {index: 58, name: "UMBER_BROWN"},
            {index: 59, name: "MAPLE_BROWN"},
            {index: 60, name: "BEECHWOOD_BROWN"},
            {index: 61, name: "SIENNA_BROWN"},
            {index: 62, name: "SADDLE_BROWN"},
            {index: 63, name: "MOSS_BROWN"},
            {index: 64, name: "WOODBEECH_BROWN"},
            {index: 65, name: "STRAW_BROWN"},
            {index: 66, name: "SANDY_BROWN"},
            {index: 67, name: "BLEECHED_BROWN"},
            {index: 68, name: "PURPLE"},
            {index: 69, name: "SPIN_PURPLE"},
            {index: 70, name: "MIGHT_PURPLE"},
            {index: 71, name: "BRIGHT_PURPLE"}, //ultra blue
            {index: 72, name: "CREAM"},
            {index: 73, name: "WHITE"},
            {index: 74, name: "FROST_WHITE"}
            /*
            {"type":2,index: 0, name: "BLACK"},
            {"type":2,index: 1, name: "BLACK"},
            {"type":2,index: 2, name: "BLACK"},
            {"type":2,index: 3, name: "BLACK"},
            {"type":2,index: 4, name: "BLACK"},
            {"type":2,index: 5, name: "BLACK"},
            {"type":2,index: 6, name: "BLACK"},
            {"type":2,index: 7, name: "BLACK"},
            {"type":2,index: 8, name: "BLACK"},
            {"type":2,index: 9, name: "BLACK"},
            {"type":2,index: 10, name: "BLACK"},
            {"type":2,index: 11, name: "BLACK"},
            {"type":2,index: 12, name: "BLACK"},
            {"type":2,index: 13, name: "BLACK"},
            {"type":2,index: 14, name: "BLACK"},
            {"type":2,index: 15, name: "BLACK"},
            {"type":2,index: 16, name: "BLACK"},
            {"type":2,index: 17, name: "BLACK"},
            {"type":2,index: 18, name: "BLACK"},
            {"type":2,index: 19, name: "BLACK"},
            {"type":2,index: 20, name: "BLACK"},
            {"type":2,index: 21, name: "BLACK"},
            {"type":2,index: 22, name: "BLACK"},
            {"type":2,index: 23, name: "BLACK"},
            {"type":2,index: 24, name: "BLACK"},
            {"type":2,index: 25, name: "BLACK"},
            {"type":2,index: 26, name: "BLACK"},
            {"type":2,index: 27, name: "BLACK"},
            {"type":2,index: 28, name: "BLACK"},
            {"type":2,index: 29, name: "BLACK"},
            {"type":2,index: 30, name: "BLACK"},
            {"type":2,index: 31, name: "BLACK"},
            {"type":2,index: 32, name: "BLACK"},
            {"type":2,index: 33, name: "BLACK"},
            {"type":2,index: 34, name: "BLACK"},
            {"type":2,index: 35, name: "BLACK"},
            {"type":2,index: 36, name: "BLACK"},
            {"type":2,index: 37, name: "BLACK"},
            {"type":2,index: 38, name: "BLACK"},
            {"type":2,index: 39, name: "BLACK"},
            {"type":2,index: 40, name: "BLACK"},
            {"type":2,index: 41, name: "BLACK"},
            {"type":2,index: 42, name: "BLACK"},
            {"type":2,index: 43, name: "BLACK"},
            {"type":2,index: 44, name: "BLACK"},
            {"type":2,index: 45, name: "BLACK"},
            {"type":2,index: 46, name: "BLACK"},
            {"type":2,index: 47, name: "BLACK"},
            {"type":2,index: 48, name: "BLACK"},
            {"type":2,index: 49, name: "BLACK"},
            {"type":2,index: 50, name: "BLACK"},
            {"type":2,index: 51, name: "BLACK"},
            {"type":2,index: 52, name: "BLACK"},
            {"type":2,index: 53, name: "BLACK"},
            {"type":2,index: 54, name: "BLACK"},
            {"type":2,index: 55, name: "BLACK"},
            {"type":2,index: 56, name: "BLACK"},
            {"type":2,index: 57, name: "BLACK"},
            {"type":2,index: 58, name: "BLACK"},
            {"type":2,index: 59, name: "BLACK"},
            {"type":2,index: 60, name: "BLACK"},
            {"type":2,index: 61, name: "BLACK"},
            {"type":2,index: 62, name: "BLACK"},
            {"type":2,index: 63, name: "BLACK"},
            {"type":2,index: 64, name: "BLACK"},
            {"type":2,index: 65, name: "BLACK"},
            {"type":2,index: 66, name: "BLACK"},
            {"type":2,index: 67, name: "BLACK"},
            {"type":2,index: 68, name: "BLACK"},
            {"type":2,index: 69, name: "BLACK"},
            {"type":2,index: 70, name: "BLACK"},
            {"type":2,index: 71, name: "BLACK"},
            {"type":2,index: 72, name: "BLACK"},
            {"type":2,index: 73, name: "BLACK"}
            */
        ]
    },

    {
        index: 3,
        name: "Matte",
        count: 20,
        colors: [
            {index: 0, name: "BLACK"},
            {index: 1, name: "GREY"},
            {index: 2, name: "LIGHT_GREY"},
            {index: 3, name: "WHITE"},
            {index: 4, name: "BLUE"},
            {index: 5, name: "DARK_BLUE"},
            {index: 6, name: "MIDNIGHT_BLUE"},
            {index: 7, name: "MIGHT_PURPLE"},
            {index: 8, name: "Purple"},
            {index: 9, name: "RED"},
            {index: 10, name: "DARK_RED"},
            {index: 11, name: "ORANGE"},
            {index: 12, name: "YELLOW"},
            {index: 13, name: "LIME_GREEN"},
            {index: 14, name: "GREEN"},
            {index: 15, name: "MATTE_FOR"},
            {index: 16, name: "MATTE_FOIL"},
            {index: 17, name: "MATTE_OD"},
            {index: 18, name: "MATTE_DIRT"},
            {index: 19, name: "MATTE_DESERT"}
        ]
    },
    
    {
        index: 4,
        name: "Metal",
        count: 5,
        colors: [
            {index: 0, name: "BR_STEEL"},
            {index: 1, name: "BR_BLACK_STEEL"},
            {index: 2, name: "BR_ALUMINIUM"},
            {index: 3, name: "GOLD_P"},
            {index: 4, name: "GOLD_S"}
        ]
    },
    
    {
        index: 5,
        name: "Chrome",
        count: 1,
        colors: [
            {index: 0, name: "CHROME"},
        ]
    },

    {
        index: 6,
        name: "Chameleon",
        count: 10,
        colors: [
            {index: 0, name: "ANOD_RED"},
            {index: 1, name: "ANOD_BLUE"},
            {index: 2, name: "ANOD_GOLD"},
            {index: 3, name: "GREEN_BLUE_FLIP"},
            {index: 4, name: "PURP_GREEN_FLIP"},
            {index: 5, name: "ORANG_PURP_FLIP"},
            {index: 6, name: "DARKPURPLEPEARL"},
            {index: 7, name: "BLUE_PEARL"},
            {index: 8, name: "RED_PRISMA"},
            {index: 9, name: "BLACK_PRISMA"}
        ]
    }
]
