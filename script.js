// Загрузка треков из localStorage или дефолтные
let defaultTracks = [
    {
        title: "Slow Down",
        artist: "dabbackwood",
        album: "SoundCloud Single",
        dateAdded: "Только что",
        duration: "2:15",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        cover: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=300"
    },
    {
        title: "Hellraisa",
        artist: "zxcursed",
        album: "Reflection",
        dateAdded: "1 час назад",
        duration: "1:50",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300"
    }
];

let savedTracks = localStorage.getItem('xanax_tracks');
let tracks = savedTracks ? JSON.parse(savedTracks) : defaultTracks;

let currentTrackIndex = 0;
let listenHistory = [];

const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const trackList = document.getElementById('trackList');
const searchTrackList = document.getElementById('searchTrackList');
const libraryTableBody = document.getElementById('libraryTableBody');
const libraryStats = document.getElementById('libraryStats');
const searchInput = document.getElementById('searchInput');

const currentTitle = document.getElementById('currentTitle');
const currentArtist = document.getElementById('currentArtist');
const currentCover = document.getElementById('currentCover');
const progressBar = document.getElementById('progressBar');
const volumeBar = document.getElementById('volumeBar');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');

const scTitleInput = document.getElementById('scTitle');
const scArtistInput = document.getElementById('scArtist');
const scUrlInput = document.getElementById('scUrl');
const addScTrackBtn = document.getElementById('addScTrackBtn');

function saveToLocalStorage() {
    localStorage.setItem('xanax_tracks', JSON.stringify(tracks));
}

function renderAll() {
    renderTracks(trackList, tracks);
    renderTracks(searchTrackList, tracks);
    renderLibraryTable(tracks);
    if (libraryStats) {
        libraryStats.textContent = `Forget • ${tracks.length} треков`;
    }
}

// Рендер обычного списка треков (для главной и поиска)
function renderTracks(container, listToRender) {
    if (!container) return;
    container.innerHTML = '';
    
    if (listToRender.length === 0) {
        container.innerHTML = '<p style="color: #b3b3b3; font-size: 0.9rem; padding: 10px;">Ничего не найдено</p>';
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
            const index = tracks.indexOf(track);
            loadTrack(index);
            playTrack();
        });
        container.appendChild(item);
    });
}

// Рендер таблицы для вкладки "Любимые треки"
function renderLibraryTable(listToRender) {
    if (!libraryTableBody) return;
    libraryTableBody.innerHTML = '';

    if (listToRender.length === 0) {
        libraryTableBody.innerHTML = '<p style="color: #b3b3b3; font-size: 0.9rem; padding: 10px;">Плейлист пуст</p>';
        return;
    }

    listToRender.forEach((track, index) => {
        const row = document.createElement('div');
        row.classList.add('table-row');
        row.innerHTML = `
            <span>${index + 1}</span>
            <div class="col-title">
                <img src="${track.cover}" alt="Cover">
                <div>
                    <h4>${track.title}</h4>
                    <p>${track.artist}</p>
                </div>
            </div>
            <span>${track.album || 'SoundCloud'}</span>
            <span>${track.dateAdded || 'Только что'}</span>
            <span>${track.duration || '2:30'}</span>
        `;
        row.addEventListener('click', () => {
            const realIndex = tracks.indexOf(track);
            loadTrack(realIndex);
            playTrack();
        });
        libraryTableBody.appendChild(row);
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

// Живой поиск
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const filtered = tracks.filter(track => 
            track.title.toLowerCase().includes(query) || 
            track.artist.toLowerCase().includes(query)
        );
        renderTracks(searchTrackList, filtered);
    });
}

// Добавление трека из SoundCloud и сохранение
if (addScTrackBtn) {
    addScTrackBtn.addEventListener('click', () => {
        const title = scTitleInput.value.trim();
        const artist = scArtistInput.value.trim();
        const url = scUrlInput.value.trim();

        if (!title || !artist || !url) {
            alert('Пожалуйста, заполните все поля!');
            return;
        }

        const newTrack = {
            title: title,
            artist: artist,
            album: "SoundCloud Release",
            dateAdded: "Только что",
            duration: "2:45",
            src: url,
            cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300"
        };

        tracks.push(newTrack);
        saveToLocalStorage();
        renderAll();
        
        scTitleInput.value = '';
        scArtistInput.value = '';
        scUrlInput.value = '';

        alert('Трек успешно добавлен и сохранен!');
    });
}

// История прослушивания
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
renderAll();
renderHistory();
