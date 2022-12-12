
const nodeList = document.querySelectorAll("button")
const buttonList = Array.prototype.slice.call(nodeList)

buttonList.forEach(button => {
    button.onclick = function () {
        //btnEvent(this.id)
        alt.emit("loadWebView", this.id)
    }
})

alt.on("resourcesAvailable", (resources, vehicle) => {
    buttonList.forEach(button => {
        if (!resources[button.className])
            button.disabled = true

        if (button.id == "modVeh" && !vehicle)
            button.disabled = true  
    })
})

/*
function btnEvent (id) {
    console.log(id);
    switch (id) {
        case "spawnVeh":
        case "modVeh":
            alt.emit("loadWebView", id)
            break;
    
        default:
            break;
    }
}
*/