import vehicles from "./data/vehicles.json" assert { type: "json" };
import vehiclesMod from "./data/vehiclesMod.json" assert { type: "json" };

if (window.alt === undefined) {
    window.alt = {
        emit: () => {},
        on: () => {},
    };
}

const DEFAULT_IMAGE = "./images/notfound.webp";
const vehicleCardClone = document.querySelector("#clones .vehicle-card");
const vehicleCategoryButtons = document.querySelectorAll("button.vehicle-category");
const vehicleCategoryContent = Array.from(document.querySelectorAll("#content > div"));
const searchInput = document.getElementById("search-input");
const searchList = document.getElementById("searchList");
let antiSpam = false;

vehicleCategoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
        document.querySelector("button[selected]")?.removeAttribute("selected");
        button.toggleAttribute("selected");
        document.querySelector("#content > div[selected]")?.removeAttribute("selected");
        document.querySelector(`#content #${button.id}`).toggleAttribute("selected");
        searchList.removeAttribute("selected");
    });
});

function createVehicleCard(veh) {
    const div = vehicleCardClone.cloneNode(true);
    const img = div.querySelector("img");
    const path = veh.Class === "MOD" ? "mod/" : "basegame/";
    img.src += `${path}${veh.Name}.webp`;
    img.id = veh.Name;
    img.onerror = () => {
        img.src = DEFAULT_IMAGE;
    };
    img.onclick = () => {
        if (antiSpam) return;
        antiSpam = true;
        setTimeout(() => {
            antiSpam = false;
        }, 1000);
        alt.emit("spawn:vehicle", veh.Name);
    };
    div.querySelector("label").innerHTML = veh.DisplayName;
    div.id = veh.DisplayName.toLowerCase();
    return div;
}

vehicles.concat(vehiclesMod).forEach((vehicle) => {
    const category = vehicleCategoryContent.find((content) => content.id === vehicle.Class);
    category.append(createVehicleCard(vehicle));
    searchList.append(createVehicleCard(vehicle));
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
