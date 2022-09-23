import { defer } from "./Utils.js";

var state = {
  playing: false,
  pausing: false,
  paused: false,
  idle: true,
  tracks:{}
};

function addTrackElements (trackName) {
  state.tracks[trackName].deckA = document.createElement("audio");
  state.tracks[trackName].deckB = document.createElement("audio");

  // Update its class
  state.tracks[trackName].deckA.style.display = "box";
  state.tracks[trackName].deckB.style.display = "box";
  state.tracks[trackName].deckA.loop = true;
  state.tracks[trackName].deckA.preload = "auto";
  state.tracks[trackName].deckA.volume = state.tracks[trackName].volume / 100;
  state.tracks[trackName].deckB.loop = true;
  state.tracks[trackName].deckB.preload = "auto";
  state.tracks[trackName].deckB.volume = state.tracks[trackName].volume / 100;

  // Append the element to .container
  document.querySelector("body").appendChild(state.tracks[trackName].deckA);
  document.querySelector("body").appendChild(state.tracks[trackName].deckB);
}

async function loadSong (trackName, soundName) {
  let result = new defer();
  if (state.paused || state.idle) {
    let evl = state.tracks[trackName].deckA.addEventListener("canplaythrough", () => {
      state.tracks[trackName].currentDeck = 'deckA';
      result.resolve(soundName);
    }, { once: true });
    state.tracks[trackName].deckA.src = state.tracks[trackName].files[soundName];
  } else {
    let nextDeck = state.tracks[trackName].currentDeck == 'deckA' ? 'deckB' : 'deckA';
    let evl = state.tracks[trackName][nextDeck].addEventListener("canplaythrough", () => {
      state.tracks[trackName].currentDeck = nextDeck;
      result.resolve(soundName);
    }, { once: true });
    state.tracks[nextDeck].deckA.src = state.tracks[trackName].files[soundName];
    // Play pause
  }
  return result;
}

async function playLoop () {
  let results = [];
  if (state.paused || state.idle) {
    for (const trackName in state.tracks) {
      let element = state.tracks[trackName];
      let result = new defer();
      let evl = element[element.currentDeck].addEventListener("play", () => {
        state.paused = false;
        state.idle = false;
        state.playing = true;
        result.resolve(element.currentDeck);
      }, { once: true });
      element[element.currentDeck].play();
      results.push(result);
    }
  } 
  return Promise.all(results);
}

export const registerTrack = function (trackName, options) {
  const defaultConf = {
    volume: 50,
    files: {},
    currentFile: false,
    currentDeck: null,
    deckA: null,
    deckB: null
  }
  if (!state.tracks[trackName]) {
    state.tracks[trackName] = Object.assign(defaultConf, options);
    addTrackElements(trackName);
  }
}

export const switchSong = async function (trackName, soundName) {
  if (!state.playing && !state.pausing) {
    return await loadSong(trackName, soundName);
  }
}
export const play = async function (trackName) {
  if (!state.playing) {
    return await playLoop();
  }
}
