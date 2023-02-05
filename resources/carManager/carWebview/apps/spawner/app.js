let htmlClassList = document.getElementById("classList");
const vehDivTemplate = document.getElementById("template").querySelector(".vehicle");
const defaultImage = "./imgs/_notfound.webp";

function weaponDiv(veh) {
    const div = vehDivTemplate.cloneNode(true);
    const img = div.querySelector("img");
    const path = veh.Class === "MOD" ? "mod/" : "";
    img.src += `${path}${veh.Name}.webp`;
    img.id = veh.Hash;
    div.querySelector("strong").innerHTML = veh.DisplayName;
    div.id = veh.DisplayName.toLowerCase();
    return div;
}

//  createAll vehicle div
Object.entries(vehicles).forEach(([key, veh]) => {
    document.getElementById(veh.Class).appendChild(weaponDiv(veh));
});

//  addImgErrorListeners
let imgs = document.querySelectorAll("img");
for (const img of imgs) {
    img.onerror = () => (img.src = defaultImage);
}

const searchInput = document.querySelector("input");
const htmlSearch = document.getElementById("searchList");
let searchVehDiv;

//  SearchInputEvent
searchInput.oninput = function () {
    htmlClassList.setAttribute("notInSelection", !!this.value);
    htmlSearch.setAttribute("notInSelection", !this.value);
    const searchValue = this.value.toLowerCase();
    searchVehDiv.forEach((htmlVeh) => htmlVeh.setAttribute("notInSelection", !htmlVeh.id.includes(searchValue)));
};

//  blockSpaceScrollEvent
window.addEventListener("keydown", (key) => {
    if (key.code == 32 && key.target == document.body) key.preventDefault();
});

//  initSearchList
setTimeout(() => {
    for (const vehDiv of document.querySelectorAll(".vehicle")) htmlSearch.append(vehDiv.cloneNode(true));
    searchVehDiv = Array.from(htmlSearch.children);
}, 500);

//  addButtonListeners
setTimeout(() => {
    let buttons = document.getElementsByClassName("button");
    for (const but of buttons) {
        but.onclick = function () {
            if ("alt" in window) alt.emit("spawnVehicle", this.id);
        };
    }
}, 1000);
