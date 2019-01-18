const slider = document.getElementById('slider');
let noise;
let sound;
let soundPos;
let playlists;
let playlist;

function preload() {
    noise = loadSound('noise.mp3');
    playlists = (JSON.parse(playlistsJSONString)).results;
    playlist = (JSON.parse(samplePlaylistJSONString)).results[0].tracks;
    sound = loadSound(playlist[0].audio);
}

function setup() {
	createCanvas(innerWidth, innerHeight);
	ellipseMode(RADIUS);
	angleMode(DEGREES); 

    noise.setLoop(true);
    noise.setVolume(0);
    // noise.play();
	noise.setVolume(0.5, 5);

	soundPos = floor(random(40, 100));
}

function draw() {
	background(200);
}

slider.oninput = (e) => {
	const val = e.target.value;
	const dist = Math.abs(val - soundPos);
	const near = dist < 20;
	near && console.log(near)
};