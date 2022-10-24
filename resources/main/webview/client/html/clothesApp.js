let nodeList1 = document.querySelectorAll(".button")
buttonList = Array.prototype.slice.call(nodeList1)

var btn = []


for (var i = 0; i < buttonList.length; i++) {

    if (buttonList[i].addEventListener){
        buttonList[i].addEventListener("click", function(event){
            var btn = event.target || event.srcElement;
            btnSelector(btn.id, btn.name)
        });

    } else if (buttonList[i].attachEvent) {    
        buttonList[i].attachEvent("onclick", function(){
            var btn = event.target || event.srcElement;
            //spawnVeh(btn.id)
        });
    } 
};



function btnSelector (action, name) {
    if (action == 'cancel') {
        alt.emit('cancel:WebviewVehicle');
    }
    if (action == 'done') {
        alt.emit('saveClothes')
        alt.emit('close:Webview');
    }
    if (action == 'save') {
        alt.emit('saveClothes')
    }
}

const doc = {
    head1: [document.getElementById("head1"), document.getElementById("showhead1")],
    head2: [document.getElementById("head2"), document.getElementById("showhead2")],
    hair1: [document.getElementById("hair1"), document.getElementById("showhair1")],
    hair2: [document.getElementById("hair2"), document.getElementById("showhair2")],
    arms1: [document.getElementById("arms1"), document.getElementById("showarms1")],
    arms2: [document.getElementById("arms2"), document.getElementById("showarms2")],
    shirt1: [document.getElementById("shirt1"), document.getElementById("showshirt1")],
    shirt2: [document.getElementById("shirt2"), document.getElementById("showshirt2")],
    under1: [document.getElementById("under1"), document.getElementById("showunder1")],
    under2: [document.getElementById("under2"), document.getElementById("showunder2")],
    lower1: [document.getElementById("lower1"), document.getElementById("showlower1")],
    lower2: [document.getElementById("lower2"), document.getElementById("showlower2")],
    shoes1: [document.getElementById("shoes1"), document.getElementById("showshoes1")],
    shoes2: [document.getElementById("shoes2"), document.getElementById("showshoes2")],
    mask1: [document.getElementById("mask1"), document.getElementById("showmask1")],
    mask2: [document.getElementById("mask2"), document.getElementById("showmask2")],
    tie1: [document.getElementById("tie1"), document.getElementById("showtie1")],
    tie2: [document.getElementById("tie2"), document.getElementById("showtie2")],
    parachute1: [document.getElementById("parachute1"), document.getElementById("showparachute1")],
    parachute2: [document.getElementById("parachute2"), document.getElementById("showparachute2")],
    bulletproof1: [document.getElementById("bulletproof1"), document.getElementById("showbulletproof1")],
    bulletproof2: [document.getElementById("bulletproof2"), document.getElementById("showbulletproof2")],
}


alt.on('clothesValInit', (data) => {
    //if (!doc[data[1]]) return

    const val1 = data[1]['drawable']
    const val2 = data[1]['texture']
    const html1 = doc[data[0]+'1']
    const html2 = doc[data[0]+'2']
    
    html1[1].innerHTML = val1
    html1[0].value = val1
    html2[1].innerHTML = val2
    html2[0].value = val2
    
})




var head1 = document.getElementById("head1");
var showhead1 = document.getElementById("showhead1");
showhead1.innerHTML = head1.value
head1.oninput = function() {
    showhead1.innerHTML = this.value

    alt.emit('setClothes', [0, this.value, head2.value, 0])
}
var head2 = document.getElementById("head2");
var showhead2 = document.getElementById("showhead2");
showhead2.innerHTML = head2.value
head2.oninput = function() {
    showhead2.innerHTML = this.value
    alt.emit('setClothes', [0, head1.value, this.value, 0])
}

var hair1 = document.getElementById("hair1");
var showhair1 = document.getElementById("showhair1");
showhair1.innerHTML = hair1.value
hair1.oninput = function() {
    showhair1.innerHTML = this.value

    alt.emit('setClothes', [2, this.value, hair2.value, 0])
}
var hair2 = document.getElementById("hair2");
var showhair2 = document.getElementById("showhair2");
showhair2.innerHTML = hair2.value
hair2.oninput = function() {
    showhair2.innerHTML = this.value
    alt.emit('setClothes', [2, hair1.value, this.value, 0])
}

var arms1 = document.getElementById("arms1");
var showarms1 = document.getElementById("showarms1");
showarms1.innerHTML = arms1.value
arms1.oninput = function() {
    showarms1.innerHTML = this.value

    alt.emit('setClothes', [3, this.value, arms2.value, 0])
}
var arms2 = document.getElementById("arms2");
var showarms2 = document.getElementById("showarms2");
showarms2.innerHTML = arms2.value
arms2.oninput = function() {
    showarms2.innerHTML = this.value
    alt.emit('setClothes', [3, arms1.value, this.value, 0])
}

