let htmlClassList = document.getElementById("classList");
const modelDivTemplate = document.getElementById("template").querySelector(".model");
const defaultImage = "./imgs/_notfound.webp";

// function imgNameParser(model) {
//     return model.English.replaceAll("-", "").replaceAll("_", "").replaceAll(".", "").replaceAll(" ", "").toLowerCase();
// }

// function htmlNameParser(model) {
//     return model.French.replaceAll("é", "&eacute").replaceAll("è", "&egrave").replaceAll("ê", "&ecirc").replaceAll("à", "&agrave");
// }

function modelDiv(model) {
    const div = modelDivTemplate.cloneNode(true);
    const img = div.querySelector("img");
    img.id = model.Hash;
    // img.src += `${imgNameParser(model)}.webp`;
    img.onerror = () => {
        console.log(`${imgNameParser(model)}.webp`);
        img.src = defaultImage;
    };
    // div.querySelector("strong").innerHTML = htmlNameParser(model);
    return div;
}

//  createAll vehicle div
Object.entries(models).forEach(([key, model]) => {
    // if (model.Category === null || model.English === "Invalid") return;
    // document.getElementById(model.Category).appendChild(modelDiv(model));
});

//  blockSpaceScrollEvent
window.addEventListener("keydown", (key) => {
    if (key.code == 32 && key.target == document.body) key.preventDefault();
});

document.getElementById("all").onclick = () => alt.emit("giveAll");
document.getElementById("remove").onclick = () => alt.emit("removeAll");
