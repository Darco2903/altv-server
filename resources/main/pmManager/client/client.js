import * as alt from 'alt-client';
import * as native from 'natives';
import WebView from "./WebView";
//import { WebView } from "exports";


alt.log("WEBVIEW STARTED")


let webview

alt.on('keyup', (key) => {
    if (key == 27 && webview) { //Escape
        webview = webview.close()
    }
})

