const slider = document.getElementById('slider');
let noise;
let noiseVol;
let sound;
let soundVol;
let curSound = 0;
let soundPos;
let playlists;
let playlist;
let near;

function preload() {
	noise = loadSound('noise.mp3');
	playlists = (JSON.parse(playlistsJSONString)).results;
	playlist = (JSON.parse(samplePlaylistJSONString)).results[0].tracks;
	sound = loadSound(playlist[curSound].audio);
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

	sound.setVolume(0);
	sound.onended(handleSoundEnds);
	sound.play();
	soundPos = floor(random(40, 100));
}

function handleSoundEnds() {

}

// function draw() {
// 	background(200);
// }

const threshold = 20;
slider.oninput = (e) => {
	const val = e.target.value;
	const dist = Math.abs(val - soundPos);
	near = dist < threshold;
	if (near) {
		noiseVol = +(map(dist, threshold, 0, 1, 0).toFixed(2));
		soundVol = +(map(dist, threshold, 0, 0, 1).toFixed(2));
		console.log({noiseVol, soundVol})
		noise.setVolume(noiseVol, 0.2);
		sound.setVolume(soundVol, 0.2);
	} else {
		sound.setVolume(0, 0.2);
	}
};