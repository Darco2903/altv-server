if (window.alt === undefined) {
    window.alt = {
        emit: () => {},
        on: () => {},
    };
}

const COOLDOWN = 500;

const playerClone = document.querySelector("#clones .player");
const startButton = document.querySelector("button#start");
const readyButton = document.querySelector("button#ready");

let blockChoice = false;
const cooldown = {
    team: false,
    ready: false,
};

function setCooldown(name) {
    cooldown[name] = true;
    setTimeout(() => (cooldown[name] = false), COOLDOWN);
}

document.querySelectorAll(".team-content").forEach((element) => {
    element.addEventListener("click", () => {
        if (element.hasAttribute("selected") || blockChoice || cooldown.team) return;
        setCooldown("team");
        readyButton.removeAttribute("disabled");
        document.querySelector(".team-content[selected]")?.removeAttribute("selected");
        element.setAttribute("selected", "");
        alt.emit("upn:teamChoose", element.parentElement.id);
    });
});

alt.on("upn:open", (state) => {
    document.querySelector("#content").setAttribute("open", state);
});

alt.on("upn:team:update", (teams) => {
    teams.forEach((team) => {
        const teamElement = document.querySelector(`.team#${team.name} .team-content`);
        if (!teamElement) return;
        teamElement.innerHTML = "";
        team.players.forEach((player) => {
            const playerElement = playerClone.cloneNode(true);
            playerElement.querySelector(".player-name").innerHTML = player.name;
            if (player.ready) playerElement.setAttribute("ready", "");
            teamElement.appendChild(playerElement);
        });
        document.querySelector(`#${team.name}-count`).innerHTML = team.players.length;
    });
    const ready = teams.every((team) => team.players.every((player) => player.ready));
    if (ready) startButton.removeAttribute("disabled");
    else startButton.setAttribute("disabled", "");
});

readyButton.addEventListener("click", () => {
    if (cooldown.ready) return;
    setCooldown("ready");
    readyButton.toggleAttribute("ready");
    blockChoice = readyButton.hasAttribute("ready");
    alt.emit("upn:ready", blockChoice);
});

startButton.addEventListener("click", () => {
    alt.emit("upn:start");
});

alt.on("upn:enableStart", () => {
    startButton.removeAttribute("hidden");
});

alt.on("upn:reset", () => {
    document.querySelector("#content").removeAttribute("open");
    document.querySelectorAll(".team-content").forEach((element) => {
        element.innerHTML = "";
    });
    document.querySelectorAll(".team-count").forEach((element) => {
        element.innerHTML = "0";
    });
    document.querySelector(".team-content[selected]")?.removeAttribute("selected");
    startButton.setAttribute("hidden", "");
    startButton.setAttribute("disabled", "");
    readyButton.removeAttribute("ready");
    readyButton.setAttribute("disabled", "");
    blockChoice = false;
});
