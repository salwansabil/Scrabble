//File: script.js
//GUI Assignment: Scrabble
//Salwan Sabil, UMass Lowell Computer Science, salwan_sabil@student.uml.edu
//Copyright (c) 2025 by Salwan. All rights reserved. May be freely copied or
//excerpted for educational purposes with credit to the author.
//updated by SS on July 4, 2025 at 12:30 PM

$(document).ready(function () {
    let tilePool = [];
    const tileCount = 7;
    let placedTiles = [];

    $.getJSON("pieces.json", function (data) {
        const pieces = data.pieces;

        //load pool for distribution amount
        pieces.forEach(piece => {
            for (let i = 0; i < piece.amount; i++) {
                tilePool.push({
                    letter: piece.letter,
                    value: piece.value
                });
            }
        });

        generateTileRack();
    });

    //make 7 tiles and post them to rack
    function generateTileRack() {
        const $rack = $("#rack");
        $rack.empty();  //empty rack

        for (let i = 0; i < tileCount && tilePool.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * tilePool.length);
            const tile = tilePool.splice(randomIndex, 1)[0]; //remove from tile pool

            const $img = $("<img>")
                .attr("src", `images/Scrabble_Tiles/Scrabble_Tile_${tile.letter}.jpg`)
                .attr("alt", tile.letter)
                .attr("data-letter", tile.letter)
                .attr("data-value", tile.value)
                .addClass("tile")
                .draggable({
                    revert: "invalid",
                    containment: "#game-area",
                    stack: ".tile"
                });

            $rack.append($img);
        }
    }
    //jquery ui for drag and drop
    $(".board-square").droppable({
        accept: ".tile",
        drop: function (event, ui) {
            const $tile = ui.draggable;
            const letter = $tile.attr("data-letter");
            const value = parseInt($tile.attr("data-value"));
            const index = parseInt($(this).attr("data-index"));
            const bonus = $(this).attr("data-bonus");

            //lock in tile
            $(this).append($tile);
            $tile.css({ top: 0, left: 0, position: "relative" });
            $tile.draggable("disable");

            //store data
            placedTiles[index] = {
                letter: letter,
                value: value,
                bonus: bonus
            };

            console.log(`Placed ${letter} (value: ${value}) on square ${index} (${bonus})`);
            console.log(placedTiles);
        }
    });
    //score
    $("#calculateScore").click(function () {
        let baseScore = 0;
        let totalMultiplier = 1;

        for (let i = 0; i < placedTiles.length; i++) {
            const tile = placedTiles[i];

            if (!tile) continue;

            let { value, bonus } = tile;
            let tileScore = value;

        //letter score bonus
        if (bonus === "double-letter") {
            tileScore *= 2;
        } else if (bonus === "triple-letter") {
            tileScore *= 3;
        }

        baseScore += tileScore;

        //word score bonus
        if (bonus === "double-word") {
            totalMultiplier *= 2;
        } else if (bonus === "triple-word") {
            totalMultiplier *= 3;
        }
    }

        const finalScore = baseScore * totalMultiplier;

        $("#scoreDisplay").text(`Total Score: ${finalScore}`);
        console.log(`Base: ${baseScore}, Word Multiplier: x${totalMultiplier}`);
    });
    //reset board and bring back tiles to rack
    $("#resetBoard").click(function () {
        $(".board-square").each(function () {
        const $tile = $(this).find(".tile");
        if ($tile.length > 0) {
            $("#rack").append($tile);
            $tile.css({ top: 0, left: 0, position: "relative" });
            $tile.draggable("enable");
        }
    });

    placedTiles = [];
    $("#scoreDisplay").text("");
  });
    //new 7 tiles if user gets stuck
    $("#dealNewTiles").click(function () {
    //bring back current tiles
    $("#rack .tile").each(function () {
        const letter = $(this).attr("data-letter");
        const value = parseInt($(this).attr("data-value"));
        tilePool.push({ letter: letter, value: value });
    });

    generateTileRack(); //7 new tiles
});
});
