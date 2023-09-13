// timerModule.mjs
'use strict';

/**
 * Checks for availability of the storage API
 * @param {string} type
 * @returns {boolean}
 */
export function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // Check for specific DOMException names
      (e.name === 'QuotaExceededError' ||
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

/**
 * Saves timers object to localStorage
 * @param {object} timers
 */
function saveToLocalStorage(timers) {
  try {
    localStorage.setItem('timers', JSON.stringify(timers));
  } catch (e) {
    if (!storageAvailable('localStorage')) {
      alert('Ran out of storage space probably');
    } else {
      alert(`Something went wrong: ${e}`);
      console.error(e);
    }
  }
}

/**
 * Creates div element with h1 name of the timer and a div with different countdowns
 * @param {string} timerName
 * @param {string} innerName
 * @returns {Element}
 */
export function createTimer(timerName, innerName) {
  // const timerName = timers[innerName][1];
  const timerTitle = document.createElement('h1');
  const timerTitleText = document.createTextNode(timerName);
  timerTitle.appendChild(timerTitleText);
  // addTimerWrapper.insertAdjacentElement('beforebegin', timerTitle);

  // const innerName = timerNameToHash(timerName);
  const timerWrapper = document.createElement('div');
  timerWrapper.classList.add('wrapper');
  const timerElement = document.createElement('p');
  const timerElementSeconds = document.createElement('p');
  const timerElementHours = document.createElement('p');
  timerElement.id = `${innerName}`;
  timerWrapper.appendChild(timerElement);
  timerElementSeconds.id = `${innerName}Seconds`;
  timerWrapper.appendChild(timerElementSeconds);
  timerElementHours.id = `${innerName}Hours`;
  timerWrapper.appendChild(timerElementHours);

  const timerDeleteButton = document.createElement('button');
  timerDeleteButton.classList.add('deleteTimer');
  timerDeleteButton.id = `${innerName}DeleteButton`;
  timerDeleteButton.textContent = 'Delete timer';
  timerDeleteButton.type = 'button';
  timerWrapper.appendChild(timerDeleteButton);

  timerDeleteButton.addEventListener('click', () => {
    const deleteConfirm = document.createElement('button');
    deleteConfirm.type = 'button';
    deleteConfirm.classList.add('deleteTimer');
    deleteConfirm.id = `${innerName}DeleteConfirm`;
    deleteConfirm.textContent = 'Confirm';

    const deleteCancel = document.createElement('button');
    deleteCancel.type = 'button';
    deleteCancel.classList.add('deleteTimer');
    deleteCancel.id = `${innerName}DeleteCancel`;
    deleteCancel.textContent = 'Cancel';

    timerWrapper.appendChild(deleteConfirm);
    timerWrapper.appendChild(deleteCancel);

    timerDeleteButton.disabled = true;

    deleteConfirm.addEventListener('click', () => {
      // I'd also remove the event listener itself here,
      // but it's too much effort to pass specific functions to removeEventListener
      deleteTimer(innerName);
      timerWrapper.remove();
      timerTitle.remove();
    });

    deleteCancel.addEventListener('click', () => {
      timerDeleteButton.disabled = false;
      deleteConfirm.remove();
      deleteCancel.remove();
    });
  });

  // addTimerWrapper.insertAdjacentElement('beforebegin', timerWrapper);
  const extraTimerWrapper = document.createElement('div');
  extraTimerWrapper.classList.add('wrappper', 'vertical');
  extraTimerWrapper.appendChild(timerTitle);
  extraTimerWrapper.appendChild(timerWrapper);
  return extraTimerWrapper;
}

/**
 * Creates a simple ID compliant hash from name
 * @param {string} name
 * @returns {string}
 */
export function timerNameToHash(name) {
  return `timer${Array.from(name).reduce(
    (hash, char) => 0 | (31 * hash + char.charCodeAt(0)),
    0
  )}`;
}

/**
 * Gets milliseconds since Unix time 0 based on timezone or 'Invalid Date'
 * @param {string} dateString
 * @returns {number}
 */
function parseDateString(dateString) {
  const tempDate = new Date(dateString);
  if (tempDate.toString() === 'Invalid Date') {
    return 'Invalid Date';
  }

  return Date.UTC(
    tempDate.getUTCFullYear(),
    tempDate.getUTCMonth(),
    tempDate.getUTCDate(),
    tempDate.getUTCHours(),
    tempDate.getUTCMinutes(),
    tempDate.getUTCSeconds(),
    tempDate.getUTCMilliseconds()
  );
}

/**
 * Wrapper for createTimer that also records to timers object and saves to localStorage
 * Can take in a Date object as a string or time in milliseconds
 * @param {string} timerName
 * @param {string} dateString
 * @param {number} dateMs
 * @returns
 */
export function addTimerNew(timerName, dateString = null, dateMs = null) {
  const innerName = timerNameToHash(timerName);
  const newTimer = Number.isInteger(dateMs)
    ? dateMs
    : parseDateString(dateString);

  // Fails if incorrect name,
  // dateString is an empty string or dateString is Invalid Date and at the same time dateMs isn't provided
  if (
    innerName === '' ||
    ((dateString === '' || newTimer.toString() === 'Invalid Date') && !dateMs)
  ) {
    console.warn('Invalid date/name entered');
    return null;
  }

  timers[innerName] = [newTimer, timerName];
  saveToLocalStorage(timers);

  if (document.querySelector(`#${innerName}`)) {
    alert(`Timer with the innerName ${timerName} was replaced`);
    return null;
  }
  return createTimer(timerName, innerName);
}

/**
 * Deletes innerName from timers object and saves timers to the localStorage
 * @param {string} innerName
 */
function deleteTimer(innerName) {
  delete timers[innerName];
  saveToLocalStorage(timers);
}

/**
 * Get timers object
 * @returns {object}
 */
export function getTimers() {
  return timers;
}

const timers = {};
if (
  storageAvailable('localStorage') &&
  (!localStorage ||
    localStorage.length === 0 ||
    localStorage['timers'] === '{}')
) {
  const initTimer = {
    timer2130170518: [
      Date.parse('2020-12-02T20:00:00Z'),
      'Time since 2020-12-02',
    ],
  };
  localStorage.setItem('timers', JSON.stringify(initTimer));
}
let virtualTimers;
if (storageAvailable('localStorage')) {
  virtualTimers = JSON.parse(localStorage['timers']);
} else {
  // ignore
  virtualTimers = {};
}
for (const [innerName, [timerDate, timerName]] of Object.entries(
  virtualTimers
)) {
  timers[innerName] = [timerDate, timerName];
}
