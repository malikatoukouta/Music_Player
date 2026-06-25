// Récupération des éléments
const audio = document.querySelector("audio");
const track = document.querySelector("#track");
const elapsed = document.querySelector("#elapsed");
const trackTime = document.querySelector("#track-time");
const playButton = document.querySelector("#play-button");
const pauseButton = document.querySelector("#pause-button");
const stopButton = document.querySelector("#stop-button");
const prevButton = document.querySelector("#prev-button");
const nextButton = document.querySelector("#next-button");
const shuffleButton = document.querySelector("#shuffle-button");
const repeatButton = document.querySelector("#repeat-button");
const repeatOneBadge = document.querySelector("#repeat-one-badge");
const volume = document.querySelector("#volume");
const volumeValue = document.querySelector("#volume-value");
const currentTrackTitle = document.querySelector("#current-track-title");
const playlistEl = document.querySelector("#playlist");
const coverImg = document.querySelector("#cover-img");
const coverPlaceholder = document.querySelector("#cover-placeholder");

// Tableau des pistes audio, des titres et des pochettes
const tracks = [
    { title: "Love is show", src: "assets/Love is show.mp3", cover: "assets/Love is show.jpg" },
    { title: "Hana no Kusari", src: "assets/Hana no kusari.mp3", cover: "assets/Hana no kusari.jpg" },
    { title: "Hyori ittai", src: "assets/Hyori ittai.mp3", cover: "assets/Hyori ittai.jpg" }
];

let currentTrackIndex = 0; // Index de la piste actuelle
let isShuffle = false;      // Lecture aléatoire active ?

// Modes de répétition : 0 = playlist en boucle, 1 = répéter une piste, 2 = pas de répétition
const REPEAT_ALL = 0;
const REPEAT_ONE = 1;
const REPEAT_NONE = 2;
let repeatMode = REPEAT_ALL;

// Fonction pour formater la durée (gère les valeurs invalides)
function buildDuration(duration) {
    if (!isFinite(duration)) {
        return "0:00";
    }
    let minutes = Math.floor(duration / 60);
    let secondes = Math.floor(duration % 60);
    secondes = String(secondes).padStart(2, "0");
    return minutes + ":" + secondes;
}

// Met à jour l'état visuel des boutons play / pause
function setPlayingUI(isPlaying) {
    playButton.style.display = isPlaying ? "none" : "initial";
    pauseButton.style.display = isPlaying ? "initial" : "none";
    stopButton.style.display = isPlaying ? "initial" : "none";
}

// Affiche la pochette (avec repli sur une icône si l'image est absente)
function updateCover(index) {
    const cover = tracks[index].cover;
    if (cover) {
        coverImg.src = cover;
    } else {
        coverImg.removeAttribute("src");
        coverImg.hidden = true;
        coverPlaceholder.hidden = false;
    }
}

coverImg.addEventListener("load", function () {
    coverImg.hidden = false;
    coverPlaceholder.hidden = true;
});

coverImg.addEventListener("error", function () {
    coverImg.hidden = true;
    coverPlaceholder.hidden = false;
});

// Met en surbrillance la piste active dans la playlist
function highlightActiveTrack() {
    const items = playlistEl.querySelectorAll("li");
    items.forEach((item, i) => {
        item.classList.toggle("active", i === currentTrackIndex);
    });
}

// Construit la playlist cliquable
function renderPlaylist() {
    playlistEl.innerHTML = "";
    tracks.forEach((t, i) => {
        const li = document.createElement("li");
        li.textContent = t.title;
        li.addEventListener("click", () => {
            const wasPlaying = !audio.paused;
            loadTrack(i);
            if (wasPlaying) audio.play();
        });
        playlistEl.appendChild(li);
    });
    highlightActiveTrack();
}

// Fonction pour changer de piste
function loadTrack(index) {
    currentTrackIndex = index;
    audio.src = tracks[index].src;
    currentTrackTitle.textContent = tracks[index].title;
    updateCover(index);
    audio.load(); // Recharge l'audio avec la nouvelle piste
    setPlayingUI(false);
    elapsed.textContent = "0:00";
    track.value = 0;
    highlightActiveTrack();
}

// Renvoie l'index de la piste suivante selon le mode shuffle
function getNextIndex() {
    if (isShuffle && tracks.length > 1) {
        let next;
        do {
            next = Math.floor(Math.random() * tracks.length);
        } while (next === currentTrackIndex);
        return next;
    }
    return (currentTrackIndex + 1) % tracks.length;
}

