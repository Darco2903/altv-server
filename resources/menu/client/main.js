import * as alt from 'alt-client';
import { open, close, cantLoad } from "webview";



let webview
let resouces = ["carManager"]

let player = alt.Player.local


alt.on('keyup', (key) => {
    switch (key) {
        case 75: // K
            switchMenu()
            break;
            
        case 27: // Escape
            if (webview)
                closeWebView()
            break;
    
        default:
            break;
    }
})

const menuURL = "http://resource/client/html/menu.html"

function openMenu () {
    webview = new alt.WebView(menuURL)
    webview.on("loadWebView", loadWbVw)
    webview.emit("resourcesAvailable", resourcesAvailable(), !!alt.Player.local.vehicle)
    open(webview)
}

function switchMenu () {
    switch (true) {

        case !!webview:
            closeWebView()
            // fall through

        case cantLoad():
            return

        case !webview && !player.vehicle:
        case !webview && player.vehicle.speed < 10:
            openMenu()
            break;

        default:
            break;
    }
}

function resourcesAvailable () {
    let available = {}
    resouces.forEach(resourceName => available[resourceName] = alt.Resource.all.includes(alt.Resource.getByName(resourceName)))
    return available
}

function loadWbVw (toLoad) {
    closeWebView()
    alt.emit(`${toLoad}:load`)
}

function closeWebView () {
    close(webview)
    webview = undefined
}
