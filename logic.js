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

var initialname = "";
var initialmessage = "";
var currentName = initialname;
var currentMessage = initialmessage;
var username = "";
var ignore = false;
var name = "";

//When creating a New Chatroom
$("#SubmitNewChat").on("click", function(event){
  event.preventDefault;
  name = $("#GroupName").val().trim();
  database.ref(name+'/chat').set({
    LatestName: "",
    LatestMessage: ""
  })
  // database.ref(name+'/users').set({
  //   Users:""
  // })  
  $("#StartUp").remove();
  $("#Main").removeClass("hide");
  loadChat();
})
$("#SubmitExistingChat").on("click", function(event){
  event.preventDefault;
  name = $("#GroupName").val().trim();
  $("#StartUp").remove();
  $("#Main").removeClass("hide");
  loadChat();
})


// print initial values to chatbox or print new values to chatbox
function loadChat(){
  $("#ChatTitle").text("Chatroom: " + name);
  database.ref(name+'/chat').on("value", function(snapshot) {
    if (snapshot.child("LatestName").exists() && snapshot.child("LatestMessage").exists()){
      currentMessage = snapshot.val().LatestMessage;
      currentName = snapshot.val().LatestName;
      if (currentMessage != ""){
        $("#chatbox").append("<h3>" + currentName.toUpperCase() + ": " + currentMessage + "</h3>");      
      }
    }
    scrollSmoothToBottom("convo");
  }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
  database.ref(name+'/users').on("child_added", function(snapshot) {
    $("#UserList").append('<div class="row"><span class="glyphicon glyphicon-ok" style="font-size:12px;color:green"></span> '+ snapshot.val() + '</div>');
  }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  });  
}



$("#submit-message").on("click", function(event) {
  event.preventDefault();
  currentMessage = $("#message").val().trim();
  console.log(currentMessage);
  if(ignore == false){
    username = $("#name").val().trim()
    if(username === ""){
      alert("Username cannot be blank");
      return;
    }
    else{
      ignore = true;  
      database.ref(name+'/users').push(username);      
    }
  };
  $("#name-form").remove();
  $("#message").val("");
  database.ref(name+'/chat').set({
    LatestName: username,
    LatestMessage: currentMessage
  })
  $("#message").focus();
});


function scrollSmoothToBottom (id) {
   var div = document.getElementById(id);
   $('#' + id).animate({
      scrollTop: div.scrollHeight - div.clientHeight
   }, 500);
}