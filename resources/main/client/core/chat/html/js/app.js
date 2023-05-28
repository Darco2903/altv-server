const msgListBlock = document.querySelector(".msglist");
const chat = document.querySelector("#chat");
const msgInputBlock = document.querySelector(".msginput");
const msgInputLine = document.querySelector(".msginput input");
const autocompleteDiv = document.querySelector("ul#autocomplete");
const autocompleteLabel = document.querySelector("#message label");

let buffer = [];
let bufferIndex = -1;
let autocomplete = [];
let autocompleteIndex = 0;
let startedTyping = false;
let timeout = null;
let chatOpened = false;
let permissionLevel = 0;

/**
 * @typedef {Object} commandArgs
 * @property {string} name
 * @property {string} description
 * @property {"string"|"number"|"boolean"} type
 * @property {string[]} values
 * @property {boolean} required
 */

/**
 * @typedef {Object} Command
 * @property {string} name
 * @property {commandArgs[]} args
 * @property {string} description
 * @property {number} permissionLevel
 */

/** @type {Command[]} */
let commands = [];

if (window.alt === undefined) {
    window.alt = {
        emit: () => {},
        on: () => {},
    };
}

function colorify(text) {
    let matches = [];
    let m = null;
    let curPos = 0;

    while (m != null) {
        m = /\{[A-Fa-f0-9]{3}\}|\{[A-Fa-f0-9]{6}\}/g.exec(text.substr(curPos));

        if (!m) {
            break;
        }

        matches.push({
            found: m[0],
            index: m["index"] + curPos,
        });

        curPos = curPos + m["index"] + m[0].length;
    }

    if (matches.length > 0) {
        text += "</font>";

        for (let i = matches.length - 1; i >= 0; --i) {
            let color = matches[i].found.substring(1, matches[i].found.length - 1);
            let insertHtml = (i != 0 ? "</font>" : "") + '<font color="#' + color + '">';
            text = text.slice(0, matches[i].index) + insertHtml + text.slice(matches[i].index + matches[i].found.length, text.length);
        }
    }
    return text;
}

/**
 * @param {boolean} visible
 */
function setChatVisibility(visible) {
    const isVisible = chat.classList.contains("active");
    if (visible && !isVisible) {
        chat.classList.add("active");
    } else if (!visible && isVisible) {
        chat.classList.remove("active");
    }
}

/**
 * @param {boolean} state
 */
function hideChatAutocomplete(state) {
    const isHidden = chat.classList.contains("hide");
    if (state && !isHidden) {
        chat.classList.add("hide");
    } else if (!state && isHidden) {
        chat.classList.remove("hide");
    }
}

function openChat(insertSlash) {
    if (!chatOpened) {
        document.querySelector(".chatbox").classList.add("active");
        if (insertSlash) {
            msgInputLine.value = "/";
            msgInputLine.dispatchEvent(new Event("input"));
        }
        msgInputBlock.style.display = "block";
        msgInputBlock.style.opacity = 1;
        msgInputLine.focus();
        clearTimeout(timeout);
        setChatVisibility(true);
        bufferIndex = -1;
        chatOpened = true;
    }
}

function closeChat() {
    if (chatOpened) {
        document.querySelector(".chatbox").classList.remove("active");
        msgInputBlock.style.display = "none";
        msgInputLine.blur();
        msgInputLine.value = "";
        autocompleteDiv.innerHTML = "";
        hideChatAutocomplete(false);
        clearTimeout(timeout);
        timeout = setTimeout(() => setChatVisibility(false), 1000);
        chatOpened = false;
    }
}

function isCommand(text) {
    return text.startsWith("/");
}

function shakeInput() {
    msgInputLine.style.animation = "shake 0.5s";
    msgInputLine.style.color = "red";
    setTimeout(() => {
        msgInputLine.style.animation = "";
        msgInputLine.style.color = "";
    }, 500);
}

/**
 * @param {string} input
 * @returns {HTMLElement[]}
 */
function getAutocompleteCommands(input) {
    return commands
        .filter((cmd) => cmd.name.toLocaleLowerCase().startsWith(input.toLocaleLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name))
        .slice(0, 5)
        .map((cmd, index) => {
            const li = document.createElement("li");
            li.innerHTML = cmd.name; // + " " + cmd.args.map((arg) => `<${arg.name}>`).join(" ");
            if (index === 0) {
                li.id = "selected";
            }
            return li;
        });
}

/**
 * @return {Promise<string[]>}
 */
function getAllPlayers() {
    return new Promise((resolve, reject) => {
        alt.emit("getAllPlayers");
        alt.once("getAllPlayers", resolve);
    });
}

/**
 * @param {Command} command
 * @param {number} index
 * @returns {string}
 */
function getAutocompleteCommandArg(command, index) {
    return command.args[index]?.name ?? "";
}

/**
 * @param {Command} command
 * @param {string} input
 * @param {number} index
 * @returns {Promise<HTMLElement[]>}
 */
async function getAutocompleteCommandValue(command, input, index) {
    const argName = command.args[index]?.name ?? "";
    let values;

    if (argName === "player") {
        values = await getAllPlayers();
    } else {
        values = command.args[index]?.values ?? [];
    }

    return values
        .filter((value) => value.toString().toLocaleLowerCase().startsWith(input.toLocaleLowerCase()))
        .sort((a, b) => (typeof a === "string" ? a.localeCompare(b) : 0))
        .slice(0, 5)
        .map((value, index) => {
            const li = document.createElement("li");
            li.innerHTML = value;
            if (index === 0) {
                li.id = "selected";
            }
            return li;
        });
}

