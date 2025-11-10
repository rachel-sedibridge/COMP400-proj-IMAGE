const triggerUp = 'UpArrow'
const triggerDown = 'DownArrow'

const start_ping = new Audio('audio_tracks/start.mp3')
const stop_ping = new Audio('audio_tracks/stop.mp3')

const sky_real_ping = new Audio('audio_tracks/sky_wind-vertical_scan-w.mp3');
const water_real_ping = new Audio('audio_tracks/water_lake-vertical_scan-w.mp3');
const animal_real_ping = new Audio('audio_tracks/animal_gallop-vertical_scan-w.mp3');
const ground_real_ping = new Audio('audio_tracks/ground_rocks-vertical_scan-w.mp3');

const sky_eg_ping = new Audio('audio_tracks/example_tone-sky_wind.mp3');
const water_eg_ping = new Audio('audio_tracks/example_tone-water_lake.mp3');
const animal_eg_ping = new Audio('audio_tracks/example_tone-animal_gallop.mp3');
const ground_eg_ping = new Audio('audio_tracks/example_tone-ground_rocks.mp3');

const sky_play_button = document.getElementById("sky-play-pause");
const water_play_button = document.getElementById("water-play-pause");
const animal_play_button = document.getElementById("animal-play-pause");
const ground_play_button = document.getElementById("ground-play-pause");

// const sky_checkbox = document.getElementById("sky-checkbox");
// const water_checkbox = document.getElementById("water-checkbox");
// const animal_checkbox = document.getElementById("animal-checkbox");
// const ground_checkbox = document.getElementById("ground-checkbox");

var regions_to_play = {}

var mainPlayer = new Tone.Players().toDestination()
var startPlayer = new Tone.Player(start_ping).toDestination()
var stopPlayer = new Tone.Player(stop_ping).toDestination()

// called only once to init everything
function initPlayers() {
  updateRegionsToPlay() //also init's it
  // region:str, attrs:list -> [ping url:str, ischecked:bool]
  for (const [region, attrs] of Object.entries(regions_to_play)) {
    if (attrs[1]) {
      mainPlayer.add(region, attrs[0])
    }
  }
  mainPlayer.onstop = (() => stopPlayer.play())
  // also chain this main one to the start ping player
  startPlayer.onstop = (() => mainPlayer.play())
}

// called before playing anything, every time
function updateMainPlayer() {
  // region:str, attrs:list -> [ping url:str, ischecked:bool]
  for (const [region, attrs] of Object.entries(regions_to_play)) {
    if (attrs[1]) {
      mainPlayer.add(region, attrs[0])
    }
  }
}

function updateRegionsToPlay() {
  // TODO: for now, only can play all regions -- change to accomodate the "all/selected" toggle
  regions_to_play = {
    sky: [sky_real_ping, true],
    water: [water_real_ping, true],
    animal: [animal_real_ping, true],
    ground: [ground_real_ping, true]
  }
  // regions_to_play = {
  //   sky: [sky_real_ping, sky_checkbox.checked],
  //   water: [water_real_ping, water_checkbox.checked],
  //   animal: [animal_real_ping, animal_checkbox.checked],
  //   ground: [ground_real_ping, ground_checkbox.checked]
  // }
}

// ========================================================
// OLD VERSION USING BUILTIN AUDIOELEMENT API - EXISTS FOR BACK COMPATIBILITY

// play the sonification, checked elements only
function sonify() {
  console.log("sonifying!")
  updateRegionsToPlay()
  // if anything is playing, pause all
  if (
    (!sky_real_ping.paused && !sky_real_ping.ended)
    || (!water_real_ping.paused && !water_real_ping.ended)
    || (!animal_real_ping.paused && !animal_real_ping.ended)
    || (!ground_real_ping.paused && !ground_real_ping.ended)
  ) {
    for (const [region, attrs] of Object.entries(regions_to_play))
      attrs[0].pause() //AudioElement object
  }
  // else, play all checked
  else {
    start_ping.addEventListener("ended", (e) => {
      for (const [region, attrs] of Object.entries(regions_to_play)) {
        if (attrs[1]) { //is checked
          attrs[0].play() //AudioElement object
          console.log(attrs[0])
        }
      }
    })
    start_ping.play()
    // regions_entries = Object.entries(regions_to_play)
    // any_sound = regions_entries[regions_entries.length - 1][1][0]
    // any_sound.addEventListener("ended", (e) => {
    //   stop_ping.play()
    // })
  }
}

// event listeners for play/pause individual sound playback
sky_play_button.addEventListener("click", (e) => {
  if (sky_eg_ping.paused || sky_eg_ping.ended) {
    sky_eg_ping.play();
  } else {
    sky_eg_ping.pause();
  }
});
water_play_button.addEventListener("click", (e) => {
  if (water_eg_ping.paused || water_eg_ping.ended) {
    water_eg_ping.play();
  } else {
    water_eg_ping.pause();
  }
});
animal_play_button.addEventListener("click", (e) => {
  if (animal_eg_ping.paused || animal_eg_ping.ended) {
    animal_eg_ping.play();
  } else {
    animal_eg_ping.pause();
  }
});
ground_play_button.addEventListener("click", (e) => {
  if (ground_eg_ping.paused || ground_eg_ping.ended) {
    ground_eg_ping.play();
  } else {
    ground_eg_ping.pause();
  }
});

// toggle all checkboxes w/ "All"
function toggleAll(source) {
  checkboxes = document.getElementsByName("region");
  for(var checkbox in checkboxes)
    checkboxes[checkbox].checked = source.checked;
}
// ========================================================

// toggle display of instructions
function toggleText() {
  var text = document.getElementById("instructions");
  if (text.style.display === "none") {
    text.style.display = "block";
  } else {
    text.style.display = "none";
  }
}


// from https://javascript.info/keyboard-events

// kinput.onkeydown = kinput.onkeyup = kinput.onkeypress = handle;
document.addEventListener('keyup', handleUp);
document.addEventListener('keydown', handleDown);
// document.addEventListener('keypress', handle); //deprecated, doesn't matter

let lastTime = Date.now();

function handleDown(e) {
  console.log('keydown')
  if (e.key == triggerUp) {
    if (e.repeat) {

    }
  }
  if (e.key == triggerDown) {

  }

  let text = e.type +
    ' key=' + e.key +
    ' code=' + e.code +
    (e.shiftKey ? ' shiftKey' : '') +
    (e.ctrlKey ? ' ctrlKey' : '') +
    (e.altKey ? ' altKey' : '') +
    (e.metaKey ? ' metaKey' : '') +
    (e.repeat ? ' (repeat)' : '') +
    "\n";
  console.log(text)
}

function handleUp(e) {
  console.log('keyup')
}
