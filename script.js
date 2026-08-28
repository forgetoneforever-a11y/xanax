const tracks = [
    {
        title: "Lofi Study Beats",
        artist: "Chillhop",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        cover: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=300"
    },
    {
        title: "Electronic Vibes",
        artist: "SynthWave",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300"
    },
    {
        title: "Ambient Space",
        artist: "Cosmic Sound",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        cover: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300"
    }
];

let currentTrackIndex = 0;
const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const trackListEl = document.getElementById('trackList');
const currentTitle = document.getElementById('currentTitle');
const currentArtist = document.getElementById('currentArtist');
const currentCover = document.getElementById('currentCover');
const progressBar = document.getElementById('progressBar');
const volumeBar = document.getElementById('volumeBar');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');

function renderTracks() {
    trackListEl.innerHTML = '';
    tracks.forEach((track, index) => {
        const item = document.createElement('div');
        item.classList.add('track-item');
        item.innerHTML = `
            <div class="track-info-left">
                <img src="${track.cover}" alt="Cover">
                <div>
                    <h4>${track.title}</h4>
                    <p>${track.artist}</p>
                </div>
            </div>
            <i class="fa-solid fa-play"></i>
        `;
        item.addEventListener('click', () => {
            loadTrack(index);
            playTrack();
        });
        trackListEl.appendChild(item);
    });
}

function loadTrack(index) {
    currentTrackIndex = index;
    const track = tracks[index];
    audioPlayer.src = track.src;
    currentTitle.textContent = track.title;
    currentArtist.textContent = track.artist;
    currentCover.src = track.cover;
}

function playTrack() {
    audioPlayer.play();
    playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
}

function pauseTrack() {
    audioPlayer.pause();
    playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
}

playPauseBtn.addEventListener('click', () => {
    if (audioPlayer.paused) {
        if (!audioPlayer.src) loadTrack(0);
        playTrack();
    } else {
        pauseTrack();
    }
});

document.getElementById('nextBtn').addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(currentTrackIndex);
    playTrack();
});

document.getElementById('prevBtn').addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrackIndex);
    playTrack();
});

audioPlayer.addEventListener('timeupdate', () => {
    if (audioPlayer.duration) {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.value = progress;
        currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
        durationEl.textContent = formatTime(audioPlayer.duration);
    }
});

progressBar.addEventListener('input', () => {
    if (audioPlayer.duration) {
        audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
    }
});

volumeBar.addEventListener('input', () => {
    audioPlayer.volume = volumeBar.value / 100;
});

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Инициализация первого трека при загрузке
loadTrack(0);
renderTracks();