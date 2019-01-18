const slider = document.getElementById('slider');
let noise;
let noiseVol;
let sounds = [];
let sound;
let nextSound;
let soundVol = 0;
let curSoundLoad = 0;
let curSoundPlay = 0;
let soundPos;
let playlists;
let playlist;
let near;

function preload() {
	noise = loadSound('noise.mp3');
	playlists = (JSON.parse(playlistsJSONString)).results;
	playlist = (JSON.parse(samplePlaylistJSONString)).results[0].tracks;
	loadNextSound();
	loadNextSound();
}

function setup() {
	createCanvas(innerWidth, innerHeight);
	ellipseMode(RADIUS);
	angleMode(DEGREES);
	window.map = map;

	noise.setLoop(true);
	noise.setVolume(0);
	noise.play();
	noise.setVolume(0.5, 1);

	sound = sounds[curSoundPlay++];
	sound.setVolume(0);
	sound.play();
	soundPos = floor(random(40, 100));
}

function loadNextSound() {
	if (curSoundLoad === playlist.length) return;

	loadSound(playlist[curSoundLoad++].audio, s => {
		s.addCue(s.duration() / 2, loadNextSound);
		s.addCue(s.duration() - 1, playNextLoadedSound);
		sounds.push(s);
	});
}

function playNextLoadedSound() {
	curSoundPlay = curSoundPlay === playlist.length ? 0 : curSoundPlay;

	sound.stop();
	sound.setVolume(0, 0.5);
	sound = sounds[curSoundPlay++];
	sound.setVolume(soundVol, 0.5);
	sound.play();
}

const threshold = 20;
slider.oninput = (e) => {
	const val = e.target.value;
	const dist = Math.abs(val - soundPos);
	near = dist < threshold;
	if (near) {
		noiseVol = +(map(dist, threshold, 0, 1, 0).toFixed(2));
		soundVol = +(map(dist, threshold, 0, 0, 1).toFixed(2));
		// console.log({noiseVol, soundVol})
		noise.setVolume(noiseVol, 0.2);
		sound.setVolume(soundVol, 0.2);
	} else {
		sound.setVolume(0, 0.2);
	}
};