  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyBTC_DEy2hw-WLtbxgQOnLEVIVWKgV1ty4",
    authDomain: "rps-game-46a9a.firebaseapp.com",
    databaseURL: "https://rps-game-46a9a.firebaseio.com",
    projectId: "rps-game-46a9a",
    storageBucket: "",
    messagingSenderId: "412874592967",
    appId: "1:412874592967:web:5bec7f6ddb8e44f8"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // Create a variable to reference the database
  var database = firebase.database();

  // connectionsRef references a specific location in our database.
  // All of our connections will be stored in this directory.
  var connectionsRef = database.ref("/connections");

  // '.info/connected' is a special location provided by Firebase that is updated
  // every time the client's connection state changes.
  // '.info/connected' is a boolean value, true if the client is connected and false if they are not.
  var connectedRef = database.ref(".info/connected");
// When the client's connection state changes...
  connectedRef.on("value", function(snap) {

    // If they are connected..
    if (snap.val()) {
  
      // Add user to the connections list.
      var con = connectionsRef.push(true);
      // Add a variable to hold the game info
      var gg = database.ref("/gameInfo")

      // Remove user from the connection list and elete game info when someone disconnects.
      con.onDisconnect().remove();
      gg.onDisconnect().remove();
    }
  });

  var playerNumber = 0

  connectionsRef.on("value", function(snap) {
    if(playerNumber == 0){
    $("#playerNumber").text(snap.numChildren());
    playerNumber = snap.numChildren()
    console.log(playerNumber)
    }
    if(snap.numChildren() < 2){    
    $("#oppChoice").text("Waiting for an Opponent")
    }else{
    $("#oppChoice").text("Someone is rdy to rock lol, hit 'r', 'p', or 's'")
    }
  });

  var choices = ["r", "p", "s"];
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

  // When first loaded or when the connections list changes...
  connectionsRef.on("value", function(snap) {

    // Display the viewer count in the html.
    // The number of online users is the number of children in the connections list.
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
    console.log(playerNumber)
  });


  database.ref("/gameInfo").on("value", function(snapshot) {
    var p1c = snapshot.child("playerOneChoice").val()
    var p2c = snapshot.child("playerTwoChoice").val()


    // If Firebase has a highPrice and highBidder stored (first case)
    if (choices.includes(p1c) && choices.includes(p2c)){

      // Set the local variables for the player choices equal to the stored values in firebase.
        
        if ((p1c === "r" && p2c === "s") ||
        (p1c === "s" && p2c === "p") || 
        (p1c === "p" && p2c === "r")) {
            playerOneWins++;
            database.ref("/gameInfo").update({
                playerOneWins: playerOneWins,
                playerOneChoice: blank,
                playerTwoChoice: blank,
                    });
        } else if (snapshot.val().playerOneChoice === snapshot.val().playerTwoChoice) {
            ties++;
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
            database.ref("/gameInfo").update({
                playerTwoWins: playerTwoWins,
                playerOneChoice: blank,
                playerTwoChoice: blank,
            });
            if(playerNumber == 1){
                playerChoice = snapshot.val().playerOneChoice;
                oppChoice = snapshot.val().playerTwoChoice;
                wins = snapshot.val().playerOneWins;
                losses = snapshot.val().playerTwoWins;
                localTies = snapshot.val().ties;
                $("#wins").text(wins);
                $("#losses").text(losses);
                $("#ties").text(localTies);
            }else{
                playerChoice = snapshot.val().playerTwoChoice;
                oppChoice = snapshot.val().playerOneChoice;
                wins = snapshot.val().playerTwoWins;
                losses = snapshot.val().playerOneWins;
                localTies = snapshot.val().ties;
                $("#wins").text(wins);
                $("#losses").text(losses);
                $("#ties").text(localTies);
            }
        }
    }else if(choices.includes(p1c)) {
        if(playerNumber == 1){
            $("#choice").text(snapshot.val().playerOneChoice);
            $("#oppChoice").text("Waiting for Opponent to Choose");

      // Change the HTML to reflect the local value in firebase
        }else{
            $("#choice").text("Choose your Destiny!");
            $("#oppChoice").text("Your Opponent has Chosen!");
        }
    }else if(choices.includes(p2c)) {
        if(playerNumber == 2){
        $("#choice").text(snapshot.val().playerTwoChoice);
        $("#oppChoice").text("Waiting for Opponent to Choose");
        }
    }else if (connectedRef.numChildren > 1){
        $("#choice").text("Choose your Destiny!");
        $("#oppChoice").text("Waiting for Opponent to Choose");
    }

    // If any errors are experienced, log them to console.
  }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
  
document.onkeyup = function(event) {

    // Determines which key was pressed.
    var userGuess = event.key;
    
    // This logic determines the outcome of the game (win/loss/tie), and increments the appropriate number
    if ((userGuess === "r") || (userGuess === "p") || (userGuess === "s")) {


        // Save the new price in Firebase
        if(playerNumber == 1){
            database.ref("/gameInfo").update({
                playerOneChoice: userGuess,
                    });
                    }
        if(playerNumber == 2){
            database.ref("/gameInfo").update({
                playerTwoChoice: userGuess,
            });
        }
    }
}


        // Hide the directions

        // directionsText.textContent = "";