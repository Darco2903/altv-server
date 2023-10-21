import peds from "http://assets/data-pack/content/ped/peds.json" assert { type: "json" };
import pedsMod from "http://assets/data-pack/content/ped/pedsMod.json" assert { type: "json" };

if (window.alt === undefined) {
    window.alt = {
        emit: () => {},
        on: () => {},
    };
}

const IMAGE_URL = "http://assets/data-pack/content/ped/images";
const IMAGE_TYPE = ".webp";
const DEFAULT_IMAGE = `${IMAGE_URL}/default${IMAGE_TYPE}`;
const pedCardClone = document.querySelector("#clones .ped-card");
const pedCategoryButtons = document.querySelectorAll("button.ped-category");
const pedCategoryContent = Array.from(document.querySelectorAll("#content > div"));
const searchInput = document.getElementById("search-input");
const searchList = document.getElementById("searchList");

pedCategoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
        document.querySelector("button[selected]")?.removeAttribute("selected");
        button.toggleAttribute("selected");
        document.querySelector("#content > div[selected]")?.removeAttribute("selected");
        document.querySelector(`#content #${button.id}`).toggleAttribute("selected");
        searchList.removeAttribute("selected");
    });
});

function createPedCard(ped) {
    const div = pedCardClone.cloneNode(true);
    const img = div.querySelector("img");
    const path = ped.Pedtype === "MOD" ? "mod" : "basegame";
    img.src = `${IMAGE_URL}/${path}/${ped.Name}${IMAGE_TYPE}`;
    img.id = ped.Name;
    img.onerror = () => (img.src = DEFAULT_IMAGE);
    img.onclick = () => alt.emit("model:player", ped.Name);
    div.querySelector("label").innerHTML = ped.DisplayName;
    div.id = ped.DisplayName.toLowerCase();
    return div;
}

peds.concat(pedsMod).forEach((ped) => {
    if (ped.Pedtype.includes("PLAYER")) {
        ped.Pedtype = "PLAYER";
    } else if (["MEDIC", "FIREMAN", "Swat"].includes(ped.Pedtype)) {
        ped.Pedtype = "LSD";
    }

    const category = pedCategoryContent.find((content) => content.id === ped.Pedtype);
    category.append(createPedCard(ped));
    searchList.append(createPedCard(ped));
});

searchInput.addEventListener("input", () => {
    const search = searchInput.value.toLowerCase();
    searchList.childNodes.forEach((div) => {
        if (div.id.includes(search)) {
            div.setAttribute("selected", "");
        } else {
            div.removeAttribute("selected");
        }
    });
});

searchInput.addEventListener("focusin", () => {
    document.querySelector("button[selected]")?.removeAttribute("selected");
    document.querySelector("#content > div[selected]")?.removeAttribute("selected");
    searchList.setAttribute("selected", "");
    searchInput.dispatchEvent(new Event("input"));
    alt.emit("search:start");
});

searchInput.addEventListener("focusout", () => {
    alt.emit("search:end");
});

window.addEventListener("keydown", (e) => {
    if (e.code === "Escape") {
        searchInput.blur();
        alt.emit("search:end");
    } else if (e.code === "Space" && document.activeElement !== searchInput) {
        e.preventDefault();
    }
});
