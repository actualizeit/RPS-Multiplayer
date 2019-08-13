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

  //Initial Values
  var playerOneChoice = ""
  var playerTwoChoice = ""
  var choices = ["r", "p", "s"];