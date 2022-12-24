
const butNodeList = document.querySelectorAll("button")
const buttonList = Array.prototype.slice.call(butNodeList)
const checkNodeList = document.querySelectorAll("input[type=checkbox]")
const checkboxList = Array.prototype.slice.call(checkNodeList)

function sendEvent () {
    alt.emit("menu:event", {id: this.id, checked: this.checked})
}

buttonList.forEach(button => button.onclick = sendEvent)
checkboxList.forEach(checkbox => checkbox.onchange = sendEvent)

alt.on("resourcesAvailable", (resources, vehicle) => {
    buttonList.forEach(button => {
        if (!resources[button.className])
            button.disabled = true

        if (button.id == "modVeh" && !vehicle)
            button.disabled = true  
    })
})

alt.on("nametag:diplay", (enabled) => {
    const check = document.getElementById("nametag")
    check.checked = enabled
})