window.addEventListener("load", () => {
    msgInputLine.focus();

    document.querySelector("#message").addEventListener("submit", (e) => {
        e.preventDefault();

        if (isCommand(msgInputLine.value)) {
            const args = msgInputLine.value.substring(1).split(" ");
            const cmdName = args.shift();
            const cmd = commands.find((cmd) => cmd.name === cmdName);
            if (!cmd) {
                shakeInput();
                return;
            }
        }

        alt.emit("chat:message", msgInputLine.value);
        saveBuffer();
        closeChat();
    });

    window.addEventListener("wheel", (event) => {
        chat.scrollBy({ top: event.deltaY, behavior: "smooth" });
    });

    msgInputLine.addEventListener("keydown", (e) => {
        switch (e.key) {
            case "Tab":
                e.preventDefault();
                if (autocomplete.length > 0) {
                    const args = msgInputLine.value.substring(1).split(" ");
                    args.pop();

                    if (args.length === 0) {
                        msgInputLine.value = `/${autocomplete[autocompleteIndex].innerHTML}`;
                    } else {
                        msgInputLine.value = `/${args.join(" ")} ${autocomplete[autocompleteIndex].innerHTML}`;
                    }

                    autocompleteDiv.innerHTML = "";
                    startedTyping = false;
                    msgInputLine.dispatchEvent(new Event("input"));
                }
                break;

            case "ArrowUp":
                e.preventDefault();
                if (!startedTyping) {
                    if (bufferIndex < buffer.length - 1) {
                        loadBuffer(++bufferIndex);
                    }
                } else if (autocompleteIndex > 0) {
                    autocomplete.forEach((li) => (li.id = ""));
                    autocomplete[--autocompleteIndex].id = "selected";
                }

                break;

            case "ArrowDown":
                e.preventDefault();
                if (!startedTyping) {
                    if (bufferIndex > 0) {
                        loadBuffer(--bufferIndex);
                    } else if (bufferIndex == 0) {
                        bufferIndex = -1;
                        msgInputLine.value = "";
                    }
                } else if (autocompleteIndex < autocomplete.length - 1) {
                    autocomplete.forEach((span) => (span.id = ""));
                    autocomplete[++autocompleteIndex].id = "selected";
                }

                break;
        }
    });

    msgInputLine.addEventListener("input", async (e) => {
        if (msgInputLine.value === "/ ") {
            msgInputLine.value = "/";
        }
        if (msgInputLine.value.endsWith(" ")) {
            msgInputLine.value = msgInputLine.value.trimEnd() + " ";
        }
        const input = msgInputLine.value;

        startedTyping = input !== "";
        autocomplete = [];
        autocompleteDiv.innerHTML = "";
        autocompleteLabel.innerHTML = "";
        autocompleteIndex = 0;

        if (isCommand(input)) {
            let args = input.substring(1).split(" ");
            const cmdName = args.shift() ?? "";

            if (commands.map((cmd) => cmd.name).includes(cmdName) && input.includes(cmdName + " ")) {
                const command = commands.find((cmd) => cmd.name === cmdName);
                const argEmpty = input.endsWith(" ");
                const index = args.length - 1;

                autocomplete = await getAutocompleteCommandValue(command, args[index], index);

                if (argEmpty) {
                    const argName = getAutocompleteCommandArg(command, index);
                    autocompleteLabel.innerHTML = `${input} ${argName}`;
                }
            } else {
                autocomplete = getAutocompleteCommands(cmdName);
            }
            autocomplete.forEach((li) => autocompleteDiv.appendChild(li));
        }

        hideChatAutocomplete(autocomplete.length > 0);
    });

    msgInputLine.addEventListener("focusout", (e) => {
        msgInputLine.focus();
    });

    alt.emit("chatloaded");
});

function saveBuffer() {
    if (!msgInputLine.value) return;
    if (buffer.length > 100) {
        buffer.pop();
    }

    bufferIndex = -1;
    if (buffer[0] != msgInputLine.value) {
        buffer.unshift(msgInputLine.value);
        alt.emit("chatBuffer", buffer);
    }
}

function loadBuffer(idx) {
    msgInputLine.value = buffer[idx];
}

function checkOverflow() {
    if (chat.clientHeight > msgListBlock.clientHeight) {
        if (!msgListBlock.classList.contains("overflowed")) {
            msgListBlock.classList.add("overflowed");
        }
    } else if (msgListBlock.classList.contains("overflowed")) {
        msgListBlock.classList.remove("overflowed");
    }
}

function addString(text) {
    if (chat.children.length > 100) {
        chat.removeChild(chat.children[0]);
    }
    const msg = document.createElement("p");
    msg.innerHTML = text;
    chat.appendChild(msg);
    checkOverflow();

    chat.scrollTo({
        top: chat.scrollHeight,
        behaviour: "smooth",
    });
    clearTimeout(timeout);
    setChatVisibility(true);
    timeout = setTimeout(() => setChatVisibility(false), 2000);
}

alt.on("addString", (text) => addString(colorify(text)));
alt.on("addMessage", (name, text) => addString("<b>" + name + ": </b>" + colorify(text)));
alt.on("openChat", openChat);
alt.on("closeChat", closeChat);
alt.on("restoreBuffer", (buf) => (buffer = buf));
alt.on("commandsInit", (cmds) => (commands = cmds));
