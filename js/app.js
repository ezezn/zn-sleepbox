import ButtonBuilder from "./ButtonBuilder.js";
import State from "./State.js";
//import { play, pause, registerTrack, switchSong } from "./Looper.js";
import { defer, domReady } from "./Utils.js";
import { initTrack, selectSong, clearTrack, playTracks, pauseTracks } from "./AudioControler.js";  

var selectBackground = function (buttonName) {
    return selectSong('backgroundSelection', buttonName).then(() => {
        State.set('backgroundSelection', buttonName);
    });
}

var selectVoice = function (buttonName) {
    return selectSong('voiceSelection', buttonName).then(() => {
        State.set('voiceSelection', buttonName);
    });
}


var deselectBackground = function () {
    return clearTrack('backgroundSelection').then(() => {
        State.remove('backgroundSelection');
    });
}

var deselectVoice = function () {
    return clearTrack('voiceSelection').then(() => {
        State.remove('voiceSelection');
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

    // Add background sound selector
    ButtonBuilder.groupedButton('noise', 'backSelector', selectBackground, deselectBackground);
    ButtonBuilder.groupedButton('wind', 'backSelector', selectBackground, deselectBackground);
    ButtonBuilder.groupedButton('raindrops', 'backSelector', selectBackground, deselectBackground);
    ButtonBuilder.groupedButton('music', 'backSelector', selectBackground, deselectBackground);

    ButtonBuilder.groupedButton('manito', 'backSelector', selectBackground, deselectBackground);
    ButtonBuilder.groupedButton('siempre', 'backSelector', selectBackground, deselectBackground);
    ButtonBuilder.groupedButton('marolio', 'backSelector', selectBackground, deselectBackground);
    ButtonBuilder.groupedButton('camelias', 'backSelector', selectBackground, deselectBackground);

    // Add voice sound selector
    ButtonBuilder.groupedButton('sh2', 'voiceSelector', selectVoice, deselectVoice);
    ButtonBuilder.groupedButton('sh3', 'voiceSelector', selectVoice, deselectVoice);
    ButtonBuilder.groupedButton('sh5', 'voiceSelector', selectVoice, deselectVoice);

    ButtonBuilder.click(State.get('backgroundSelection'));
    ButtonBuilder.click(State.get('voiceSelection'));
    if (State.get('loopActive')) {
        ButtonBuilder.click('power');
    }
}

var startAudio = function () {
    return Promise.all([
        initTrack('background').then((results) => { console.log(`Sound ready : ${JSON.stringify(results)}`) }),
        initTrack('voice').then((results) => { console.log(`Sound ready : ${JSON.stringify(results)}`) })]);
}

domReady(() => { 
    /* Do things after DOM has fully loaded */
    State.init({
        backgroundSelection: 'noise',
        voiceSelection: 'sh2',
        loopActive: false
    });
    startAudio().then(connectButtons);
});