// timerModule.js
'use strict';

const [hoursTimezoneOffset, minutesTimezoneOffset] = (() => {
  const timezoneOffset = new Date().getTimezoneOffset();
  return [
    String(Math.floor(timezoneOffset / 60)).padStart(2, '0'),
    String(timezoneOffset % 60).padStart(2, '0'),
  ];
})();

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

function loadFromLocalStorage() {
  const timersObject = {};
  const timersString = JSON.parse(localStorage.getItem('timers'));
  for (const [innerName, [timerDate, timerName]] of Object.entries(
    timersString
  )) {
    timersObject[innerName] = [new Date(timerDate), timerName];
  }
  return timersObject;
}

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

export function timerNameToHash(name) {
  return `timer${Array.from(name).reduce(
    (hash, char) => 0 | (31 * hash + char.charCodeAt(0)),
    0
  )}`;
}

export function addTimerNew(timerName, dateString) {
  const innerName = timerNameToHash(timerName);
  const newTimer =
    dateString.endsWith('Z') || dateString[dateString.length - 3] === ':'
      ? new Date(dateString)
      : new Date(
          `${dateString}+${hoursTimezoneOffset}:${minutesTimezoneOffset}`
        );

  if (
    innerName === '' ||
    dateString === '' ||
    newTimer.toString() === 'Invalid Date'
  ) {
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

function deleteTimer(innerName) {
  delete timers[innerName];
  saveToLocalStorage(timers);
}

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
      new Date('2020-12-02T20:00:00Z'),
      'Time since 2020-12-02',
    ],
  };
  localStorage.setItem('timers', JSON.stringify(initTimer));
}
let virtualTimers;
if (storageAvailable('localStorage')) {
  virtualTimers = loadFromLocalStorage();
} else {
  // ignore
  virtualTimers = {};
}
for (const [innerName, [timerDate, timerName]] of Object.entries(
  virtualTimers
)) {
  timers[innerName] = [timerDate, timerName];
}
