import ButtonBuilder from "./ButtonBuilder.js";
import State from "./State.js";
//import { play, pause, registerTrack, switchSong } from "./Looper.js";
import { defer, domReady } from "./Utils.js";
import { initTrack, selectSong, playTracks, pauseTracks } from "./AudioControler.js";  

var selectBackground = function (buttonName) {
    return selectSong('backgroundSelection', buttonName).then(() => {
        State.set('backgroundSelection', buttonName);
    });
}

var connectButtons = function () {
    ButtonBuilder.toggleButton('power', {
        on: (buttonName) => {
            State.set('loopActive', true);
            return playTracks();
        },
        off: (buttonName) => {
            State.set('loopActive', false);
            return pauseTracks();
        }
    })
    ButtonBuilder.groupedButton('noise', 'backSelector', selectBackground);
    ButtonBuilder.groupedButton('wind', 'backSelector', selectBackground);
    ButtonBuilder.groupedButton('raindrops', 'backSelector', selectBackground);
    ButtonBuilder.groupedButton('music', 'backSelector', selectBackground);

    ButtonBuilder.click(State.get('backgroundSelection'));
    if (State.get('loopActive')) {
        ButtonBuilder.click('power');
    }
}

var startAudio = function () {
    return initTrack('background').then((results) => { console.log(`Sound ready : ${JSON.stringify(results)}`) });
}

domReady(() => { 
    /* Do things after DOM has fully loaded */
    State.init({
        backgroundSelection: 'noise',
        loopActive: false
    });
    startAudio().then(connectButtons);
});