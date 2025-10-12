const sky_vert_scan = new Audio('audio_tracks/sky-vertical_scan-w.mp3');
const water_vert_scan = new Audio('audio_tracks/water-vertical_scan-w.mp3');
const animal_vert_scan = new Audio('audio_tracks/animal-vertical_scan-w.mp3');
const ground_vert_scan = new Audio('audio_tracks/ground-vertical_scan-w.mp3');

const sky_eg = new Audio('audio_tracks/scanning-example_tone-sky-short.mp3');
const water_eg = new Audio('audio_tracks/scanning-example_tone-water.mp3');
const animal_eg = new Audio('audio_tracks/scanning-example_tone-animal-short.mp3');
const ground_eg = new Audio('audio_tracks/scanning-example_tone-ground.mp3');

const sky_play_pause = document.getElementById("sky-play-pause");
const water_play_pause = document.getElementById("water-play-pause");
const animal_play_pause = document.getElementById("animal-play-pause");
const ground_play_pause = document.getElementById("ground-play-pause");

function playAudio(region) {
    // switch(region) {
    //     case "sky":
    // }
    // sky_eg.play();
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

// event listeners for play/pause individual sound playback
sky_play_pause.addEventListener("click", (e) => {
  if (sky_eg.paused || sky_eg.ended) {
    sky_eg.play();
  } else {
    sky_eg.pause();
  }
});
water_play_pause.addEventListener("click", (e) => {
  if (water_eg.paused || water_eg.ended) {
    water_eg.play();
  } else {
    water_eg.pause();
  }
});
animal_play_pause.addEventListener("click", (e) => {
  if (animal_eg.paused || animal_eg.ended) {
    animal_eg.play();
  } else {
    animal_eg.pause();
  }
});
ground_play_pause.addEventListener("click", (e) => {
  if (ground_eg.paused || ground_eg.ended) {
    ground_eg.play();
  } else {
    ground_eg.pause();
  }
});

// toggle all checkboxes w/ "All"
function toggle(source) {
  checkboxes = document.getElementsByName("region");
  for(var checkbox in checkboxes)
    checkboxes[checkbox].checked = source.checked;
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