if (!window.alt) {
    window.alt = {
        emit: () => {},
        on: () => {},
    };
}

alt.on("image:dimensions", (id = "", base64) => {
    try {
        const img = new Image();
        img.src = `data:image/png;base64,${base64}`;
        img.onload = () => {
            alt.emit("image:dimensions" + id, { width: img.width, height: img.height });
        };
    } catch (error) {
        console.error(error);
        alt.emit("image:dimensions" + id, { width: 0, height: 0 });
    }
});

/**
 * @param {string} base64 - Base64 image encoded string
 * @param {number} width - New width
 * @param {number} height - New height
 * @returns {Promise<string>} - Resized base64 image encoded string
 */
function resizeBase64Image(base64, width, height) {
    return new Promise((resolve, reject) => {
        const resize = new Image();
        resize.src = `data:image/png;base64,${base64}`;
        resize.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(resize, 0, 0, width, height);
            const resizedBase64 = canvas.toDataURL("image/png").replace(/^data:image\/(png|jpg);base64,/, "");
            resolve(resizedBase64);
        };
        resize.onerror = (err) => reject(err);
    });
}

alt.on("image:resize", async (id = "", { base64, width, height }) => {
    let resizedBase64;
    try {
        resizedBase64 = await resizeBase64Image(base64, width, height);
    } catch (error) {
        console.error(error);
    }
    alt.emit("image:resize" + id, resizedBase64);
});

/**
 * @param {string} base64 - Base64 image encoded string
 * @param {number} topLeftX - Top left x coordinate
 * @param {number} topLeftY - Top left y coordinate
 * @param {number} bottomRightX - Bottom right x coordinate
 * @param {number} bottomRightY - Bottom right y coordinate
 * @returns {Promise<string>} - Cropped base64 image encoded string
 */
function cropBase64Image(base64, topLeftX, topLeftY, bottomRightX, bottomRightY) {
    return new Promise((resolve, reject) => {
        const crop = new Image();
        crop.src = `data:image/png;base64,${base64}`;
        crop.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = crop.width - bottomRightX - topLeftX;
            canvas.height = crop.height - bottomRightY - topLeftY;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(crop, topLeftX, topLeftY, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
            const croppedBase64 = canvas.toDataURL("image/png").replace(/^data:image\/(png|jpg);base64,/, "");
            resolve(croppedBase64);
        };
        crop.onerror = (err) => reject(err);
    });
}

alt.on("image:crop", async (id = "", { base64, topLeftX, topLeftY, bottomRightX, bottomRightY }) => {
    let cropBase64;
    try {
        cropBase64 = await cropBase64Image(base64, topLeftX, topLeftY, bottomRightX, bottomRightY);
    } catch (error) {
        console.error(error);
    }
    alt.emit("image:crop" + id, cropBase64);
});

/**
 * @param {string} base64 - Base64 image encoded string
 * @param {number} x - X value to move the image by
 * @param {number} y - Y value to move the image by
 * @returns {Promise<string>} - Moved base64 image encoded string
 */
function moveBase64Image(base64, x, y) {
    return new Promise((resolve, reject) => {
        const move = new Image();
        move.src = `data:image/png;base64,${base64}`;
        move.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = move.width;
            canvas.height = move.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(move, x, y);
            const movedBase64 = canvas.toDataURL("image/png").replace(/^data:image\/(png|jpg);base64,/, "");
            resolve(movedBase64);
        };
        move.onerror = (err) => reject(err);
    });
}

alt.on("image:move", async (id = "", { base64, x, y }) => {
    let movedBase64;
    try {
        movedBase64 = await moveBase64Image(base64, x, y);
    } catch (error) {
        console.error(error);
    }
    alt.emit("image:move" + id, movedBase64);
});

/**
 * @param {string} base64 - Base64 image encoded string
 * @param {number} factor - Factor to zoom image by
 * @returns {Promise<string>} - Zoomed base64 image encoded string
 */
function zoomBase64Image(base64, factor) {
    return new Promise((resolve, reject) => {
        const zoom = new Image();
        zoom.src = `data:image/png;base64,${base64}`;
        zoom.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = zoom.width / factor;
            canvas.height = zoom.height / factor;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(zoom, canvas.width / -factor, canvas.height / -factor);
            const zoomedBase64 = canvas.toDataURL("image/png").replace(/^data:image\/(png|jpg);base64,/, "");
            resolve(zoomedBase64);
        };
        zoom.onerror = (err) => reject(err);
    });
}

alt.on("image:zoom", async (id = "", { base64, factor }) => {
    let zoomedBase64;
    try {
        zoomedBase64 = await zoomBase64Image(base64, factor);
    } catch (error) {
        console.error(error);
    }
    alt.emit("image:zoom" + id, zoomedBase64);
});

/**
 * @param {string} base64 - Base64 image encoded string
 * @param {number} degrees - Degrees to rotate image by
 * @returns {Promise<string>} - Rotated base64 image encoded string
 */
function rotateBase64Image(base64, degrees) {
    return new Promise((resolve, reject) => {
        const rotate = new Image();
        rotate.src = `data:image/png;base64,${base64}`;
        rotate.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = rotate.width;
            canvas.height = rotate.height;
            const ctx = canvas.getContext("2d");
            ctx.translate(rotate.width / 2, rotate.height / 2);
            ctx.rotate((degrees * Math.PI) / 180);
            ctx.drawImage(rotate, -rotate.width / 2, -rotate.height / 2);
            const rotatedBase64 = canvas.toDataURL("image/png").replace(/^data:image\/(png|jpg);base64,/, "");
            resolve(rotatedBase64);
        };
        rotate.onerror = (err) => reject(err);
    });
}

alt.on("image:rotate", async (id = "", { base64, degrees }) => {
    let rotatedBase64;
    try {
        rotatedBase64 = await rotateBase64Image(base64, degrees);
    } catch (error) {
        console.error(error);
    }
    alt.emit("image:rotate" + id, rotatedBase64);
});
