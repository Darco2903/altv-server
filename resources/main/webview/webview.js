import * as alt from "alt-client"
import * as native from 'natives';
import { enableChat } from "chat"


export class WebView extends alt.WebView {
    constructor(url) {
        super(url, false)
        this.disablePauseMenu = false
    }

    open () {
        enableChat(false)
        this.focus(); 
        alt.showCursor(true);
        native.setPlayerControl(alt.Player.local.scriptID, false, 1)
        
        this.disablePauseMenu = alt.everyTick(() => {
            native.disableControlAction(0, 199, true)
            native.disableControlAction(0, 200, true)
        })
        alt.on('keydown', unlockCam);
        alt.on('keyup', freezeCam);
    }

    close () {
        enableChat(true)
        alt.showCursor(false)
        setTimeout(() => {
            native.setPlayerControl(alt.Player.local.scriptID, true, 1)
        }, 100)
        alt.clearEveryTick(this.disablePauseMenu)
        this.destroy()
        alt.off("keydown", unlockCam)
        alt.off("keyup", freezeCam)
        return undefined
    }

}

function freezeCam (key) {
    if (key == 2) //RClick
        native.setPlayerControl(alt.Player.local.scriptID, false, 1)
}

function unlockCam (key) {
    if (key == 2) //RClick
        native.setPlayerControl(alt.Player.local.scriptID, false, 256)
}
