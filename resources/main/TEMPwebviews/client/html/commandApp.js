let nodeList = document.querySelectorAll(".button")

buttonList = Array.prototype.slice.call(nodeList)

this.keydownBind = this.keydown.bind(this);


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
            if (btn.id == 'close') {
                alt.emit('close:Webview')
            }
        })
    }
}