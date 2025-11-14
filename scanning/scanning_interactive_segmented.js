// import * as Tone from "tone"; //Node doesn't implement Web Audio and I THINK
// that's why this breaks everything?? I have actually no idea.
// NEW VERSION OF THE JS BREAKING THE SONIFICATION UP INTO SLICES
// STILL USING TONE.JS API

// FILE-GLOBAL VARS

// keybinds, number of segments
const MOVE_UP = 'ArrowUp';
const MOVE_DOWN = 'ArrowDown';
const TOGGLE_PLAY = ' '; //space
var NUM_SEGMENTS = 4;

// start, end pings - constant
const START_PING = 'audio_tracks/start.mp3'
const END_PING = 'audio_tracks/end.mp3'

// region tracks (rendered and example versions) - example-specific
const sky_real_ping = 'audio_tracks/sky-truelen-mono-w.mp3'
const water_real_ping = 'audio_tracks/water-truelen-mono-w.mp3'
const animal_real_ping = 'audio_tracks/animal-truelen-mono-w.mp3'
const ground_real_ping = 'audio_tracks/ground-truelen-mono-w.mp3'

// NOTE: example tones have not had the panning from the source clip removed
const sky_eg_ping = 'audio_tracks/example_tone-sky_wind.mp3'
const water_eg_ping = 'audio_tracks/example_tone-water_lake.mp3'
const animal_eg_ping = 'audio_tracks/example_tone-animal_gallop.mp3'
const ground_eg_ping = 'audio_tracks/example_tone-ground_rocks.mp3'

// region mapper - example-specific
// NOTE: the 'true' refers to checkbox.checked, keeping compatibility w/
// reintroducing that "select regions to play" feature later
var regions_to_play = {
  sky: [sky_real_ping, true],
  water: [water_real_ping, true],
  animal: [animal_real_ping, true],
  ground: [ground_real_ping, true]
}
var players = [];
var segment_tracker = 0; //start at 'start'

/*
the idea of this version is to split the audio into x segments and the user can go through those.
- each segment loops until moved up to the next one
- there's a start/stop key (spacebar for now)
- the sonification starts w/ 'start' and ends w/ 'end'
- default num segments is 4
- loop length is player.buffer.duration / num_segments
- when the user is going back down, the sound no longer actually reverses
    i.e. sound is always played bottom -> top
- track which segment the player is on. start and end pings are played when
    tracker is at 0 and num_segments + 1 respectively

ASSUMPTIONS
- all rendered tracks are the same length
- FOR NOW playing all regions, always
*/



// SETUP

// init Player and Channel objs for region tones
for (const [region, attrs] of Object.entries(regions_to_play)) {
  if (attrs[1]) {
    const channel = new Tone.Channel().toDestination();
    const player = new Tone.Player({
      url: attrs[0],
      loop: true, // it breaks after 1 playthrough if this is not set
    }).sync().start(0);
    player.name = region; //set name to region name
    player.connect(channel);

    players.push(player); //maintain list of active players
  }
}
// init start and end tone Player objs
// unsynced w/ TransportTime rn...
const startPlayer = new Tone.Player(START_PING).toDestination();
const endPlayer = new Tone.Player(END_PING).toDestination();

// // set up loops based on time split
// for (var i = 0; i < NUM_SEGMENTS; i++) {
//   console.log('asdf')
// }



// KEYBINDINGS

document.addEventListener('keyup', handleUp);
document.addEventListener('keydown', handleDown);

function handleDown(e) {
  // if user holding down key:
  if (e.repeat) {
    return;
  }
  // play/pause
  else if (e.key == TOGGLE_PLAY) {
    Tone.getTransport().toggle();
    console.log(`toggling`)
  }
  // moving up (initial keypress)
  else if (e.key == MOVE_UP) {
    sonify(segment_tracker);
    segment_tracker += 1;
    console.log(`segment tracker = ${segment_tracker}`)
  } 
  // moving down (initial keypress)
  else if (e.key == MOVE_DOWN) {
    sonify(segment_tracker);
    segment_tracker -= 1;
    console.log(`segment tracker = ${segment_tracker}`)
  }
}

function sonify(whichSegment) {
  if (whichSegment < 1) { //play START
    startPlayer.start();
  }
  else if (whichSegment > NUM_SEGMENTS) { //play END
    endPlayer.start();
  }
  else { //play sonification segment
    var segmentLen = players[0].buffer.duration / NUM_SEGMENTS;
    console.log(`segmentLen = ${segmentLen}`)
    console.log(`starttime = ${(whichSegment - 1) * segmentLen}`)
    console.log(`stoptime = ${whichSegment * segmentLen}`)

    Tone.getTransport().start((whichSegment - 1) * segmentLen);
    Tone.getTransport().stop(whichSegment * segmentLen);
  }
}

function handleUp(e) {
  return;
}



// HTML UTILITY

// toggle display of region selector checkboxes
function toggleRegionSelect() {
  var toToggle = document.getElementById("checkboxes");
  if (document.getElementById("play-selected").checked) {
    toToggle.style.display = "block";
  } else {
    toToggle.style.display = "none";
  }
}

// toggle display of instructions
function toggleText() {
  var text = document.getElementById("instructions");
  if (text.style.display === "none") {
    text.style.display = "block";
  } else {
    text.style.display = "none";
  }
}

// function printKeyEventDetails(e) {
//   let text = e.type +
//   ' key=' + e.key +
//   ' code=' + e.code +
//   (e.shiftKey ? ' shiftKey' : '') +
//   (e.ctrlKey ? ' ctrlKey' : '') +
//   (e.altKey ? ' altKey' : '') +
//   (e.metaKey ? ' metaKey' : '') +
//   (e.repeat ? ' (repeat)' : '') +
//   "\n";
//   console.log(text)
// }