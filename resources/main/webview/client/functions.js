import * as alt from "alt-client"
import * as native from 'natives';
import { enableChat } from "chat"

export class WebView {
    constructor(url) {
        let webview = new alt.WebView(url, false)
        webview.disablePauseMenu = false

        webview.open = function () {
            enableChat(false)
            webview.focus(); 
            alt.showCursor(true);
            native.setPlayerControl(alt.Player.local.scriptID, false, 1)
            
            webview.disablePauseMenu = alt.everyTick(() => {
                native.disableControlAction(0, 199, true)
                native.disableControlAction(0, 200, true)
            })
            
            //RClick
            alt.on('keydown', unlockCam);
            alt.on('keyup', freezeCam);
            
        }
        
        webview.close = function () {
            enableChat(true)
            alt.showCursor(false)
            setTimeout(() => {
                native.setPlayerControl(alt.Player.local.scriptID, true, 1)
            }, 100)
            alt.clearEveryTick(webview.disablePauseMenu)
            webview.destroy()
            webview = undefined
            alt.off("keydown", unlockCam)
            alt.off("keyup", freezeCam)
            return webview
        }
        return webview
    }
}

function freezeCam (key) {
    if (key == 2) native.setPlayerControl(alt.Player.local.scriptID, false, 1)
}

function unlockCam (key) {
    if (key == 2) native.setPlayerControl(alt.Player.local.scriptID, false, 256)
}
