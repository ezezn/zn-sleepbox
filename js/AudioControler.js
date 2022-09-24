import { defer, findEl } from './Utils.js';

var selection = {}
var playing = false;

export const initTrack = function (trackName) {
    let taskResults = [];
    let audioEls = findEl(`[data-track="${trackName}"]`);
    audioEls.forEach((audio) => {
        let taskResult = new defer();
        audio.addEventListener("loadeddata", () => {
            taskResult.resolve(audio.getAttribute('data-sound'));
        }, { once: true });
        audio.load();
        taskResults.push(taskResult);
    });
    return Promise.all(taskResults);
}

export const playTracks = function () {
    let taskResults = [];
    if (!playing && Object.keys(selection).length) {
        for (const songName in selection) {
            let audio = findEl(`[data-sound="${songName}"]`);
            let task = new defer();
            audio.addEventListener("play", () => {
                task.resolve(songName);
            }, { once: true });
            audio.play();
            taskResults.push(task);
        }
        return Promise.all(taskResults).then(() => {
            playing = true;
        });
    } else {
        let result = new defer();
        result.reject(false);
        return result;
    } 
}

export const pauseTracks = function () {
    let taskResults = [];
    if (playing) {
        for (const songName in selection) {
            let audio = findEl(`[data-sound="${songName}"]`);
            let task = new defer();
            audio.addEventListener("pause", () => {
                task.resolve(songName);
            }, { once: true });
            audio.pause();
            taskResults.push(task);
        }
        return Promise.all(taskResults).then(() => {
            playing = false;
        });
    } else {
        let result = new defer();
        result.reject(false);
        return result;
    } 
}

export const selectSong = function (songName, trackName) {
    let taskResult = new defer();
    selection[trackName] = songName;

    taskResult.resolve(true);
    return taskResult;
}