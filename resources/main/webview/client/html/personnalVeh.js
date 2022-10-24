
let veh


let table = document.createElement('table')
table.height='99vw'
let t = 0, n = 0;


const html = document.querySelector('div')

htmlGen()
html.append(table)


function htmlGen (vehList) {
    for (const veh of vehList) {
        
        
    }

}

function tdGen () {
    var tdModel = document.createElement('td')
    var h2Model = document.createElement('h2')
    var tdID = document.createElement('td')
    var h2ID = document.createElement('h2')
    var tdColor = document.createElement('td')
    var h2Color = document.createElement('h2')
    h2Model.innerHTML = veh.model
    h2ID = veh.getSyncedMeta('id')
    h2Color = veh.color
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


function veh(veh) {
    console.log(weap)
    if('alt' in window) {
        if (weap != 'close') {
            //alt.emit('giveWeapon', weap);
        }
        alt.emit('close:Webview');
    }
}