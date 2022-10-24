const vehicleColorTable = {
    '0': { name: 'Metallic Black', hex: '#0d1116' },
    '1': { name: 'Metallic Graphite Black', hex: '#1c1d21' },
    '2': { name: 'Metallic Black Steal', hex: '#32383d' },
    '3': { name: 'Metallic Dark Silver', hex: '#454b4f' },
    '4': { name: 'Metallic Silver', hex: '#999da0' },
    '5': { name: 'Metallic Blue Silver', hex: '#c2c4c6' },
    '6': { name: 'Metallic Steel Gray', hex: '#979a97' },
    '7': { name: 'Metallic Shadow Silver', hex: '#637380' },
    '8': { name: 'Metallic Stone Silver', hex: '#63625c' },
    '9': { name: 'Metallic Midnight Silver', hex: '#3c3f47' },
    '10': { name: 'Metallic Gun Metal', hex: '#444e54' },
    '11': { name: 'Metallic Anthracite Grey', hex: '#1d2129' },
    '12': { name: 'Matte Black', hex: '#13181f' },
    '13': { name: 'Matte Gray', hex: '#26282a' },
    '14': { name: 'Matte Light Grey', hex: '#515554' },
    '15': { name: 'Util Black', hex: '#151921' },
    '16': { name: 'Util Black Poly', hex: '#1e2429' },
    '17': { name: 'Util Dark silver', hex: '#333a3c' },
    '18': { name: 'Util Silver', hex: '#8c9095' },
    '19': { name: 'Util Gun Metal', hex: '#39434d' },
    '20': { name: 'Util Shadow Silver', hex: '#506272' },
    '21': { name: 'Worn Black', hex: '#1e232f' },
    '22': { name: 'Worn Graphite', hex: '#363a3f' },
    '23': { name: 'Worn Silver Grey', hex: '#a0a199' },
    '24': { name: 'Worn Silver', hex: '#d3d3d3' },
    '25': { name: 'Worn Blue Silver', hex: '#b7bfca' },
    '26': { name: 'Worn Shadow Silver', hex: '#778794' },
    '27': { name: 'Metallic Red', hex: '#c00e1a' },
    '28': { name: 'Metallic Torino Red', hex: '#da1918' },
    '29': { name: 'Metallic Formula Red', hex: '#b6111b' },
    '30': { name: 'Metallic Blaze Red', hex: '#a51e23' },
    '31': { name: 'Metallic Graceful Red', hex: '#7b1a22' },
    '32': { name: 'Metallic Garnet Red', hex: '#8e1b1f' },
    '33': { name: 'Metallic Desert Red', hex: '#6f1818' },
    '34': { name: 'Metallic Cabernet Red', hex: '#49111d' },
    '35': { name: 'Metallic Candy Red', hex: '#b60f25' },
    '36': { name: 'Metallic Sunrise Orange', hex: '#d44a17' },
    '37': { name: 'Metallic Classic Gold', hex: '#c2944f' },
    '38': { name: 'Metallic Orange', hex: '#f78616' },
    '39': { name: 'Matte Red', hex: '#cf1f21' },
    '40': { name: 'Matte Dark Red', hex: '#732021' },
    '41': { name: 'Matte Orange', hex: '#f27d20' },
    '42': { name: 'Matte Yellow', hex: '#ffc91f' },
    '43': { name: 'Util Red', hex: '#9c1016' },
    '44': { name: 'Util Bright Red', hex: '#de0f18' },
    '45': { name: 'Util Garnet Red', hex: '#8f1e17' },
    '46': { name: 'Worn Red', hex: '#a94744' },
    '47': { name: 'Worn Golden Red', hex: '#b16c51' },
    '48': { name: 'Worn Dark Red', hex: '#371c25' },
    '49': { name: 'Metallic Dark Green', hex: '#132428' },
    '50': { name: 'Metallic Racing Green', hex: '#122e2b' },
    '51': { name: 'Metallic Sea Green', hex: '#12383c' },
    '52': { name: 'Metallic Olive Green', hex: '#31423f' },
    '53': { name: 'Metallic Green', hex: '#155c2d' },
    '54': { name: 'Metallic Gasoline Blue Green', hex: '#1b6770' },
    '55': { name: 'Matte Lime Green', hex: '#66b81f' },
    '56': { name: 'Util Dark Green', hex: '#22383e' },
    '57': { name: 'Util Green', hex: '#1d5a3f' },
    '58': { name: 'Worn Dark Green', hex: '#2d423f' },
    '59': { name: 'Worn Green', hex: '#45594b' },
    '60': { name: 'Worn Sea Wash', hex: '#65867f' },
    '61': { name: 'Metallic Midnight Blue', hex: '#222e46' },
    '62': { name: 'Metallic Dark Blue', hex: '#233155' },
    '63': { name: 'Metallic Saxony Blue', hex: '#304c7e' },
    '64': { name: 'Metallic Blue', hex: '#47578f' },
    '65': { name: 'Metallic Mariner Blue', hex: '#637ba7' },
    '66': { name: 'Metallic Harbor Blue', hex: '#394762' },
    '67': { name: 'Metallic Diamond Blue', hex: '#d6e7f1' },
    '68': { name: 'Metallic Surf Blue', hex: '#76afbe' },
    '69': { name: 'Metallic Nautical Blue', hex: '#345e72' },
    '70': { name: 'Metallic Bright Blue', hex: '#0b9cf1' },
    '71': { name: 'Metallic Purple Blue', hex: '#2f2d52' },
    '72': { name: 'Metallic Spinnaker Blue', hex: '#282c4d' },
    '73': { name: 'Metallic Ultra Blue', hex: '#2354a1' },
    '74': { name: 'Metallic Bright Blue', hex: '#6ea3c6' },
    '75': { name: 'Util Dark Blue', hex: '#112552' },
    '76': { name: 'Util Midnight Blue', hex: '#1b203e' },
    '77': { name: 'Util Blue', hex: '#275190' },
    '78': { name: 'Util Sea Foam Blue', hex: '#608592' },
    '79': { name: 'Uil Lightning blue', hex: '#2446a8' },
    '80': { name: 'Util Maui Blue Poly', hex: '#4271e1' },
    '81': { name: 'Util Bright Blue', hex: '#3b39e0' },
    '82': { name: 'Matte Dark Blue', hex: '#1f2852' },
    '83': { name: 'Matte Blue', hex: '#253aa7' },
    '84': { name: 'Matte Midnight Blue', hex: '#1c3551' },
    '85': { name: 'Worn Dark blue', hex: '#4c5f81' },
    '86': { name: 'Worn Blue', hex: '#58688e' },
    '87': { name: 'Worn Light blue', hex: '#74b5d8' },
    '88': { name: 'Metallic Taxi Yellow', hex: '#ffcf20' },
    '89': { name: 'Metallic Race Yellow', hex: '#fbe212' },
    '90': { name: 'Metallic Bronze', hex: '#916532' },
    '91': { name: 'Metallic Yellow Bird', hex: '#e0e13d' },
    '92': { name: 'Metallic Lime', hex: '#98d223' },
    '93': { name: 'Metallic Champagne', hex: '#9b8c78' },
    '94': { name: 'Metallic Pueblo Beige', hex: '#503218' },
    '95': { name: 'Metallic Dark Ivory', hex: '#473f2b' },
    '96': { name: 'Metallic Choco Brown', hex: '#221b19' },
    '97': { name: 'Metallic Golden Brown', hex: '#653f23' },
    '98': { name: 'Metallic Light Brown', hex: '#775c3e' },
    '99': { name: 'Metallic Straw Beige', hex: '#ac9975' },
    '100': { name: 'Metallic Moss Brown', hex: '#6c6b4b' },
    '101': { name: 'Metallic Biston Brown', hex: '#402e2b' },
    '102': { name: 'Metallic Beechwood', hex: '#a4965f' },
    '103': { name: 'Metallic Dark Beechwood', hex: '#46231a' },
    '104': { name: 'Metallic Choco Orange', hex: '#752b19' },
    '105': { name: 'Metallic Beach Sand', hex: '#bfae7b' },
    '106': { name: 'Metallic Sun Bleeched Sand', hex: '#dfd5b2' },
    '107': { name: 'Metallic Cream', hex: '#f7edd5' },
    '108': { name: 'Util Brown', hex: '#3a2a1b' },
    '109': { name: 'Util Medium Brown', hex: '#785f33' },
    '110': { name: 'Util Light Brown', hex: '#b5a079' },
    '111': { name: 'Metallic White', hex: '#fffff6' },
    '112': { name: 'Metallic Frost White', hex: '#eaeaea' },
    '113': { name: 'Worn Honey Beige', hex: '#b0ab94' },
    '114': { name: 'Worn Brown', hex: '#453831' },
    '115': { name: 'Worn Dark Brown', hex: '#2a282b' },
    '116': { name: 'Worn straw beige', hex: '#726c57' },
    '117': { name: 'Brushed Steel', hex: '#6a747c' },
    '118': { name: 'Brushed Black steel', hex: '#354158' },
    '119': { name: 'Brushed Aluminium', hex: '#9ba0a8' },
    '120': { name: 'Chrome', hex: '#5870a1' },
    '121': { name: 'Worn Off White', hex: '#eae6de' },
    '122': { name: 'Util Off White', hex: '#dfddd0' },
    '123': { name: 'Worn Orange', hex: '#f2ad2e' },
    '124': { name: 'Worn Light Orange', hex: '#f9a458' },
    '125': { name: 'Metallic Securicor Green', hex: '#83c566' },
    '126': { name: 'Worn Taxi Yellow', hex: '#f1cc40' },
    '127': { name: 'police car blue', hex: '#4cc3da' },
    '128': { name: 'Matte Green', hex: '#4e6443' },
    '129': { name: 'Matte Brown', hex: '#bcac8f' },
    '130': { name: 'Worn Orange', hex: '#f8b658' },
    '131': { name: 'Matte White', hex: '#fcf9f1' },
    '132': { name: 'Worn White', hex: '#fffffb' },
    '133': { name: 'Worn Olive Army Green', hex: '#81844c' },
    '134': { name: 'Pure White', hex: '#ffffff' },
    '135': { name: 'Hot Pink', hex: '#f21f99' },
    '136': { name: 'Salmon pink', hex: '#fdd6cd' },
    '137': { name: 'Metallic Vermillion Pink', hex: '#df5891' },
    '138': { name: 'Orange', hex: '#f6ae20' },
    '139': { name: 'Green', hex: '#b0ee6e' },
    '140': { name: 'Blue', hex: '#08e9fa' },
    '141': { name: 'Mettalic Black Blue', hex: '#0a0c17' },
    '142': { name: 'Metallic Black Purple', hex: '#0c0d18' },
    '143': { name: 'Metallic Black Red', hex: '#0e0d14' },
    '144': { name: 'hunter green', hex: '#9f9e8a' },
    '145': { name: 'Metallic Purple', hex: '#621276' },
    '146': { name: 'Metaillic V Dark Blue', hex: '#0b1421' },
    '147': { name: 'MODSHOP BLACK1', hex: '#11141a' },
    '148': { name: 'Matte Purple', hex: '#6b1f7b' },
    '149': { name: 'Matte Dark Purple', hex: '#1e1d22' },
    '150': { name: 'Metallic Lava Red', hex: '#bc1917' },
    '151': { name: 'Matte Forest Green', hex: '#2d362a' },
    '152': { name: 'Matte Olive Drab', hex: '#696748' },
    '153': { name: 'Matte Desert Brown', hex: '#7a6c55' },
    '154': { name: 'Matte Desert Tan', hex: '#c3b492' },
    '155': { name: 'Matte Foilage Green', hex: '#5a6352' },
    '156': { name: 'DEFAULT ALLOY COLOR', hex: '#81827f' },
    '157': { name: 'Epsilon Blue', hex: '#afd6e4' },
    '158': { name: 'Pure Gold', hex: '#7a6440' },
    '159': { name: 'Brushed Gold', hex: '#7f6a48' }
  }
  92

