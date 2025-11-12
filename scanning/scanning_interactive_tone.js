// NEW VERSION OF THE JS USING TONE.JS API

const triggerUp = 'ArrowUp'
const triggerDown = 'ArrowDown'

const start_ping = 'audio_tracks/start.mp3'
const stop_ping = 'audio_tracks/stop.mp3'

const sky_real_ping = 'audio_tracks/sky_wind-vertical_scan-w.mp3'
const water_real_ping = 'audio_tracks/water_lake-vertical_scan-w.mp3'
const animal_real_ping = 'audio_tracks/animal_gallop-vertical_scan-w.mp3'
const ground_real_ping = 'audio_tracks/ground_rocks-vertical_scan-w.mp3'

const sky_eg_ping = 'audio_tracks/example_tone-sky_wind.mp3'
const water_eg_ping = 'audio_tracks/example_tone-water_lake.mp3'
const animal_eg_ping = 'audio_tracks/example_tone-animal_gallop.mp3'
const ground_eg_ping = 'audio_tracks/example_tone-ground_rocks.mp3'

const sky_play_button = document.getElementById("sky-play-pause")
const water_play_button = document.getElementById("water-play-pause")
const animal_play_button = document.getElementById("animal-play-pause")
const ground_play_button = document.getElementById("ground-play-pause")

// const sky_checkbox = document.getElementById("sky-checkbox")
// const water_checkbox = document.getElementById("water-checkbox")
// const animal_checkbox = document.getElementById("animal-checkbox")
// const ground_checkbox = document.getElementById("ground-checkbox")

// default: play all regions
var regions_to_play = {
  sky: [sky_real_ping, true],
  water: [water_real_ping, true],
  animal: [animal_real_ping, true],
  ground: [ground_real_ping, true]
}

// // create a meter on the destination node - IS THIS NECESSARY?
// const toneMeter = new Tone.Meter({ channelCount: 2 });
// Tone.Destination.chain(toneMeter);
// meter({
//   tone: toneMeter,
//   parent: document.querySelector("#content"),
// });

var startPlayer = new Tone.Player(start_ping).toDestination()
var stopPlayer = new Tone.Player(stop_ping).toDestination()

startPlayer.sync().start(0)

var players = []

// TODO: accomodate the "all/selected" toggle, call updateRegions (once it's updated... ha)
// init region players
for (const [region, attrs] of Object.entries(regions_to_play)) {
  if (attrs[1]) {
    const channel = new Tone.Channel().toDestination();
    const player = new Tone.Player({
      url: attrs[0],
      name: region,
    }).sync();
    players.push(player);
    player.onstop = (() => stopPlayer.start());
    player.connect(channel);
  }
}

// called before playing anything, every time
function updateMainPlayer() {
  // region:str, attrs:list -> [ping url:str, ischecked:bool]
  for (const [region, attrs] of Object.entries(regions_to_play)) {
    if (attrs[1]) {
      mainPlayers.add(region, attrs[0])
    }
  }
}

// // TODO: change to accomodate the "all/selected" toggle
// function updateRegionsToPlay() {
//   regions_to_play = {
//     sky: [sky_real_ping, sky_checkbox.checked],
//     water: [water_real_ping, water_checkbox.checked],
//     animal: [animal_real_ping, animal_checkbox.checked],
//     ground: [ground_real_ping, ground_checkbox.checked]
//   }
// }

// from https://javascript.info/keyboard-events

// kinput.onkeydown = kinput.onkeyup = kinput.onkeypress = handle;
document.addEventListener('keyup', handleUp);
document.addEventListener('keydown', handleDown);
// document.addEventListener('keypress', handle); //deprecated, doesn't matter

function handleDown(e) {
  if (e.repeat) {
    console.log('repeat keydown: skipping...');
    return;
  } else if (e.key == triggerUp) { //initial press, scanning up
    console.log('keydown up');
    startPlayer.onstop(sonify(false));
  } else if (e.key == triggerDown) { //initial press, scanning down
    console.log('keydown down');
    startPlayer.onstop(sonify(true));
  }

  // let text = e.type +
  // ' key=' + e.key +
  // ' code=' + e.code +
  // (e.shiftKey ? ' shiftKey' : '') +
  // (e.ctrlKey ? ' ctrlKey' : '') +
  // (e.altKey ? ' altKey' : '') +
  // (e.metaKey ? ' metaKey' : '') +
  // (e.repeat ? ' (repeat)' : '') +
  // "\n";
  // console.log(text)
}

function handleUp(e) {
  console.log('keyup');
  Tone.Transport.pause();
}

function sonify(isBackwards) {
  // make sure tracks are playing in the correct direction (forwards for up, vice versa)
  // can check one instead of all, bc either all tracks are reversed or none are.
  // if isBackwards, all tracks should be reversed (.reverse == true), and v.v.
  if (players[0].reverse !== isBackwards) {
    for (i = 0; i < players.length; i++) {
      players[0].reverse == isBackwards;
    }
  }
  Tone.Transport.start();
}

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
