import { songsDB } from './data.js';
import { DOM, updateGameUI, showWinScreen, showLossScreen, resetScreens, setDifficultyTheme } from './ui.js';

const intervals = [0.1, 0.5, 2.0, 8.0, 15.0];
const difficulties = ['easy', 'medium', 'hard', 'expert', 'impossible'];

let activePlaylist = [...songsDB];
let currentStep = 0;
let currentSongIndex = 0;
let streak = 0;
let audioTimeout;
let currentDiffIndex = 0;

// NOUVEAU : Fonction de mélange (Algorithme de Fisher-Yates)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function buildFilters() {
    const artistCounts = {};
    const filtersRow = document.getElementById('artist-filters');
    
    songsDB.forEach(song => {
        artistCounts[song.artist] = (artistCounts[song.artist] || 0) + 1;
    });

    const topArtists = Object.keys(artistCounts).filter(artist => artistCounts[artist] > 10);
    
    let html = `<span class="filter-text active" data-artist="all">All genres</span>`;
    topArtists.forEach(artist => {
        html += `<span class="filter-text" data-artist="${artist}">${artist}</span>`;
    });
    
    filtersRow.innerHTML = html;

    // NOUVEAU : Fonction mathématique pour centrer l'élément
    function centerFilter(element) {
        const container = document.querySelector('.filters-container');
        
        // Calcul du décalage exact (Centre du conteneur - Centre de l'élément cliqué)
        const containerCenter = container.offsetWidth / 2;
        const itemCenter = element.offsetLeft + (element.offsetWidth / 2);
        const translateX = containerCenter - itemCenter;
        
        // Applique l'animation CSS de glissement
        filtersRow.style.transform = `translateX(${translateX}px)`;
    }

    document.querySelectorAll('.filter-text').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-text').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            // On lance l'animation de centrage au clic !
            centerFilter(e.target);

            const selectedArtist = e.target.getAttribute('data-artist');
            if (selectedArtist === 'all') {
                activePlaylist = [...songsDB];
            } else {
                activePlaylist = songsDB.filter(song => song.artist === selectedArtist);
            }

            shuffleArray(activePlaylist);
            currentSongIndex = 0;
            streak = 0;
            currentDiffIndex = 0;
            initGame();
        });
    });

    // Centrer la vue initialement sur "All genres" au chargement de la page
    setTimeout(() => {
        const firstFilter = document.querySelector('.filter-text.active');
        if (firstFilter) centerFilter(firstFilter);
    }, 50); // Un mini-délai permet au CSS de se charger avant de calculer la largeur
}

function initGame() {
    currentStep = 0;
    DOM.audioPlayer.src = activePlaylist[currentSongIndex].audio;
    updateGameUI(currentStep, intervals[currentStep]);
    setDifficultyTheme(difficulties[currentDiffIndex]);
    resetScreens();
}

DOM.playBtn.addEventListener('click', () => {
    clearTimeout(audioTimeout);
    DOM.audioPlayer.currentTime = 0;
    DOM.audioPlayer.play();
    
    const playDuration = intervals[currentStep] * 1000;
    audioTimeout = setTimeout(() => {
        DOM.audioPlayer.pause();
    }, playDuration);
});

DOM.skipBtn.addEventListener('click', () => {
    if (currentStep < 4) {
        currentStep++;
        updateGameUI(currentStep, intervals[currentStep]);
    } else {
        triggerLoss();
    }
});

DOM.searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase();
    DOM.autocompleteList.innerHTML = '';
    
    if (query.length < 1) {
        DOM.autocompleteList.classList.add('hidden');
        return;
    }
    
    const results = activePlaylist.filter(song => 
        song.title.toLowerCase().includes(query) || 
        song.artist.toLowerCase().includes(query)
    );
    
    if (results.length > 0) {
        DOM.autocompleteList.classList.remove('hidden');
        results.forEach(song => {
            const li = document.createElement('li');
            li.innerHTML = `<div class="autocomplete-title">${song.title}</div>
                            <div class="autocomplete-artist">${song.artist}</div>`;
            
            li.addEventListener('click', () => checkAnswer(song.id));
            DOM.autocompleteList.appendChild(li);
        });
    }
});

function checkAnswer(selectedId) {
    DOM.autocompleteList.classList.add('hidden');
    
    if (selectedId === activePlaylist[currentSongIndex].id) {
        triggerWin();
    } else {
        if (currentStep < 4) {
            currentStep++;
            updateGameUI(currentStep, intervals[currentStep]);
            DOM.searchInput.value = '';
        } else {
            triggerLoss();
        }
    }
}

function triggerWin() {
    streak++;
    showWinScreen(activePlaylist[currentSongIndex], intervals[currentStep], streak);
    currentDiffIndex++;
    if (currentDiffIndex > 4) currentDiffIndex = 0;
}

function triggerLoss() {
    streak = 0;
    showLossScreen(activePlaylist[currentSongIndex]);
    currentDiffIndex = 0;
}

DOM.nextBtn.addEventListener('click', () => {
    currentSongIndex++;
    
    // NOUVEAU : Si on a joué toutes les musiques, on remélange tout et on repart à zéro
    if (currentSongIndex >= activePlaylist.length) {
        currentSongIndex = 0;
        shuffleArray(activePlaylist);
    }
    
    initGame();
});

// Lancement global
buildFilters();
shuffleArray(activePlaylist);
initGame();