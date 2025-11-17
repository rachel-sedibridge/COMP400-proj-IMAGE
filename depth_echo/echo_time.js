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
- FROM ONYX - how to make something sound far away: lowpass filter and
  then also add reverb w/ lowpass on the reverb. Add a send to reverb,
  have it go to main out and also to reverb, and then put a lowpass
  filter as an insert on the reverb.
*/

// FILE-GLOBAL VARS
// reference global vars: these are just defaults, and are editable
const TOGGLE_PLAY = ' '; //key to toggle play/pause

const D_URL = "clean_d_str_pick.mp3" //unclipped 27s sample
const MAX_DELAY = 5 //in seconds, parameter for Tone.Delay objs, >delays norm to this
const TONE_SPACING = 8; //in seconds, shouldn't be less than max delay
var toneEvents = []; //list of tone event objs used in playback, populate during loading

//TEMPLATE
const basicTone = new Tone.Sampler({
  urls: {
      D1: D_URL, //I have no idea which D it is, not 1 but doesn't matter! :D
  },
  baseUrl: "audio_tracks/",
  release: 0.3,
}).toDestination();


// SETUP OF TONES
// run through DATA (from json_loader.js) and create the tone for each detected obj
for (const [index, obj] of Object.entries(DATA)) {
  // console.log(obj)
  var objName = `${obj.type}${obj.ID}`;
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
  // create parts of the echo
  var delayTime = normalizeDepthToDelay(depth);
  var delay = new Tone.Delay(delayTime, MAX_DELAY);
  var r_decay, r_wet = normalizeDepthToReverb(depth);
  var reverb = new Tone.Reverb({decay: r_decay, wet: r_wet});
  var lp_high, lp_freq = normalizeDepthToLowPass(depth);
  var lowPassFilter = new Tone.EQ3({high: lp_high, highFrequency: lp_freq});
  // chain those parts to the tone and output
  // two branches of the delayed signal: one directly to main w/ volume
  // lowered, and one goes through reverb and lp filter first
  var vol = new Tone.Volume(-15);
  newTone.chain(panner, delay, vol, Tone.Destination);
  newTone.chain(panner, delay, reverb, lowPassFilter, Tone.Destination);
  // save the final tone by name
  toneEvents.push({
    name: objName,
    tone: newTone,
    delay: delayTime
  });
}

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

// get the params for reverb from depth num [0,1]
// we want: decay (s), wet (% as decimal)
function normalizeDepthToReverb(depth) {
  var decay_min = 1.5; //s when depth = 0
  var decay_max = 0.5; //s when depth = 1
  var decay = decay_min + (decay_max - decay_min) * depth;

  var wet_min = 0.97; //%wet when depth = 0
  var wet_max = 0.6; //%wet when depth = 1
  var wet = wet_min + (wet_max - wet_min) * depth;

  return decay, wet;
}

// get the params for lowpass filter from depth num [0,1]
// we want: high (decibels) = amount high frequency range is suppressed,
// highFrequency (Hz) = mid/high cutoff freq., i.e. where to start limiting
function normalizeDepthToLowPass(depth) {
  var high_min = -13; //decibels when depth = 0
  var high_max = -8; //decibels when depth = 1
  var high = high_min + (high_max - high_min) * depth;

  // TODO: this cannot be linear frequency is not linear
  var freq_min = 600; //Hz when depth = 0
  var freq_max = 4000; //Hz when depth = 1
  var freq = freq_min + (freq_max - freq_min) * depth;

  return high, freq;
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
  var toneSequence = new Tone.Sequence({
    callback: playTone,
    events: toneEvents,
    subdivision: TONE_SPACING,
    loop: false, //defaults to true otherwise
  }).start(0);
  console.log(toneSequence.get())
  Tone.getTransport().start();
}

// the callback for the Tone.Part that plays all the tones
// args MUST be (time, value) (API requirement)
function playTone(time, value) {
  // always the same note, time comes from ^Sequence.subdivision^
  // value contains `name` for the 'captioning', not implemented yet
  var duration = value.delay < 0.5 ? 0.5 : value.delay;
  value.tone.triggerAttackRelease("D1", duration, time);
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
  // console.log(normalizeDepthToDelay(0))
  // console.log(normalizeDepthToDelay(0.25))
  // console.log(normalizeDepthToDelay(0.5))
  // console.log(normalizeDepthToDelay(0.75))
  // console.log(normalizeDepthToDelay(1))
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