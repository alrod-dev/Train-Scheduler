

$(document).ready(function () {

// Initialize Firebase
    var config = {
        apiKey: "AIzaSyA2MvSMPQObWis89Hag77g73ZzjYQ_QnLI",
        authDomain: "train-schedule-69798.firebaseapp.com",
        databaseURL: "https://train-schedule-69798.firebaseio.com",
        projectId: "train-schedule-69798",
        storageBucket: "",
        messagingSenderId: "398170386058"
    };

    firebase.initializeApp(config);


    // Create a variable to reference the database

    var database = firebase.database();

    var trainName;
    var destination;
    var trainTime;
    var frequency;


    // Capture Button Click
    $("#add-user").on("click", function () {
        // Don't refresh the page!
        event.preventDefault();

        // YOUR TASK!!!

        trainName = $("#trainName-input").val().trim();
        destination = $("#destination-input").val().trim();
        trainTime = $("#timeTrain-input").val().trim();
        frequency = $("#frequency-input").val().trim();

        // Save new value to Firebase

        database.ref().push({
            trainName: trainName,
            destination: destination,
            trainTime: trainTime,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });

        // Code in the logic for storing and retrieving the most recent user.

        $("#trainName-display").html(trainName);
        $("#destination-display").html(destination);
        $("#trainTime-display").html(trainTime);
        $("#frequency-display").html(frequency);

    });



    // Create Firebase "watcher" Hint: .on("value")

    database.ref().on("value", function(snapshot) {

        //Console logs the value from the snapshot online
        console.log(snapshot);
        console.log(snapshot.val().trainName);
        console.log(snapshot.val().destination);
        console.log(snapshot.val().frequency);
        console.log(snapshot.val().trainTime);


        //
        $("#trainName-display").html(snapshot.val().trainName);
        $("#destination-display").html(snapshot.val().destination);
        $("#trainTime-display").html(snapshot.val().trainTime);
        $("#frequency-display").html(snapshot.val().frequency);

        //
        trainName = snapshot.val().trainName;
        destination = snapshot.val().destination;
        trainTime = snapshot.val().trainTime;
        frequency = snapshot.val().frequency;


        //Catches any errors
    }, function(errorObject) {

        //Logs into the console log
        console.log("The read failed: " + errorObject.code);
    });


    database.ref().on("child_added", function(childSnapshot) {


        var table = $("#tableBody");

        var tableRow = $("<tr>");

        var trainName = childSnapshot.val().trainName;
        var trainDestination = childSnapshot.val().destination;
        var trainFirstArrival = childSnapshot.val().trainTime;
        var trainFrequency = childSnapshot.val().frequency;


        var trainFirstArrivalAdjusted = moment(trainFirstArrival, "HH:mm").subtract(1, "year");


        // storing the hour value of first arrival in local variable \\
        var hourOfFirstArrival = moment(trainFirstArrival, "HH:mm").hour();

        // store curent time formated in military in variavle called now \\\
        var currentTime = moment();

        var currentHour = moment(currentTime, "HH:mm").hour();



        var diffTime = moment().diff(moment(trainFirstArrivalAdjusted), "minutes");
        var timeDifference = diffTime % trainFrequency; // minutes from last arrival
        var minutesTillArrival = trainFrequency - timeDifference; // minutes from last arrival


        // checking to see if minutes to next arrival is greater than 60 \\
        if (currentHour - hourOfFirstArrival < 0) {
            // for every additional hour over the first sixty minutes,
            // store that value in variable a1 \\
            var a1 = hourOfFirstArrival - currentHour;
            // converting hours to minutes \\
            minutesTillArrival = minutesTillArrival + (a1 * 60);
            // add extra time (in minutes) to current time (moment.js) to obtain value of next arrival\
            var nextTrain = moment().add(minutesTillArrival, "minutes");
            // formatting time to 12 hour standard \\
            var arrivaltime = moment(nextTrain).format("hh:mm a");

        } else {

            var nextTrain = moment().add(minutesTillArrival, "minutes");
            var arrivaltime = moment(nextTrain).format("hh:mm a");
        }

        table.append(tableRow);

        tableRow.append("<td>" + trainName  + "</td>");
        tableRow.append("<td>" + trainDestination + "</td>");
        tableRow.append("<td>" + trainFrequency + " minutes" + "</td>");
        tableRow.append("<td>" + arrivaltime + "</td>");
        tableRow.append("<td>" + minutesTillArrival + "</td>");

    }, function(errorObject) {

        //Logs into the console log
        console.log("The read failed: " + errorObject.code);

    });

    database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function (snapshot) {

        // Change the HTML to reflect
        $("#trainName-display").html("Train: " + snapshot.val().trainName);
        $("#destination-display").html("Destination: " + snapshot.val().destination);

        console.log(snapshot.val().trainTime);

        $("#timeTrain-display").html("First Train Time: " + moment(snapshot.val().trainTime, "hhm").format('LT'));
        $("#frequency-display").html("Frequency: " + snapshot.val().frequency + " minutes");
    });


});