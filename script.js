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
    }
];

let currentTrackIndex = 0;
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
                // Если трек из поиска, временно добавляем его в общий список
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

// Переключение вкладок
const navLinks = document.querySelectorAll('.nav-menu a');
const views = document.querySelectorAll('.view-section');
const pageTitle = document.getElementById('pageTitle');

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

        if (targetId === 'home-view') pageTitle.textContent = 'Главная';
        if (targetId === 'search-view') pageTitle.textContent = 'Поиск';
        if (targetId === 'library-view') pageTitle.textContent = 'Медиатека';
    });
});

// Запрос к Jamendo API для поиска миллионов треков в реальном времени
async function searchJamendo(query) {
    if (!query.trim()) {
        renderTracks(searchResultsList, tracks);
        return;
    }
    
    searchResultsList.innerHTML = '<p style="color: #b3b3b3; padding: 10px;">Ищем музыку в мировой базе...</p>';
    
    try {
        // Публичный клиентский ключ Jamendo API для демонстрации
        const clientId = '93498877';
        const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${clientId}&format=json&limit=20&search=${encodeURIComponent(query)}`;
        
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
        console.error("Ошибка при поиске музыки:", error);
        searchResultsList.innerHTML = '<p style="color: #ff5555; padding: 10px;">Ошибка соединения с базой данных</p>';
    }
}

// Живой поиск с задержкой (чтобы не спамить запросами при каждом нажатии клавиши)
let searchTimeout;
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value;
        searchTimeout = setTimeout(() => {
            searchJamendo(query);
        }, 500);
    });
}

// Инициализация при запуске
const homeView = document.getElementById('home-view');
if (homeView) homeView.classList.add('active-view');

loadTrack(0);
renderTracks(trackList, tracks);
renderTracks(searchResultsList, tracks);
