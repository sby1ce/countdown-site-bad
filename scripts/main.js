// TODO: Organize these TODOs
// TODO: Remake the way add timer button looks
// TODO: Add option to choose formats
// TODO: Refactor the way timers are launched
// TODO: Make button to change between flex (priority timers first)
// and grid, as many timers on screen as possible (like Google Keep)
// TODO: add selecting time not by string but by some calendar/clock element?
// TODO: Make automatic highlight of the smallest countdown
// TODO: Add changing timer priority like Steam wishlist
// TODO: Optimize hour calculation
// TODO: Refactor this to add elements through addTimer() from array
// from localStorage
// TODO: Add button to save/load timers into localStorage
// TODO: Port button to clear localStorage
// TODO: Make timerName => innerName conversion prettier
// possibly use hashes?
// TODO?: Related, make elements into iframes, 
// so that the selection of the timer text persists
    

const timeUnits = [
  { key: 'weeks', divisor: 1000 * 60 * 60 * 24 * 7, suffix: 'w' },
  { key: 'days', divisor: 1000 * 60 * 60 * 24, suffix: 'd' },
  { key: 'hours', divisor: 1000 * 60 * 60, suffix: 'h' },
  { key: 'minutes', divisor: 1000 * 60, suffix: 'm' },
  { key: 'seconds', divisor: 1000, suffix: 's' },
  { key: 'milliseconds', divisor: 1, suffix: 'ms' }
];
const timers = new Map();
timers.set('taxiDeparture', new Date("Jul 28, 2023 10:30:00 UTC+0"));
timers.set('trainDeparture', new Date("Jul 28, 2023 13:12:00 UTC+0"));
timers.set('trainArrival', new Date("Jul 29, 2023 20:56:00 UTC+0"));
timers.set('taxiArrivalArrival', new Date("Jul 29, 2023 21:20:00 UTC+0"));
timers.set('taxiArrival', new Date("Jul 29, 2023 22:00:00 UTC+0"));
timers.set('start', new Date("2023-07-17T19:00:00Z"));
timers.set('test', new Date("2023-07-17T21:00:00Z"));

// Timer button needs to be initialized here because it is used for inserting elements
const addTimerButton = document.querySelector('#addTimerButton');
const dhms = {'days': true, 'hours': true, 'minutes': true, 'seconds': true};


function createTimer(timerName) {
  const timerTitle = document.createElement('h1');
  const timerTitleText = document.createTextNode(timerName);
  timerTitle.appendChild(timerTitleText);
  addTimerButton.insertAdjacentElement('beforebegin', timerTitle);

  const innerName = timerName.replaceAll(' ', '_');
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
  timerWrapper.appendChild(timerDeleteButton);
  timerDeleteButton.onclick = () => {
    timers.delete(innerName);
    timerWrapper.remove();
    timerTitle.remove();
  };

  addTimerButton.insertAdjacentElement('beforebegin', timerWrapper);

  // Set the date we're counting down to
  const countDownDate = timers.get(innerName).getTime();

  // Update the count down every 1 second
  const timerInterval = setInterval(() => {
    // Get today's date and time
    const now = new Date().getTime();

    // Find the distance between now and the count down date
    const distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    const timeInDHMS = convertDateToString(distance, dhms);
    const timeInSeconds = convertDateToString(distance, { 'seconds': true });
    const timeInHours = convertDateToString(distance, { 'hours': true });

    // Display the result in the element
    try {
      document.getElementById(innerName).textContent = timeInDHMS;
      document.getElementById(innerName + "Seconds").textContent = timeInSeconds;
      document.getElementById(innerName + "Hours").textContent = timeInHours;
    } catch(TypeError) {
      clearInterval(timerInterval);
    }

  }, 1000);
}

function addTimer(timerName, dateString) {
  const innerName = timerName.replaceAll(' ', '_');
  const newTimer = new Date(dateString);

  if (innerName === '' || dateString === '') {
    return null;
  }
  
  timers.set(innerName, newTimer);

  if (document.querySelector(`#${innerName}`)) {
    alert(`Timer with the innerName ${timerName} was replaced`);
    return null;
  }

  createTimer(timerName);
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

function writeTimers() {
  const now = new Date().getTime();
  
  for (const [timerName, timerDate] of timers.entries()) {
    createTimer(timerName);
  }
}

function main() {
  addTimerButton.onclick = () => { 
    const timerNameField = document.querySelector('#addTimerName');
    const timerDateField = document.querySelector('#addTimerDate');
    addTimer(timerNameField.value, timerDateField.value); 
  };

  for (const [timerName, timerDate] of timers.entries()) {
    createTimer(timerName);
  }
  // document.getElementById("test").textContent = "AAAAAAAAAAAAAAAAA";
}

main();

/*
const testDeparture = new Date("Jul 28, 2023 13:12:00 UTC+0").getTime();
const testArrival = new Date("Jul 29, 2023 20:56:00 UTC+0").getTime();
console.log((testArrival - testDeparture) / 1000 / 60)
console.log()
*/
