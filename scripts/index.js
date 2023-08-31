// TODO: Organize these TODOs
// TODO: Change timers back to object to JSON.stringify it into localStorage
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
const timeUnits = [
  { key: 'weeks', divisor: 1000 * 60 * 60 * 24 * 7, suffix: 'w' },
  { key: 'days', divisor: 1000 * 60 * 60 * 24, suffix: 'd' },
  { key: 'hours', divisor: 1000 * 60 * 60, suffix: 'h' },
  { key: 'minutes', divisor: 1000 * 60, suffix: 'm' },
  { key: 'seconds', divisor: 1000, suffix: 's' },
  { key: 'milliseconds', divisor: 1, suffix: 'ms' },
];
const timers = {
  [timerNameToHash('A')]: [new Date('2020-12-02T20:00:00Z'), 'A'],
  [timerNameToHash('B')]: [new Date('2022-02-24T01:00:00Z'), 'B'],
  [timerNameToHash('C')]: [new Date('2023-06-28T12:00:00Z'), 'C'],
};

// Timer wrapper is initialized here because it is used for inserting elements
const addTimerWrapper = document.querySelector('#addTimerWrapper');
const dhms = { days: true, hours: true, minutes: true, seconds: true };
const [hoursTimezoneOffset, minutesTimezoneOffset] = (() => {
  const timezoneOffset = new Date().getTimezoneOffset();
  return [
    String(Math.floor(timezoneOffset / 60)).padStart(2, '0'),
    String(timezoneOffset % 60).padStart(2, '0'),
  ];
})();

function createTimer(timerName, innerName) {
  // const timerName = timers[innerName][1];
  const timerTitle = document.createElement('h1');
  const timerTitleText = document.createTextNode(timerName);
  timerTitle.appendChild(timerTitleText);
  addTimerWrapper.insertAdjacentElement('beforebegin', timerTitle);

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
    if (timerDeleteButton.disabled) {
      return;
    }
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

  addTimerWrapper.insertAdjacentElement('beforebegin', timerWrapper);
}

function timerNameToHash(name) {
  return `timer${Array.from(name).reduce(
    (hash, char) => 0 | (31 * hash + char.charCodeAt(0)),
    0
  )}`;
}

function setTimers() {
  const intervalName = setInterval(() => {
    // Get today's date and time
    const now = new Date().getTime();

    for (const [innerName, [timerDate, timerName]] of Object.entries(timers)) {
      updateTimer(innerName, now, timerDate.getTime());
    }
  }, 1000);
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

function addTimerNew(timerName, dateString) {
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

  if (document.querySelector(`#${innerName}`)) {
    alert(`Timer with the innerName ${timerName} was replaced`);
    return null;
  }

  createTimer(timerName, innerName);
}

function deleteTimer(innerName) {
  delete timers[innerName];
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
    createTimer(timerName, innerName);
  }
  setTimers();

  const addTimerButton = document.querySelector('#addTimerButton');
  addTimerButton.addEventListener('click', () => {
    const timerNameField = document.querySelector('#addTimerName');
    const timerDateTime = document.querySelector('#addTimerDateTime');
    const timerDateField = document.querySelector('#addTimerDateString');

    if (timerDateTime.value) {
      // This adding of seconds and timezone shouldn't be necessary but copium
      addTimerNew(timerNameField.value, `${timerDateTime.value}:00Z`);
      timerNameField.value = '';
      timerDateTime.value = '';
      timerDateField.value = '';
    } else if (timerDateField.value) {
      addTimerNew(timerNameField.value, timerDateField.value);
      timerNameField.value = '';
      timerDateTime.value = '';
      timerDateField.value = '';
    }
  });
  // document.getElementById("test").textContent = "AAAAAAAAAAAAAAAAA";
}

main();

/*
const testDeparture = new Date("Jul 28, 2023 13:12:00 UTC+0").getTime();
const testArrival = new Date("Jul 29, 2023 20:56:00 UTC+0").getTime();
console.log((testArrival - testDeparture) / 1000 / 60)
console.log()
*/
