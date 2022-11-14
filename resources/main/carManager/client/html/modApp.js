
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
            
        case "color":
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
    let slider = document.createElement("input")
    slider.type = "range"
    slider.class = "slider"
    slider.max = max
    slider.value = value
    return slider
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
                let htmlButton = document.createElement("button")
                htmlButton.className = "toogleMod"
                htmlButton.id = !!num
                htmlButton.innerHTML = !!num
                htmlButton.onclick = function () {
                    const bool = (this.innerHTML != "true")
                    this.id = bool
                    this.innerHTML = bool
                    alt.emit("toogleMod", [modType, bool])
                }
                htmlMod.append(htmlButton)
                break;
        
            default:
                if (count == 0) continue
                let htmlSelector = createSlider(num, count)
                let htmlShow = document.createElement('strong')
                htmlShow.className = "show"
                htmlShow.innerHTML = num

                htmlSelector.oninput = function () {
                    let modNum = parseInt(this.value)
                    htmlShow.innerHTML = modNum
                    alt.emit("setMod", [modType, modNum])
                }
                htmlMod.append(htmlSelector, htmlShow)
                break;
        }
        htmlGenerated.append(htmlMod)
    }
}


///////////////////////////////////////////////////////////////////////////

//  alt.on('initColor:return', data => {
//      colorData = data    
//      restoreData.color = data
//  
//      initColor()
//  
//  })


/*
function initColor () {

    appLoaded = "color"

    ////    Création de la page html    ////

    const colorDoc = [
        {name: 'type', max: 5},
        {name: 'color', max: 75}
    ]
    const Title = ['Prim', 'Second']

    for (var i=1 ; i <= 2 ; i++) {

        var trTitle = document.createElement('tr')
        var h1Title = document.createElement('h1')
        h1Title.innerHTML = Title[i-1] + "ary Color"
        
        trTitle.append(h1Title) ; html.append(trTitle)

        for (var elem of colorDoc) {

            const name = elem.name + i

            var tr = document.createElement('tr')
            var td = document.createElement('td')
            const colorSld = document.createElement('input')
            colorSld.type = "range" ; colorSld.id = elem.name ; colorSld.max = elem.max ; colorSld.value = colorData[i-1][elem.name]

            const show = document.createElement('h3')
            
            show.id = "show" + name ; show.innerHTML = colorData[i-1][elem.name]
            //  if (elem.name == "type") show.innerHTML = colorsId[colorData[i-1][elem.name]].name
            var h3 = document.createElement('h3')
            h3.innerHTML = elem.name

            td.append(h3, colorSld, show) ; tr.append(td) ; html.append(tr)

            slider[name] = {sld: colorSld, show: show}

            colorSld.oninput = function () {
                show.innerHTML = this.value

                updateColorSliders(colorSld)

                if (show.id.indexOf('type') > 0) show.innerHTML = colorsId[this.value].name
                colorData[0] = {type: slider["type1"].sld.value, color: slider["color1"].sld.value}
                colorData[1] = {type: slider["type2"].sld.value, color: slider["color2"].sld.value}

                //alt.emit('client:SetColor', colorData)
            }
        }
    }
}
*/


/*
function updateColorSliders (slider) {
    //for (var i=1 ; i<=2 ; i++) slider["color" +i].max = colorsId[slider["type" +i].value].max

    //if (slider.id == "type1") slider["color1"].max = 


    //console.log(slider["type1"].value)
    //slider["color1"].max = colorsId[slider["type1"].value].max
    //slider["color2"].max = colorsId[slider["type2"].value].max
}
*/


///////////////////////////////////////////////////////////////////////////


function initWheels (data) {
    appLoaded = "wheels"

    let {typeIndex, wheelNum, wheelTypeCount} = data.restore
    
    let htmlWheelType = document.createElement("wheel")
    let htmlWheelNum = document.createElement("wheel")
    
    let htmlNameType = document.createElement('strong')
    htmlNameType.innerHTML = "Type"
    let htmlSelectorType = createSlider(typeIndex, wheelTypeCount)
    let htmlShowType = document.createElement('strong')
    htmlShowType.className = "show"
    htmlShowType.innerHTML = data[typeIndex].name

    let htmlNameNum = document.createElement('strong')
    htmlNameNum.innerHTML = "Num"
    let htmlSelectorNum = createSlider(wheelNum, data[typeIndex].count)
    let htmlShowNum = document.createElement('strong')
    htmlShowNum.className = "show"
    htmlShowNum.innerHTML = origine(wheelNum)
    htmlSelectorType.oninput = function () {
        typeIndex = parseInt(this.value)
        htmlShowType.innerHTML = data[typeIndex].name
        const max = data[typeIndex].count
        htmlSelectorNum.max = max
        if (htmlSelectorNum.value > max) {
            htmlSelectorNum.value = max
            htmlShowNum.innerHTML = max
        }
        alt.emit("setWheels", {typeIndex, wheelNum})
    }
    
    htmlSelectorNum.oninput = function () {
        wheelNum = parseInt(this.value)
        htmlShowNum.innerHTML = origine(wheelNum)
        alt.emit("setWheels", {typeIndex, wheelNum})
    }
    
    let htmlWheelBut = document.createElement("wheel")
    let htmlOrigineBut = document.createElement("button")
    htmlOrigineBut.innerHTML = "Jantes d'origine"
    htmlOrigineBut.onclick = function () {
        const origine = 0
        htmlSelectorNum.value = origine
        wheelNum = origine
        htmlShowNum.innerHTML = "Origine"
        alt.emit("setWheels", {typeIndex, wheelNum: origine})
    }

    htmlWheelType.append(htmlNameType, htmlSelectorType, htmlShowType)
    htmlWheelNum.append(htmlNameNum, htmlSelectorNum, htmlShowNum)
    htmlWheelBut.append(htmlOrigineBut)
    htmlGenerated.append(htmlWheelType, htmlWheelNum, htmlWheelBut)
}

