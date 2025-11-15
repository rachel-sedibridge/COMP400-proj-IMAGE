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
var INIT = true; //set to false after first key pressed
var tones = []; //popular during loading

//TEMPLATE
const basicTone = new Tone.Sampler({
  urls: {
      D1: "clean_d_str_pick-short.mp3",
  },
  baseUrl: "audio_tracks/",
  release: 0.3,
}).toDestination();
const delays = [
  new Tone.Delay(0.6, 5),
  new Tone.Delay(1.3, 5),
  new Tone.Delay(1.3, 5),
  new Tone.Delay(3, 5)
];
const vols = [
  new Tone.Volume(-8),
  new Tone.Volume(-14),
  new Tone.Volume(-20),
  new Tone.Volume(-25)
]
const reverbs = [
  new Tone.Reverb({decay: 1, wet: 0.65}),
  new Tone.Reverb({decay: 1, wet: 0.75}),
  new Tone.Reverb({decay: 1, wet: 0.85}),
  new Tone.Reverb({decay: 1, wet: 0.95})
]
const lowPassFilters = [
  new Tone.EQ3({high: -8, highFrequency: 4000}),
  new Tone.EQ3({high: -8, highFrequency: 1600}),
  new Tone.EQ3({high: -8, highFrequency: 1000}),
  new Tone.EQ3({high: -8, highFrequency: 700})
]
for (var i = 0; i < 4; i++) {
  reverbs[i].chain(lowPassFilters[i], Tone.Destination);
}


// const delay_echo1 = new Tone.Delay(0.6, 5);
// const delay_echo2 = new Tone.Delay(1.3, 5);
// const delay_echo3 = new Tone.Delay(1.3, 5);
// const delay_echo4 = new Tone.Delay(3, 5);
// const vol_echo1 = new Tone.Volume(-8);
// const vol_echo2 = new Tone.Volume(-14);
// const vol_echo3 = new Tone.Volume(-20);
// const vol_echo4 = new Tone.Volume(-25);


// SETUP OF TONES
// run through DATA and create the echoes
function initEchoes(data) {
  for (const [index, obj] of Object.entries(data)) {
    console.log(obj)
    var name = `${obj.type}${obj.ID}`;
    var x = obj.centroid[0];
    var depth = obj.depth;
    var newTone = new Tone.Sampler({
      urls: {
          D1: "clean_d_str_pick-short.mp3",
      },
      baseUrl: "audio_tracks/",
      release: 0.3,
    });
    // pan using x coordinate
    var panner = new Tone.Panner(normalizePanX(x)).toDestination();
    newTone.connect(panner);
    // add echoes in order from nearest to farthest, stopping when dictated by `depth`
    var numEchoes = normalizeDepthToEchoes(depth);
    for (var i = 0; i < numEchoes; i++) {
      newTone.chain(delays[i], vols[i], Tone.Destination);
      newTone.chain(delays[i], vols[i], reverbs[i], Tone.Destination);
    }
    tones.push(newTone);
  }
}

// // use an array of objects as long as the object has a "time" attribute
// const part = new Tone.Part(((time, value) => {
//     // the value is an object which contains both the note and the velocity
//     basicTone.triggerAttackRelease(value.note, "8n", time, value.velocity);
// }), [{ time: 0, note: "C3", velocity: 0.9 },
//     { time: "0:2", note: "C4", velocity: 0.5 }
// ]).start(0);
// Tone.Transport.start();

// callback for Tone.Part
function buildEcho(time, obj) {
  var myTone = basicTone;
  const delay = new Tone.Delay(obj.offset).connect
}

// normalize from x in [0, 1] to Tone.Panner input in [-1, 1]
function normalizePanX(x) {
  return -1 + 2 * x
}

// get the number of echoes from the depth number
// divide into 4 "quadrants" w/ the nearest 0.05 reserved for "extreme foreground" (no echo)
function normalizeDepthToEchoes(depth) {
  if (depth <= 0.24) { //[0, 0.24]
    return 4;
  }
  else if (depth <= 0.48) { //(0.24, 0.48]
    return 3;
  }
  else if (depth <= 0.72) { //(0.48, 0.72]
    return 2;
  }
  else if (depth <= 0.95) { //(0.72, 0.95]
    return 1;
  }
  else { //(0.95, 1] *extreme* foreground
    return 0;
  }
}



// KEYBINDINGS
document.addEventListener('keydown', handleDown);
document.addEventListener('keyup', handleUp);

function handleDown(e) {
  if (INIT) { //init on ANY keypress
    fetch('json_schemas/city_street.json')
    .then((response) => response.json())
    .then((data) => initEchoes(data));
    INIT = false;
  }
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
  // const freeverb = new Tone.Freeverb().toDestination();
  // freeverb.dampening = 1000;
  // basicTone.connect(freeverb);
  // basicTone.triggerAttackRelease("D1", 0.9);

  // connect the signal to both the delay and the destination
  // delay_echo1.chain(vol_echo1, Tone.Destination);
  // basicTone.chain(delays[0], vols[0], Tone.Destination);
  // basicTone.chain(delays[1], vols[1], Tone.Destination);
  // basicTone.chain(delays[2], vols[2], Tone.Destination);
  // start and stop the pulse
  // basicTone.triggerAttackRelease("D1", 0.9);

  // const vol1 = new Tone.Volume(-20).toDestination();
  // const osc = new Tone.Oscillator().connect(vol1).start(0);
  console.log(tones)
  tones[0].triggerAttackRelease("D1", 0.8)
}