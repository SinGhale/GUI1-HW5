/*
 File: script.js
 Assignment: Scrabble Game
 Sindhuja Ghale, UMass Lowell Computer Science, Sindhuja_Ghale@student.uml.edu
 Copyright (c) 2023 by Sindhuja Ghale. All rights reserved. May be
 freely copied or excerpted for educational purposes with credit to the
 author.
 Updated by SG on June 30, 2023 at 7:00 PM
 Brief Overview: This is a Scrabble game using drag-and-drop. In the game, along with HTML and CSS, I worked with jQuery UI. This game is not fully functional like the way we play at home or online but it mostly serves the purposes given in the assignment rubrics.
 Sources of Help: w3school, Class Notes, GeeksforGeeks, and Stack Overflows. 
*/


$(window).on('load', function () {
	$(function () {
		// 1 = reg tile, 2 = double word score, 3 = double letter score
		const tileOrder = [1, 1, 2, 1, 1, 1, 3, 1, 3, 1, 1, 1, 2, 1, 1];

		// Build the board row with the correct images
		for (let i = 1; i < 16; i++) {
			var tileId = "";
			if (i < 10) {
				var tileId = "0" + i + "_tile";
			} else {
				var tileId = i + "_tile";
			}
			
			// Create image in tile
			switch (tileOrder[i - 1]) {
				case 1:	// Regular tile
					$("#board_row").append('<div id="' + tileId + '" class="boardTile reg"></div>')
					$("#" + tileId).append('<img src="graphics_data/Board_Tiles/reg.png" class="boardTileImg ireg" width=75 height=75>');
					break;
				
				case 2: // Double word score tile
					$("#board_row").append('<div id="' + tileId + '" class="boardTile dws"></div>')
					$("#" + tileId).append('<img src="graphics_data/Board_Tiles/dls.png" class="boardTileImg idws" width=75 height=75>');
					break;
				
				case 3: // Double letter score tile
					$("#board_row").append('<div id="' + tileId + '" class="boardTile dls"></div>')
					$("#" + tileId).append('<img src="graphics_data/Board_Tiles/dls.png" class="boardTileImg idls" width=75 height=75>');
					break;
			};
		}
		 
		// Position the board tiles in a row, all next to each other
		var position = $("#01_tile").position();
		for (let i = 1; i < 16; i++) {
			var tile = "";
			if (i < 10) {
				var tile = "0" + i + "_tile";
			} else {
				var tile = i + "_tile";
			}
			$("#" + tile).css({
				"top": position.top,
				"left": position.left,
			})
			position.left += 78;
		}
		
		// Prevent the individual tiles from being dragged around
		$(".boardTileImg").on('dragstart', function (event) { event.preventDefault(); });
	});


	$(function () {

		// Arrays to keep track of which pieces are on the board and on the dock
		const OnBoard = [];
		const onDock = ["piece1", "piece2", "piece3", "piece4", "piece5", "piece6", "piece7"];

		// Keep track of occupied tiles and which pieces occupy them
		const occTiles = ["-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1"];

		// The order of the tiles for calculating score
		const tileOrder = [1, 1, 2, 1, 1, 1, 3, 1, 3, 1, 1, 1, 2, 1, 1];

		var fullScore = 0;
		var gameOverStat = false;

		// Calculate available tiles
		$("#holder").droppable({
			drop: function (event, ui) {
				avilTiles();
			},
			out: function (event, ui) {
				avilTiles();
			}
		})

		$(".boardTile").droppable({
			// When a tile is dropped
			drop: function (event, ui) {
				// If a tile is occupied, dont accept another tile
				$(this).droppable('option', 'accept', ui.draggable);

				// Save the position of the dropped tile
				ui.draggable.position({ of: $(this) });

				// Add to onBoard array when dropped
				OnBoard.push($(ui.draggable).attr('id'));
				for (let i = 0; i < onDock.length; i++) {
					if (onDock[i] == $(ui.draggable).attr('id')) {
						onDock.splice(i, 1);
					}
				}

				// Add to array of occupied tiles
				var name = $(this).attr('id');
				var tileArrId = Number(name[0] + name[1]) - 1;
				occTiles[tileArrId] = $(ui.draggable).attr('id');

				// Calculate the score
				$("#Score").html("Score: " + fullScore + " + ( " + calcScore() + " )");

				// Update the avaivble tiles
				avilTiles();
			},

			//When a tile is taken out
			out: function (event, ui) {
				$(this).droppable('option', 'accept', '.gamePiece');

				// Add to onDock array when dropped
				onDock.push($(ui.draggable).attr('id'));
				for (let i = 0; i < OnBoard.length; i++) {
					if (OnBoard[i] == $(ui.draggable).attr('id')) {
						OnBoard.splice(i, 1);
					}
				}

				// Update the occTiles Array
				var name = $(this).attr('id');
				var tileArrId = Number(name[0] + name[1]) - 1;
				occTiles[tileArrId] = "-1";


				//Calculate the score
				$("#Score").html("Score: " + fullScore + " + ( " + calcScore() + " )");
				avilTiles();
			}
		});

		// For returning a string version of an id
		function tileIdHelper(ind) {
			var tmpId = "";
			if (ind > 9) {
				tmpId = ind;
			} else {
				tmpId = "0" + ind;
			}
			return tmpId;
		}

		// Find and set available tiles
		function avilTiles() {
			// Check if all the tiles are empty
			var allEmpty = true;
			for (let i = 0; i < occTiles.length - 1; i++) {
				if (occTiles[i] == "-1" && occTiles[i] == occTiles[i + 1]) {
					allEmpty = true;
				} else {
					allEmpty = false;
					break;
				}
			}
			
			// If all the tiles are empty, enable all droppables and set the border colors to green
			if (allEmpty == true) {
				$(".boardTile").css({
					"border-color": "greenyellow"
				});
				$(".boardTile").droppable("enable");
			} else {
				
				// If they aren't all empty, set all border colors to black and disable all tiles
				$(".boardTile").css({
					"border-color": "black"
				})
				$(".boardTile").droppable("disable");
				for (let i = 0; i < occTiles.length; i++) {
					// Variables for the tile ids of the current tile, previous tile, and next tile
					var avlTileIdL = "#" + tileIdHelper(i) + "_tile";
					var avlTileIdC = "#" + tileIdHelper(i + 1) + "_tile";
					var avlTileIdR = "#" + tileIdHelper(i + 2) + "_tile";

					// If there is a piece on a tile, then enable the droppable and change the border color
					if (occTiles[i] != "-1") {
						console.log(occTiles[i]);
						$(avlTileIdC).droppable("enable");
						$("#" + occTiles[i]).draggable("disable");

						// If the tile to the left is empty, then enable and change the color
						if (occTiles[i - 1] == "-1") {
							$(avlTileIdL).css({
								"border-color": "greenyellow"
							});
							$(avlTileIdL).droppable("enable");
							$("#" + occTiles[i]).draggable("enable");
						}
						
						// If the tile to the right is empty, then enable and change the colo
						if (occTiles[i + 1] == "-1") {
							$(avlTileIdR).css({
								"border-color": "greenyellow"
							});
							$(avlTileIdR).droppable("enable");
							$("#" + occTiles[i]).draggable("enable");
						}

					} else if (occTiles[i] == "-1") {
						if (occTiles[i - 1] == "-1" && occTiles[i + 1] == "-1") {
							$(avlTileIdC).css({
								"border-color": "black"
							})
						}
					}
				}
			}
		}

		// Calculate the score for the current word and display it
		function calcScore() {
			var curWord = "";
			var score = 0;
			for (let i = 0; i < occTiles.length; i++) {
				// If the tile is occupied and there is a tile either to the right or left of the current tile, add to the score (edge tiles are accounted for)
				if (occTiles[i] != "-1") {
					if ((occTiles[i + 1] != "-1" && occTiles[i + 1] != null) ||
						(occTiles[i - 1] != "-1" && occTiles[i - 1] != null)) {
						var nameTmp = $("#" + occTiles[i]).css("background-image");
						var name = nameTmp.substr(nameTmp.length - 7, 1);
						if (name == "k") {
							var name = " ";
						}
						switch (tileOrder[i]) {
							case 1:
								score += Number(gameBag.getPieceValue(name));
								break;
							// Double word Score
							case 2:
								score += (Number(gameBag.getPieceValue(name)) * 2);
								break;
							// Double letter Score
							case 3:
								score += (Number(gameBag.getPieceValue(name)) * 2);
								break;
						};
						// Adds to the current word string 
						curWord += name;
					}
				}
			}
			// Displays current word
			$("#currentWord").html("Current Word: " + curWord);
			return score;
		}

		//Button to save the current word to the score and redraw pieces
		$("#nextWordBtn").button();
		$("#nextWordBtn").click(function (e) {
			// Create a temporary array to store the current positions of the pieces on the board
			var tmpOnBoard = [];
			for (let j = 0; j < OnBoard.length; j++) {
				tmpOnBoard.push(OnBoard[j]);
			}
			
			// Calculate the score for the current word and update the total score
			fullScore += calcScore();
			$("#Score").html("Score: " + fullScore + " + ( " + calcScore() + " )");

			// Move the pieces back to the dock using jQuery simulate library and Calculate the position based on the difference between the current position and the original position
			for (let i = 0; i < tmpOnBoard.length; i++) {
				var pId = "#" + tmpOnBoard[i];
				var index = Number(tmpOnBoard[i].substr(5, 1)) - 1;
				var offset = $(pId).offset();
				var y = dockPos[index].top - offset.top;
				var x = dockPos[index].left - offset.left;
				$(pId).simulate("drag", {
					dx: x,
					dy: y
				});

				//Re-Rolls the piece
				var gamePieceLt = gameBag.drawPiece();
				if (gamePieceLt == " ") {
					var imgPath = 'url("graphics_data/Scrabble_Tiles/Scrabble_Tile_Blank.jpg")';
				} else if (gamePieceLt == "noPiece") {
					var imgPath = 'url("graphics_data/Scrabble_Tiles/Scrabble_Tile_NP.png")';
					$(pId).draggable("destory");
				} else {
					var imgPath = 'url("graphics_data/Scrabble_Tiles/Scrabble_Tile_' + gamePieceLt + '.jpg")';
				}
				$(pId).css({
					"background-image": imgPath,
				})
			}

			// Display the remaining pieces and check if the game can continue
			$("#remainTiles").html("Remaining Tiles: " + gameBag.getAmount());
			checkGameOver();
		});

		// Button to re-draw the tiles on the rack
		$("#reRollBtn").button();
		$("#reRollBtn").click(function (e) {

			// Iterate over each piece on the rack
			for (let i = 1; i < 8; i++) {
				var pieceId = "piece" + i;

				// Check if the piece is on the dock
				for (let j = 0; j < onDock.length; j++) {
					if (pieceId === onDock[j]) {
						// Re-draw a new piece from the game bag
						var btnPiece = gameBag.drawPiece();
						if (btnPiece == " ") {
							var imgPath = 'url("graphics_data/Scrabble_Tiles/Scrabble_Tile_Blank.jpg")';
						} else if (btnPiece == "noPiece") {
							var imgPath = 'url("graphics_data/Scrabble_Tiles/Scrabble_Tile_NP.png")';
							$(pieceId).draggable("destory");
						} else {
							var imgPath = 'url("graphics_data/Scrabble_Tiles/Scrabble_Tile_' + btnPiece + '.jpg")';
						}

						// Update the background image of the piece on the rack
						$("#" + pieceId).css({
							"background-image": imgPath,
						})
					}
				}
			}
			
			// Display the remaining tiles and check if the game is over
			$("#remainTiles").html("Remaining Tiles: " + gameBag.getAmount());
			checkGameOver();
		});

		// Check if the game is over and If it is, display the game over screen 
		function checkGameOver() {
			if (gameOverStat == false) {
				if (gameBag.getAmount() < 1) {
					$("#currentWord").hide();
					$("#Score").hide();
					$("#remainTiles").hide();
					$("#nextWordBtn").hide();
					$("#reRollBtn").hide();

					$("#gameOverInfo").show();
					$("#gameOverInfo").prepend('<p>GAME OVER!</p>');
					$("#gameOverInfo").prepend('<p>Final Score: ' + fullScore + '</p>');
					gameOverStat = true;
				}
			} else {
				gameOverStat = false;
			}
		}

		//Refreshes the page to restart the game
		$("#restartBtn").button();
		$("#restartBtn").click(function (e) {
			if (window.confirm("Are you sure you want to restart?")) {
				localStorage.clear();
				window.location.reload();
			}
		});

	});
});

