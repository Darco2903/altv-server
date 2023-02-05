let htmlClassList = document.getElementById("classList");
const weaponDivTemplate = document.getElementById("template").querySelector(".weapon");
const defaultImage = "./imgs/_notfound.webp";

function weaponDiv(weapon) {
    const div = weaponDivTemplate.cloneNode(true);
    const img = div.querySelector("img");
    img.src += `${weapon.Name}.webp`;
    img.id = weapon.Hash;
    img.onerror = () => (img.src = defaultImage);
    div.querySelector("strong").innerHTML = weapon.TranslatedLabel ? weapon.TranslatedLabel.French : weapon.Name;
    return div;
}

//  createAll vehicle div
Object.entries(weapons).forEach(([key, weapon]) => {
    if (weapon.Category === null || (weapon.TranslatedLabel && weapon.TranslatedLabel.English === "Invalid")) return;
    document.getElementById(weapon.Category).appendChild(weaponDiv(weapon));
});

//  blockSpaceScrollEvent
window.addEventListener("keydown", (key) => {
    if (key.code == 32 && key.target == document.body) key.preventDefault();
});

document.getElementById("all").onclick = () => alt.emit("giveAll");
document.getElementById("remove").onclick = () => alt.emit("removeAll");

//  addButtonListeners
const amount = document.getElementById("amoAmount");
const equipNow = document.getElementById("equipNow");
console.log(equipNow);
let buttons = document.getElementsByClassName("button");
for (const but of buttons) {
    but.onclick = function () {
        if ("alt" in window) alt.emit("giveWeapon", this.id, amount.value, equipNow.checked);
    };
}
