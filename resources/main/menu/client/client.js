import * as alt from 'alt-client';
//  import * as native from 'natives';
import WebView from "./WebView";
import { chatOpened } from "chat"


let webview
let resouces = {carManager: false}


alt.on('keyup', (key) => {
    switch (key) {
        case 75: // K
            if (!webview && !chatOpened()) {
                openMenu()
                break;
            }
            
        case 27: // Escape
            if (webview)
                webview = webview.close()
            break;
    
        default:
            break;
    }
})


function openMenu () {
    if (webview) return
    webview = new WebView("http://resource/client/html/menu.html")
    webview.on("action", loadWbVw)
    resourcesAvailable()
    webview.emit("resourcesAvailable", resouces, !!alt.Player.local.vehicle)
    webview.open()
}


function resourcesAvailable () {
    Object.keys(resouces).forEach(function(key) {
        resouces[key] = alt.Resource.all.includes(alt.Resource.getByName(key))
    })
}

function loadWbVw (wbvw) {
    webview = webview.close()
    alt.emit(`${wbvw}:load`)
}
