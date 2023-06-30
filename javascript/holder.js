/*
 File: holder.js
 Assignment: Scrabble Game
 Sindhuja Ghale, UMass Lowell Computer Science, Sindhuja_Ghale@student.uml.edu
 Copyright (c) 2023 by Sindhuja Ghale. All rights reserved. May be
 freely copied or excerpted for educational purposes with credit to the
 author.
 Updated by SG on June 30, 2023 at 7:00 PM
 Brief Overview: This is a Scrabble game using drag-and-drop. In the game, along with HTML and CSS, I worked with jQuery UI. This game is not fully functional like the way we play at home or online but it mostly serves the purposes given in the assignment rubrics.
 Sources of Help: w3school, Class Notes, GeeksforGeeks, and Stack Overflows. 
*/

// Arrays to hold the original doc position and the last dropped postion of each piece
const dockPos = [];
const currentPos = [];
$(window).on('load', function () {
    // Create piece holder
    $("#pieces").append('<div id="pieceHolder"></div>');
    $("#pieceHolder").append('<img src="graphics_data/scrabble-tile-holder-406774_640.png" id="holder">');

    // Create pieces and set their positions 
    for (let i = 1; i < 8; i++) {
        var pieceId = "piece" + i;
        $("#pieceHolder").append('<div id="' + pieceId + '" class = gamePiece></div>');
    }
    var position = $("#holder").position();
    position.left += 45;

    //Set inital position and tile image 
    for (let i = 1; i < 8; i++) {
        var pieceId = "#piece" + i;

        var gamePieceLt = gameBag.drawPiece();
        if (gamePieceLt == " ") {
            var imgPath = 'url("graphics_data/Scrabble_Tiles/Scrabble_Tile_Blank.jpg")';
        } else if (gamePieceLt == "noPiece") {
            var imgPath = 'url("graphics_data/Scrabble_Tiles/Scrabble_Tile_NP.png")';
            $(pieceId).draggable("destory");
        } else {
            var imgPath = 'url("graphics_data/Scrabble_Tiles/Scrabble_Tile_' + gamePieceLt + '.jpg")';
        }

        $(pieceId).css({
            "top": position.top,
            "left": position.left,
            "background-image": imgPath,
            "background-size": "cover"

        })
        var position = $(pieceId).position();
        position.top = position.top;
        position.left += $(pieceId).width() + 5;
        var offset = $(pieceId).offset();
        dockPos.push(offset);
        currentPos.push(offset);
    }

    //Piece Holder droppable
    $(function () {
        $("#holder").droppable({
            drop: function (event, ui) {


            },

        });
    });
    //Pieces draggable
    $(function () {
        $(".gamePiece").draggable({
            snap: "#pieceHolder",
            snapMode: "inner",
            snapTolerance: 10,
            // Custom revert fucntion that uses jquery simulate to drag the piece back
            // to the last valid position the piece was in
            revert: function (valid) {
                var tmpNameT = String($(this).attr("id"));
                var indTmp = tmpNameT.slice(-1);
                var pPosTmp = $(this).offset();
                var pPosTmp2 = $(this).offset();
                if (!valid) {
                    setTimeout(() => { revertHelper(tmpNameT, indTmp, pPosTmp); }, 10);
                } else {
                    currentPos[indTmp - 1] = pPosTmp;
                }
            },
            //Saves the last valid piece position
            stop: function (event, ui) {
                var tmpNameT = String($(this).attr("id"));
                var indTmp = tmpNameT.slice(-1)
                var pPosTmp = $(this).offset();
            }

        });
    });

    // Used to move the piece 
    function revertHelper(name, index, curPos) {
        var tmpName = "#" + name;
        var ndy = currentPos[index - 1].top - curPos.top;
        var ndx = currentPos[index - 1].left - curPos.left;
        $(tmpName).simulate("drag", {
            dx: ndx,
            dy: ndy,
        });
    }

});