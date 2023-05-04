import weapons from "./data/weapons.json" assert { type: "json" };

const weaponDivTemplate = document.getElementById("template").querySelector(".weapon");
const defaultImage = "./imgs/_notfound.webp";

function imgNameParser(weapon) {
    return weapon.English.replaceAll("-", "").replaceAll("_", "").replaceAll(".", "").replaceAll(" ", "").toLowerCase();
}

function htmlNameParser(weapon) {
    return weapon.French.replaceAll("é", "&eacute").replaceAll("è", "&egrave").replaceAll("ê", "&ecirc").replaceAll("à", "&agrave");
}

function vehicleDiv(weapon) {
    const div = weaponDivTemplate.cloneNode(true);
    const img = div.querySelector("img");
    img.id = weapon.Hash;
    img.src += `${imgNameParser(weapon)}.webp`;
    img.onerror = () => {
        img.src = defaultImage;
    };
    div.querySelector("strong").innerHTML = htmlNameParser(weapon);
    return div;
}

//  createAll vehicle div
Object.entries(weapons).forEach(([key, weapon]) => {
    if (weapon.Category === null || weapon.English === "Invalid") return;
    document.getElementById(weapon.Category).appendChild(vehicleDiv(weapon));
});

//  blockSpaceScrollEvent
window.addEventListener("keydown", (key) => {
    if (key.code === "Space") {
        key.preventDefault();
    }
});

document.getElementById("all").onclick = () => alt.emit("giveAll");
document.getElementById("remove").onclick = () => alt.emit("removeAll");

//  addButtonListeners
const amount = document.getElementById("amoAmount");
const equipNow = document.getElementById("equipNow");
let buttons = document.getElementsByClassName("button");
for (const but of buttons) {
    but.onclick = function () {
        if ("alt" in window) {
            alt.emit("giveWeapon", this.id, amount.value, equipNow.checked);
        }
    };
}
