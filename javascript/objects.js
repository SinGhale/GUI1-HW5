/*
 File: objects.js
 Assignment: Scrabble Game
 Sindhuja Ghale, UMass Lowell Computer Science, Sindhuja_Ghale@student.uml.edu
 Copyright (c) 2023 by Sindhuja Ghale. All rights reserved. May be
 freely copied or excerpted for educational purposes with credit to the
 author.
 Updated by SG on June 30, 2023 at 7:00 PM
 Brief Overview: This is a Scrabble game using drag-and-drop. In the game, along with HTML and CSS, I worked with jQuery UI. This game is not fully functional like the way we play at home or online but it mostly serves the purposes given in the assignment rubrics.
 Sources of Help: w3school, Class Notes, GeeksforGeeks, and Stack Overflows. 
*/

// Reads the JSON data and populates an array.
var gameBag = new Bag(); // Creates a new instance of the Bag class to represent the game bag
$.getJSON("graphics_data/pieces.json", function (bag) {
  // Retrieves the JSON data from the "pieces.json" file
  $.each(bag.pieces, function (pieces, values) {
    // Iterates over each "pieces" object in the JSON data
    gameBag.addPiece(values.letter, Number(values.value), Number(values.amount));
    // Adds a game piece to the game bag using the letter, value, and amount from the JSON data
  });
  gameBag.addPiece(" ", 0, 2);
  // Adds a blank game piece to the game bag with a value of 0 and an amount of 2
});

$(window).on('load', function () {
  // Executes the following code when the window has finished loading
});
