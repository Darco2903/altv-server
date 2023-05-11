import * as alt from "alt-client";

const tool = new alt.WebView("http://resource/client/class/Image/tool/index.html", false);
tool.isVisible = false;

export class Image {
    #base64;
    #dimensions;
    #id; // used for events
    static #idCounter = 0;
    name;
    #size;
    #src;
    static #STORAGE_PREFIX = "image:";
    static #storedKeys = alt.LocalStorage.get(Image.#STORAGE_PREFIX + "#ALL_KEYS") ?? [];

    /**
     * @param {string|import("./Image").ImageData} data
     * @param {string} [name]
     */
    constructor(data, name = "unnamed") {
        if (!data) throw new Error("No data provided");
        this.#id = Image.#idCounter++;
        if (Image.#isImageData(data)) {
            this.#base64 = data.base64;
            this.#dimensions = data.dimensions;
            this.name = data.name;
            this.#size = data.size;
            this.#src = "data:image/png;base64," + this.#base64;
            this.onLoad();
        } else {
            this.#init(data, name);
        }
    }

    async #init(data, name) {
        this.#base64 = data;
        this.#src = "data:image/png;base64," + this.#base64;
        this.name = name;
        this.#size = this.#calcFileSize();
        this.#dimensions = await this.#calcDimensions();
        this.onLoad();
    }

    /**
     * @param {any} data
     * @returns {boolean}
     */
    static #isImageData(data) {
        return (
            typeof data === "object" &&
            data.hasOwnProperty("base64") &&
            data.hasOwnProperty("dimensions") &&
            data.hasOwnProperty("name") &&
            data.hasOwnProperty("size")
        );
    }

    /**
     * @param {function ()} f
     */
    onLoad(f) {}

    /**
     * @param {"dimensions"|"resize"} event
     * @param {{base64: string}|{base64: string, width: number, height: number}} data
     * @returns {Promise<import("./Image").ImageDimensions|string>}
     */
    async #tool(event, data) {
        let res;
        const setData = (d) => (res = d);
        try {
            tool.once("image:" + event + this.#id, setData);
            tool.emit("image:" + event, this.#id, data);
            await alt.Utils.waitFor(() => res, 2000);
            return Promise.resolve(res);
        } catch (error) {
            tool.off("image:" + event + this.#id, setData);
            return Promise.reject("Response took too long");
        }
    }

    /**
     * @param {string} base64
     * @returns {Promise<import("./Image").ImageDimensions>}
     */
    async #calcDimensions() {
        return await this.#tool("dimensions", this.#base64);
    }

    /**
     * @param {string} base64
     * @returns {import("./Image").ImageSize}
     */
    #calcFileSize() {
        const sizeInBytes = Math.ceil(4 * (this.#base64.length / 3) * 0.5624896334383812);

        // const textEncoder = new TextEncoder();
        // const sizeInBytes = textEncoder.encode(base64);

        let size = Math.ceil(sizeInBytes);
        let unit = "B";

        if (size > 1000) {
            size /= 1000;
            unit = "KB";
        }

        if (size > 1000) {
            size /= 1000;
            unit = "MB";
        }

        return { size: size.toFixed(2), sizeInBytes, unit };
    }

    /**
     * @param {string} base64
     * @returns {Promise<void>}
     */
    async #updateImage(base64) {
        this.#base64 = base64;
        this.#src = "data:image/png;base64," + this.#base64;
        this.#size = this.#calcFileSize();
        this.#dimensions = await this.#calcDimensions();
        return Promise.resolve();
    }

    /**
     * @param {number} width - the desired width
     * @param {?number} height - the desired height
     * @returns {Promise<void>} - base64 encoded image
     */
    async resize(width, height) {
        if (!width) {
            throw new Error("No width provided");
        } else if (!height) {
            height = Math.ceil(this.#dimensions.height * (width / this.#dimensions.width));
        }
        const resized = await this.#tool("resize", { base64: this.#base64, width, height });
        await this.#updateImage(resized);
        return Promise.resolve();
    }

    /**
     * @param {number} x1 - the x coordinate of the top left corner
     * @param {number} y1 - the y coordinate of the top left corner
     * @param {number} x2 - the x coordinate of the bottom right corner
     * @param {number} y2 - the y coordinate of the bottom right corner
     * @returns {Promise<void>} - base64 encoded image
     */
    async crop(topLeftX, topLeftY, bottomRightX, bottomRightY) {
        const cropped = await this.#tool("crop", { base64: this.#base64, topLeftX, topLeftY, bottomRightX, bottomRightY });
        await this.#updateImage(cropped);
        return Promise.resolve();
    }

    // /**
    //  * @param {number} x - the x value to move the image by
    //  * @param {number} y - the y value to move the image by
    //  * @returns {Promise<void>} - base64 encoded image
    //  */
    // async move(x, y) {
    //     const moved = await this.#tool("move", { base64: this.#base64, x, y });
    //     this.#updateImage(moved);
    //     return Promise.resolve();
    // }

    /**
     * @param {number} factor - the factor to zoom the image by (must be greater than 1)
     * @returns {Promise<void>} - base64 encoded image
     */
    async zoom(factor) {
        if (!factor || factor < 1) {
            throw new Error("Invalid factor provided");
        }
        const zoomed = await this.#tool("zoom", { base64: this.#base64, factor });
        await this.#updateImage(zoomed);
        return Promise.resolve();
    }

    /**
     * @param {number} degrees - the degrees to rotate the image by
     * @returns {string} - base64 encoded image
     */
    async rotate(degrees) {
        const rotated = await this.#tool("rotate", { base64: this.#base64, degrees });
        await this.#updateImage(rotated);
        return Promise.resolve();
    }

    /**
     * @returns {string}
     * @readonly
     */
    getSource() {
        return Object.freeze(this.#src);
    }

    /**
     * @returns {ImageSize}
     * @readonly
     */
    getSize() {
        return Object.freeze(this.#size);
    }

    /**
     * @returns {Promise<{width: number, height: number}>}
     * @readonly
     */
    getDimensions() {
        return Object.freeze(this.#dimensions);
    }

    /**
     * @returns {string[]}
     * @readonly
     */
    static stored() {
        return Object.freeze([...this.#storedKeys]);
    }

    /**
     * @param {string} key
     * @returns {boolean}
     */
    static exists(key) {
        return this.#storedKeys.includes(key);
    }

    /**
     * @param {string} key
     * @returns {Image}
     */
    static load(key) {
        if (!Image.exists(key)) throw new Error("Key does not exist");
        const data = alt.LocalStorage.get(Image.#STORAGE_PREFIX + key);
        return new Image(data);
    }

    /**
     * @param {string} key
     */
    save(key) {
        alt.LocalStorage.set(Image.#STORAGE_PREFIX + key, { base64: this.#base64, dimensions: this.#dimensions, name: this.name, size: this.#size });
        if (!Image.exists(key)) Image.#storedKeys.push(key);
        alt.LocalStorage.set(Image.#STORAGE_PREFIX + "#ALL_KEYS", Image.#storedKeys);
        alt.LocalStorage.save();
    }

    /**
     * @param {string} key
     */
    static delete(key) {
        if (!Image.exists(key)) throw new Error("Key does not exist");
        alt.LocalStorage.delete(Image.#STORAGE_PREFIX + key);
        Image.#storedKeys = Image.#storedKeys.filter((storedKey) => storedKey !== key);
        alt.LocalStorage.set(Image.#STORAGE_PREFIX + "#ALL_KEYS", Image.#storedKeys);
        alt.LocalStorage.save();
    }
}
