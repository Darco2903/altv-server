const buttons = selectMultiple("button");
const checkboxs = selectMultiple("input[type=checkbox]");
const carManager = document.getElementById("carManager");
const vehButtons = selectMultiple(".requireVehicle");
const disabled = selectMultiple(".disabled");

if (window.alt === undefined) {
    window.alt = {
        emit: () => {},
        on: () => {},
    };
}

function selectMultiple(selectors) {
    const nodeList = document.querySelectorAll(selectors);
    return Array.prototype.slice.call(nodeList);
}

function sendEvent() {
    console.log("event");
    alt.emit("event", { id: this.id, checked: this.checked });
}

checkboxs.forEach((checkbox) => (checkbox.onchange = sendEvent));
buttons.forEach((button) => {
    //  button.disabled = true;
    button.onclick = sendEvent;
});

alt.on("resources", (resources) => {
    disabled.forEach((div) => {
        if (resources.includes(div.id)) div.className = "enabled";
        else div.className = "disabled";
    });
});

alt.on("vehicle", (playerInVehicle) => {
    Object.values(carManager.children).forEach((button) => {
        if (button.className === "requireVehicle") button.disabled = !playerInVehicle;
    });
});

alt.on("nametag", (enabled) => {
    const check = document.getElementById("nametag");
    check.checked = enabled;
});
