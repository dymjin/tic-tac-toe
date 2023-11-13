const Gameboard = (() => {
    let gameboardArr = [
        ["b", "b", "b"],
        ["b", "b", "b"],
        ["b", "b", "b"]
    ];

    const display = () => {
        let msg = "";
        for (let i = 0; i < gameboardArr.length; i++) {
            for (let j = 0; j < gameboardArr[i].length; j++) {
                if (j % 3 === 0) msg += `\n`;
                msg += `${gameboardArr[i][j]} `;
            }
        }
        console.log(msg);
    }

    const getBoard = () => gameboardArr;

    return { display, getBoard };
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

const Game = () => {
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
        console.log(`${players[0].getName()}'s turn`);
    }
    else {
        currentPlayer = players[1];
        console.log(`${players[1].getName()}'s turn`);
    }

    const getCurrentPlayer = () => currentPlayer;

    const switchPlayerTurn = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
        console.log(`${getCurrentPlayer().getName()}'s turn`);
    }

    const checkBoard = (board) => {
        for (let x = 0; x < (board.length - 2); x++) {
            for (let y = 0; y < board.length; y++) {
                if (board[x][y] !== "b"
                    && board[x][y] === board[x + 1][y]
                    && board[x + 2][y] === board[x + 1][y]) {
                    return true;
                }
                else if (board[y][x] !== "b"
                    && board[y][x] === board[y][x + 1]
                    && board[y][x + 1] === board[y][x + 2]) {
                    return true;
                }
                else if (board[x][x] !== "b"
                    && board[x][x] === board[x + 1][x + 1]
                    && board[x + 1][x + 1] === board[x + 2][x + 2]) {
                    return true;
                }
                else if (board[x][x + 2] !== "b"
                    && board[x][x + 2] === board[x + 1][x + 1]
                    && board[x + 1][x + 1] === board[x + 2][x]) {
                    return true;
                }
            }
        }
        return false;
    }

    const endGame = () => {
        console.clear();
        console.log(Gameboard.display());
        console.log(`${getCurrentPlayer().getName()} won this round!`);
        getCurrentPlayer().updateScore();
    }

    const placeMarker = (x, y) => {
        const board = Gameboard.getBoard();
        if (x > board.length || y > board.length) {
            console.log('invalid move!');
            console.log(`${getCurrentPlayer().getName()}'s turn`);
        }
        else {
            if (board[x - 1][y - 1] !== "b") {
                console.log('marker already present!');
                console.log(`${getCurrentPlayer().getName()}'s turn`);
            } else {
                board[x - 1].splice(y - 1, 1, getCurrentPlayer().getMarker());
                Gameboard.display();
                moves.push(getCurrentPlayer().getMarker());
                switchPlayerTurn();
            }
        }
        if (moves.length >= 5 && checkBoard(board)) {
            endGame();
        }
    }

    return { getCurrentPlayer, placeMarker };
};

const game = Game();