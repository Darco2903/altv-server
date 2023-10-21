import weapons from "http://assets/data-pack/content/weapon/weapons.json" assert { type: "json" };

if (window.alt === undefined) {
    window.alt = {
        emit: () => {},
        on: () => {},
    };
}

const IMAGE_URL = "http://assets/data-pack/content/weapon/images";
const IMAGE_TYPE = ".webp";
const DEFAULT_IMAGE = `${IMAGE_URL}/default${IMAGE_TYPE}`;
const weaponCardClone = document.querySelector("#clones .weapon-card");
const weaponCategoryButtons = document.querySelectorAll("button.weapon-category");
const weaponCategoryContent = Array.from(document.querySelectorAll("#content > div"));
const ammoAmountInput = document.getElementById("ammo-amount");
const giveAllButton = document.getElementById("give-all");
const allWeapons = [];
const searchInput = document.getElementById("search-input");
const searchList = document.getElementById("searchList");

weaponCategoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
        document.querySelector("button[selected]")?.removeAttribute("selected");
        button.toggleAttribute("selected");
        document.querySelector("#content > div[selected]")?.removeAttribute("selected");
        document.querySelector(`#content #${button.id}`).toggleAttribute("selected");
        searchList.removeAttribute("selected");
    });
});

function createWeapCard(weap) {
    const div = weaponCardClone.cloneNode(true);
    const img = div.querySelector("img");
    const path = weap.Category === "MOD" ? "mod" : "basegame";
    const weaponName = weap.DisplayName.toLowerCase().replaceAll(" ", "");
    img.src = `${IMAGE_URL}/${path}/${weaponName}${IMAGE_TYPE}`;
    img.id = weap.Name;
    img.onerror = () => (img.src = DEFAULT_IMAGE);
    img.onclick = () => alt.emit("weapon:player", weap.Name, parseInt(ammoAmountInput.value));
    div.querySelector("label").innerHTML = weap.DisplayName;
    div.id = weap.DisplayName.toLowerCase();
    return div;
}

weapons.forEach((weap) => {
    const category = weaponCategoryContent.find((content) => content.id === weap.Category);
    category.append(createWeapCard(weap));
    searchList.append(createWeapCard(weap));
    allWeapons.push(weap.Name);
});

ammoAmountInput.addEventListener("input", () => {
    const value = parseInt(ammoAmountInput.value);
    ammoAmountInput.value = value > 9999 ? 9999 : value < 0 ? 0 : value;
});

giveAllButton.addEventListener("click", () => {
    alt.emit("weapon:player:all", allWeapons);
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
