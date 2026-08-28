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
    },
    {
        title: "shadowraze - showdown",
        artist: "shadowraze",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300"
    },
    {
        title: "vxv",
        artist: "zxcursed",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
        cover: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=300"
    }
];

let currentTrackIndex = 0;
let listenHistory = [];

const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const trackList = document.getElementById('trackList');
const searchResultsList = document.getElementById('searchResultsList');
const searchInput = document.getElementById('searchInput');
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
    if (listToRender.length === 0) {
        container.innerHTML = '<p style="color: #b3b3b3; padding: 10px;">Ничего не найдено</p>';
        return;
    }
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
            const originalIndex = tracks.indexOf(track);
            if (originalIndex !== -1) {
                loadTrack(originalIndex);
            } else {
                tracks.unshift(track);
                loadTrack(0);
                renderTracks(trackList, tracks);
            }
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

// Умный поиск: локальная база + глобальный Jamendo API
async function handleSearch(query) {
    const cleanQuery = query.toLowerCase().trim();
    
    if (!cleanQuery) {
        searchResultsList.innerHTML = '';
        return;
    }

    const localResults = tracks.filter(t => 
        t.title.toLowerCase().includes(cleanQuery) || t.artist.toLowerCase().includes(cleanQuery)
    );

    if (localResults.length > 0) {
        renderTracks(searchResultsList, localResults);
        return;
    }

    searchResultsList.innerHTML = '<p style="color: #b3b3b3; padding: 10px;">Ищем в глобальной базе...</p>';
    
    try {
        const clientId = '93498877';
        const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${clientId}&format=json&limit=15&search=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data && data.results && data.results.length > 0) {
            const apiTracks = data.results.map(t => ({
                title: t.name,
                artist: t.artist_name,
                src: t.audio,
                cover: t.image || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300"
            }));
            renderTracks(searchResultsList, apiTracks);
        } else {
            searchResultsList.innerHTML = '<p style="color: #b3b3b3; padding: 10px;">Ничего не найдено</p>';
        }
    } catch (error) {
        searchResultsList.innerHTML = '<p style="color: #ff5555; padding: 10px;">Ничего не найдено</p>';
    }
}

let searchTimeout;
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value;
        searchTimeout = setTimeout(() => {
            handleSearch(query);
        }, 300);
    });
}

// Инициализация при старте
const homeView = document.getElementById('home-view');
if (homeView) homeView.classList.add('active-view');

loadTrack(0);
renderTracks(trackList, tracks);
renderHistory();
