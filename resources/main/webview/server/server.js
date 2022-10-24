import * as alt from 'alt-server';
import * as chat from 'chat';



alt.onClient('clothesWebview:getClothesInit', (player) => {
    alt.emitClient(player, 'clothesWebview:getClothesInit', getPlayerClothes(player))
})


function getPlayerClothes (player) {
    var clothes = {}

    for (var i = 0; i < 11; i++) {
        clothes[clothesIndex[i]] = player.getDlcClothes(i)
    }

    return clothes
}

const clothesIndex = [
    'head',
    'mask',
    'hair',
    'arms',
    'lower',
    'parachute',
    'shoes',
    'tie',
    'under',
    'bulletproof',
    'shirt',
]


alt.on('p', (player) => {

    var vehList = []
    alt.Vehicle.all.forEach(vehicle => {
        if (vehicle.getSyncedMeta('owner') == player.name) vehList.push([vehicle.model, vehicle])
    })

    vehList.sort()

    for (const i in vehList) {
        var veh = vehList[i][1]
        vehList[i] = {id: veh.getSyncedMeta('id'), model: veh.getSyncedMeta('model'), color: getVehColor(veh)[0]}
    }
    alt.emitClientRaw(player, 'personnalVehWebview:load', (vehList))
})

function getVehColor (vehicle) {
    var appearance = vehicle.getSyncedMeta('appearance')
    var color = appearance.substr(5, 4)
    return convertBase64toDecimal(color)
}

function convertBase64toDecimal (base64) {
    var binary_string = Buffer.from(base64, 'base64').toString()
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes
}