// Renvoie l'index de la piste précédente selon le mode shuffle
function getPrevIndex() {
    if (isShuffle && tracks.length > 1) {
        let prev;
        do {
            prev = Math.floor(Math.random() * tracks.length);
        } while (prev === currentTrackIndex);
        return prev;
    }
    return (currentTrackIndex - 1 + tracks.length) % tracks.length;
}

// Gestion du bouton play
playButton.addEventListener("click", function () {
    audio.play();
});

// Gestion du bouton pause
pauseButton.addEventListener("click", function () {
    audio.pause();
});

// Gestion du bouton stop
stopButton.addEventListener("click", function () {
    audio.pause();
    audio.currentTime = 0;
    elapsed.textContent = "0:00";
    track.value = 0;
    setPlayingUI(false);
});

// Bascule lecture / pause (utilisé par le clavier)
function togglePlay() {
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
}

// Synchronise l'UI avec l'état réel de l'audio
audio.addEventListener("play", () => setPlayingUI(true));
audio.addEventListener("pause", () => setPlayingUI(false));

// Met à jour l'UI avec la durée lorsque les métadonnées sont chargées
audio.addEventListener("loadedmetadata", function () {
    track.max = Math.floor(audio.duration) || 0;
    trackTime.textContent = buildDuration(audio.duration);
});

// Met à jour le temps écoulé pendant la lecture
audio.addEventListener("timeupdate", function () {
    track.value = this.currentTime;
    elapsed.textContent = buildDuration(this.currentTime);
});

// Contrôle du volume
volume.addEventListener("input", function () {
    audio.volume = volume.value;
    volumeValue.textContent = Math.round(volume.value * 100) + "%";
});

// Permet de naviguer dans la piste audio en utilisant le slider
track.addEventListener("input", function () {
    audio.currentTime = track.value;
});

// Piste précédente
prevButton.addEventListener("click", function () {
    const wasPlaying = !audio.paused;
    loadTrack(getPrevIndex());
    if (wasPlaying) audio.play();
});

// Piste suivante
nextButton.addEventListener("click", function () {
    const wasPlaying = !audio.paused;
    loadTrack(getNextIndex());
    if (wasPlaying) audio.play();
});

// Bouton shuffle
shuffleButton.addEventListener("click", function () {
    isShuffle = !isShuffle;
    shuffleButton.classList.toggle("active", isShuffle);
});

// Bouton repeat (cycle entre les 3 modes)
repeatButton.addEventListener("click", function () {
    repeatMode = (repeatMode + 1) % 3;
    repeatButton.classList.toggle("active", repeatMode !== REPEAT_NONE);
    repeatOneBadge.hidden = repeatMode !== REPEAT_ONE;
    const labels = { 0: "Répéter la playlist", 1: "Répéter la piste", 2: "Répétition désactivée" };
    repeatButton.title = labels[repeatMode];
});

// Fin de piste : enchaîne selon le mode de répétition
audio.addEventListener("ended", function () {
    if (repeatMode === REPEAT_ONE) {
        audio.currentTime = 0;
        audio.play();
        return;
    }

    const isLast = currentTrackIndex === tracks.length - 1;
    if (repeatMode === REPEAT_NONE && isLast && !isShuffle) {
        setPlayingUI(false);
        return;
    }

    loadTrack(getNextIndex());
    audio.play();
});

// Raccourcis clavier
document.addEventListener("keydown", function (e) {
    // Ne pas intercepter quand on manipule un champ (slider, saisie)
    const tag = e.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;

    switch (e.code) {
        case "Space":
            e.preventDefault();
            togglePlay();
            break;
        case "ArrowRight":
            nextButton.click();
            break;
        case "ArrowLeft":
            prevButton.click();
            break;
        case "ArrowUp":
            e.preventDefault();
            volume.value = Math.min(1, parseFloat(volume.value) + 0.05);
            volume.dispatchEvent(new Event("input"));
            break;
        case "ArrowDown":
            e.preventDefault();
            volume.value = Math.max(0, parseFloat(volume.value) - 0.05);
            volume.dispatchEvent(new Event("input"));
            break;
    }
});

// Initialisation
renderPlaylist();
updateCover(currentTrackIndex);
