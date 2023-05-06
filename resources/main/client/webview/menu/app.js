const buttons = selectMultiple("button");
const checkboxs = selectMultiple("input[type=checkbox]");
const carManager = document.getElementById("carManager");
const vehButtons = selectMultiple(".requireVehicle");

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
    alt.emit("event", this.id, this.checked);
    this.blur();
}

buttons.forEach((button) => (button.onclick = sendEvent));
checkboxs.forEach((checkbox) => (checkbox.onchange = sendEvent));

alt.on("vehicle", (state, hasId) => {
    Array.from(carManager.children).forEach((button) => {
        if (button.className.includes("requireVehicle")) button.disabled = !state;
    });
    if (state) {
        document.getElementById("register").disabled = hasId;
        document.getElementById("delete").disabled = !hasId;
    } else {
        document.getElementById("register").disabled = true;
        document.getElementById("delete").disabled = true;
    }
});

alt.on("nametag", (state) => {
    const checkbox = document.getElementById("nametag");
    checkbox.checked = state;
});
