// when someone submit the form
$(document).ready(function () {
  var config = {
    apiKey: "AIzaSyD3-RMPYfcuA_JpdX1kw0wGIFtcD_nHnFg",
    authDomain: "coding-bootcamp-firebase.firebaseapp.com",
    databaseURL: "https://coding-bootcamp-firebase.firebaseio.com",
    projectId: "coding-bootcamp-firebase",
    storageBucket: "coding-bootcamp-firebase.appspot.com",
    messagingSenderId: "575573294033"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  $("#form-submit").on("click", function (event) {
    event.preventDefault();

    //Define variables
    var trainName = $("#name").val().trim();
    var trainDestination = $("#destination").val().trim();
    var arrivalTime = $("#time").val().trim();
    var trainFrequency = $("#frequency").val().trim();
    console.log(trainName);
    console.log(trainDestination);
    console.log(arrivalTime);
    console.log(trainFrequency);

    database.ref().push({
      name: trainName,
      destination: trainDestination,
      time: arrivalTime,
      frequency: trainFrequency
    });

    $("#name").val("");
    $("#destination").val("");
    $("#time").val("");
    $("#frequency").val("");

  });

  // the event listener for firebase when we add a record 
  database.ref().on("child_added", function (snapshot) {
    console.log(snapshot.val());

    // Assumptions
    var tFrequency = snapshot.val().frequency;

    // Time is 3:30 AM
    var firstTime = snapshot.val().time;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
    var trainArrivalTime = moment(nextTrain).format("hh:mm");
    
    $("table tbody").append("<tr><td>" + snapshot.val().name + "</td><td>" + snapshot.val().destination + "</td><td>" + snapshot.val().frequency + "</td><td>" + trainArrivalTime + "</td><td>"+tMinutesTillTrain+"</td></tr>");
  });
});



