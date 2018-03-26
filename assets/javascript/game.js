  // Initialize Firebase Project RPS-2Player
  var config = {
    apiKey: "AIzaSyC3bCi2WAqY_aOTiJLVWtm5Em5J9Y-qGbQ",
    authDomain: "rps-2player-15dc1.firebaseapp.com",
    databaseURL: "https://rps-2player-15dc1.firebaseio.com",
    projectId: "rps-2player-15dc1",
    storageBucket: "rps-2player-15dc1.appspot.com",
    messagingSenderId: "1078100268931"
  };
  firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();

// create static variables to hold initial values
var noPlayer = "";

// create dynamic variables to track firebase data
var playerName = noPlayer;


// -------------------------------------------------------------------------------------------------------------

database.ref().on("value", function(snapshot) {

    console.log(snapshot.val());
    playerName = snapshot.val().player.name;
    console.log("playerName " + playerName);
    $("#player1name").text(playerName);

}, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
});

// -------------------------------------------------------------------------------------------------------------
$(document).ready(function() {

    // Whenever a user clicks the Submit button
    $("#playerSubmit").on("click", function(event) {
        event.preventDefault();
        // change playerName to name submitted
        playerName = $("#enterName").val();
        console.log(playerName);
    
        // Save new value to Firebase
        database.ref().set({
          player: {name: playerName}
        });
        
    });

});

