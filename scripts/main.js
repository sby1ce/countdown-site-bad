function convertDateToString(interval, format) {
  let time = interval;
  let result = "";

  if (time < 0) {
    // If the count down is finished, write some text
    // TODO: negative countdown
    return "EXPIRED";
  }

  if (format.includes("w ")) {
    result = result + (Math.floor(time / (1000 * 60 * 60 * 24 * 7)) + "w ");
    time = time % (1000 * 60 * 60 * 24 * 7)
  } 
  if (format.includes("d ")) {
    result = result + (Math.floor(time / (1000 * 60 * 60 * 24)) + "d ");
    time = time % (1000 * 60 * 60 * 24)
  } 
  if (format.includes("h ")) {
    result = result + (Math.floor(time / (1000 * 60 * 60)) + "h ");
    time = time % (1000 * 60 * 60)
  } 
  if (format.includes("m ")) {
    result = result + (Math.floor(time / (1000 * 60)) + "m ");
    time = time % (1000 * 60)
  } 
  if (format.includes("s")) {
     result = result + (Math.floor(time / 1000) + "s ");
     time = time % 1000;
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
  } else if (countdownElement === "test") {
    var countDownDate = new Date("2023-07-22 00:00:00 UTC+0").getTime();
  }
  // TODO: Make automatic highlight of the smallest countdown

  // Update the count down every 1 second
  var x = setInterval( () => {
    // Get today's date and time
    var now = new Date().getTime();

    // Find the distance between now and the count down date
    var distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    var timeInDHMS = convertDateToString(distance, "d h m s ");
    var timeInSeconds = convertDateToString(distance, "s ");
    var timeInHours = convertDateToString(distance, "h ");
    // TODO: Optimize hour calculation

    // Display the result in the element
    document.getElementById(countdownElement).innerHTML = timeInDHMS;
    try {
      document.getElementById(countdownElement + "Seconds").innerHTML = timeInSeconds;
      document.getElementById(countdownElement + "Hours").innerHTML = timeInHours;
    } catch (TypeError) {
      console.error("No Seconds/Hours element");
      var a = new Date("2023-07-22T00:00:00Z")
      console.log(a);
    }
  }, 1000);
}

writeTimer("taxiDeparture");
writeTimer("trainDeparture");
writeTimer("trainArrival");
writeTimer("taxiArrival");
writeTimer("test")

/*
const testDeparture = new Date("Jul 28, 2023 13:12:00 UTC+0").getTime();
const testArrival = new Date("Jul 29, 2023 20:56:00 UTC+0").getTime();
console.log((testArrival - testDeparture) / 1000 / 60)
console.log()
*/
