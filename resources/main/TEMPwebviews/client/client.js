import * as alt from 'alt-client';
import * as native from 'natives';
import { WebView } from './classWebview';

export { WebView }

/*
let webview
alt.on('keydown', (key) => {
    //²
    if (key == 222) {
        if (!webview) {
            webview = new alt.WebView('http://resource/client/html/tabWebview.html')
            webview.emit('players', true) //alt.Player.all
        }
    }

    if (key == 113) { //F2
        if (webview) {
            if (webview.url == 'http://resource/client/html/commandWebview.html') {
                alt.emit('tabWebview:playersList', 'a')
                return closeWebview()
            }
        }
        helpWebview()
    }
    
})

const tabWebview = "WebView{ url: http://resource/client/html/tabWebview.html }"
alt.on('keyup', (key) => {
    if (key == 222 && webview == tabWebview) { //²
        webview.destroy()
        webview = undefined
    }
})


alt.onServer('clothesWebview:load', () => {
    if (webview) return

    webview = new alt.WebView('http://resource/client/html/clothesWebview.html')
    webview.on('close:Webview', closeWebview)
    webview.on('cancel:WebviewClothes', playerDiscardChange)
    webview.on('saveClothes', saveClothes)
    webview.on('setClothes', setClothes)

    alt.emitServer('clothesWebview:getClothesInit', (alt.Player.local.scriptID))
    alt.onServer('clothesWebview:getClothesInit', (clothes) => {
        for (var elem in clothes) {
            console.log(elem, clothes[elem])
        
            webview.emit('clothesValInit', [elem, clothes[elem]])
                            
        }
    })
    
    openWebview()
})


alt.onServer('pmWebview:load', () => {
    if (!webview) {
        webview = new alt.WebView('http://resource/client/html/pmWebview.html')
        webview.on('close:Webview', closeWebview)
        webview.on('setpm', setpm)
    }
    openWebview()
})

alt.onServer('weaponWebview:load', () => {
    if (!webview) {
        webview = new alt.WebView('http://resource/client/html/weaponWebview.html')
        webview.on('close:Webview', closeWebview)
        webview.on('giveWeapon', weaponGive)
    }
    openWebview()
})

alt.onServer('helpWebview:load', () => {
    helpWebview()
})

function helpWebview () {
    if (!webview) {
        webview = new alt.WebView('http://resource/client/html/commandWebview.html')
        webview.on('close:Webview', closeWebview)
    }
    openWebview()
}


alt.onServer('gotoWebview:load', () => {
    if (!webview) {
        webview = new alt.Webview('http://resource/client/html/gotoWebview.html')
    }
})


function setClothes (clothes) {
    alt.emitServer('editClothes:Player', clothes)
}

function saveClothes (clothes) {
    alt.emitServer('saveClothes:Player', clothes)
}

function setpm (pm) {
    alt.emitServer('setpm:SendToServer', pm)
}

function playerDiscardChange () {
    alt.emitServer('discardChange:Player', alt.Player.local.scriptID)
}

function weaponGive (weap) {
    alt.emitServer('giveWeapon:Player', weap)
}

*/