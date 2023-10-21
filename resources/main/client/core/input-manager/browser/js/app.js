import keyCode from "http://assets/data-pack/content/input-key/keyCode.js";

if (window.alt === undefined) {
    window.alt = {
        emit: () => {},
        on: () => {},
    };
}

const ICON_URL = "http://assets/data-pack/content/input-key/icons";

function iconKey(key) {
    const name = keyCode[key]?.replaceAll(" ", "-").toLowerCase() ?? "";
    return `${ICON_URL}/key-${name}-100px.png`;
}

async function getInput() {
    return new Promise((resolve, reject) => {
        alt.emit("input:wait");
        alt.once("input:get", (key) => {
            if (key === 27) {
                // Escape
                reject();
            } else {
                resolve({
                    key,
                    name: keyCode[key],
                    icon: iconKey(key),
                });
            }
        });
    });
}

document.querySelectorAll(".input-container").forEach((inputContainer) => {
    const input = inputContainer.querySelector(".input");
    const inputKey = input.querySelector(".input-key");
    const inputIcon = input.querySelector(".input-icon");
    const inputReset = inputContainer.querySelector(".input-reset");

    const f = async (e) => {
        if (e.target === inputReset) return;
        inputContainer.removeEventListener("click", f);
        inputContainer.setAttribute("user-input", true);
        try {
            const userInput = await getInput();
            inputKey.innerHTML = userInput.name;
            inputKey.dataset.key = userInput.key;
            inputIcon.src = userInput.icon;
            chekDuplicateKeys();
            alt.emit("input:change", inputContainer.dataset.name, userInput.key);
        } catch (error) {}
        inputContainer.removeAttribute("user-input");
        setTimeout(() => {
            inputContainer.addEventListener("click", f);
        }, 100);
    };
    inputContainer.addEventListener("click", f);
    inputIcon.addEventListener("error", () => {
        inputIcon.src = `${ICON_URL}/key-${inputKey.dataset.key <= 6 ? "mouse" : "keyboard"}-100px.png`;
    });
    inputReset.addEventListener("click", () => alt.emit("input:reset", inputContainer.dataset.name));
});

alt.on("keyInit", (name, key) => {
    const inputContainer = document.querySelector(`.input-container[data-name="${name}"]`);
    if (!inputContainer) throw new Error(`Input container with name ${name} not found`);
    inputContainer.setAttribute("initialized", "");
    const input = inputContainer.querySelector(".input");
    const inputKey = input.querySelector(".input-key");
    const inputIcon = input.querySelector(".input-icon");
    inputKey.innerHTML = keyCode[key];
    inputKey.dataset.key = key;
    inputIcon.src = iconKey(key);
    chekDuplicateKeys();
});

function chekDuplicateKeys() {
    const duplicates = Array.from(document.querySelectorAll(".input-key"))
        .map((inputKey) => inputKey.dataset.key)
        .filter((key, index, arr) => arr.indexOf(key) !== index);
    document.querySelectorAll(".input-container").forEach((inputContainer) => {
        inputContainer.removeAttribute("duplicate-key");
    });
    duplicates
        .flatMap((key) => Array.from(document.querySelectorAll(`.input-container:has([data-key="${key}"])`)))
        .forEach((inputContainer) => inputContainer.setAttribute("duplicate-key", ""));
}
