import ButtonBuilder from "./ButtonBuilder.js";
import State from "./State.js";
import { play, registerTrack, switchSong } from "./Looper.js";
import { defer } from "./Utils.js";

// Define a convenience method and use it

var ready = (callback) => {
    if (document.readyState != "loading") callback();
    else document.addEventListener("DOMContentLoaded", callback);
}
  
var logButton = function (buttonName) {
    let result = new defer();
    setTimeout(() => {
        result.resolve(true);
        console.log(`${buttonName} button clicked..`)
        if (buttonName !== 'power') {
            State.set('backgroundSelection', buttonName);
            switchSong('background', buttonName);
        } else {
            play();
        }
    }, 2000);
    return result;
}

var connectButtons = function () {
    ButtonBuilder.toggleButton('power', {
        click: logButton,
        on: (buttonName) => {
            State.set('loopActive', true);
        },
        off: (buttonName) => {
            State.set('loopActive', false);
        }
    })
    ButtonBuilder.groupedButton('noise', 'backSelector', logButton);
    ButtonBuilder.groupedButton('wind', 'backSelector', logButton);
    ButtonBuilder.groupedButton('raindrops', 'backSelector', logButton);
    ButtonBuilder.groupedButton('music', 'backSelector', logButton);

    ButtonBuilder.click(State.get('backgroundSelection'));
    if (State.get('loopActive')) {
        ButtonBuilder.click('power');
    }
}

var startAudio = function () {
    console.log("starting audio");
    registerTrack('background', {
        files: {
            noise: '/sound/noise.mp3',
            wind: '/sound/forest-stream.mp3',
            raindrops: '/sound/light-rain.mp3',
            music: '/sound/lullaby.mp3'
        }
    });
}

ready(() => { 
    /* Do things after DOM has fully loaded */
    State.init({
        backgroundSelection: 'noise',
        loopActive: false
    });
    startAudio();
    connectButtons();

});