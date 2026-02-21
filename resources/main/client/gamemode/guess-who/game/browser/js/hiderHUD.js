if (window.alt === undefined) {
    window.alt = {
        emit: () => {},
        on: () => {},
    };
}

alt.on("perk:play", (anim) => {
    // document.getElementById(anim).setAttribute("active", "");
    document.getElementById(anim).setAttribute("reload", "");
});

alt.on("perk:stop", (anim) => {
    // document.getElementById(anim).removeAttribute("active");
    document.getElementById(anim).removeAttribute("reload");
});

// alt.on("perk:stop", (anim) => {
//     document.getElementById(anim).removeAttribute("active");
//     document.getElementById(anim).setAttribute("reloading", "");
// });

// alt.on("perk:ready", (anim) => {
//     document.getElementById(anim).removeAttribute("reloading");
// });

alt.on("perk:setup", (anim, key) => {
    document.getElementById(anim).querySelector(".keybind").innerText = key;
});
