// Exportation des éléments du DOM pour pouvoir écouter les événements dans main.js
export const DOM = {
    artistFilters: document.getElementById('artist-filters'),
    audioPlayer: document.getElementById('audio-player'),
    playBtn: document.getElementById('play-btn'),
    skipBtn: document.getElementById('skip-btn'),
    timeDisplay: document.getElementById('current-time-display'),
    progressFill: document.getElementById('progress-fill'),
    searchInput: document.getElementById('search-input'),
    autocompleteList: document.getElementById('autocomplete-list'),
    activeGame: document.getElementById('active-game'),
    resultScreen: document.getElementById('result-screen'),
    nextBtn: document.getElementById('next-btn'),
    confettiContainer: document.getElementById('confetti-container'),
    streakContainer: document.getElementById('streak-container'),
    streakCount: document.getElementById('streak-count'),
    resultCover: document.getElementById('result-cover'),
    resultTitle: document.getElementById('result-title'),
    resultArtist: document.getElementById('result-artist'),
    resultBadge: document.getElementById('result-badge')
};

export function updateGameUI(currentStep, intervalTime) {
    DOM.timeDisplay.innerText = intervalTime + "s";
    DOM.progressFill.style.width = ((currentStep + 1) * 20) + "%";
}

export function setDifficultyTheme(difficultyLevel) {
    const diffBtn = document.querySelector(`.diff-btn[data-diff="${difficultyLevel}"]`);
    if(diffBtn) {
        // Enlève l'état actif de tous les boutons
        document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
        // Active le bouton actuel
        diffBtn.classList.add('active');
        
        // Change la variable CSS globale (Modifie le bouton Play et la jauge)
        const newColor = getComputedStyle(document.documentElement).getPropertyValue(`--c-${difficultyLevel}`);
        document.documentElement.style.setProperty('--theme-color', newColor.trim());
    }
}

export function showWinScreen(song, intervalTime, streak) {
    DOM.resultCover.src = song.cover;
    DOM.resultTitle.innerText = song.title;
    DOM.resultArtist.innerText = song.artist;
    
    DOM.resultBadge.innerText = `GUESSED IN ${intervalTime}S!`;
    DOM.resultBadge.className = 'result-badge badge-win';
    DOM.nextBtn.innerText = "Next";
    
    DOM.activeGame.classList.add('hidden');
    DOM.resultScreen.classList.remove('hidden');
    DOM.streakContainer.classList.remove('hidden');
    DOM.streakCount.innerText = `${streak}`;
    
    createConfetti();
}

export function showLossScreen(song) {
    DOM.resultCover.src = song.cover;
    DOM.resultTitle.innerText = song.title;
    DOM.resultArtist.innerText = song.artist;
    
    DOM.resultBadge.innerText = "LOST!";
    DOM.resultBadge.className = 'result-badge badge-lose';
    DOM.nextBtn.innerText = "Try again";
    
    DOM.activeGame.classList.add('hidden');
    DOM.resultScreen.classList.remove('hidden');
    DOM.streakContainer.classList.add('hidden');
}

export function resetScreens() {
    DOM.activeGame.classList.remove('hidden');
    DOM.resultScreen.classList.add('hidden');
    DOM.searchInput.value = '';
    DOM.confettiContainer.innerHTML = '';
}

function createConfetti() {
    DOM.confettiContainer.innerHTML = '';
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animation = `fall ${Math.random() * 2 + 1}s linear forwards`;
        confetti.style.backgroundColor = Math.random() > 0.5 ? 'var(--theme-color)' : '#ffffff';
        DOM.confettiContainer.appendChild(confetti);
    }
}