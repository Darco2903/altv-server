import * as alt from "alt-client";
import { Image } from "./Image.js";

alt.Utils.Image = Image;

// /** @type {Image} */
// let img;
// let cam;

// alt.on("keydown", async (key) => {
//     // alt.KeyCode.F1
//     if (key === 112) {
//     } // alt.KeyCode.F2
//     if (key === 113) {
//         if (img) {
//             await img.resize(340, 220);
//             console.log(img.getSize());
//             console.log(img.getDimensions());
//             alt.emit("image", img.getSource());
//         }
//     } // alt.KeyCode.F3
//     else if (key === 114) {
//         if (Image.exists("test")) {
//             img = Image.load("test");
//             console.log(img.getSize());
//             console.log(img.getDimensions());
//             console.log(img.getSource().substring(0, 100) + "...");
//             alt.emit("image", img.getSource());
//         }
//     } // alt.KeyCode.F4
//     else if (key === 115) {
//         if (Image.exists("test")) {
//             Image.delete("test");
//             console.log("deleted", "test");
//             console.log(Image.stored());
//         }
//     } else if (key === 116) {
//         if (img) {
//             img.save("test");
//             console.log("saved", "test");
//         }
//     }
// });
