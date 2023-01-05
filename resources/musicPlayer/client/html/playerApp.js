let debug;
let player;
let debugDiv = document.getElementById("debug");
let managerDiv = document.getElementById("manager");

function setDebug(enable) {
    debug = enable;
    if (enable) debugDiv.style.display = "block";
    else debugDiv.style.display = "none";
}

function onYouTubeIframeAPIReady() {
    setDebug(false);
    player = new YT.Player("player", {
        height: 90,
        width: 160,
        videoId: null,
        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
            //  onPlaybackQualityChange: onPlayerPlaybackQualityChange,
            onError: onPlayerError,
        },
    });
}

function onPlayerReady(event) {
    if ("alt" in window) alt.emit("musicPlayer:ready");
    else load({ id: "aYcOg6hk3Zs", time: 0, volume: 40 });
    //  console.log(event.target);
    //  event.target.playVideo();
}

function onPlayerError(event) {
    //  console.log("error", Object.entries(event));
    //  alt.emit("musicPlayer:error", event)
}

function onPlayerStateChange(event) {
    console.log("state", event.data);
    if ("alt" in window) alt.emit("musicPlayer:state", event.data);
}

function init(music) {
    load(music);
    if (music.state == YT.PlayerState.PAUSED) pause();
}

function load({ id, time, volume }) {
    player.loadVideoById(id, time || 0, "small");
    setVolume(volume);
}

function play() {
    player.playVideo();
}

function stop() {
    player.stopVideo();
}

function pause() {
    player.pauseVideo();
}

function seek(time) {
    player.seekTo(time, true);
}

function setVolume(volume) {
    player.setVolume(volume);
}

if ("alt" in window) {
    alt.on("debug", setDebug);
    alt.on("init", init);
    alt.on("load", load);
    alt.on("play", play);
    alt.on("stop", stop);
    alt.on("pause", pause);
    alt.on("seek", seek);
    alt.on("volume", setVolume);
}
