
let htmlGenerated = document.querySelector("generated")
let htmlSearch = document.querySelector("generatedSearch")
console.log(htmlSearch);

htmlGen()

function htmlGen () {
    Object.keys(carListByType).forEach(type => {
        let htmlVehType = document.createElement("vehType")
        htmlVehType.id = type

        let htmlTypeName = document.createElement("strong")
        htmlTypeName.innerHTML = type
        htmlVehType.append(htmlTypeName)
        
        carListByType[type].forEach(vehName => htmlVehType.append(htmlVeh(vehName, type)));        

        htmlGenerated.append(htmlVehType)

    })
    addListeners()
    initSearch()
}

function htmlVeh (vehName, type) {
    let html = document.createElement("veh")
    html.className = type

    let img = document.createElement("img")
    
    const underscore = type == "Mod" ? '_' : ''
    img.src = `./vehimg/${underscore}240px-${vehName}.png`
    img.className = "button"
    img.id = vehName
    
    let name = document.createElement("strong")
    let vehShowName = type != "Mod" ? vehName[0].toUpperCase() + vehName.substring(1) : nameSwap[vehName]

    name.innerHTML = vehShowName
    html.id = vehShowName.toLowerCase()

    html.append(img, name)
    htmlSearch.append(html.cloneNode(true))
    return html
}

function addListeners () {
    let buttons = document.getElementsByClassName("button");
    for(const but of buttons) {
       but.onclick = function() {
        alt.emit('spawnVehicle', this.id)
       }
    }
}

function initSearch () {
    const searchInput = document.querySelector("input")
    const vehNodeList = htmlSearch.querySelectorAll("veh")
    const htmlVehList = Array.prototype.slice.call(vehNodeList)

    searchInput.oninput = function () {
        htmlGenerated.setAttribute("notInSelection", !!this.value)
        htmlSearch.setAttribute("notInSelection", !this.value)
        const searchValue = this.value.toLowerCase()
        htmlVehList.forEach(htmlVeh => htmlVeh.setAttribute("notInSelection", !htmlVeh.id.includes(searchValue)))
    }
}