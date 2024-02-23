var playButton = document.getElementById("play");
  var pauseButton = document.getElementById("pause");
  var stopButton = document.getElementById("stop");
  var timeDisplay = document.getElementById("time");
  var volume_slider = document.getElementById("volume-slider");
  var slider = document.getElementById("timeline-slider");

  // Event listeners
  playButton.addEventListener("click", play);
  pauseButton.addEventListener("click", pause);
  stopButton.addEventListener("click", stop);


function play() {
    audio.play();

  }

  function pause() {
    audio.pause();
  }

  function stop() {
    audio.pause();
    audio.currentTime = 0;
  }

function changeVolume() {
  audio.volume = volume_slider.value;
}

  
volume_slider.addEventListener("input", changeVolume);

function updateTimeDisplay() {
  var audio = document.getElementById("audio");
  var slider = document.getElementById("timeline-slider");
  var currentMinutes = Math.floor(audio.currentTime / 60);
  var currentSeconds = Math.floor(audio.currentTime % 60);
  var durationMinutes = Math.floor(audio.duration / 60);
  var durationSeconds = Math.floor(audio.duration % 60);
  
  if (currentSeconds < 10) {
    currentSeconds = "0" + currentSeconds;
  }
  if (durationSeconds < 10) {
    durationSeconds = "0" + durationSeconds;
  }
  
  slider.value = audio.currentTime / audio.duration;
  timeDisplay.innerHTML = currentMinutes + ":" + currentSeconds + "/" + durationMinutes + ":" + durationSeconds;
}

function updateAudio() {
  var audio = document.getElementById("audio");
  var slider = document.getElementById("timeline-slider");

  audio.currentTime = audio.duration * slider.value;
}

var audio = document.getElementById("audio");
audio.addEventListener("timeupdate", updateTimeDisplay);

var slider = document.getElementById("timeline-slider");
slider.addEventListener("input", updateAudio);

