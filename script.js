const Gameboard = (() => {
    let gameboardArr = [[], [], []];
    for (let j = 0; j < gameboardArr.length;) {
        for (let i = 0; i < 9; i++) {
            if (i % 3 !== 0) {
                gameboardArr[j - 1].push(document.querySelectorAll(".container>div")[i]);
            } else {
                j++;
                gameboardArr[j - 1].push(document.querySelectorAll(".container>div")[i]);
            }
        }
    }
    const getBoard = () => gameboardArr;

    return { getBoard };
})();

function Player(name, marker) {
    let score = 0;
    if (!marker) {
        marker = Math.round(Math.random()) ? "O" : "X";
    }

    const updateScore = () => score++;
    const getScore = () => score;

    const getMarker = () => marker;
    const getName = () => name;

    return { getName, getMarker, updateScore, getScore };
}

const DOMDisplay = (() => {
    const board = Gameboard.getBoard();
    const updateDisplay = (div, marker) => {
        if (marker === "O") div.textContent = "circle";
        else div.textContent = "close";
    }

    const clearDisplay = () => {
        board.forEach(arr => {
            arr.forEach(div => div.addEventListener('click', () => {
                div.textContent = "";
            }))
        })
    }

    return { updateDisplay, clearDisplay };
})();

const Game = (() => {
    const board = Gameboard.getBoard();
    let currentPlayer;
    let marker2;
    let moves = [];

    const player1 = Player("player one");
    marker2 = player1.getMarker() === "O" ? "X" : "O";
    const player2 = Player("player two", marker2);
    const players =
        [
            player1,
            player2
        ];
    if (players[0].getMarker() === "X") {
        currentPlayer = players[0];
    }
    else {
        currentPlayer = players[1];
    }

    const getCurrentPlayer = () => currentPlayer;

    const switchPlayerTurn = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    }

    const checkBoard = (board) => {
        for (let x = 0; x < (board.length - 2); x++) {
            for (let y = 0; y < board.length; y++) {
                if (board[x][y].textContent !== ""
                    && board[x][y].textContent === board[x + 1][y].textContent
                    && board[x + 2][y].textContent === board[x + 1][y].textContent) {
                    return true;
                }
                else if (board[y][x].textContent !== ""
                    && board[y][x].textContent === board[y][x + 1].textContent
                    && board[y][x + 1].textContent === board[y][x + 2].textContent) {
                    return true;
                }
                else if (board[x][x].textContent !== ""
                    && board[x][x].textContent === board[x + 1][x + 1].textContent
                    && board[x + 1][x + 1].textContent === board[x + 2][x + 2].textContent) {
                    return true;
                }
                else if (board[x][x + 2].textContent !== ""
                    && board[x][x + 2].textContent === board[x + 1][x + 1].textContent
                    && board[x + 1][x + 1].textContent === board[x + 2][x].textContent) {
                    return true;
                }
            }
        }
        return false;
    }

    const endGame = () => {
        controller.abort();
        getCurrentPlayer().updateScore();
    }
    
    //https://developer.mozilla.org/en-US/docs/Web/API/AbortController
    //https://stackoverflow.com/questions/3723914/remove-eventlistener-in-javascript-after-event-occurred#:~:text=For%20those%20who%20needs%20to%20remove%20after%20a%20certain%20condition%20(or%20even%20inside%20a%20loop%20too)%2C%20one%20alternative%20is%20using%20AbortController%20and%20AbortSignal%3A
    const controller = new AbortController();
    const placeMarker = () => {
        board.forEach(arr => arr.forEach(div => {
            checkMoves = (div) => {
                return { div };
            }
            div.addEventListener('click', () => {
                checkMoves.div = div;
                if (div.textContent !== "") { }
                else {
                    DOMDisplay.updateDisplay(div, getCurrentPlayer().getMarker());
                    moves.push(getCurrentPlayer().getMarker());
                    if (moves.length >= 5 && checkBoard(board)) {
                        endGame();
                    }
                    switchPlayerTurn();
                }
            }, { signal: controller.signal });
        }));
    }
    placeMarker();
})();