// play button plays or pauses the video

const playBtn = document.querySelector(".player__button.toggle");
const video = document.querySelector(".player__video");

playBtn.addEventListener("click", togglePlay);
video.addEventListener("click", togglePlay);


function togglePlay(event) {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
}

// update play btn when video playing state change
video.addEventListener("pause", event => playBtn.textContent = "►");
video.addEventListener("play", event => playBtn.textContent = "⏸");



// skip function

const skipBtns = document.querySelectorAll("button[data-skip]");

skipBtns.forEach(btn => btn.addEventListener("click", handleSkip))

function handleSkip(event) {

    const skipValue = event.target.dataset.skip;

    if (skipValue) {
        video.currentTime += +skipValue;
    }

}


// once played, video time constantly moving which should be reflected in the progress

const progressBar = document.querySelector(".progress__filled");
video.addEventListener("timeupdate", moveProgress);


function moveProgress(event) {
    const currentTime = video.currentTime;
        
    const progress = (currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${progress}%`;

}


// controls on the progress bar
const progressCtrl = document.querySelector(".progress");
let seeking = false;

progressCtrl.addEventListener("mousedown", handleMove);
window.addEventListener("mouseup", event => seeking = false);
progressCtrl.addEventListener("mousemove", handleSeek);

function handleMove(event) {

    video.currentTime = video.duration * (event.offsetX / event.currentTarget.offsetWidth);
    seeking = true;
    
}


function handleSeek(event) {

    if (seeking) {
        video.currentTime += event.movementX;
    }

}


// volume control

const volumeCtrl = document.querySelector("input[name='volume']");

volumeCtrl.addEventListener("input", event => video.volume = event.target.value);


// playback rate control

const rateCtrl = document.querySelector("input[name='playbackRate']");

rateCtrl.addEventListener("input", event => video.playbackRate = event.target.value)


