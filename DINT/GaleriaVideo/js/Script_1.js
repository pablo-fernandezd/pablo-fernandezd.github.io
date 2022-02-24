

var video = document.getElementsByClassName("video");

function PlayVideos() {
for (i=0;i<video.length;i++){
    video[i].play();
}
}

function PauseVideos() {
    for (i=0;i<video.length;i++){
        video[i].pause();
    }
}

function RewindVideos() {
    for (i=0;i<video.length;i++) {
        video[i].currentTime = 0;
    }
}

function StopVideos() {
    for (i=0;i<video.length;i++){
        video[i].load();
    }
}