declare module "alt-client" {
    interface WebView {
        /**
         * Sets the cursor to the center of the screen.
         */
        centerPointer(): void;

        /**
         * Closes the webview.
         */
        close(): void;

        /**
         * Opens the webview.
         */
        open(): void;

        /**
         * Toggle the webview on or off.
         *
         * @param state The state to set the webview to.
         */
        toggle(state: boolean): void;
    }
}
