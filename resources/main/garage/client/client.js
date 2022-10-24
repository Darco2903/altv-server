import * as alt from 'alt';
import * as native from 'natives';


let show


alt.onServer('exitGarage:Client', exitGarage)
alt.onServer('vehParked', vehParked)
alt.onServer('stopShow', () => {clearInterval(show)})



function exitGarage () {
    const text = "Press E to exit garage."
    showHelpText(text)

    alt.on('keydown', (key) => {
        if (key === 'E'.charCodeAt(0) ) {
            alt.emitServer('exitGarage:Server')
        }
    });
}

function vehParked () {
    const text = "Car parked !"
    showHelpText(text)
}



function showHelpText(text) {
    native.beginTextCommandDisplayHelp("STRING");
    native.addTextComponentSubstringPlayerName(text);
    native.endTextCommandDisplayHelp(0, false, true, 10);

    show = setInterval(() => {
        native.beginTextCommandDisplayHelp("STRING");
        native.addTextComponentSubstringPlayerName(text);
        native.endTextCommandDisplayHelp(0, false, false, 10);

    }, 10);
}

