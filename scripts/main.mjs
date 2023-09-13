// main.mjs
'use strict';

import {
  getTimers,
  storageAvailable,
  addTimerNew,
  createTimer,
} from './timersModule.mjs';
import {
  clearLocalStorage,
  getLocalStorageAsText,
  handlePasteLocalStorage,
} from './storageModule.mjs';

const timeUnits = [
  { key: 'weeks', divisor: 1000 * 60 * 60 * 24 * 7, suffix: 'w' },
  { key: 'days', divisor: 1000 * 60 * 60 * 24, suffix: 'd' },
  { key: 'hours', divisor: 1000 * 60 * 60, suffix: 'h' },
  { key: 'minutes', divisor: 1000 * 60, suffix: 'm' },
  { key: 'seconds', divisor: 1000, suffix: 's' },
  { key: 'milliseconds', divisor: 1, suffix: 'ms' },
];
/*
const timers = {
  [timerNameToHash('A')]: [new Date('2020-12-02T20:00:00Z'), 'A'],
  [timerNameToHash('B')]: [new Date('2022-02-24T01:00:00Z'), 'B'],
  [timerNameToHash('C')]: [new Date('2023-06-28T12:00:00Z'), 'C'],
};
*/

// Timer wrapper is initialized here because it is used for inserting elements
const addTimerWrapper = document.querySelector('#addTimerWrapper');
const dhms = { days: true, hours: true, minutes: true, seconds: true };

function insertTimer(timerWrapper) {
  if (timerWrapper) {
    addTimerWrapper.insertAdjacentElement('beforebegin', timerWrapper);
  }
}

function setTimers() {
  // This is called before the setInterval so that the text is inserted instantly
  updateTimers();
  const intervalName = setInterval(() => {
    updateTimers();
  }, 1000);
}

function updateTimers() {
  // Get today's date and time
  const now = Date.now();

  for (const [innerName, [timerMs, timerName]] of Object.entries(timers)) {
    updateTimer(innerName, now, timerMs);
  }
}

function updateTimer(innerName, now, countDownDate) {
  // Find the distance between now and the count down date
  const distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  const timeInDHMS = convertDateToString(distance, dhms);
  const timeInSeconds = convertDateToString(distance, { seconds: true });
  const timeInHours = convertDateToString(distance, { hours: true });

  // Display the result in the element
  document.querySelector(`#${innerName}`).textContent = timeInDHMS;
  document.querySelector(`#${innerName}Seconds`).textContent = timeInSeconds;
  document.querySelector(`#${innerName}Hours`).textContent = timeInHours;
}

export function convertDateToString(interval, format) {
  let absInterval = Math.abs(interval);
  const result = timeUnits.reduce((acc, unit) => {
    if (format[unit.key]) {
      const value = Math.floor(absInterval / unit.divisor);
      absInterval %= unit.divisor;
      return acc + (value + unit.suffix + ' ');
    }
    return acc;
  }, '');

  return interval < 0 ? `-${result.trim()}` : result.trim();
}

function initFooter() {
  const showLocalStorageArea = document.querySelector('#showLocalStorageArea');
  const clearLocalStorageButton = document.querySelector('#clearLocalStorage');
  clearLocalStorageButton.addEventListener('click', () => {
    const result = clearLocalStorage();
    if (result === 'success') {
      showLocalStorageArea.value = 'Successful localStorage clear';
    } else {
      showLocalStorageArea.value = result;
    }
  });

  const showLocalStorageButton = document.querySelector('#showLocalStorage');
  showLocalStorageButton.addEventListener('click', () => {
    showLocalStorageArea.value = getLocalStorageAsText();
  });

  const pasteLocalStorageButton = document.querySelector('#pasteLocalStorage');
  pasteLocalStorageButton.addEventListener('click', () => {
    const loadedTimers = handlePasteLocalStorage(showLocalStorageArea);
    if (!loadedTimers) {
      return null;
    }
    clearLocalStorage();

    // Clearing and repopulating with new timers
    const mainBlock = document.querySelector('main');
    while (mainBlock.firstChild && mainBlock.firstChild !== addTimerWrapper) {
      mainBlock.removeChild(mainBlock.firstChild);
    }
    for (const [innerName, [timerMs, timerName]] of Object.entries(timers)) {
      insertTimer(addTimerNew(timerName, (dateMs = timerMs)));
    }
    updateTimers();
  });

  const openLocalStorageAreaButton = document.querySelector(
    '#openLocalStorageArea'
  );
  openLocalStorageAreaButton.addEventListener('click', () => {
    showLocalStorageArea.readOnly = showLocalStorageArea.readOnly
      ? false
      : true;
    openLocalStorageAreaButton.textContent =
      openLocalStorageAreaButton.textContent === 'Open' ? 'Close' : 'Open';
  });

  const copyLocalStorageAreaButton = document.querySelector(
    '#copyLocalStorageArea'
  );
  copyLocalStorageAreaButton.addEventListener('click', () => {
    navigator.clipboard.writeText(showLocalStorageArea.value);
  });
}

function main() {
  for (const [innerName, [timerMs, timerName]] of Object.entries(timers)) {
    insertTimer(createTimer(timerName, innerName));
  }
  setTimers();

  const addTimerButton = document.querySelector('#addTimerButton');
  addTimerButton.addEventListener('click', () => {
    const timerNameField = document.querySelector('#addTimerName');
    const timerDateTime = document.querySelector('#addTimerDateTime');
    const timerDateField = document.querySelector('#addTimerDateString');

    if (timerDateTime.value) {
      // This adding of seconds and timezone shouldn't be necessary but copium
      insertTimer(
        addTimerNew(timerNameField.value, (dateString = timerDateTime.value))
      );
      timerNameField.value = '';
      timerDateTime.value = '';
      timerDateField.value = '';
    } else if (timerDateField.value) {
      insertTimer(
        addTimerNew(timerNameField.value, (dateString = timerDateField.value))
      );
      timerNameField.value = '';
      timerDateTime.value = '';
      timerDateField.value = '';
    }
  });

  initFooter();
}

const timers = getTimers();
if (typeof window !== 'undefined' && storageAvailable('localStorage')) {
  main();
} else if (
  typeof window !== 'undefined' &&
  !storageAvailable('localStorage') &&
  typeof process === 'undefined'
) {
  alert('localStorage is unavailble for whatever reason');
}
