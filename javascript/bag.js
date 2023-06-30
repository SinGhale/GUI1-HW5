/*
 File: bag.js
 Assignment: Scrabble Game
 Sindhuja Ghale, UMass Lowell Computer Science, Sindhuja_Ghale@student.uml.edu
 Copyright (c) 2023 by Sindhuja Ghale. All rights reserved. May be
 freely copied or excerpted for educational purposes with credit to the
 author.
 Updated by SG on June 30, 2023 at 7:00 PM
 Brief Overview: This is a Scrabble game using drag-and-drop. In the game, along with HTML and CSS, I worked with jQuery UI. This game is not fully functional like the way we play at home or online but it mostly serves the purposes given in the assignment rubrics.
 Sources of Help: w3school, Class Notes, GeeksforGeeks, and Stack Overflows. 
*/

// Piece class representing a game piece.
class Piece {
    constructor(letter, value, amount) {
      this.letter = letter; // The letter of the piece
      this.value = value; // The value of the piece
      this.amount = amount; // The amount of pieces available
    }
  
    getLetter() {
      return this.letter; // Returns the letter of the piece
    }
  
    getValue() {
      return this.value; // Returns the value of the piece
    }
  
    getAmount() {
      return this.amount; // Returns the amount of pieces available
    }
  }
  
  //  Bag class representing a collection of game pieces.
  class Bag {
    // Each bag object holds two arrays (refArr and pBag) and a length (amount).
    constructor() {
      this.refArr = []; // An array to store references to all pieces
      this.pBag = []; // An array to store pieces in the bag
      this.amount = this.pBag.length; // The amount of pieces in the bag
    }
  
    getAmount() {
      this.amount = this.pBag.length; // Updates and returns the amount of pieces in the bag
      return this.amount;
    }
  
    // Adds a specified amount of pieces to the reference array and the pBag.
    addPiece(letter, value, amount) {
      this.refArr.push(new Piece(letter, value, amount)); // Adds a new piece reference to the reference array
      for (let i = 0; i < amount; i++) {
        this.pBag.push(new Piece(letter, value, amount)); // Adds multiple pieces to the bag based on the amount
      }
    }
  
    // Refreshes the pBag array by emptying it and refilling it based on the refArr.
    refillBag() {
      this.pBag = []; // Clears the bag
      for (let i = 0; i < this.refArr.length; i++) {
        for (let j = 0; j < this.refArr[i].getAmount(); j++) {
          const { letter, value, amount } = this.refArr[i];
          this.pBag.push(new Piece(letter, value, amount)); // Refills the bag with pieces based on the reference array
        }
      }
    }
  
    // Returns the value of a given game piece character.
    getPieceValue(letter) {
      for (let i = 0; i < this.refArr.length; i++) {
        if (letter === this.refArr[i].getLetter()) {
          return this.refArr[i].getValue(); // Returns the value of a piece based on its letter
        }
      }
    }
  
    // Draws a random game piece if available, otherwise returns 'noPiece'
    drawPiece() {
      if (this.pBag.length >= 0) {
          var draw = Math.round(Math.random() * ((this.pBag.length - 1) + 0) + 0);

          var letter = this.pBag[draw].getLetter();
          this.pBag.splice(draw, 1);

          return letter;
      } else {
          return "noPiece";
      }

  }
}
