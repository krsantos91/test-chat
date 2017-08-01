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
var ignore2 = false;
var name = "";
var sitekey = "";

//When creating a New Chatroom
$("#SubmitNewChat").on("click", function(event){
  event.preventDefault;
  name = $("#NewChat").val().trim();
  sitekey = keyGen();
  database.ref(sitekey+'/chat').set({
    LatestName: "",
    LatestMessage: "",
    Chatname: name
  })
  loadNewChat();
})
$("#SubmitExistingChat").on("click", function(event){
  event.preventDefault;
  sitekey = $("#ExistingChat").val().trim();
  loadExistingChat();
})

function loadNewChat(){
  $("#StartUp").remove();
  $("#Main").removeClass("hide");
  database.ref(sitekey+'/chat').on("value", function(snapshot) {
    if (snapshot.child("LatestName").exists() && snapshot.child("LatestMessage").exists()){
      $("#ChatTitle").text("Chatroom: " + snapshot.child("Chatname").val())
      $("#ChatTitle").append('<h5>The sitekey for this chat is: <strong>' + sitekey +'</strong></h5>')
      currentMessage = snapshot.val().LatestMessage;
      currentName = snapshot.val().LatestName;
      if (currentMessage != ""){
        $("#chatbox").append("<h4>" + currentName.toUpperCase() + ": " + currentMessage + "</h4>");      
      }
    }
    scrollSmoothToBottom("chatbox");
  }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
  database.ref(sitekey+'/users').on("child_added", function(snapshot) {
    $("#UserList").append('<div class="row"><span class="glyphicon glyphicon-ok" style="font-size:12px;color:green"></span> '+ snapshot.val() + '</div>');
  }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  });  
}

function loadExistingChat(){
  database.ref(sitekey).on("value",function(snapshot){
    if(snapshot.exists() === false){
      alert("This chatroom doesn't exist. Please try again");
      $("#ExistingChat").val("");
      $("#ExistingChat").focus();
    }
    else{
      if (ignore2 === false){
        loadNewChat();        
      }
      ignore2 = true;
    };
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
      database.ref(sitekey+'/users').push(username);      
    }
  };
  $("#name-form").remove();
  $("#message").val("");
  database.ref(sitekey+'/chat').set({
    LatestName: username,
    LatestMessage: currentMessage,
    Chatname:name
  })
  $("#message").focus();
});


function scrollSmoothToBottom (id) {
   var div = document.getElementById(id);
   $('#' + id).animate({
      scrollTop: div.scrollHeight - div.clientHeight
   }, 500);
}

//keygen File
function keyGen(){
  var length = 10;
  var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  var key = '';
  for (let i = 0; i < length; i++) {
      key += chars[Math.floor(Math.random() * chars.length)];
  }
  console.log(chars);
  return key;
}