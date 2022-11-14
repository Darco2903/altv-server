
const nodeList = document.querySelectorAll("button")
const buttonList = Array.prototype.slice.call(nodeList)


alt.on("resourcesAvailable", (resources, vehicle) => {
    buttonList.forEach(button => {
        if (resources[button.className]) {
            button.onclick = function () {
                btnEvent(this.id)
            }
        } else {
            button.disabled = true
        }
        if (button.id == "modVeh" && !vehicle)
            button.disabled = true
        
    });
})


function btnEvent (id) {
    console.log(id);
    switch (id) {
        case "spawnVeh":
        case "modVeh":
            alt.emit("action", id)
            break;
    
        default:
            break;
    }
}

