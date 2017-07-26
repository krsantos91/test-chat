// Initialize Firebase
// Make sure to match the configuration to the script version number in the HTML
// (Ex. 3.0 != 3.7.0)
  var config = {
    apiKey: "AIzaSyBswMwyD7IWpaSv2NuQD5uscHK4YeEjM8s",
    authDomain: "ks-firebase-app1.firebaseapp.com",
    databaseURL: "https://ks-firebase-app1.firebaseio.com",
    projectId: "ks-firebase-app1",
    storageBucket: "ks-firebase-app1.appspot.com",
    messagingSenderId: "1024949813364"
  };
  firebase.initializeApp(config);


// Assign the reference to the database to a variable named 'database'
var database = firebase.database();


// Initial Values
var initialname = "";
var initialmessage = "";
var currentName = initialname;
var currentMessage = initialmessage;

// --------------------------------------------------------------

// At the initial load and subsequent value changes, get a snapshot of the local data.
// This function allows you to update your page in real-time when the firebase database changes.
database.ref().on("value", function(snapshot) {

  // If Firebase has a highPrice and highBidder stored (first case)
  if (snapshot.child("name").exists() && snapshot.child("message").exists()) {

    // Set the local variables for highBidder equal to the stored values in firebase.
    // highPrice = ...
    // highBidder = ...
    currentMessage = snapshot.val().message;
    currentName = snapshot.val().name;


    // change the HTML to reflect the newly updated local values (most recent information from firebase)
    $("#chatbox").append("<h3>" + currentName + ": " + currentMessage + "</h3>");


  }

  // Else Firebase doesn't have a highPrice/highBidder, so use the initial local values.
  else {
    // Change the HTML to reflect the local value in firebase
    $("#chatbox").append("<h3>" + currentName + ": " + currentMessage + "</h3>");
  }


// If any errors are experienced, log them to console.
}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});

// --------------------------------------------------------------

// Whenever a user clicks the submit-bid button
$("#submit-message").on("click", function(event) {
  event.preventDefault();
  currentMessage = $("#message").val().trim();
  currentName = $("#name").val().trim();
  $("#message").val("");
  database.ref().set({
    name: currentName,
    message: currentMessage
  })
});