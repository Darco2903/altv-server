
let htmlGenerated = document.querySelector("generated")
let htmlSearch = document.querySelector("generatedSearch")
let template = document.querySelector(".template")
let htmlVeh = template.querySelector("veh")
let htmlImgs
let underscore


htmlGen()

function htmlGen () {
    Object.keys(vehiclesClass).forEach(Class => {
        let htmlVehClass = document.createElement("vehType")
        htmlVehClass.id = Class
        
        let htmlClassName = document.createElement("strong")
        htmlClassName.innerHTML = vehiclesClass[Class]
        htmlVehClass.append(htmlClassName)
        
        underscore = Class == "MOD" ? '_' : ''
        vehiclesByClass[Class].forEach(Name => htmlVehClass.append(htmlVehClone(Name)));        

        htmlGenerated.append(htmlVehClass)

    })
    addImgErrorListeners()
    addButtonListeners()
    initSearch()
}


function htmlVehClone (Name) {

    let html = htmlVeh.cloneNode(true)
    let [img, name] = html.children
    let vehShowName = vehicles[Name].DisplayName
    
    img.src += `${underscore}${Name}.webp`
    img.id = vehicles[Name].Hash
    
    name.innerHTML = vehShowName
    html.id = vehShowName.toLowerCase()
    
    htmlSearch.append(html.cloneNode(true))
    return html
}

function addImgErrorListeners () {
    let imgs = document.querySelectorAll("img")
    for (const img of imgs) {
        img.onerror = function () {
            const defaultImage = './vehimg/__notfound.webp'
            img.src = defaultImage;
        }
    }
}

function addButtonListeners () {
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