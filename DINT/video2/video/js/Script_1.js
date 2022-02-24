

var video = document.querySelector('.video-mp4');

function PlayVideo() {

    video.play();

}

function PauseVideo() {

    video.pause();

}

function RewindVideo() {

    video.currentTime = 0;
}

function StopVideo() {

    video.load();
}