// JS FOR THE DEPTH-MAP ECHO IDEA

/*
IDEA:
Like the depth muffle idea, but the first tone is always clear and just has
a series of fading echoes indicating distance.

ASSUMPTIONS:
- 

USEFUL NOTES:
- map interval [a,b] -> [c,d] : f(t) = c + (d-c/b-a) * (t - a)
  https://math.stackexchange.com/questions/914823/shift-numbers-into-a-different-range
*/

// FILE-GLOBAL VARS
// reference global vars: these are just defaults, and are editable
const TOGGLE_PLAY = ' '; //key to toggle play/pause

const D_URL = "clean_d_str_pick.mp3" //unclipped 27s sample
const MAX_DELAY = 5 //in seconds, parameter for Tone.Delay objs, >delays norm to this
const TONE_SPACING = 4; //in seconds, shouldn't be less than max delay
var tones = {}; //name:tone mapping, populate during loading

//TEMPLATE
const basicTone = new Tone.Sampler({
  urls: {
      D1: D_URL, //I have no idea which D it is, not 1 but doesn't matter! :D
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
// OK this might have been doing something but I'm really not sure...
// for (var i = 0; i < 4; i++) {
//   reverbs[i].chain(lowPassFilters[i], Tone.Destination);
// }


// SETUP OF TONES
// run through DATA (from json_loader.js) and create the echoes
for (const [index, obj] of Object.entries(DATA)) {
  // console.log(obj)
  var name = `${obj.type}${obj.ID}`;
  var x = obj.centroid[0];
  var depth = obj.depth;
  var newTone = new Tone.Sampler({
    urls: {
        D1: D_URL,
    },
    baseUrl: "audio_tracks/",
    release: 0.3,
  });
  // pan using x coordinate
  var panner = new Tone.Panner(normalizePanX(x)).toDestination();
  newTone.connect(panner);
  // add echoes in order from nearest to farthest, stopping when dictated by `depth`
  var delayTime = normalizeDepthToDelay(depth);
  // for (var i = 0; i < delayTime; i++) {
  //   newTone.chain(panner, delays[i], vols[i], reverbs[i], lowPassFilters[i], Tone.Destination);
  // }
  tones[name] = newTone;
}
console.log(tones)

// normalize from x in [0, 1] to Tone.Panner input in [-1, 1]
function normalizePanX(x) {
  // function for this in the comment block at the top of the file
  return -1 + 2 * x;
}

// get echo delay time in seconds, from depth num in json
function normalizeDepthToDelay(depth) {
  // [0,1] -> [c,d] : f(t) = c + (d-c/1-0) * (t - 0)
  var delay_min = 4; //s when depth = 0
  var delay_max = 0.05; //s when depth = 1
  return delay_min + (delay_max - delay_min) * depth;
}


// KEYBINDINGS
document.addEventListener('keydown', handleDown);
document.addEventListener('keyup', handleUp);

function handleDown(e) {
  if (e.key != TOGGLE_PLAY) {
    return;
  }
  playAllTones();
  // tester();
}

function handleUp(e) {
  return;
}

// helper to play all the tones in sequence, without narration so far
function playAllTones() {
  // NOTE: edit eventList to pass additional info to the callback
  var eventList = [];
  for (const [name, toneObj] of Object.entries(tones)) {
    console.log(toneObj)
    eventList.push({
      name: name,
      tone: toneObj
    });
  }
  var toneSequence = new Tone.Sequence({
    callback: playTone,
    events: eventList,
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

  // const delay1 = new Tone.Delay(normalizeDepthToDelay(1), MAX_DELAY)
  // const delay2 = new Tone.Delay(normalizeDepthToDelay(0.75), MAX_DELAY)
  // const delay3 = new Tone.Delay(normalizeDepthToDelay(0.5), MAX_DELAY)
  // const delay4 = new Tone.Delay(normalizeDepthToDelay(0.25), MAX_DELAY)
  // const delay5 = new Tone.Delay(normalizeDepthToDelay(0), MAX_DELAY)
  // basicTone.chain(delay1, Tone.Destination)
  // basicTone.chain(delay2, Tone.Destination)
  // basicTone.chain(delay3, Tone.Destination)
  // basicTone.chain(delay4, Tone.Destination)
  // basicTone.chain(delay5, Tone.Destination)
  basicTone.triggerAttackRelease("D1", 0.9);

  // const vol1 = new Tone.Volume(-20).toDestination();
  // const osc = new Tone.Oscillator().connect(vol1).start(0);
  // console.log(tones)
  // tones[1].triggerAttackRelease("D1", 0.8)
}