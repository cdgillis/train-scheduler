var config = {
    apiKey: "AIzaSyBS-O5aWS2epcROYLl6V1x6oaQg61aL2O0",
    authDomain: "train-scheduler-ba2c0.firebaseapp.com",
    databaseURL: "https://train-scheduler-ba2c0.firebaseio.com",
    projectId: "train-scheduler-ba2c0",
    storageBucket: "", //"train-scheduler-ba2c0.appspot.com",
    messagingSenderId: "503243241418"
};

firebase.initializeApp(config);

var database = firebase.database();

// Capture Button Click
$("#add-train").on("click", function (event) {
    event.preventDefault();

    // Capture User Inputs and store into variables
    var nameTrain = $("#name-input").val().trim();
    var destinationTrain = $("#destination-input").val().trim();
    var startTime = moment($("#start-time-input").val().trim(), "HH:mm").format("");
    var frequencyTrain = $("#frequency-input").val().trim();

    database.ref().push({
        name: nameTrain,
        destination: destinationTrain,
        startTime: startTime,
        frequency: frequencyTrain,

    });

    console.log(nameTrain);
    console.log(destinationTrain);
    console.log(startTime);
    console.log(frequencyTrain);

    $("#name-input").val("");
    $("#destination-input").val("");
    $("#start-time-input").val("");
    $("#frequency-input").val("");
});

database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    nameTrain = childSnapshot.val().name;
    destinationTrain = childSnapshot.val().destination;
    startTime = childSnapshot.val().startTime;
    frequencyTrain = childSnapshot.val().frequency;

    console.log(nameTrain);
    console.log(destinationTrain);
    console.log(startTime);
    console.log(frequencyTrain);

    var firstTimeConvert = moment(startTime, "HH:mm").subtract(1, "years"); 
    console.log(firstTimeConvert);

    // Calculate the current time with MomentJS
    var currentTime = moment(); 
    console.log("Current time: " + moment(currentTime).format("HH:mm")); 

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConvert), "minutes"); 
    console.log("Time difference: " + diffTime);

    // The time in between
    var timeRemainder = diffTime % frequencyTrain;
    console.log(timeRemainder);

    // # minutes til the train arrives
    var minutesTillTrain = frequencyTrain - timeRemainder;
    console.log("Train arrives in " + minutesTillTrain + " minutes");

    // Next train
    var nextTrain = moment().add(minutesTillTrain, "minutes"); 
    var nextTrainConvert = moment(nextTrain).format("hh:mm a"); 
    console.log("Arrival Time: " + moment(nextTrain).format("HH:mm")); 

    // Add trains to the HTML table
    $("#train-table > tbody").prepend("<tr><td>" + nameTrain + "</td><td>" + destinationTrain +
        "</td><td>" + "Every " + frequencyTrain + " minutes" + "</td><td>" +
        nextTrainConvert + "</td><td>" + minutesTillTrain + "</td></tr>");
});