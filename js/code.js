const slider = document.getElementById('slider');
const info = document.getElementById('info');
const tracksURL = 'https://api.jamendo.com/v3.0/playlists/tracks/?client_id=f612760f&format=json&id=';

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
let wasNear = false;

function preload() {
	noise = loadSound('noise.mp3');
	playlists = (JSON.parse(playlistsJSONString)).results;
	const playlistId = playlists[floor(random(playlists.length))].id;
	console.log(playlistId)
	// playlist = (JSON.parse(samplePlaylistJSONString)).results[0].tracks;
	loadJSON(tracksURL + playlistId, json => {
		playlist = json.results[0].tracks;
		loadNextSound();
		loadNextSound();	
	});

}

function setup() {
	createCanvas(innerWidth, innerHeight);
	window.map = map;

	noise.setLoop(true);
	noise.setVolume(0);
	noise.play();
	noise.setVolume(0.5, 1);

	playNextLoadedSound();
	soundPos = floor(random(40, 100));
	console.log("Sound pos " + soundPos)
}

function loadNextSound() {
	if (curSoundLoad === playlist.length) return;
	const { artist_name, name } = playlist[curSoundLoad];

	loadSound(playlist[curSoundLoad++].audio, s => {
		s.addCue(s.duration() / 2, loadNextSound);
		s.addCue(s.duration() - 1, playNextLoadedSound);
		sounds.push({ s, artist_name, name});
	});
}

function playNextLoadedSound() {
	curSoundPlay = curSoundPlay === sounds.length ? 0 : curSoundPlay;

	// setInfo();
	sound = sounds[curSoundPlay++].s;
	sound.setVolume(soundVol, 0.5);
	sound.play();
}

function setInfo() {
	const { artist_name, name } = sounds[curSoundPlay];
	info.innerText = near ? artist_name + ' ' + name : '';
}

const threshold = 20;
function setSoundPos(val) {
	let pos;

	const right = val > 50;
	if (right) {
		pos = floor(random(0, val - threshold));
	} else {
		pos = floor(random(val + threshold, 100));
	}
	pos = pos < 0 ? 0 : pos > 100 ? 100 : pos;
	console.log("Sound pos " + pos);
	soundPos = pos;
}

slider.oninput = (e) => {
	const val = e.target.value;
	const dist = Math.abs(val - soundPos);
	near = dist < threshold;
	if (near) {
		wasNear = true;
		noiseVol = +(map(dist, threshold, 0, 1, 0).toFixed(2));
		soundVol = +(map(dist, threshold, 0, 0, 1).toFixed(2));
		noise.setVolume(noiseVol, 0.2);
		sound.setVolume(soundVol, 0.2);
	} else {
		sound.setVolume(0, 0.2);
		if (wasNear) {
			setSoundPos(+val);
			loadNextSound();
			playNextLoadedSound();
			wasNear = false;
		}
	}

};