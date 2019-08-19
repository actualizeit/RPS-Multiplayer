var playerNumber = 0
var choices = ["Rock", "Paper", "Scissors"];
var playerChoice = ""
var oppChoice = ""
var wins = 0
var losses = 0 
var LocalTies = 0
var playerOneChoice = ""
var playerTwoChoice = ""
var blank = ""

var playerOneWins = 0
var playerTwoWins = 0
var ties = 0
var DBOutput = []

var firebaseConfig = {
  apiKey: "AIzaSyBTC_DEy2hw-WLtbxgQOnLEVIVWKgV1ty4",
  authDomain: "rps-game-46a9a.firebaseapp.com",
  databaseURL: "https://rps-game-46a9a.firebaseio.com",
  projectId: "rps-game-46a9a",
  storageBucket: "",
  messagingSenderId: "412874592967",
  appId: "1:412874592967:web:5bec7f6ddb8e44f8"
};

firebase.initializeApp(firebaseConfig);

var database = firebase.database();
var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");

connectedRef.on("value", function(snap) {
if (snap.val()) {
  var con = connectionsRef.push(true);
  var gg = database.ref("/gameInfo")
  con.onDisconnect().remove();
  gg.onDisconnect().remove();
}
});



connectionsRef.on("value", function(snap) {
  if(playerNumber == 0){
    $("#playerNumber").text(snap.numChildren());
    playerNumber = snap.numChildren()
  }
  if(snap.numChildren() < 2){    
    $("#oppChoice").text("Waiting for an Opponent")
  }else{
    $("#oppChoice").text("Someone is rdy to rock lol, click a button to make your choice!")
  }
});

connectionsRef.on("value", function(snap) {

  $("#connected").text(snap.numChildren());
    if(snap.numChildren() < 3){
      database.ref("/gameInfo").set({
        playerOneChoice: playerOneChoice,
        playerTwoChoice: playerTwoChoice,
        playerOneWins: playerOneWins,
        playerTwoWins: playerTwoWins,
        ties: ties,
      });
    }
});

database.ref("/gameInfo").on("value", function(snapshot) {
  var p1c = snapshot.child("playerOneChoice").val()
  var p2c = snapshot.child("playerTwoChoice").val()
  DBOutput = snapshot

  if (choices.includes(p1c) && choices.includes(p2c)){        
    if ((p1c === "Rock" && p2c === "Scissors") ||
    (p1c === "Scissors" && p2c === "Paper") || 
    (p1c === "Paper" && p2c === "Rock")) {
      playerOneWins++;
      $("#choice").text("Player One Chose " + snapshot.val().playerOneChoice + " and Player Two Chose " + snapshot.val().playerTwoChoice + ". Player One Wins!")
      $("#oppChoice").text("Make a another choice to play again!");
      database.ref("/gameInfo").update({
        playerOneWins: playerOneWins,
        playerOneChoice: blank,
        playerTwoChoice: blank,
      });
    } else if (snapshot.val().playerOneChoice === snapshot.val().playerTwoChoice) {
        ties++;
        $("#choice").text("Player One Chose " + snapshot.val().playerOneChoice + " and Player Two Chose " + snapshot.val().playerTwoChoice + ". It's a tie!")
        $("#oppChoice").text("Make a another choice to play again!");
        database.ref("/gameInfo").update({
          ties: ties,
          playerOneChoice: blank,
          playerTwoChoice: blank,
        });
        localTies = snapshot.val().ties;
        $("#wins").text(wins);
        $("#losses").text(losses);
        $("#ties").text(localTies);
    } else {
        playerTwoWins++;
        $("#choice").text("Player One Chose " + snapshot.val().playerOneChoice + " and Player Two Chose " + snapshot.val().playerTwoChoice + ". Player Two Wins!")
        $("#oppChoice").text("Make a another choice to play again!");
        database.ref("/gameInfo").update({
          playerTwoWins: playerTwoWins,
          playerOneChoice: blank,
          playerTwoChoice: blank,
        });
      }
  }else if(choices.includes(p1c)) {
    if(playerNumber == 1){
      $("#choice").text("You chose " + snapshot.val().playerOneChoice);
      $("#oppChoice").text("Waiting for Opponent to Choose");
        }else{
          $("#choice").text("Choose your Destiny!");
          $("#oppChoice").text("Your Opponent has Chosen!");
        }
  }else if(choices.includes(p2c)) {
    if(playerNumber == 2){
      $("#choice").text("You chose " + snapshot.val().playerTwoChoice);
      $("#oppChoice").text("Waiting for Opponent to Choose");
    }
  }else if (connectedRef.numChildren > 1){
    $("#choice").text("Choose your Destiny!");
    $("#oppChoice").text("Waiting for Opponent to Choose");
    $("#wins").text(wins);
    $("#losses").text(losses);
    $("#ties").text(localTies);
  }
  if(playerNumber == 1){
    playerChoice = snapshot.val().playerOneChoice;
    oppChoice = snapshot.val().playerTwoChoice;
    wins = snapshot.val().playerOneWins;
    losses = snapshot.val().playerTwoWins;
    localTies = snapshot.val().ties;
    $("#wins").text(wins);
    $("#losses").text(losses);
    $("#ties").text(localTies);
    }
  if(playerNumber == 2){
  playerChoice = snapshot.val().playerTwoChoice;
  oppChoice = snapshot.val().playerOneChoice;
  wins = snapshot.val().playerTwoWins;
  losses = snapshot.val().playerOneWins;
  localTies = snapshot.val().ties;
  $("#wins").text(wins);
  $("#losses").text(losses);
  $("#ties").text(localTies);
    }

}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});
  
