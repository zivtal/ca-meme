'use strict';

// export const storageService = {
//     load: loadFromStorage,
//     save: saveToStorage
// }

function saveToStorage(key, val) {
    const json = JSON.stringify(val)
    localStorage.setItem(key, json)
}

function loadFromStorage(key) {
    const json = localStorage.getItem(key)
    return JSON.parse(json)
}

