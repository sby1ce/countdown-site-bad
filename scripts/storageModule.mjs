// storageModule.mjs
'use strict';

/**
 * Tries to clear localStorage object and returns status
 * @returns {string}
 */
export function clearLocalStorage() {
  if (localStorage && localStorage.length !== 0) {
    localStorage.clear();
    return 'success';
  } else if (localStorage && localStorage.length === 0) {
    return 'already empty';
  } else {
    return 'failure';
  }
}

/**
 * If localStorage is present, has timers attribute and that attribute isn't empty, returns JSON.stringify of timers object
 * @returns {string}
 */
export function getLocalStorageAsText() {
  if (localStorage && localStorage['timers']) {
    return localStorage['timers'];
  } else {
    return null;
  }
}

/**
 * Toggles readOnly in textarea and parses value if it's valid
 * @param {Element} showLocalStorageArea
 * @returns {object}
 */
export function handlePasteLocalStorage(showLocalStorageArea) {
  let loadedTimers = null;
  try {
    loadedTimers = JSON.parse(showLocalStorageArea.value);
  } catch {
    showLocalStorageArea.value = 'Invalid object pasted';
  }
  return loadedTimers;
}
