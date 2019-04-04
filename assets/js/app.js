var config = {
  apiKey: "AIzaSyDC38WLnlOkT1dthVQS2n9dFKPGSN6TCHI",
  authDomain: "fir-project-51a56.firebaseapp.com",
  databaseURL: "https://fir-project-51a56.firebaseio.com",
  projectId: "fir-project-51a56",
  storageBucket: "fir-project-51a56.appspot.com",
  messagingSenderId: "611923460758"
};



firebase.initializeApp(config);

var database = firebase.database();
var ref = database.ref();

var name;
var destination;
var firstTrain;
var frequency;

$("#formSubmit").on("click", function () {

  var nameInput = $("#name-input").val().trim();
  var destInput = $("#destination-input").val().trim();
  var firstTrn = $("#firstTrain-input").val().trim();
  var frq = $("#frequency-input").val().trim();
  var regEx = RegExp("^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$");

  if (nameInput == "") {
    alert("Please enter the name of the train.");

  } else if (destInput == "") {
    alert("Please enter the destination of the train.");

  } else if (firstTrn == "") {
    alert("Please enter the time the first train arrives.");

  } else if (regEx.test(firstTrn) == false) {
    alert("Please enter a valid military time.");

  } else if (frq == "") {
    alert("Please enter the frequency the train arrives.");

  } else if (firstTrn.match(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)) {

    name = nameInput;
    destination = destInput;
    firstTrain = firstTrn;
    frequency = frq;

    $("#name-input").val("");
    $("#destination-input").val("");
    $("#firstTrain-input").val("");
    $("#frequency-input").val("");

    ref.push({
      name: name,
      destination: destination,
      firstTrain: firstTrain,
      frequency: frequency,
      currentTime: currentTime
    });
  }

});

//Adding commas to numbers
//Source: https://blog.tompawlak.org/number-currency-formatting-javascript
function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
};

ref.on("child_added", function (snapshot) {

  var fbName = snapshot.val().name;
  var fbDest = snapshot.val().destination;
  var fbFreq = snapshot.val().frequency;
  var formattedFbFreq = formatNumber(snapshot.val().frequency);
  var fbTrn = snapshot.val().firstTrain;

  // First Train: Subtract 1 year to make sure it comes before current time
  var firstTrainConverted = moment(fbTrn, "hh:mm").subtract(1, "years");

  // Time difference between current time and firstTrainConverted
  var timeDiff = moment().diff(firstTrainConverted, "minutes");

  // Remainder of minutes until next train
  var minRemainder = timeDiff % fbFreq;

  // Minutes left until next train 
  var minNextTrain = fbFreq - minRemainder;

  var nextTrainArrival = moment().add(minNextTrain, "minutes");
  var formattedNextTrain = nextTrainArrival.format("hh:mm a");

  //Create dynamic elements 
  var newRow = $("<tr>");
  var newDiv = $("<td>");

  //Adding information to the dynamic table elements
  newRow.append("<td>" + fbName + "</td> <td>" + fbDest + "</td> <td>" + formattedFbFreq + "</td> <td>" + formattedNextTrain + "</td> <td>" + formatNumber(minNextTrain) + "</td> <td> <button keyID= '" + snapshot.key + "' class='delete'>" + "Delete" + "</button> </td>");

  //Append to HTML
  $("#userData").append(newRow);

});

//Event handler for delete buttons
$(document).on("click", ".delete", function (event) {
  event.preventDefault();
  ref.child($(this).attr("keyID")).remove();
  location.reload();
});

//Date Time Display
//Slightly altered from Source: https://stackoverflow.com/questions/10590461/dynamic-date-and-time-with-moment-js-and-setinterval
var datetime = null;
var date = null;

var updateTime = function () {
  date = moment(new Date())
  datetime.html(date.format('dddd, MMMM Do YYYY, h:mm:ss a'));
};

$(document).ready(function () {
  datetime = $('#currentTime')
  updateTime();
  setInterval(updateTime, 1000);
});