var shirt1 = document.getElementById("shirt1");
var showshirt1 = document.getElementById("showshirt1");
showshirt1.innerHTML = shirt1.value
shirt1.oninput = function() {
    showshirt1.innerHTML = this.value

    alt.emit('setClothes', [11, this.value, shirt2.value, 0])
}
var shirt2 = document.getElementById("shirt2");
var showshirt2 = document.getElementById("showshirt2");
showshirt2.innerHTML = shirt2.value
shirt2.oninput = function() {
    showshirt2.innerHTML = this.value
    alt.emit('setClothes', [11, shirt1.value, this.value, 0])
}

var under1 = document.getElementById("under1");
var showunder1 = document.getElementById("showunder1");
showunder1.innerHTML = under1.value
under1.oninput = function() {
    showunder1.innerHTML = this.value

    alt.emit('setClothes', [8, this.value, under2.value, 0])
}
var under2 = document.getElementById("under2");
var showunder2 = document.getElementById("showunder2");
showunder2.innerHTML = under2.value
under2.oninput = function() {
    showunder2.innerHTML = this.value
    alt.emit('setClothes', [8, under1.value, this.value, 0])
}

var lower1 = document.getElementById("lower1");
var showlower1 = document.getElementById("showlower1");
showlower1.innerHTML = lower1.value
lower1.oninput = function() {
    showlower1.innerHTML = this.value

    alt.emit('setClothes', [4, this.value, lower2.value, 0])
}
var lower2 = document.getElementById("lower2");
var showlower2 = document.getElementById("showlower2");
showlower2.innerHTML = lower2.value
lower2.oninput = function() {
    showlower2.innerHTML = this.value
    alt.emit('setClothes', [4, lower1.value, this.value, 0])
}

var shoes1 = document.getElementById("shoes1");
var showshoes1 = document.getElementById("showshoes1");
showshoes1.innerHTML = shoes1.value
shoes1.oninput = function() {
    showshoes1.innerHTML = this.value

    alt.emit('setClothes', [6, this.value, shoes2.value, 0])
}
var shoes2 = document.getElementById("shoes2");
var showshoes2 = document.getElementById("showshoes2");
showshoes2.innerHTML = shoes2.value
shoes2.oninput = function() {
    showshoes2.innerHTML = this.value
    alt.emit('setClothes', [6, shoes1.value, this.value, 0])
}

var mask1 = document.getElementById("mask1");
var showmask1 = document.getElementById("showmask1");
showmask1.innerHTML = mask1.value
mask1.oninput = function() {
    showmask1.innerHTML = this.value

    alt.emit('setClothes', [1, this.value, mask2.value, 0])
}
var mask2 = document.getElementById("mask2");
var showmask2 = document.getElementById("showmask2");
showmask2.innerHTML = mask2.value
mask2.oninput = function() {
    showmask2.innerHTML = this.value
    alt.emit('setClothes', [1, mask1.value, this.value, 0])
}

var tie1 = document.getElementById("tie1");
var showtie1 = document.getElementById("showtie1");
showtie1.innerHTML = tie1.value
tie1.oninput = function() {
    showtie1.innerHTML = this.value

    alt.emit('setClothes', [7, this.value, tie2.value, 0])
}
var tie2 = document.getElementById("tie2");
var showtie2 = document.getElementById("showtie2");
showtie2.innerHTML = tie2.value
tie2.oninput = function() {
    showtie2.innerHTML = this.value
    alt.emit('setClothes', [7, tie1.value, this.value, 0])
}

var parachute1 = document.getElementById("parachute1");
var showparachute1 = document.getElementById("showparachute1");
showparachute1.innerHTML = parachute1.value
parachute1.oninput = function() {
    showparachute1.innerHTML = this.value

    alt.emit('setClothes', [5, this.value, parachute2.value, 0])
}
var parachute2 = document.getElementById("parachute2");
var showparachute2 = document.getElementById("showparachute2");
showparachute2.innerHTML = parachute2.value
parachute2.oninput = function() {
    showparachute2.innerHTML = this.value
    alt.emit('setClothes', [5, parachute1.value, this.value, 0])
}

var bulletproof1 = document.getElementById("bulletproof1");
var showbulletproof1 = document.getElementById("showbulletproof1");
showbulletproof1.innerHTML = bulletproof1.value
bulletproof1.oninput = function() {
    showbulletproof1.innerHTML = this.value

    alt.emit('setClothes', [9, this.value, bulletproof2.value, 0])
}
var bulletproof2 = document.getElementById("bulletproof2");
var showbulletproof2 = document.getElementById("showbulletproof2");
showbulletproof2.innerHTML = bulletproof2.value
bulletproof2.oninput = function() {
    showbulletproof2.innerHTML = this.value
    alt.emit('setClothes', [9, bulletproof1.value, this.value, 0])
}

