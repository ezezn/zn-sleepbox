import ButtonBuilder from "./ButtonBuilder.js";
import State from "./State.js";
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
        if (buttonName !== 'power') State.set('backgroundSelection', buttonName);
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

ready(() => { 
    /* Do things after DOM has fully loaded */
    State.init({
        backgroundSelection: 'noise',
        loopActive: false
    });

    connectButtons();

});