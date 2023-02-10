let htmlClassList = document.getElementById("classList");
const modelDivTemplate = document.getElementById("template").querySelector(".model");
const defaultImage = "./imgs/_notfound.webp";

function imgNameParser(name) {
    return name.replaceAll("-", "").replaceAll("_", "").replaceAll(".", "").replaceAll(" ", "").toLowerCase();
}

function htmlNameParser(name) {
    return name.replaceAll("é", "&eacute").replaceAll("è", "&egrave").replaceAll("ê", "&ecirc").replaceAll("à", "&agrave");
}

function modelDiv(model) {
    const div = modelDivTemplate.cloneNode(true);
    const img = div.querySelector("img");
    const path = model.Class === "MOD" ? "mod/" : "";
    img.src += `${path}${model.Name}.webp`;
    img.id = model.Hash;
    div.querySelector("strong").innerHTML = htmlNameParser(model.French);
    div.id = model.French.toLowerCase();
    return div;
}

//  createAll model div
peds.concat(freemod).concat(mods).forEach((model) => {
    document.getElementById(model.Pedtype).appendChild(modelDiv(model));
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
    searchVehDiv.forEach((modelDiv) => modelDiv.setAttribute("notInSelection", !modelDiv.id.includes(searchValue)));
};

//  initSearchList
for (const modelDiv of document.querySelectorAll(".model")) htmlSearch.append(modelDiv.cloneNode(true));
searchVehDiv = Array.from(htmlSearch.children);

//  addButtonListeners
let buttons = document.getElementsByClassName("button");
for (const but of buttons) {
    but.onerror = () => (but.src = defaultImage);
    but.onclick = () => {
        if ("alt" in window) alt.emit("setPlayerModel", but.id);
    };
}
