import { WebView } from "alt-client";

type ImageDimensions = {
    width: number;
    height: number;
};

type ImageSize = {
    size: number;
    sizeInBytes: number;
    unit: string;
};

export type ImageData = {
    base64: string;
    dimensions: ImageDimensions;
    name: string;
    size: ImageSize;
};

declare class Image {
    private #base64: string;
    private #dimensions: ImageDimensions;
    private #id: number;
    private static #idCounter: number;
    public name: string;
    private #size: ImageSize;
    private #src: string;
    private static #STORAGE_PREFIX: string;
    private static #storedKeys: string[];
    private static #imageTool: WebView;

    constructor(base64: string, name: string, src: string);
    constructor(data: ImageData);

    /**
     * Executes a function when the image is loaded.
     *
     * @example
     * img.onLoad = () => {
     *    console.log("Image loaded!");
     * };
     */
    public onLoad(): void;

    public getSource(): readonly string;
    public getSize(): readonly ImageSize;
    public getDimensions(): readonly ImageDimensions;

    private #init(base64: string, name: string): void;
    private static #isImageData(data: any): boolean;

    private static #tool(event: string, data: any): Promise<any>;

    private static #calcDimensions(base64: string): Promise<ImageDimensions>;
    private static #calcFileSize(base64: string): Promise<ImageSize>;

    /**
     * Resizes the image to the specified width and height.
     *
     * @param width The width to resize the image to.
     * @param height The height to resize the image to.
     */
    public async resize(width: number, height: ?number): Promise<void>;

    /**
     * Crops the image to the specified coordinates.
     *
     * @param topLeftX The top left x coordinate.
     * @param topLeftY The top left y coordinate.
     * @param bottomRightX The bottom right x coordinate.
     * @param bottomRightY The bottom right y coordinate.
     */
    public async crop(topLeftX: number, topLeftY: number, bottomRightX: number, bottomRightY: number): Promise<void>;

    // /**
    //  * Moves the image by the specified x and y values.
    //  *
    //  * @param x The x value to move the image by
    //  * @param y The y value to move the image by
    //  */
    // public async move(x: number, y: number): Promise<void>;

    /**
     * Zooms the image by the specified factor.
     *
     * @param factor The factor to zoom the image by.
     */
    public zoom(factor: number): Promise<void>;

    /**
     * Rotates the image by the specified degrees.
     *
     * @param degrees The degrees to rotate the image by.
     */
    public async rotate(degrees: number): Promise<void>;

    public static stored(): Promise<string[]>;
    public static load(key: string): Promise<Image>;
    public save(key: string): void;
    public static exists(key: string): boolean;
    public static delete(key: string): void;
}
