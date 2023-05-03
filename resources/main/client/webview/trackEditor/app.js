if (window.alt === undefined) {
    window.alt = {
        emit: () => {},
        on: () => {},
    };
}

/**
 * @param {string} selectors
 * @returns {HTMLElement[]}
 */
function selectMultiple(selectors) {
    const nodeList = document.querySelectorAll(selectors);
    return Array.prototype.slice.call(nodeList);
}

const buttons = selectMultiple("button");
const checkboxs = selectMultiple("input[type=checkbox]");
buttons.forEach((button) => (button.onclick = sendEvent));
checkboxs.forEach((checkbox) => (checkbox.onchange = sendEvent));

function sendEvent() {
    console.log("sendEvent:", this.id);
    alt.emit("event", this.id, this.checked);
    this.blur();
}

alt.on("prompt", (title, id) => {
    const input = document.querySelector("#prompt");
    input.value = "";
    input.dataset.id = id;
    input.dataset.title = title;
    input.focus();
});

alt.on("editor", (state) => {
    const editor = selectMultiple(".editorOnly");
    editor.forEach((element) => element.setAttribute("visible", state));
});
