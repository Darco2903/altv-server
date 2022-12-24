import * as alt from 'alt-client';
import * as native from "natives"



let webview
let resouces = ["carManager"]
let player = alt.Player.local
const menuURL = "http://resource/client/html/menu.html"


function openMenu () {
    webview = new alt.WebView(menuURL)
    webview.on("menu:event", eventHandler)
    webview.emit("resourcesAvailable", resourcesAvailable(), !!alt.Player.local.vehicle)
    webview.emit("nametag:diplay", alt.getMeta("displayNametag"))
    //open(webview)
    alt.emit("webview:open", webview)
    const cursosPos = alt.getScreenResolution().div(2, 2)
    alt.setCursorPos(cursosPos)
}

function eventHandler (event) {
    const id = event.id
    switch (id) {
        case "spawnVeh":
        case "modVeh":
            loadWbVw(id)
            break;
        
        case "nametag":
            alt.emit("nametag:toogle", event.checked)
            break;
    
        default:
            break;
    }
}

alt.on('keyup', (key) => {
    switch (key) {
        case 75:    //  K
            switchMenu()
            break;

        case 27:    //  ESC
            if (webview)
                closeWebView()
            break;

        default:
            break;
    }
})

function switchMenu () {

    switch (true) {

        case !!webview:
            closeWebView()
            // fall through
        case !alt.gameControlsEnabled():
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
    //  close(webview)
    alt.emit("webview:close", webview)
    webview = undefined
}
