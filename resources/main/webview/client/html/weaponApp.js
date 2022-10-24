
const Assault_Rifle = ['Advanced Rifle','Assault Rifle MK2','Bullpup Rifle MK2','Bullpup Rifle','Carbine Rifle MK2','Carbine Rifle','Compact Rifle','Special Carbine MK2','Special Carbine','Assault Rifle',]
const Heavy_Weapon = ['Compact Grenade Launcher','Firework Launcher','Grenade Launcher','Homing Launcher','Minigun','Railgun','RPG','Widowmaker',]
const Light_Machine_Gun = ['Combat MG MK2','Combat MG','Gusenberg Sweeper','MG','Unholy Hellbringer',]
const Melee = ['Dagger','Baseball Bat','Battle Axe','Bottle','Crowbar','Flashlight','Golf Club','Hammer','Hatchet','Knife','Knuckle','Machete','Nightstick','Wrench','Pool Cue','Stone Hatchet','Switchblade',]
const Other = ['Fire Extinguisher','Jerrican','Stun Gun',]
const Pistol = ['AP Pistol','Combat Pistol','Double Action Revolver','Flare Gun','Heavy Pistol','Revolver MK2','Revolver','Machine Pistol','Pistol 50','Pistol MK2','Pistol','SNS Pistol MK2','SNS Pistol','UP N Atomizer','Vintage Pistol',]
const Shotgun = ['Assault Shotgun','Bullpup Shotgun','Double Shotgun','Heavy Shotgun','Musket','Pump Shotgun MK2','Pump Shotgun','Sawed Off','Sweeper Shotgun',]
const Sniper_Rifle = ['Heavy Sniper MK2','Heavy Sniper','Marksman Rifle MK2','Marksman Rifle','Sniper Rifle',]
const Sub_Machine_Gun = ['Assault SMG','Combat PDW','Marksman Pistol','Micro SMG','Mini SMG','SMG MK2','SMG',]
const Throwable = ['Ball','BZ Gas','Flare','Grenade','Molotov','Pipe Bomb','Proximity Mine','Snowball','Sticky Bomb','Smoke',]

const weapList = {Pistol: Pistol, Assault_Rifle: Assault_Rifle, Heavy_Weapon: Heavy_Weapon, Shotgun: Shotgun, Sniper_Rifle: Sniper_Rifle, Light_Machine_Gun: Light_Machine_Gun, Sub_Machine_Gun: Sub_Machine_Gun, Melee: Melee, Throwable: Throwable, Other: Other}

let weap

let weapClass = []
for (const elem in weapList) {
    weapClass.push(elem)
}


let table = document.createElement('table')
table.height='99vw'
let t = 0, n = 0;


const html = document.querySelector('div')

htmlGen()
html.append(table)


function htmlGen () {
    if (!weapClass[t]) {
        return
    }
    if (n==0) {
        var h1 = document.createElement('h1')
        h1.append(weapClass[t])
        table.append(h1)
    }

        var trImg =  document.createElement('tr');
        var trBut =  document.createElement('tr');
        //tr.style.backgroundColor = 'red';
        table.appendChild(trImg)
        table.appendChild(trBut)
        
        trGen(trImg, trBut)

}


function trGen (trImg, trBut) {
    for (var j=0; j<9; j++){
        var tdImg = document.createElement('td')
        var tdBut = document.createElement('td')
        var img = document.createElement('img')
        var button = document.createElement('button')
        var Model = weapList[weapClass[t]][n]

        if (!Model) {
            t++
            n=0
            return htmlGen()
        }
    
        var ModelName = Model.toLowerCase()

        while (ModelName.indexOf(' ') >= 0) {
            ModelName = ModelName.replace(' ', '')
        }

        var imgName = './weapimg/' + ModelName + '.png'

        img.src = (imgName)
        tdImg.append(img)
        trImg.append(tdImg)
        button.append(Model)
        button.id = ModelName
        tdBut.append(button)
        trBut.append(tdBut)
        n++
        
    }
    return htmlGen()
}



let nodeList = document.querySelectorAll("button")

buttonList = Array.prototype.slice.call(nodeList)


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


function giveWeap(weap) {
    console.log(weap)
    if('alt' in window) {
        if (weap != 'close') {
            alt.emit('giveWeapon', weap);
        }
        alt.emit('close:Webview');
    }
}