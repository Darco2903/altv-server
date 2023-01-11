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
    alt.emit("event", { id: this.id, checked: this.checked });
    this.blur();
}

buttons.forEach((button) => (button.onclick = sendEvent));
checkboxs.forEach((checkbox) => (checkbox.onchange = sendEvent));

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

alt.on("nametag", (state) => {
    const check = document.getElementById("nametag");
    check.checked = state;
});
