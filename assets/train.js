$(document).ready(function () {
  //add firebase
  var config = {
    apiKey: "AIzaSyCqExyVWIg2WZ1EarCt7rkqZpDskDSwHSA",
    authDomain: "funproject-e5474.firebaseapp.com",
    databaseURL: "https://funproject-e5474.firebaseio.com",
    projectId: "funproject-e5474",
    storageBucket: "funproject-e5474.appspot.com",
    messagingSenderId: "502860653161"
  };
  firebase.initializeApp(config);
  //data base var
  var database = firebase.database();
  //convert for train time
  //var currentTime = moment();
  //console.log("Current Time: " + currentTime);

  //funtion section

  // click button
  $("#submit").on("click", function () {

    //add values in html
    var name = $('#nameInput').val().trim();
    var dest = $('#destInput').val().trim();
    var time = $('#timeInput').val().trim();
    var freq = $('#freqInput').val().trim();

    // add push to fire-database
    database.ref().push({
      name: name,
      dest: dest,
      time: time,
      freq: freq,
      timeAdded: firebase.database.ServerValue.TIMESTAMP
    });
    // no refresh input
    $("input").val('');
    return false;
  });

  //make on click child add function
  database.ref().on("child_added", function (childSnapshot) {
      // console.log(childSnapshot.val());
      var name = childSnapshot.val().name;
      var dest = childSnapshot.val().dest;
      var time = childSnapshot.val().time;
      var freq = childSnapshot.val().freq;

      console.log("Name: " + name);
      console.log("Destination: " + dest);
      console.log("Time: " + time);
      console.log("Frequency: " + freq);
      //console.log(moment().format("HH:mm"));

      //train time formula
      var freq = parseInt(freq);
      //current time
      var currentTime = moment();
      console.log("CURRENT TIME: " + moment().format('HH:mm'));


      var dConverted = moment(childSnapshot.val().time, 'HH:mm').subtract(1, 'years');
      console.log("DATE CONVERTED: " + dConverted);
      var trainTime = moment(dConverted).format('HH:mm');
      console.log("TRAIN TIME : " + trainTime);

      //difference in times
      var tConverted = moment(trainTime, 'HH:mm').subtract(1, 'years');
      var tDifference = moment().diff(moment(tConverted), 'minutes');
      console.log("DIFFERENCE IN TIME: " + tDifference);
      //modulo 
      var tRemainder = tDifference % freq;
      console.log("TIME REMAINING: " + tRemainder);
      //mins until next train
      var minsAway = freq - tRemainder;
      console.log("MINUTES UNTIL NEXT TRAIN: " + minsAway);
      //next time
      var nextTrain = moment().add(minsAway, 'minutes');
      console.log("ARRIVAL TIME: " + moment(nextTrain).format('HH:mm A'));


      //table

      //appened to table
      $('#currentTime').text(currentTime);
      $('#trainTable').append(
        "<tr><td id='nameDisplay'>" + childSnapshot.val().name +
        "</td><td id='destDisplay'>" + childSnapshot.val().dest +
        "</td><td id='freqDisplay'>" + childSnapshot.val().freq +
        "</td><td id='nextDisplay'>" + moment(nextTrain).format("HH:mm") +
        "</td><td id='awayDisplay'>" + minsAway + ' minutes until arrival' + "</td></tr>");
    },

    function (errorObject) {
      console.log("Read failed: " + errorObject.code)
    });

  // database.ref().orderByChild("timeAdded").limitToLast(1).on("child_added", function(snapshot){
  //     // Change the HTML to reflect
  //     $("#nameDisplay").html(snapshot.val().name);
  //     $("#destDisplay").html(snapshot.val().dest);
  //     $("#timeDisplay").html(snapshot.val().time);
  //     $("#freqDisplay").html(snapshot.val().freq);
  // })

}); //END DOCUMENT.READY