// TODO: Organize these TODOs
// TODO: Add option to choose formats
// TODO: Make button to change between flex (priority timers first)
// and grid, as many timers on screen as possible (like Google Keep)
// TODO: Make automatic highlight of the smallest countdown
// TODO: Add changing timer priority like Steam wishlist (used to be. RIP)
// TODO: Optimize hour calculation
// TODO: Add button to save/load timers into localStorage
// TODO?: Related, make elements into iframes,
// so that the selection of the timer text persists
'use strict';

import {
  getTimers,
  storageAvailable,
  addTimerNew,
  createTimer,
} from './timersModule';

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
  const intervalName = setInterval(() => {
    updateTimers();
  }, 1000);
}

function updateTimers() {
  // Get today's date and time
  const now = new Date().getTime();

  for (const [innerName, [timerDate, timerName]] of Object.entries(timers)) {
    updateTimer(innerName, now, timerDate.getTime());
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

function convertDateToString(interval, format) {
  const result = timeUnits.reduce((acc, unit) => {
    if (format[unit.key]) {
      const value = Math.abs(Math.floor(interval / unit.divisor));
      interval %= unit.divisor;
      return acc + (value + unit.suffix + ' ');
    }
    return acc;
  }, '');

  return interval < 0 ? `-${result}` : result.trim();
}

function main() {
  // TODO: this is temporary
  for (const [innerName, [timerDate, timerName]] of Object.entries(timers)) {
    insertTimer(createTimer(timerName, innerName));
  }
  updateTimers();
  setTimers();

  const addTimerButton = document.querySelector('#addTimerButton');
  addTimerButton.addEventListener('click', () => {
    const timerNameField = document.querySelector('#addTimerName');
    const timerDateTime = document.querySelector('#addTimerDateTime');
    const timerDateField = document.querySelector('#addTimerDateString');

    if (timerDateTime.value) {
      // This adding of seconds and timezone shouldn't be necessary but copium
      insertTimer(addTimerNew(timerNameField.value, `${timerDateTime.value}:00Z`));
      timerNameField.value = '';
      timerDateTime.value = '';
      timerDateField.value = '';
    } else if (timerDateField.value) {
      insertTimer(addTimerNew(timerNameField.value, timerDateField.value));
      timerNameField.value = '';
      timerDateTime.value = '';
      timerDateField.value = '';
    }
  });
}

const timers = getTimers();
if (typeof window !== 'undefined' && storageAvailable('localStorage')) {
  main();
} else if (typeof window !== 'undefined' && !storageAvailable('localStorage')) {
  alert('localStorage is unavailble for whatever reason');
}
