// JS FOR THE DEPTH-MAP ECHO IDEA

/*
IDEA:
Like the depth muffle idea, but the first tone is always clear and just has
a series of fading echoes indicating distance.

ASSUMPTIONS:
- 
*/

// FILE-GLOBAL VARS
// reference global vars: these are just defaults, and are editable
const TOGGLE_PLAY = ' '; //key to toggle play/pause


// SETUP OF TONES
const basicTone = new Tone.Sampler({
    urls: {
        D1: "clean_d_str_pick-short.mp3",
    },
    baseUrl: "audio_tracks/",
    release: 0.2,
    // onload: () => {
    //     basicTone.triggerAttackRelease(["C1", "E1", "G1", "B1"], 0.5);
    // },
}).toDestination();


// KEYBINDINGS
document.addEventListener('keydown', handleDown);
document.addEventListener('keyup', handleUp);

function handleDown(e) {
  if (e.key != TOGGLE_PLAY) {
    return;
  }
  playTone();
}

function handleUp(e) {
  return;
}

// helper to play basic tone
function playTone() {
  basicTone.triggerAttackRelease("D1", 0.5);
}