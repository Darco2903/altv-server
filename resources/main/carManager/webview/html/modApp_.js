
let nodeList = document.querySelectorAll("button")
let buttonList = Array.prototype.slice.call(nodeList)


for (const button of buttonList) {
    if (button.addEventListener){
        button.addEventListener("click", function (event){
            let btn = event.target || event.srcElement
            btnSelector(btn.id, btn.name)
        });
    } 
}


let selector = new Array(49).fill(0)

function btnSelector (action, name) {
    console.log(action, name)
    let i = parseInt(name)

    switch (action) {
        case "previous":
            if (selector[i] > 0) selector[i] -= 1
            break;
        
        case "next":
            selector[i] += 1
            break;
        
        case "cancel":
            alt.emit('cancel:WebviewVehicle');
            break;

        case "done":
            alt.emit('save:WebviewVehicle')
            alt.emit('close:Webview');
            break;

        case "save":
            alt.emit('save:WebviewVehicle')
            break;

        default:
            break;
    }

    switch (name) {
        case 18: // turbo
        case 22: // xenon
            if (selector[i] > 1)
                selector[i] -= 1
            break;

        case 12: // brakes
        case 13: // transmission
        case 46: // window tint
            if (selector[i] > 3)
                selector[i] -= 1
            break;

        case 11: // engine
        case 15: // suspension
        case 62: // plate
            if (selector[i] > 4)
                selector[i] -= 1
            break;
        
        case 16: //armour
            if (selector[i] > 5)
                selector[i] -= 1
            break;

        case 14: //horn
            if (selector[i] > 35) 
                selector[i] -= 1
            break;

        default:
            break;
    }

    let id = 'show' + name.toString()
    let show = document.getElementById(id);
    show.innerHTML = selector[i];

    alt.emit('setmod', name, selector[i]);
}

let red1 = document.getElementById("red1");
let showred1 = document.getElementById("showred1");
showred1.innerHTML = red1.value
red1.oninput = function() {
    showred1.innerHTML = this.value
    let customColor = [red1.value, green1.value, blue1.value, red2.value, green2.value, blue2.value, opac.value, pearl.value]
    alt.emit('customColor', customColor)
}
let green1 = document.getElementById("green1");
let showgreen1 = document.getElementById("showgreen1");
showgreen1.innerHTML = green1.value
green1.oninput = function() {
    showgreen1.innerHTML = this.value

    let customColor = [red1.value, green1.value, blue1.value, red2.value, green2.value, blue2.value, opac.value, pearl.value]
    alt.emit('customColor', customColor)
}
let blue1 = document.getElementById("blue1");
let showblue1 = document.getElementById("showblue1");
showblue1.innerHTML = blue1.value
blue1.oninput = function() {
    showblue1.innerHTML = this.value

    let customColor = [red1.value, green1.value, blue1.value, red2.value, green2.value, blue2.value, opac.value, pearl.value]
    alt.emit('customColor', customColor)
}
let red2 = document.getElementById("red2");
let showred2 = document.getElementById("showred2");
showred2.innerHTML = red2.value
red2.oninput = function() {
    showred2.innerHTML = this.value
    let customColor = [red1.value, green1.value, blue1.value, red2.value, green2.value, blue2.value, opac.value, pearl.value]
    alt.emit('customColor', customColor)
}
let green2 = document.getElementById("green2");
let showgreen2 = document.getElementById("showgreen2");
showgreen2.innerHTML = green2.value
green2.oninput = function() {
    showgreen2.innerHTML = this.value

    let customColor = [red1.value, green1.value, blue1.value, red2.value, green2.value, blue2.value, opac.value, pearl.value]
    alt.emit('customColor', customColor)
}
let blue2 = document.getElementById("blue2");
let showblue2 = document.getElementById("showblue2");
showblue2.innerHTML = blue2.value
blue2.oninput = function() {
    showblue2.innerHTML = this.value

    let customColor = [red1.value, green1.value, blue1.value, red2.value, green2.value, blue2.value, opac.value, pearl.value]
    alt.emit('customColor', customColor)
}

let primary = document.getElementById("primary");
let showprimary = document.getElementById("showprimary");
showprimary.innerHTML = primary.value
primary.oninput = function() {
    showprimary.innerHTML = this.value

    let color = [primary.value, secondary.value]
    alt.emit('color', color)
}
let secondary = document.getElementById("secondary");
let showsecondary = document.getElementById("showsecondary");
showsecondary.innerHTML = secondary.value
secondary.oninput = function() {
    showsecondary.innerHTML = this.value

    let color = [primary.value, secondary.value]
    alt.emit('color', color)
}

let opac = document.getElementById("opac");
let showpopac = document.getElementById("showopac");
showopac.innerHTML = opac.value
opac.oninput = function() {
    showopac.innerHTML = this.value

    let customColor = [red1.value, green1.value, blue1.value, red2.value, green2.value, blue2.value, opac.value, pearl.value]
    alt.emit('customColor', customColor)
}
let pearl = document.getElementById("pearl");
let showpearl = document.getElementById("showpearl");
showpearl.innerHTML = pearl.value
pearl.oninput = function() {
    showpearl.innerHTML = this.value

    let customColor = [red1.value, green1.value, blue1.value, red2.value, green2.value, blue2.value, opac.value, pearl.value]
    alt.emit('customColor', customColor)
}


let neonsred = document.getElementById("neonsred");
let showneonsred = document.getElementById("showneonsred");
showneonsred.innerHTML = neonsred.value
neonsred.oninput = function() {
    showneonsred.innerHTML = this.value
    let neons = [neonsred.value, neonsgreen.value, neonsblue.value]
    alt.emit('neons', neons)
}
let neonsgreen = document.getElementById("neonsgreen");
let showneonsgreen = document.getElementById("showneonsgreen");
showneonsgreen.innerHTML = neonsgreen.value
neonsgreen.oninput = function() {
    showneonsgreen.innerHTML = this.value

    let neons = [neonsred.value, neonsgreen.value, neonsblue.value]
    alt.emit('neons', neons)
}
let neonsblue = document.getElementById("neonsblue");
let showneonsblue = document.getElementById("showneonsblue");
showneonsblue.innerHTML = neonsblue.value
neonsblue.oninput = function() {
    showneonsblue.innerHTML = this.value

    let neons = [neonsred.value, neonsgreen.value, neonsblue.value]
    alt.emit('neons', neons)
}
let wheeltype = document.getElementById("wheeltype");
let showwheeltype = document.getElementById("showwheeltype");
showwheeltype.innerHTML = wheeltype.value
wheeltype.oninput = function() {
    showwheeltype.innerHTML = this.value

    let wheels = [wheeltype.value, wheelmodel.value, wheelcolor.value]
    alt.emit('setwheels', wheels)
}
let wheelmodel = document.getElementById("wheelmodel");
let showwheelmodel = document.getElementById("showwheelmodel");
showwheelmodel.innerHTML = wheelmodel.value
wheelmodel.oninput = function() {
    showwheelmodel.innerHTML = this.value

    let wheels = [wheeltype.value, wheelmodel.value, wheelcolor.value]
    alt.emit('setwheels', wheels)
}
let wheelcolor = document.getElementById("wheelcolor");
let showwheelcolor = document.getElementById("showwheelcolor");
showwheelcolor.innerHTML = wheelcolor.value
wheelcolor.oninput = function() {
    showwheelcolor.innerHTML = this.value

    let wheels = [wheeltype.value, wheelmodel.value, wheelcolor.value]
    alt.emit('setwheels', wheels)
}