const slider = document.getElementById('slider');
const info = document.getElementById('info');
const knobContainer = document.querySelector('.knob-container');
const knobVisuals = document.querySelector('.knob-visuals');
const knobInput = new PrecisionInputs.KnobInput(knobContainer, knobVisuals, {
	min: 0,
	max: 100,
	step: 1,
	initial: 0,
	visualContext: function () {
		// this.textDisplay = this.element.querySelector('.current-value-indicator');
	},
	updateVisuals: function (norm, val) {
		// this.textDisplay.innerText = val;
		this.element.style[this.transformProperty] = 'rotate(' + (360 * norm) + 'deg)';
	}
});

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
let playlistId;
let near;
let wasNear = false;

function preload() {
	noise = loadSound('noise.mp3');
	playlists = (JSON.parse(playlistsJSONString)).results;
	loadPlaylist();
}

function loadPlaylist() {
	const playlistId = getPlaylistId();
	console.log(playlistId);
	loadJSON(tracksURL + playlistId, json => {
		const results = json.results[0];
		if (!results) {
			loadPlaylist();
			return;
		}
		playlist = json.results[0].tracks;
		console.log(playlist);
		loadNextSound();
		loadNextSound();
	});
}

function getPlaylistId() {
	while (true) {
		const id = playlists[floor(random(playlists.length))].id;
		if (id !== playlistId) {
			playlistId = id;
			return id;
		}
	}
}


function setup() {
	window.map = map;

	noise.setLoop(true);
	noise.setVolume(0);
	noise.play();
	noise.setVolume(0.5, 1);

	playNextLoadedSound();
	soundPos = floor(random(40, 100));
	console.log("Sound pos: " + soundPos)
}

function loadNextSound() {
	if (curSoundLoad === playlist.length) {
		curSoundLoad = 0;
		loadPlaylist();
		return;
	};
	const { artist_name, name } = playlist[curSoundLoad];

	loadSound(playlist[curSoundLoad++].audio, s => {
		s.addCue(s.duration() / 2, loadNextSound);
		s.addCue(s.duration() - 1, playNextLoadedSound);
		sounds.push({ s, artist_name, name });
	});
}

function playNextLoadedSound() {
	curSoundPlay = curSoundPlay === sounds.length ? 0 : curSoundPlay;

	sound = sounds[curSoundPlay++].s;
	sound.setVolume(soundVol);
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

knobInput.addEventListener('change', (e) => {
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

});