function origine (wheelNum) {
    if (wheelNum == 0)
        return "Origine"
    return wheelNum
}


///////////////////////////////////////////////////////////////////////////


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
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(rgb) {
    return "#" + componentToHex(rgb.r) + componentToHex(rgb.g) + componentToHex(rgb.b);
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


const colorsId = [
    {name: "Pearl", max: 74},
    {name: 1, max: 74},
    {name: "Normal", max: 73},
    {name: "Matte", max: 19},
    {name: "Metal", max: 3},
    {name: "Chrome", max: 1},
]

const colorsSwitch = {
    0	: {type: 1, name: "Black"},
    1	: {type: 1, name: "Graphite Black"},
    2	: {type: 1, name: "Black Steal"},
    3	: {type: 1, name: "Dark Silver"},
    4	: {type: 1, name: "Silver"},
    5	: {type: 1, name: "Blue Silver"},
    6	: {type: 1, name: "Steel Gray"},
    7	: {type: 1, name: "Shadow Silver"},
    8	: {type: 1, name: "Stone Silver"},
    9	: {type: 1, name: "Midnight Silver"},
    10	: {type: 1, name: "Gun Metal"},
    11	: {type: 1, name: "Anthracite Grey"},
    27	: {type: 1, name: "Red"},
    28	: {type: 1, name: "Torino Red"},
    29	: {type: 1, name: "Formula Red"},
    30	: {type: 1, name: "Blaze Red"},
    31	: {type: 1, name: "Graceful Red"},
    32	: {type: 1, name: "Garnet Red"},
    33	: {type: 1, name: "Desert Red"},
    34	: {type: 1, name: "Cabernet Red"},
    35	: {type: 1, name: "Candy Red"},
    36	: {type: 1, name: "Sunrise Orange"},
    37	: {type: 1, name: "Classic Gold"},
    38	: {type: 1, name: "Orange"},
    49	: {type: 1, name: "Dark Green"},
    50	: {type: 1, name: "Racing Green"},
    51	: {type: 1, name: "Sea Green"},
    52	: {type: 1, name: "Olive Green"},
    53	: {type: 1, name: "Green"},
    54	: {type: 1, name: "Gasoline Blue Green"},
    61	: {type: 1, name: "Midnight Blue"},
    62	: {type: 1, name: "Dark Blue"},
    63	: {type: 1, name: "Saxony Blue"},
    64	: {type: 1, name: "Blue"},
    65	: {type: 1, name: "Mariner Blue"},
    66	: {type: 1, name: "Harbor Blue"},
    67	: {type: 1, name: "Diamond Blue"},
    68	: {type: 1, name: "Surf Blue"},
    69	: {type: 1, name: "Nautical Blue"},
    70	: {type: 1, name: "Bright Blue"},
    71	: {type: 1, name: "Purple Blue"},
    72	: {type: 1, name: "Spinnaker Blue"},
    73	: {type: 1, name: "Ultra Blue"},
    74	: {type: 1, name: "Bright Blue"},
    88	: {type: 1, name: "Taxi Yellow"},
    89	: {type: 1, name: "Race Yellow"},
    90	: {type: 1, name: "Bronze"},
    91	: {type: 1, name: "Yellow Bird"},
    92	: {type: 1, name: "Lime"},
    93	: {type: 1, name: "Champagne"},
    94	: {type: 1, name: "Pueblo Beige"},
    95	: {type: 1, name: "Dark Ivory"},
    96	: {type: 1, name: "Choco Brown"},
    97	: {type: 1, name: "Golden Brown"},
    98	: {type: 1, name: "Light Brown"},
    99	: {type: 1, name: "Straw Beige"},
    100	: {type: 1, name: "Moss Brown"},
    101	: {type: 1, name: "Biston Brown"},
    102	: {type: 1, name: "Beechwood"},
    103	: {type: 1, name: "Dark Beechwood"},
    104	: {type: 1, name: "Choco Orange"},
    105	: {type: 1, name: "Beach Sand"},
    106	: {type: 1, name: "Sun Bleeched Sand"},
    107	: {type: 1, name: "Cream"},
    111	: {type: 1, name: "White"},
    112	: {type: 1, name: "Frost White"},
    125	: {type: 1, name: "Securicor Green"},
    137	: {type: 1, name: "Vermillion Pink"},
    141	: {type: 1, name: "Black Blue"},
    142	: {type: 1, name: "Black Purple"},
    143	: {type: 1, name: "Black Red"},
    145	: {type: 1, name: "Purple"},
    146	: {type: 1, name: "V Dark Blue"},
    150	: {type: 1, name: "Lava Red"},
    12	: {type: "Matte", name: "Black"},
    13	: {type: "Matte", name: "Gray"},
    14	: {type: "Matte", name: "Light Grey"},
    39	: {type: "Matte", name: "Red"},
    40	: {type: "Matte", name: "Dark Red"},
    41	: {type: "Matte", name: "Orange"},
    42	: {type: "Matte", name: "Yellow"},
    55	: {type: "Matte", name: "Lime Green"},
    82	: {type: "Matte", name: "Dark Blue"},
    83	: {type: "Matte", name: "Blue"},
    84	: {type: "Matte", name: "Midnight Blue"},
    128	: {type: "Matte", name: "Green"},
    129	: {type: "Matte", name: "Brown"},
    148	: {type: "Matte", name: "Purple"},
    149	: {type: "Matte", name: "Dark Purple"},
    151	: {type: "Matte", name: "Forest Green"},
    152	: {type: "Matte", name: "Olive Drab"},
    153	: {type: "Matte", name: "Desert Brown"},
    154	: {type: "Matte", name: "Desert Tan"},
    155	: {type: "Matte", name: "Foilage Green"},
    131	: {type: "Matte", name: "White"},
    15	: {type: "Normal", name: " Black"},
    16	: {type: "Normal", name: " Black Poly"},
    17	: {type: "Normal", name: " Dark silver"},
    18	: {type: "Normal", name: " Silver"},
    19	: {type: "Normal", name: " Gun Metal"},
    20	: {type: "Normal", name: " Shadow Silver"},
    21	: {type: "Normal", name: " Black"},
    22	: {type: "Normal", name: " Graphite"},
    23	: {type: "Normal", name: " Silver Grey"},
    24	: {type: "Normal", name: " Silver"},
    25	: {type: "Normal", name: " Blue Silver"},
    26	: {type: "Normal", name: " Shadow Silver"},
    43	: {type: "Normal", name: " Red"},
    44	: {type: "Normal", name: " Bright Red"},
    45	: {type: "Normal", name: " Garnet Red"},
    46	: {type: "Normal", name: " Red"},
    47	: {type: "Normal", name: " Golden Red"},
    48	: {type: "Normal", name: " Dark Red"},
    56	: {type: "Normal", name: " Dark Green"},
    57	: {type: "Normal", name: " Green"},
    58	: {type: "Normal", name: " Dark Green"},
    59	: {type: "Normal", name: " Green"},
    60	: {type: "Normal", name: " Sea Wash"},
    75	: {type: "Normal", name: " Dark Blue"},
    76	: {type: "Normal", name: " Midnight Blue"},
    77	: {type: "Normal", name: " Blue"},
    78	: {type: "Normal", name: " Sea Foam Blue"},
    79	: {type: "Normal", name: " Lightning blue"},
    80	: {type: "Normal", name: " Maui Blue Poly"},
    81	: {type: "Normal", name: " Bright Blue"},
    85	: {type: "Normal", name: " Dark blue"},
    86	: {type: "Normal", name: " Blue"},
    87	: {type: "Normal", name: " Light blue"},
    108	: {type: "Normal", name: " Brown"},
    109	: {type: "Normal", name: " Medium Brown"},
    110	: {type: "Normal", name: " Light Brown"},
    113	: {type: "Normal", name: " Honey Beige"},
    114	: {type: "Normal", name: " Brown"},
    115	: {type: "Normal", name: " Dark Brown"},
    116	: {type: "Normal", name: " straw beige"},
    121	: {type: "Normal", name: " Off White"},
    122	: {type: "Normal", name: " Off White"},
    123	: {type: "Normal", name: " Orange"},
    124	: {type: "Normal", name: " Light Orange"},
    126	: {type: "Normal", name: " Taxi Yellow"},
    127	: {type: "Normal", name: " Blue"},
    130	: {type: "Normal", name: " Orange"},
    132	: {type: "Normal", name: " White"},
    133	: {type: "Normal", name: " Olive Army Green"},
    134	: {type: "Normal", name: " Pure White"},
    135	: {type: "Normal", name: " Hot Pink"},
    136	: {type: "Normal", name: " Salmon pink"},
    138	: {type: "Normal", name: " Orange"},
    139	: {type: "Normal", name: " Green"},
    140	: {type: "Normal", name: " Blue"},
    144	: {type: "Normal", name: " hunter green"},
    147	: {type: "Normal", name: " MODSHOP BLACK1"},
    157	: {type: "Normal", name: " Epsilon Blue"},
}
