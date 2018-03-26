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

// create dynamic variables to track firebase data
var playerName = noPlayer;
var gameWins = initialWins;
var gameLosses = initialLosses;
var rpsChoice = noChoice;


// -------------------------------------------------------------------------------------------------------------

database.ref().on("value", function(snapshot) {

    player1Name = snapshot.val().players.player1.name;
    $("#player1name").text(player1Name);
    
    player2Name = snapshot.val().players.player2.name;
    $("#player2name").text(player2Name);


}, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
});

// -------------------------------------------------------------------------------------------------------------
$(document).ready(function() {

    function gameAsPlayer1() {
        // add code here
        console.log("this is player 1")
        $("#top1").text("ROCK")
        $("#middle1").text("PAPER")
        $("#bottom1").text("SCISSORS")

    };

    function gameAsPlayer2() {
        // add code here
        console.log("this is player 2")
        $("#top2").text("ROCK")
        $("#middle2").text("PAPER")
        $("#bottom2").text("SCISSORS")

    };


    // Whenever a user clicks the Submit button
    $("#playerSubmit").on("click", function(event) {
        event.preventDefault();
        // change playerName to name submitted
        playerName = $("#enterName").val();
        console.log(playerName);
    
        if (player1Name === "Player 1") {
            player1Name = playerName;
            // Save player1 values to Firebase
            database.ref().set({
                players: {
                    player1: {
                        name: player1Name, 
                        wins: gameWins, 
                        losses: gameLosses, 
                        choice: rpsChoice
                    },
                    player2: {
                        name: player2Name, 
                        wins: gameWins, 
                        losses: gameLosses, 
                        choice: rpsChoice                    
                    }
                }
            });

            gameAsPlayer1();

        }else if (player2Name === "Player 2"){
            player2Name = playerName;
            // Save player2 values to Firebase
            database.ref().set({
                players: {
                    player1: {
                        name: player1Name, 
                        wins: gameWins, 
                        losses: gameLosses, 
                        choice: rpsChoice
                    },
                    player2: {
                        name: player2Name, 
                        wins: gameWins, 
                        losses: gameLosses, 
                        choice: rpsChoice                    
                    }
                }            
            });

            gameAsPlayer2();
        }else {
         alert("Two players already playing. Try again later.")   
        };
        
    });

    // Whenever a user refreshes or closes window tab
    window.onunload = function(){
        database.ref().set({
            // clear all firebase data
            // players: {
            //     player1: {
            //         name: player1Name, 
            //         wins: gameWins, 
            //         losses: gameLosses, 
            //         choice: rpsChoice
            //     },
            //     player2: {
            //         name: player2Name, 
            //         wins: gameWins, 
            //         losses: gameLosses, 
            //         choice: rpsChoice                    
            //     }
            // }            
        });       
    };

});

