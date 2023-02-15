let htmlClassList = document.getElementById("classList");
const vehDivTemplate = document.getElementById("template").querySelector(".vehicle");
const defaultImage = "./imgs/_notfound.webp";

function vehicleDiv(veh) {
    const div = vehDivTemplate.cloneNode(true);
    const img = div.querySelector("img");
    const path = veh.Class === "MOD" ? "mod/" : "";
    img.src += `${path}${veh.Name}.webp`;
    img.id = veh.Name;
    div.querySelector("strong").innerHTML = veh.DisplayName;
    div.id = veh.DisplayName.toLowerCase();
    return div;
}

//  createAll vehicle div
vehicles.concat(mods).forEach((veh) => {
    document.getElementById(veh.Class).appendChild(vehicleDiv(veh));
});

//  blockSpaceScrollEvent
window.addEventListener("keydown", (key) => {
    if (key.code == 32 && key.target == document.body) key.preventDefault();
});

const searchInput = document.querySelector("input");
const htmlSearch = document.getElementById("searchList");
let searchVehDiv;

//  SearchInputEvent
searchInput.oninput = function () {
    htmlClassList.setAttribute("notInSelection", !!this.value);
    htmlSearch.setAttribute("notInSelection", !this.value);
    if (!this.value) return;
    const searchValue = this.value.toLowerCase();
    searchVehDiv.forEach((htmlVeh) => htmlVeh.setAttribute("notInSelection", !htmlVeh.id.includes(searchValue)));
};

//  initSearchList
for (const vehDiv of document.querySelectorAll(".vehicle")) htmlSearch.append(vehDiv.cloneNode(true));
searchVehDiv = Array.from(htmlSearch.children);

//  addButtonListeners
const spawnButtons = document.getElementsByClassName("button");
for (const but of spawnButtons) {
    but.onerror = () => (but.src = defaultImage);
    but.onclick = () => {
        if ("alt" in window) alt.emit("spawnVehicle", but.id);
    };
}

let listButtons = document.querySelectorAll("button");
for (const but of listButtons) {
    but.onclick = () => alt.emit("option", but.id);
}

alt.on("garageList", (res) => {
    console.log(res);
});
