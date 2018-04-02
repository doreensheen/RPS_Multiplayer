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
var playerName = noPlayer;
var gameWins = initialWins;
var gameLosses = initialLosses;
var rpsChoice = noChoice;


// -------------------------------------------------------------------------------------------------------------

database.ref().on("value", function(snapshot) {

    player1Name = snapshot.val().players.player1.name;
    $("#player1name").text(player1Name);
    player1Choice = snapshot.val().players.player1.choice;
    
    player2Name = snapshot.val().players.player2.name;
    $("#player2name").text(player2Name);
    player2Choice = snapshot.val().players.player2.choice;

}, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
});

// -------------------------------------------------------------------------------------------------------------
$(document).ready(function() {

    function determineWinner() {
        
        if (player1Choice === player2Choice) {
            $("#gameWinner").text("Tie Game");
        } else if (player1Choice === "rock" && player2Choice === "paper") {
            $("#gameWinner").text(player2Name + " Wins")
        } else if (player1Choice === "rock" && player2Choice === "scissors") {
            $("#gameWinner").text(player1Name + " Wins")
        } else if (player1Choice === "paper" && player2Choice === "rock") {
            $("#gameWinner").text(player1Name + " Wins")
        } else if (player1Choice === "paper" && player2Choice === "scissors") {
            $("#gameWinner").text(player2Name + " Wins")
        } else if (player1Choice === "scissors" && player2Choice === "rock") {
            $("#gameWinner").text(player2Name + " Wins")
        } else if (player1Choice === "scissors" && player2Choice === "paper") {
            $("#gameWinner").text(player1Name + " Wins")
        }
        // reset player choices to null
        setTimeout(function() {
            player1Choice = "";
            database.ref("players/player1").update({ 
                choice: player1Choice
            });
            player2Choice = "";
            database.ref("players/player2").update({ 
                choice: player2Choice
            });
            $("#gameWinner").text("")
        }, 5000);
        console.log("new round")

    }

    function gameAsPlayer1() {

        
        database.ref("players/player2").on("child_changed", function(snap) {
            database.ref().on("value", function(snapshot) {
                console.log(snapshot.val())
                player1Name = snapshot.val().players.player1.name;
                $("#player1name").text(player1Name);
                player1Choice = snapshot.val().players.player1.choice;
                $("#middle1").text(player1Choice)
    
                
                player2Name = snapshot.val().players.player2.name;
                $("#player2name").text(player2Name);
                player2Choice = snapshot.val().players.player2.choice;
                $("#middle2").text(player2Choice)
            
                console.log("gameAsPlayer1 player2Name is " + player2Name + " and player1Choice is " + player1Choice)
                if (player2Name !== "Player 2" && player1Choice === "") {
                    $("#top1").text("ROCK")
                    $("#middle1").text("PAPER")
                    $("#bottom1").text("SCISSORS")
                    $("#gameNotifications").text("Your Turn...")
                }     
            }, function(errorObject) {
                console.log("The read failed: " + errorObject.code);
            });
    
        });

        $(".choiceButton").on("click", function() {
            var player1Choice = $(this).val();
            // update html with player 1 choice
            $("#top1").text("")
            $("#middle1").text(player1Choice)
            $("#bottom1").text("")
            $("#gameNotifications").text(player2Name + "'s Turn...")
            // Update firebase with player 1 choice
            database.ref("players/player1").update({
                choice: player1Choice
            });
            
            // event listener to trigger function determineWinner
            database.ref("players/player2").on("child_changed", function(snap) {
                database.ref().on("value", function(snapshot) {
                    player1Choice = snapshot.val().players.player1.choice;
                    var player2Choice = snap.val();
                    if (player2Choice !== "" && player1Choice !== "") {
                        $("#gameNotifications").text("")
                        if (player1Choice !== "" && player2Choice !== "") {
                            determineWinner();
                        // reminder: nothing placed after determineWinner here will run
                        }
                    }
                });
            
            });
        });
    };

    function gameAsPlayer2() {
        database.ref().on("value", function(snapshot) {
            player1Choice = snapshot.val().players.player1.choice;
            if (player1Choice === "") {
                $("#gamePlayerForm").text("");
                $("#gameNotifications").text(player1Name + "'s Turn...")
                $("#top2").text("")
                $("#middle2").text("")
                $("#bottom2").text("")
                $("#middle1").text("")
            }
        });

        database.ref("players/player1").on("child_changed", function(snap) {
            console.log("player 1 child changed")
            
            if (player1Choice !== "") {
                
                var player1Choice = snap.val();
                $("#gameNotifications").text("Your Turn...")
                $("#top2").text("ROCK")
                $("#middle2").text("PAPER")
                $("#bottom2").text("SCISSORS")
                
                $(".choiceButton").on("click", function() {
                    var player2Choice = $(this).val();
                    // update html with player 2 choice
                    $("#top2").text("")
                    $("#middle2").text(player2Choice)
                    $("#bottom2").text("")
                    
                    $("#middle1").text(player1Choice)
                    $("#gameNotifications").text("");
                    
                    // Update firebase with player 2 choice
                    database.ref("players/player2").update({
                        choice: player2Choice
                    });
                    
                    if (player1Choice !== "" && player2Choice !== "") {
                        determineWinner();
                        console.log(player1Choice + " vs " + player2Choice);
                    }
                    
                });
                
            };
        })

    }   


    // Whenever a user clicks the Submit button
    $("#playerSubmit").on("click", function(event) {
        event.preventDefault();
        // change playerName to name submitted
        playerName = $("#enterName").val();
    
        if (player1Name === "Player 1") {
            player1Name = playerName;
            // Save player1 values to Firebase
            database.ref().set({
                players: {
                    player1: {name: player1Name, wins: gameWins, losses: gameLosses, choice: rpsChoice},
                    player2: {name: player2Name, wins: gameWins, losses: gameLosses, choice: rpsChoice}
                }
            });
            $("#gamePlayerForm").text("");
            $("#gameNotifications").text("Waiting for a second player to join...")
            gameAsPlayer1();

        }else if (player2Name === "Player 2"){
            player2Name = playerName;
            // Save player2 values to Firebase
            database.ref().set({
                players: {
                    player1: {name: player1Name, wins: gameWins, losses: gameLosses, choice: rpsChoice},
                    player2: {name: player2Name, wins: gameWins, losses: gameLosses, choice: rpsChoice}
                }            
            });
            $("#gamePlayerForm").text("");
            $("#gameNotifications").text(player1Name + "'s Turn")

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