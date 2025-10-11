var audio = new Audio('audio_tracks/earth-rumble-128880.mp3');

function playAudio() {
    audio.play();
}

function pauseAudio() {
    audio.pause()
}

function pressedPlay() {
    if (document.getElementById("sky").checked) 
        console.log("'sky' checked");
    else 
        console.log("'sky' not checked");
}
