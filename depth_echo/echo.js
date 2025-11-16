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
const MAX_DELAY = 5 //in seconds, max time for delay (echoes)
const TONE_SPACING = 5; //in seconds, shouldn't be less than max delay
var tones = {}; //name:tone mapping, populate during loading

//TEMPLATE
const basicTone = new Tone.Sampler({
  urls: {
      D1: "clean_d_str_pick-short.mp3",
  },
  baseUrl: "audio_tracks/",
  release: 0.3,
}).toDestination();
const delays = [
  new Tone.Delay(0.7, MAX_DELAY),
  new Tone.Delay(1.4, MAX_DELAY),
  new Tone.Delay(2.1, MAX_DELAY),
  new Tone.Delay(2.8, MAX_DELAY)
];
const vols = [
  new Tone.Volume(-8),
  new Tone.Volume(-10),
  new Tone.Volume(-10),
  new Tone.Volume(-11)
]
const reverbs = [
  new Tone.Reverb({decay: 1.1, wet: 0.65}),
  new Tone.Reverb({decay: 1.23, wet: 0.76}),
  new Tone.Reverb({decay: 1.3, wet: 0.85}),
  new Tone.Reverb({decay: 1.4, wet: 0.95})
]
const lowPassFilters = [
  new Tone.EQ3({high: -14, highFrequency: 4000}),
  new Tone.EQ3({high: -15, highFrequency: 1500}),
  new Tone.EQ3({high: -16, highFrequency: 1000}),
  new Tone.EQ3({high: -18, highFrequency: 600})
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
// run through DATA (from json_loader.js) and create the echoes
for (const [index, obj] of Object.entries(DATA)) {
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
    newTone.chain(panner, delays[i], vols[i], reverbs[i], Tone.Destination);
  }
  tones.name = newTone;
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
  if (e.key != TOGGLE_PLAY) {
    return;
  }
  playAllTones();
}

function handleUp(e) {
  return;
}

// helper to play all the tones in sequence, without narration so far
function playAllTones() {
  // NOTE: edit eventList to pass additional info to the callback
  var eventList = {};
  for (const [name, toneObj] of Object.entries(DATA)) {
    eventList.name = name;
    eventList.tone = toneObj;
  }
  var toneSequence = new Tone.Sequence({
    callback: playTone,
    events: tones,
    subdivision: TONE_SPACING,
    loop: false, //defaults to true otherwise
  }).start(0);
  console.log(toneSequence.get())
  Tone.getTransport().start();
}

// the callback for the Tone.Part that plays all the tones
// args MUST be (time, value) (API requirement)
function playTone(time, value) {
  // always the same note and duration, time comes from Sequence.subdivision
  // value = {name, tone} -> name for the 'captioning', not implemented yet
  value.tone.triggerAttackRelease("D1", 0.8, time);
}

// moved all the messing around from playTone() to here
// because the name `playTone()` made more sense to use elsewhere lol
function tester() {
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
  tones[1].triggerAttackRelease("D1", 0.8)
}