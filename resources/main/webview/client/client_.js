import * as alt from 'alt-client';
import * as native from 'natives';


let webview

native.setPlayerControl(alt.Player.local.scriptID, true, 1)
native.setPlayerInvincible(alt.Player.local.scriptID, false)



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


alt.on('keyup', (key) => {

    //Escape
    if (key == 27) {
        if (webview != undefined) {
            if (webview.url == 'http://resource/client/html/modWebview.html') {
                vehicleDiscardChange()
            }
            if (webview.url == 'http://resource/client/html/clothesWebview.html') {
                playerDiscardChange()
            }
            closeWebview()
            return
        }
    }

    if (webview) {
        //²
        if (key == 222) {
            if (webview == 'WebView{ url: http://resource/client/html/tabWebview.html }') {
                webview.destroy()
                webview = undefined
            }
        }
    }
})


alt.onServer('vehWebview:load', () => {
    if (!webview) {
        webview = new alt.WebView('http://resource/client/html/vehicles/vehWebview.html')
        webview.on('close:Webview', closeWebview)
        webview.on('spawnVehicle', spawnVehicle)
    }
    openWebview()
})

alt.onServer('modWebview:load', () => {
    if (!webview) {
        webview = new alt.WebView('http://resource/client/html/vehicles/modWebview.html')
        webview.on('close:Webview', closeWebview)
        webview.on('save:WebviewVehicle', saveVeh)
        webview.on('cancel:WebviewVehicle', vehicleDiscardChange)
        webview.on('setmod', setmod)
        webview.on('setwheels', setwheels)
        webview.on('customColor', customColor)
        webview.on('color', color)
        webview.on('neons', neons)
    }
    openWebview()
})


alt.onServer('handlingWebview:load', () => {
    handlingWebview()
})

function handlingWebview () {
    if (!webview) {
        webview = new alt.WebView('http://resource/client/html/vehicles/handlingWebview.html')
        webview.on('close:Webview', closeWebview)
        webview.on('handling:Set', toSetHandling)

        const handlingData = alt.Player.local.vehicle.handling
        
        for (const elem in handlingData) {
            //console.log(elem, handlingData[elem])

            if (elem != null && elem != 'isModified' && elem != 'reset') {
                webview.emit('handlingData', [elem, handlingData[elem]])
            }
        }
    }
    openWebview()
}

alt.onServer("personnalVehWebview:load", (vehList) => {
    personnalVehWebview()
})

function personnalVehWebview () {
    if (webview) return
    webview = new alt.WebView('http://resource/client/html/vehicles/personnalVehWebview.html')
    webview.on('close:Webview', closeWebview)

    webview.emit('vehList', vehList)

    openWebview()
}


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



function toSetHandling (handling) {
    var veh = alt.Player.local.vehicle
    if (!veh) return

    if (handling == 'reset' && veh.handling.isModified()) {
        veh.handling.reset()
        closeWebview()
        setTimeout(() => {
            handlingWebview()
        }, 100);
        return
    }
    
    if (typeof handling == 'object' && Object.keys(handling).length > 2) {
        console.log('obj')
        for (const elem in handling) veh.handling[elem] = handling[elem]
        closeWebview()
        setTimeout(() => {
            handlingWebview()
        }, 100);
        return
    }
    console.log('hand')
    veh.handling[handling[0]] = handling[1]
}


function closeWebview () {

    alt.showCursor(false);

    setTimeout(() => {
        native.setPlayerControl(alt.Player.local.scriptID, true, 1)
        alt.clearEveryTick(disablePauseMenu)
    }, 100);

    webview.destroy();
    webview = undefined
}


var disablePauseMenu = null

function openWebview () {
    webview.focus(); 
    alt.showCursor(true);
    native.setPlayerControl(alt.Player.local.scriptID, false, 1)

    disablePauseMenu = alt.everyTick(() => {
        native.disableControlAction(0, 199, true)
        native.disableControlAction(0, 200, true)
    })

    //RClick
    alt.on('keydown', (key) => {
        if (key == 2 && webview != undefined) {
            native.setPlayerControl(alt.Player.local.scriptID, false, 256)
        }
    });
    alt.on('keyup', (key) => {
        if (key == 2 && webview != undefined) {
            native.setPlayerControl(alt.Player.local.scriptID, false, 1)            
        }
    });
}



function spawnVehicle(model) {
    alt.emitServer('spawn:Vehicle', JSON.stringify(model));
}

function saveVeh () {
    alt.emitServer('save:Vehicle', alt.Player.local.scriptID)
}

function vehicleDiscardChange () {
    alt.emitServer('discardChange:Vehicle', alt.Player.local.scriptID)
}

function setmod (mod) {
    alt.emitServer('vehicle:Setmod', mod)
}

function setwheels (wheels) {
    alt.emitServer('vehicle:SetWheels', wheels)
}

function customColor (customColor) {
    alt.emitServer('vehicle:CustomColor', customColor)
}

function color (color) {
    alt.emitServer('vehicle:Color', color)
}

function neons (neons) {
    alt.emitServer('vehicle:Neons', neons)
}

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