function updateDB(){
  if(playerNumber == 1){
    database.ref("/gameInfo").update({
      playerOneChoice: playerChoice
    });
  }
  if(playerNumber == 2){
    database.ref("/gameInfo").update({
      playerTwoChoice: playerChoice,
    });
  }
}

$("#rock").on("click", function(){
  $("#directions").text("");
  if(playerNumber == 1){
    if (DBOutput.child("playerOneChoice").val() == ""){
    $("#choice").text("You chose Rock!");
    playerChoice = "Rock"
    updateDB()
    }else{
      $("#choice").text("No last minute switches brah! You chose " + DBOutput.child("playerOneChoice").val() + " already!")
      }
    }
    else{
    if (DBOutput.child("playerTwoChoice").val() == ""){
      $("#choice").text("You chose Rock!");
      playerChoice = "Rock"
      updateDB()
    }else{
        $("#choice").text("No last minute switches brah! You chose " + DBOutput.child("playerTwoChoice").val() + " already!");
      }
    }
})

$("#paper").on("click", function(){
  $("#directions").css("hide");
  if(playerNumber == 1){
    if (DBOutput.child("playerOneChoice").val() == ""){
    $("#choice").text("You chose Paper!");
    playerChoice = "Paper"
    updateDB()
    }else{
      $("#choice").text("No last minute switches brah! You chose " + DBOutput.child("playerOneChoice").val() + " already!")
      }
    }
    else{
    if (DBOutput.child("playerTwoChoice").val() == ""){
      $("#choice").text("You chose Paper!");
      playerChoice = "Paper"
      updateDB()
    }else{
        $("#choice").text("No last minute switches brah! You chose " + DBOutput.child("playerTwoChoice").val() + " already!");
      }
    }
})

$("#scissors").on("click", function(){
  $("#directions").text("");
  if(playerNumber == 1){
  if (DBOutput.child("playerOneChoice").val() == ""){
  $("#choice").text("You chose Scissors!");
  playerChoice = "Scissors"
  updateDB()
  }else{
    $("#choice").text("No last minute switches brah! You chose " + DBOutput.child("playerOneChoice").val() + " already!")
    }
  }
  else{
  if (DBOutput.child("playerTwoChoice").val() == ""){
    $("#choice").text("You chose Scissors!");
    playerChoice = "Scissors"
    updateDB()
  }else{
      $("#choice").text("No last minute switches brah! You chose " + DBOutput.child("playerTwoChoice").val() + " already!");
    }
  }
})