function getUnitOfTime (interval, unit) {
  if (unit === "second") {
    return Math.floor((interval % (1000 * 60)) / 1000);
  } else if (unit === "minute") {
    return Math.floor((interval % (1000 * 60 * 60)) / (1000 * 60));
  } else if (unit === "hour") {
    return Math.floor((interval % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  } else if (unit === "day") {
    return Math.floor(interval / (1000 * 60 * 60 * 24));
  } else {
    return interval;
  }
  // TODO: Also refactor this
}

function convertDateToString(dateObject, format) {
  if (format === "dhms") {
    const days = getUnitOfTime(distance, "day")
    const hours = getUnitOfTime(distance, "hour")
    const minutes = getUnitOfTime(distance, "minute")
    const seconds = getUnitOfTime(distance, "second")
    return days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
  } else {
    return dateObject
  }
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
  } else if (countdownElement === "negativeTest") {
    var countDownDate = new Date("2023-07-22 19:08:30 UTC+0").getTime();
  }
  // TODO: Refactor this
  
  // TODO: Other countdowns
  // TODO: Make automatic highlight of the smallest countdown

  // Update the count down every 1 second
  var x = setInterval( () => {

    // Get today's date and time
    var now = new Date().getTime();

    // Find the distance between now and the count down date
    var distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    var timeInDHMS = convertDateToString(distance, "dhms");

    // Display the result in the element with id="demo"
    document.getElementById(countdownElement).innerHTML = timeInDHMS;

    // If the count down is finished, write some text
    // TODO: Negative countdown?
    if (distance < 0) {
      clearInterval(x);
      document.getElementById(countdownElement).innerHTML = "EXPIRED";
    }
  }, 1000);
}

writeTimer("taxiDeparture");
writeTimer("trainDeparture");
writeTimer("trainArrival");
writeTimer("taxiArrival");

/*
const testDeparture = new Date("Jul 28, 2023 13:12:00 UTC+0").getTime();
const testArrival = new Date("Jul 29, 2023 20:56:00 UTC+0").getTime();
console.log((testArrival - testDeparture) / 1000 / 60)
console.log()
*/
