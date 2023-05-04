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

const checkpointList = document.getElementById("checkpointList");
const template = document.getElementById("template");
const checkpointTemplate = template.querySelector(".checkpoint");
const buttons = selectMultiple("button");
const checkboxs = selectMultiple("input[type=checkbox]");

function createCheckpoint(id, data) {
    /** @type {HTMLElement} */
    const checkpoint = checkpointTemplate.cloneNode(true);
    checkpoint.id = id;

    checkpoint.name = checkpoint.querySelector("strong.name");
    checkpoint.name.innerText = parseInt(checkpoint.id) + 1;

    checkpoint.pos = {
        x: checkpoint.querySelector("div.pos>div.x>input"),
        y: checkpoint.querySelector("div.pos>div.y>input"),
        z: checkpoint.querySelector("div.pos>div.z>input"),
    };
    checkpoint.pos.x.value = data.pos.x;
    checkpoint.pos.y.value = data.pos.y;
    checkpoint.pos.z.value = data.pos.z;
    checkpoint.pos.x.onchange =
        checkpoint.pos.y.onchange =
        checkpoint.pos.z.onchange =
            () => {
                const pos = checkpoint.pos;
                const max = parseFloat(pos.x.max);
                const min = parseFloat(pos.x.min);

                Object.entries(pos).forEach(([key, { value }]) => {
                    if (value > max) {
                        pos[key].value = max;
                    }
                    if (value < min) {
                        pos[key].value = min;
                    }
                });

                alt.emit("changePos", checkpoint.id, [checkpoint.pos.x.value, checkpoint.pos.y.value, checkpoint.pos.z.value]);
            };

    checkpoint.height = checkpoint.querySelector("div.height>input");
    checkpoint.height.value = data.height;
    checkpoint.height.onchange = () => {
        alt.emit("changeHeight", checkpoint.id, checkpoint.height.value);
    };

    checkpoint.radius = checkpoint.querySelector("div.radius>input");
    checkpoint.radius.value = data.radius;
    checkpoint.radius.onchange = () => {
        const radius = checkpoint.radius;
        const max = parseFloat(radius.max);
        const min = parseFloat(radius.min);
        if (radius.value > max) {
            radius.value = max;
        }
        if (radius.value < min) {
            radius.value = min;
        }
        console.log(radius.value > max, radius.value < min);
        console.log(typeof max, max, min);
        console.log(radius.value);
        alt.emit("changeRadius", checkpoint.id, radius.value);
    };

    checkpoint.color = checkpoint.querySelector("div.color>input");
    checkpoint.color.value = data.color;
    checkpoint.color.onchange = () => {
        alt.emit("changeColor", checkpoint.id, checkpoint.color.value);
    };

    checkpoint.isVisible = () => {
        return checkpoint.querySelector("div.edit").getAttribute("visible") === "true";
    };

    checkpoint.edit = (state) => {
        checkpoint.querySelector("div.edit").setAttribute("visible", state.toString());
    };

    checkpoint.onclick = () => {
        const state = checkpoint.isVisible();
        if (!state) {
            checkpoint.edit(true);
        }
    };
    return checkpoint;
}

// for (let i = 1; i <= 40; i++) {
//     const checkpoint = createCheckpoint(i, {
//         pos: { x: 654, y: 654, z: 950 },
//         height: 1,
//         radius: 10,
//         color: { r: 255, g: 0, b: 0, a: 255 },
//         type: 1,
//     });
//     checkpointList.appendChild(checkpoint);
// }

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

alt.on("addCheckpoint", (id, data) => {
    const checkpoint = createCheckpoint(id, data);
    checkpointList.appendChild(checkpoint);
});

// const checkpoint = checkpointTemplate.cloneNode(true);
// console.log(checkpoint.querySelector("div.color>input"));
// console.log(checkpoint.querySelector("div.raidus>input"));
// console.log(checkpoint.querySelector("div.height>input"));
// console.log(checkpoint.querySelector("div.pos>div.x>input"));
// console.log(checkpoint.querySelector("div.edit"));
// console.log(checkpoint.querySelector("div.type>input"));
