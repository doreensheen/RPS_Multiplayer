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
var initialWins = 0;
var initialLosses = 0;
var noChoice = "";

var player1Name = "Player 1";
var player2Name = "Player 2";
var player1Choice;
var player2Choice;

// create dynamic variables to track firebase data
var name = noPlayer;
var wins = initialWins;
var losses = initialLosses;
var choice = noChoice;


// -------------------------------------------------------------------------------------------------------------

database.ref().on("value", function(snapshot) {
    // var allInfo = snapshot.val()
    snapshot.forEach(function(child) {
        var name = child.val().players.player1.name;
        console.log(name)
        $("#player1name").text(name);
    });

}, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
});

// -------------------------------------------------------------------------------------------------------------
$(document).ready(function() {

    function populateChoices() {

    }

    function gameAsPlayer1() {
        $("#gamePlayerForm").text("");
        $("#top1").text("ROCK")
        $("#middle1").text("PAPER")
        $("#bottom1").text("SCISSORS")
    };

    function gameAsPlayer2() {
        $("#gamePlayerForm").text("");
        $("#top2").text("ROCK")
        $("#middle2").text("PAPER")
        $("#bottom2").text("SCISSORS")
    };

    // Whenever a user refreshes or closes window tab
    function playerExit() {
        window.onunload = function(){
            database.ref().set({
                // reset all firebase data
                
            });       
        };
    };

// -------------------------------------------------------------------------------------------------------------
    // Whenever a user clicks the Submit button
    $("#playerSubmit").on("click", function(event) {
        event.preventDefault();
        // change playerName to name submitted
        name = $("#enterName").val();
    
        if (player1Name === "Player 1") {
            player1Name = name;
            // Save player1 values to Firebase
            database.ref().push({
                players: {
                    player1: {name: name, wins: wins, losses: losses, choice: choice},
                }
            });
            gameAsPlayer1();

        }else if (player2Name === "Player 2"){
            player2Name = name;
            // Save player2 values to Firebase
            database.ref().push({
                players: {
                    player2: {name: name, wins: wins, losses: losses, choice: choice},
                }            
            });
            gameAsPlayer2();

        }else {
         alert("Two players already playing. Try again later.")   
        };
        
    });







});
