function convertDateToString(time, format) {
  if (time < 0) {
    // If the count down is finished, write some text
    // TODO: negative countdown
    return "EXPIRED";
  } else if (format === "dhms") {
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const days = Math.floor(time / (1000 * 60 * 60 * 24));

    return days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
  } else if (format === "s") {
    return time / 1000;
  } else {
    return time;
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
