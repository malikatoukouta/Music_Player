// Récupération des éléments
const audio = document.querySelector("audio");
const track = document.querySelector("#track");
const elapsed = document.querySelector("#elapsed");
const trackTime = document.querySelector("#track-time");
const playButton = document.querySelector("#play-button");
const pauseButton = document.querySelector("#pause-button");
const stopButton = document.querySelector("#stop-button");
const volume = document.querySelector("#volume");
const volumeValue = document.querySelector("#volume-value");

// Gestion du bouton play
playButton.addEventListener("click", function(){
    audio.play();
    pauseButton.style.display = "initial";
    stopButton.style.display = "initial";
    this.style.display = "none";
});

// Gestion du bouton pause
pauseButton.addEventListener("click", function(){
    audio.pause();
    playButton.style.display = "initial";
    this.style.display = "none";
});

// Gestion du bouton stop
stopButton.addEventListener("click", function(){
    audio.pause();
    audio.currentTime = 0;
    playButton.style.display = "initial";
    pauseButton.style.display = "none";
    this.style.display = "none";
});

// Fonction pour formater la durée
function buildDuration(duration) {
    let minutes = Math.floor(duration / 60);
    let secondes = Math.floor(duration % 60);
    secondes = String(secondes).padStart(2, "0");
    return minutes + ":" + secondes;
}

// Met à jour l'UI avec la durée lorsque les métadonnées sont chargées
audio.addEventListener("loadedmetadata", function() {
    let duration = audio.duration;
    track.max = Math.floor(duration); // Met à jour la valeur max du slider de la piste
    trackTime.textContent = buildDuration(duration);
});

// Met à jour le temps écoulé pendant la lecture
audio.addEventListener("timeupdate", function(){
    track.value = this.currentTime;
    elapsed.textContent = buildDuration(this.currentTime);
});


// Stop (Remet à 0 et met en pause)
stopButton.addEventListener("click", function() {
    elapsed.textContent = "0:00";
    track.value = 0;
});

// Contrôle du volume
volume.addEventListener("input", function() {
    audio.volume = volume.value;
    volumeValue.textContent = Math.floor(volume.value * 100) + "%";
});

// Permet de naviguer dans la piste audio en utilisant le slider
track.addEventListener("input", function() {
    audio.currentTime = track.value;
});

// Tableau des pistes audio et des titres
const tracks = [
    { title: "Love is show", src: "assets/Love is show.mp3" },
    { title: "Hana no Kusari", src: "assets/Hana no kusari.mp3" },
    { title: "Hyori ittai", src: "assets/Hyori ittai.mp3" }
];

let currentTrackIndex = 0; // Index de la piste actuelle

// Sélection des nouveaux boutons et de l'affichage du titre
const prevButton = document.querySelector("#prev-button");
const nextButton = document.querySelector("#next-button");
const currentTrackTitle = document.querySelector("#current-track-title");

// Fonction pour changer de piste
function loadTrack(index) {
    currentTrackIndex = index;
    audio.src = tracks[index].src;
    currentTrackTitle.textContent = tracks[index].title;
    audio.load(); // Recharge l'audio avec la nouvelle piste
    playButton.style.display = "initial";
    pauseButton.style.display = "none";
    stopButton.style.display = "none";
}

// Écouteurs pour les boutons précédent et suivant
prevButton.addEventListener("click", function() {
    if (currentTrackIndex > 0) {
        loadTrack(currentTrackIndex - 1);
    }
});

nextButton.addEventListener("click", function() {
    if (currentTrackIndex < tracks.length - 1) {
        loadTrack(currentTrackIndex + 1);
    }
});

// Passer automatiquement à la piste suivante lorsque la piste actuelle se termine
audio.addEventListener("ended", function() {
    if (currentTrackIndex < tracks.length - 1) {
        loadTrack(currentTrackIndex + 1);
        audio.play(); // Commence automatiquement la lecture de la prochaine piste
    }
});
