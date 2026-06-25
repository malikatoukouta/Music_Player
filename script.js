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
const volume = document.querySelector("#volume");
const volumeValue = document.querySelector("#volume-value");
const currentTrackTitle = document.querySelector("#current-track-title");
const playlistEl = document.querySelector("#playlist");

// Tableau des pistes audio et des titres
const tracks = [
    { title: "Love is show", src: "assets/Love is show.mp3" },
    { title: "Hana no Kusari", src: "assets/Hana no kusari.mp3" },
    { title: "Hyori ittai", src: "assets/Hyori ittai.mp3" }
];

let currentTrackIndex = 0; // Index de la piste actuelle

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
            if (wasPlaying || i !== currentTrackIndex) {
                audio.play();
            }
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
    audio.load(); // Recharge l'audio avec la nouvelle piste
    setPlayingUI(false);
    elapsed.textContent = "0:00";
    track.value = 0;
    highlightActiveTrack();
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

// Piste précédente (boucle vers la fin)
prevButton.addEventListener("click", function () {
    const wasPlaying = !audio.paused;
    const newIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(newIndex);
    if (wasPlaying) audio.play();
});

// Piste suivante (boucle vers le début)
nextButton.addEventListener("click", function () {
    const wasPlaying = !audio.paused;
    const newIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(newIndex);
    if (wasPlaying) audio.play();
});

// Passe automatiquement à la piste suivante en fin de lecture (boucle la playlist)
audio.addEventListener("ended", function () {
    const newIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(newIndex);
    audio.play();
});

// Initialisation
renderPlaylist();
