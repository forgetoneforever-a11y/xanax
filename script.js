let tracks = [
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
    },
    {
        title: "Midnight Drive",
        artist: "Retrowave",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        cover: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300"
    },
    {
        title: "Sunset Chill",
        artist: "Aesthetic",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300"
    }
];

let currentTrackIndex = 0;
let listenHistory = [];

const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const trackList = document.getElementById('trackList');
const currentTitle = document.getElementById('currentTitle');
const currentArtist = document.getElementById('currentArtist');
const currentCover = document.getElementById('currentCover');
const progressBar = document.getElementById('progressBar');
const volumeBar = document.getElementById('volumeBar');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');

function renderTracks(container, listToRender) {
    if (!container) return;
    container.innerHTML = '';
    listToRender.forEach((track) => {
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
            const index = tracks.indexOf(track);
            loadTrack(index);
            playTrack();
        });
        container.appendChild(item);
    });
}

function loadTrack(index) {
    currentTrackIndex = index;
    const track = tracks[index];
    audioPlayer.src = track.src;
    currentTitle.textContent = track.title;
    currentArtist.textContent = track.artist;
    currentCover.src = track.cover;
    addToHistory(track);
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

// История прослушивания для верхней сетки на Главной
function addToHistory(track) {
    listenHistory = listenHistory.filter(t => t.src !== track.src);
    listenHistory.unshift(track);
    if (listenHistory.length > 6) listenHistory.pop();
    renderHistory();
}

function renderHistory() {
    const historyGrid = document.getElementById('historyGrid');
    if (!historyGrid) return;
    historyGrid.innerHTML = '';
    
    if (listenHistory.length === 0) {
        historyGrid.innerHTML = '<p style="color: #b3b3b3; font-size: 0.9rem; padding: 5px;">Здесь появятся треки, которые вы недавно слушали.</p>';
        return;
    }

    listenHistory.forEach((track) => {
        const card = document.createElement('div');
        card.classList.add('quick-card');
        card.innerHTML = `
            <img src="${track.cover}" alt="Cover">
            <span>${track.title}</span>
        `;
        card.addEventListener('click', () => {
            const index = tracks.indexOf(track);
            if (index !== -1) loadTrack(index);
            playTrack();
        });
        historyGrid.appendChild(card);
    });
}

// Переключение вкладок
const navLinks = document.querySelectorAll('.nav-menu a');
const views = document.querySelectorAll('.view-section');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        const targetId = link.getAttribute('data-target');
        views.forEach(view => {
            if (view.id === targetId) {
                view.classList.add('active-view');
            } else {
                view.classList.remove('active-view');
            }
        });
    });
});

// Инициализация при старте
const homeView = document.getElementById('home-view');
if (homeView) homeView.classList.add('active-view');

loadTrack(0);
renderTracks(trackList, tracks);
renderHistory();
