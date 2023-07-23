function convertDateToString(interval, format) {
  let time = interval;
  let result = "";

  if (time < 0) {
    result = "-";
    time = -time;
  }
  if (format['weeks']) {
    result = result + (Math.floor(time / (1000 * 60 * 60 * 24 * 7)) + "w ");
    time = time % (1000 * 60 * 60 * 24 * 7);
  } 
  if (format['days']) {
    result = result + (Math.floor(time / (1000 * 60 * 60 * 24)) + "d ");
    time = time % (1000 * 60 * 60 * 24);
  } 
  if (format['hours']) {
    result = result + (Math.floor(time / (1000 * 60 * 60)) + "h ");
    time = time % (1000 * 60 * 60);
  } 
  if (format['minutes']) {
    result = result + (Math.floor(time / (1000 * 60)) + "m ");
    time = time % (1000 * 60);
  } 
  if (format['seconds']) {
     result = result + (Math.floor(time / 1000) + "s ");
     time = time % 1000;
  }
  if (format['milliseconds']) {
    result = result + (time + "ms");
  }
  return result;
}

function writeTimer(countdownElement) {
  // Set the date we're counting down to
  if (countdownElement === "trainDeparture") { 
    var countDownDate = new Date("Jul 28, 2023 13:12:00 UTC+0").getTime(); 
  } else if (countdownElement === "trainArrival") {
    var countDownDate = new Date("Jul 29, 2023 20:56:00 UTC+0").getTime();
  } else if (countdownElement === "taxiDeparture") {
    var countDownDate = new Date("Jul 28, 2023 12:12:00 UTC+0").getTime();
  } else if (countdownElement === "taxiArrival") {
    var countDownDate = new Date("Jul 29, 2023 21:56:00 UTC+0").getTime();
  } else if (countdownElement === "start") {
    var countDownDate = new Date("2023-07-17T19:00:00Z").getTime();
  } else if (countdownElement === "test") {
    var countDownDate = new Date("2023-07-17T21:00:00Z").getTime();
  }
  // TODO: Make automatic highlight of the smallest countdown

  // Update the count down every 1 second
  var x = setInterval( () => {
    // Get today's date and time
    var now = new Date().getTime();

    // Find the distance between now and the count down date
    var distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    var timeInDHMS = convertDateToString(distance, dhms);
    var timeInSeconds = convertDateToString(distance, {'seconds': true});
    var timeInHours = convertDateToString(distance, {'hours': true});
    // TODO: Optimize hour calculation

    // Display the result in the element
    // TODO: Make adding elements entirely script-based
    document.getElementById(countdownElement).textContent = timeInDHMS;
    try {
      document.getElementById(countdownElement + "Seconds").textContent = timeInSeconds;
      document.getElementById(countdownElement + "Hours").textContent = timeInHours;
    } catch (TypeError) {
      console.error("No Seconds/Hours element");
    }
  }, 1000);
}

const dhms = {'days': true, 'hours': true, 'minutes': true, 'seconds': true}
document.getElementById("test").textContent = "AAAAAAAAAAAAAAAAA";
writeTimer("taxiDeparture");
writeTimer("trainDeparture");
writeTimer("trainArrival");
writeTimer("taxiArrival");
writeTimer("start");
writeTimer("test");

/*
const testDeparture = new Date("Jul 28, 2023 13:12:00 UTC+0").getTime();
const testArrival = new Date("Jul 29, 2023 20:56:00 UTC+0").getTime();
console.log((testArrival - testDeparture) / 1000 / 60)
console.log()
*/
