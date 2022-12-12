import * as alt from "alt-client"
import * as native from 'natives';
import { enableChat, chatOpened } from "chat"


let loaded
let disablePauseMenu

alt.on("anyResourceStop", resourceName => {
    if (loaded && alt.Resource.getByName(resourceName).dependencies.includes(alt.Resource.current.name))
        disablePlayerControls(false)
})

function freezeCam (key) {
    if (isRightClick(key))
        native.setPlayerControl(alt.Player.local.scriptID, false, 1)
}

function unlockCam (key) {
    if (isRightClick(key))
        native.setPlayerControl(alt.Player.local.scriptID, false, 256)
}

function isRightClick (key) {
    return key == 2     //  key: 2 = RClick
}

export function open (webview) {
    disablePlayerControls(true)
    webview.focus(); 
    alt.on('keydown', unlockCam);
    alt.on('keyup', freezeCam);
    disablePauseMenu = alt.everyTick(() => {
        native.disableControlAction(2, 199, true)
    })
}

export function close (webview) {
    alt.off("keydown", unlockCam)
    alt.off("keyup", freezeCam)
    disablePlayerControls(false)
    webview.destroy()
    alt.clearEveryTick(disablePauseMenu)
    native.enableControlAction(2, 199, true)
}

export function disablePlayerControls (bool) {
    loaded = bool
    enableChat(!bool)
    alt.showCursor(bool);
    //native.setCursorPosition(x, y)
    native.setPlayerControl(alt.Player.local.scriptID, !bool, 1)
}

export function canLoad () {
    return !loaded && !chatOpened()
}

export function cantLoad () {
    return loaded || chatOpened()
}


/*
class WebView extends alt.WebView {
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
*/
