// import * as Tone from "tone"; //Node doesn't implement Web Audio and I THINK
// that's why this breaks everything?? I have actually no idea.
// NEW VERSION OF THE JS BREAKING THE SONIFICATION UP INTO SLICES
// STILL USING TONE.JS API

const triggerUp = 'ArrowUp'
const triggerDown = 'ArrowDown'

// const start_ping = 'audio_tracks/start.mp3'
// const stop_ping = 'audio_tracks/stop.mp3'
// const end_ping = 'audio_tracks/end.mp3'

const sky_real_ping = 'audio_tracks/sky-truelen-mono-w.mp3'
const water_real_ping = 'audio_tracks/water-truelen-mono-w.mp3'
const animal_real_ping = 'audio_tracks/animal-truelen-mono-w.mp3'
const ground_real_ping = 'audio_tracks/ground-truelen-mono-w.mp3'

const sky_eg_ping = 'audio_tracks/example_tone-sky_wind.mp3'
const water_eg_ping = 'audio_tracks/example_tone-water_lake.mp3'
const animal_eg_ping = 'audio_tracks/example_tone-animal_gallop.mp3'
const ground_eg_ping = 'audio_tracks/example_tone-ground_rocks.mp3'

// default: play all regions
var regions_to_play = {
  sky: [sky_real_ping, true],
  water: [water_real_ping, true],
  animal: [animal_real_ping, true],
  ground: [ground_real_ping, true]
}
var players = []

// TODO: accomodate the "all/selected" toggle, call updateRegions (once it's updated... ha)
// init region players
for (const [region, attrs] of Object.entries(regions_to_play)) {
  if (attrs[1]) {
    const channel = new Tone.Channel().toDestination();
    const player = new Tone.Player({
      url: attrs[0],
      // onstop: ((e) => Tone.Transport.stop()),
      loop: true, //breaks after 1 playthrough if this is not set
    }).sync().start(0);
    player.name = region;
    // buffer duration is 0 now before anything plays, idk why
    // player.debug = true;
    player.connect(channel);
    players.push(player);
  }
}

// Tone.Transport.schedule(function(time){
// 	console.log('TRANSPORT AT 1.2 SECONDS ASLDFJAHSDFHASDKJFAHSKDJFHALSKDJFHALKSJDFH')
//   console.log(time)
// }, 1.2);

var reverseEvent = new Tone.ToneEvent(((time) => {
  Tone.getTransport().start(players[0].buffer.duration - time)
}), Tone.TransportTime().valueOf());


document.addEventListener('keyup', handleUp);
document.addEventListener('keydown', handleDown);

function handleDown(e) {
  console.log(`keydown. state = ${Tone.getTransport().state}`);
  // console.log(Tone.TransportTime().valueOf())
  if (e.repeat) {
    if (Tone.getTransport().state == 'stopped') {
      console.log('STOP - REPEAT 1')
      return;
    }
    if (Tone.TransportTime().valueOf() >= players[0].buffer.duration) {
      console.log('STOP - REPEAET @')
      Tone.getTransport().stop();
    }
  } 
  else if (e.key == triggerUp) { //initial press, scanning up
    sonify(false);
  } 
  else if (e.key == triggerDown) { //initial press, scanning down
    sonify(true);
  }
}

function sonify(isBackwards) {
  console.log(Tone.getTransport().state)
  // make sure tracks are playing in the correct direction (forwards for up, vice versa)
  // can check one instead of all, bc either all tracks are reversed or none are.
  // if isBackwards, all tracks should be reversed (.reverse == true), and v.v.
  // entered only the first time it's played after page load!
  if (players[0].loopEnd == 0) {
    for (var i = 0; i < players.length; i++) {
      players[i].loopEnd = players[i].buffer.duration;
    }
  }
  // entered when changing direction from previous keypress
  if (players[0].reverse !== isBackwards) {
    for (var i = 0; i < players.length; i++) {
      players[i].reverse = isBackwards;
    }
    reverseEvent.start();
  }
  Tone.getTransport().start();
}

function handleUp(e) {
  if (Tone.getTransport.state == 'stopped') {
    return;
  }
  if (e.key == triggerUp || e.key == triggerDown) { // lifting of important key
    console.log('keyup');
    // console.log(Tone.getTransport().state)
    // if hit or passed the end of the loop
    if (Tone.TransportTime().valueOf() > players[0].buffer.duration) {
      console.log('STOP')
      Tone.getTransport().stop();
    }
    Tone.getTransport().pause();
  }
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