let vehList = []

alt.on('personnalVehList', (data) => {
    vehList.push(data)
})


let veh


let table = document.createElement('table')
table.height='99vw'
let t = 0, n = 0;


const html = document.querySelector('div')

alt.on('personnalVeh:ready', () => {
    
    htmlGen(vehList)
    html.append(table)
})


function htmlGen (list) {
    for (const veh of list) {
        table.append(trGen(veh))
    }
}

function trGen (veh) {
    var tr = document.createElement('tr')
    var td = document.createElement('td')
    var h2Model = document.createElement('h2')
    var h2ID = document.createElement('h2')
    /*
    console.log(veh.color)
    console.log(vehicleColorTable[veh.color])
    console.log(vehicleColorTable[veh.color].hex)
    */
   //if (veh.color > 159) veh.color -= 159
    //td.bgColor = vehicleColorTable[veh.color].hex
    var h2Color = document.createElement('h2')

    h2Model.innerHTML = veh.model
    h2ID.innerHTML = 'ID : ' + veh.id
    h2Color.innerHTML = veh.color
    td.append(h2Model, h2ID, h2Color)
    tr.append(td)
    return tr
}



let nodeList = document.querySelectorAll("button")

var buttonList = Array.prototype.slice.call(nodeList)


function keydown(e) {
    if (e.key === 'Escape') {
        if ('alt' in window) {
            alt.emit('close:Webview');
        } else {
            console.log('Closing Window')
        }
    }
}


var btn = []
var i = 0

for (var i = 0; i < buttonList.length; i++) {

    if (buttonList[i].addEventListener){
        buttonList[i].addEventListener("click", function(event){
        var btn = event.target || event.srcElement;
            giveWeap(btn.id)
        });
    } else if (buttonList[i].attachEvent) {    
        buttonList[i].attachEvent("onclick", function(){
            var btn = event.target || event.srcElement;
            
        });
    } 
};


/*function veh(veh) {
    console.log(weap)
    if('alt' in window) {
        if (weap != 'close') {
            //alt.emit('giveWeapon', weap);
        }
        alt.emit('close:Webview');
    }
}*/