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
    const setName = (newName) => {
        name = newName;
    }

    return { getName, getMarker, setName, updateScore, getScore };
}

const DOMDisplay = (() => {
    const board = Gameboard.getBoard();
    const updateDisplay = (div, marker) => {
        if (marker === "O") div.textContent = "circle";
        else div.textContent = "close";
    }

    const clearDisplay = () => {
        board.forEach(arr => {
            arr.forEach(div => {
                div.textContent = "";
            });
        });
    }

    return { updateDisplay, clearDisplay };
})();

const Game = (() => {
    const board = Gameboard.getBoard();
    let gameActive = true;
    let currentPlayer;
    let marker2;
    let moves = [];
    let players = [];
    const startBtn = document.querySelector('button.start');
    const restartBtn = document.querySelector('button.restart');
    const input1 = document.querySelector('input[id="player1"]');
    const input2 = document.querySelector('input[id="player2"]');

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
    //https://developer.mozilla.org/en-US/docs/Web/API/AbortController
    //https://stackoverflow.com/questions/3723914/remove-eventlistener-in-javascript-after-event-occurred#:~:text=For%20those%20who%20needs%20to%20remove%20after%20a%20certain%20condition%20(or%20even%20inside%20a%20loop%20too)%2C%20one%20alternative%20is%20using%20AbortController%20and%20AbortSignal%3A
    // const controller = new AbortController();
    const endGame = () => {
        // controller.abort();
        gameActive = false;
        getCurrentPlayer().updateScore();
        const winMsg = document.createElement('div');
        winMsg.textContent = `${currentPlayer.getName()} wins!`;
        winMsg.classList.add('win');
        document.querySelector(".container").appendChild(winMsg);
    }

    const init = () => {
        board.forEach(arr => arr.forEach(div => {
            div.addEventListener('click', () => {
                placeMarker(div);
            });
        }));
        input1.addEventListener('change', () => {
            players[0].setName(input1.value);
        });
        input2.addEventListener('change', () => {
            players[1].setName(input2.value);
        });
    }

    const placeMarker = (div) => {
        if (input1.value === "" || input2.value === "") {
            input1.value === "" ? input1.focus() : input2.focus();
        } else {
            if (gameActive) {
                if (div.textContent !== "") { }
                else {
                    DOMDisplay.updateDisplay(div, getCurrentPlayer().getMarker());
                    moves.push(getCurrentPlayer().getMarker());
                    if (moves.length >= 5 && checkBoard(board)) {
                        endGame();
                    }
                    switchPlayerTurn();
                }
            }
            input1.disabled = true;
            input2.disabled = true;
        }

        // board.forEach(arr => arr.forEach(div => {
        //     div.addEventListener('click', () => {

        // }/*{signal: controller.signal} */);
        // }));
    }

    const startGame = () => {
        const player1 = Player(input1.value);
        marker2 = player1.getMarker() === "O" ? "X" : "O";
        const player2 = Player(input2.value, marker2);
        players.push(player1, player2);
        if (players[0].getMarker() === "X") {
            currentPlayer = players[0];
        }
        else {
            currentPlayer = players[1];
        }
    }

    startBtn.addEventListener('click', () => {
        if (input1.value === "" || input2.value === "") {
            input1.value === "" ? input1.focus() : input2.focus();
        } else {
            startBtn.disabled = true;
            input1.disabled = true;
            input2.disabled = true;
            init();
            startGame();
        }
    });

    restartBtn.addEventListener('click', () => {
        DOMDisplay.clearDisplay();
        input1.disabled = false;
        input2.disabled = false;
        input1.value = "Player one";
        input2.value = "Player two";
        moves = [];
        players = [];
        startGame();
        gameActive = true;
        if (document.querySelector(".container").lastChild === document.querySelector(".win")) {
            document.querySelector('.container').removeChild(document.querySelector(".win"));
        }
    });
})();