import * as alt from "alt-client"
import * as native from 'natives';



let player = alt.Player.local
let webviewLoaded


alt.on("anyResourceStop", (resourceName) => {
    if (webviewLoaded)
        disablePlayerControls(false)
})

alt.on("webview:open", open)
alt.on("webview:close", close)

function open (webview) {
    webviewLoaded = webview
    alt.setCamFrozen(false)
    disablePlayerControls(true)
    webview.focus();
    alt.on('keydown', unlockCam);
    alt.on('keyup', freezeCam);
}

function close (webview) {
    webviewLoaded = null
    alt.off("keydown", unlockCam)
    alt.off("keyup", freezeCam)
    disablePlayerControls(false)
    webview.destroy()
}

function tempUnlock (enable) {
    alt.toggleGameControls(enable)
    native.freezeEntityPosition(player, enable)
    alt.showCursor(!enable)
}

function freezeCam (key) {
    if (isRightClick(key)) {
        tempUnlock(false)
        const cursosPos = alt.getScreenResolution().div(2, 2)
        alt.setCursorPos(cursosPos)
    }
}

function unlockCam (key) {
    if (isRightClick(key))
        tempUnlock(true)
}

function isRightClick (key) {
    return key == 2     //  key: 2 = RClick
}

function disablePlayerControls (bool) {
    alt.showCursor(bool);
    alt.toggleGameControls(!bool)
}
