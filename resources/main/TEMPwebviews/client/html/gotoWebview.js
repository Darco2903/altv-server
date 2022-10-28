let veh

let vehClass = []
for (const elem in vehList) {
    vehType.push(elem)
}


let table = document.createElement('table')
table.height='99vw'
let t = 0, n = 0;


const html = document.querySelector('div')

htmlGen()
html.append(table)


function htmlGen () {
    if (!vehType[t]) {
        return
    }
    if (n==0) {
        var h1 = document.createElement('h1')
        h1.append(vehType[t])
        table.append(h1)
    }

        
        var trBut =  document.createElement('tr');
        //tr.style.backgroundColor = 'red';
        
        table.appendChild(trBut)
        
        trGen(trBut)

}


function trGen (trBut) {
    for (var j=0; j<9; j++){
        
        var tdBut = document.createElement('td')
        
        var button = document.createElement('button')
        var Model = vehList[vehType[t]][n]

        if (!Model) {
            t++
            n=0
            return htmlGen()
        }

        
        if (vehType[t] == 'Mod') {
            var ModelName = Model
            var ModelButton = Model.replace(' ', '_').toLowerCase()
            
        } else {
            var ModelName = Model[0].toUpperCase() + Model.slice(1)
            var ModelButton = Model
            
        }

        button.append(ModelName)
        button.id = ModelButton
        tdBut.append(button)
        trBut.append(tdBut)
        n++
        
    }
    return htmlGen()
}


let nodeList = document.querySelectorAll("button")

buttonList = Array.prototype.slice.call(nodeList)

var btn = []
var i = 0

for (var i = 0; i < buttonList.length; i++) {

    if (buttonList[i].addEventListener){
        buttonList[i].addEventListener("click", function(event){
            var btn = event.target || event.srcElement;
            spawnVeh(btn.id)
        });
    } else if (buttonList[i].attachEvent) {    
        buttonList[i].attachEvent("onclick", function(){
            var btn = event.target || event.srcElement;
            //spawnVeh(btn.id)
        });
    } 
};


function gotoLoc(loc) {
    if('alt' in window) {
        if (loc != 'close') {
            alt.emit('gotoLoc', loc);
        }
        alt.emit('close:Webview');
    }
}