$(document).ready(function () {
    if (!$.fn.draggable) {
        console.error("jQuery UI not loaded! Make sure you included jQuery UI in your HTML.");
        return;
    }

    $(".puzzle-piece").draggable({
        revert: "invalid",
        containment: "body"
    });

    $(".drop-zone").droppable({
        accept: ".puzzle-piece",
        drop: function (event, ui) {
            let droppedText = ui.draggable.text().trim();
            $(this).text(droppedText);
            ui.draggable.draggable("disable").hide();
        }
    });
});


// For word puzzle logic
$(function() {
    let correctWords = ["生", "日", "快", "乐", "umur", "bijak", "kaya", "cantik", "slay"];
    let shuffledWords = [...correctWords].sort(() => Math.random() - 0.5);

    shuffledWords.forEach((word, index) => {
        $("#puzzleContainer").append(`<div class='puzzle-piece' id='piece${index}'>${word}</div>`);
    });

    $(".puzzle-piece").draggable({
        revert: "invalid",
        containment: "body"
    });

    $(".drop-zone").each(function(index) {
        $(this).droppable({
            accept: ".puzzle-piece",
            drop: function(event, ui) {
                let droppedText = ui.draggable.text().trim();
                if (droppedText === correctWords[index]) {
                    $(this).text(droppedText);
                    ui.draggable.draggable("disable").hide();
                    checkWordPuzzle();
                } else {
                    $("#wrongMessage").fadeIn().delay(1000).fadeOut();
                    ui.draggable.draggable("option", "revert", true);
                }
            }
        });
    });
});

function checkWordPuzzle() {
    let correctWords = ["生", "日", "快", "乐", "umur", "bijak", "kaya", "cantik", "slay"];
    let isCorrect = $(".drop-zone").toArray().every((el, i) => $(el).text().trim() === correctWords[i]);

    if (isCorrect) {
        confetti();
        setTimeout(() => window.location.href = "page2.html", 2000);
    }
}

function checkTextAnswers() {
    let correctAnswers = {
        word1: "temen",
        word2: "random",
        word3: "marco"
    };

    let isCorrect = true;

    Object.keys(correctAnswers).forEach(id => {
        let inputField = $(`#${id}`);
        let userAnswer = inputField.val().trim().toLowerCase();
        let correctAnswer = correctAnswers[id];

        if (userAnswer === correctAnswer) {
            inputField.removeClass("wrong-answer");
        } else {
            inputField.addClass("wrong-answer"); // Highlight wrong inputs
            isCorrect = false;
        }
    });

    if (isCorrect) {
        confetti();
        setTimeout(() => window.location.href = "page3.html", 2000);
    } else {
        $("#wrongMessageText").fadeIn().delay(1500).fadeOut();
    }
}

$(document).ready(function () {
    const imageUrl = "feli.png"; // The only image used
    const pieceBank = $("#pieceBank");
    const container = $("#imagePuzzleContainer");

    const totalPieces = 9; // Change as needed
    let rows, cols, pieceWidth, pieceHeight;

    // Load the image to get original dimensions
    let img = new Image();
    img.src = imageUrl;
    img.onload = function () {
        let originalWidth = img.naturalWidth;
        let originalHeight = img.naturalHeight;

        // Reduce image size by 90% (only 10% of original)
        let imgWidth = originalWidth * 0.4;
        let imgHeight = originalHeight * 0.4;

        // Determine best grid layout
        rows = Math.round(Math.sqrt(totalPieces * (imgHeight / imgWidth)));
        cols = Math.ceil(totalPieces / rows);

        // Set puzzle grid size
        container.css({
            "grid-template-columns": `repeat(${cols}, 1fr)`,
            "width": imgWidth,
            "height": imgHeight
        });

        pieceWidth = imgWidth / cols;
        pieceHeight = imgHeight / rows;

        generatePuzzle(rows, cols, pieceWidth, pieceHeight, imgWidth, imgHeight);
    };

    function generatePuzzle(rows, cols, pieceWidth, pieceHeight, imgWidth, imgHeight) {
        let pieces = [];

        // Create puzzle slots
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                let slot = $("<div></div>")
                    .addClass("puzzle-slot")
                    .css({
                        width: pieceWidth,
                        height: pieceHeight
                    })
                    .attr("data-index", row * cols + col);

                container.append(slot);
            }
        }

        // Create puzzle pieces (cut from the original image)
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                let piece = $("<div></div>")
                    .addClass("puzzle-piece")
                    .css({
                        width: pieceWidth,
                        height: pieceHeight,
                        "background-image": `url(${imageUrl})`,
                        "background-size": `${imgWidth}px ${imgHeight}px`, // Scale background to match the puzzle
                        "background-position": `-${col * pieceWidth}px -${row * pieceHeight}px`
                    })
                    .attr("data-index", row * cols + col);

                pieces.push(piece);
            }
        }

        // Shuffle pieces randomly
        pieces = pieces.sort(() => Math.random() - 0.5);
        pieces.forEach(piece => pieceBank.append(piece));

        // Enable dragging
        $(".puzzle-piece").draggable({
            revert: "invalid",
            stack: ".puzzle-piece",
        });

        // Make slots droppable (only accept correct piece)
        $(".puzzle-slot").droppable({
            accept: function (draggable) {
                return $(this).attr("data-index") === $(draggable).attr("data-index");
            },
            drop: function (event, ui) {
                let droppedOn = $(this);
                let dragged = $(ui.draggable);

                dragged.detach().css({
                    top: 0,
                    left: 0,
                    position: "relative"
                }).appendTo(droppedOn);
            }
        });

        // Check if puzzle is solved
        $("#submitButton").click(function () {
            let isCorrect = $(".puzzle-slot").toArray().every((slot) =>
                $(slot).children().attr("data-index") == $(slot).attr("data-index")
            );

            if (isCorrect) {
                confetti();
                alert("🎉 You solved the puzzle!");
                window.location.href = "page4.html"; // Redirect to page4.html
            } else {
                $("#wrongMessage").fadeIn().delay(1000).fadeOut();
            }
        });
    }
});


function checkFinalAnswers() {
    let correctAnswers = {
        word1: "tidur",
        word2: "alpha",
        word3: "jay son",
        word4: "tom yum"
    };

    let isCorrect = Object.keys(correctAnswers).every(id => {
        let inputElement = $(`#${id}`);
        if (inputElement.length === 0) return false; // Ensure element exists

        let userInput = inputElement.val().trim().toLowerCase();
        let correctAnswer = correctAnswers[id].toLowerCase();

        return userInput === correctAnswer;
    });

    if (isCorrect) {
        confetti();
        setTimeout(() => {
            window.location.href = "final.html";
        }, 2000);
    } else {
        $("#wrongMessageFinal").stop(true, true).fadeIn().delay(1000).fadeOut();
    }
}

