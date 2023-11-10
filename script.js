const Gameboard = (() => {
    let gameboardArr = [
        "b", "b", "b",
        "b", "b", "b",
        "b", "b", "b"
    ];

    const display = () => {
        let msg = "";
        for (let i = 0; i < gameboardArr.length; i++) {
            if (i % 3 === 0) msg += `\n`;
            msg += `${gameboardArr[i]} `;
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
    const player1 = Player("player one");
    marker2 = player1.getMarker() === "O" ? "X" : "O";
    const player2 = Player("player two", marker2);
    const players =
        [
            {
                name: player1.getName(),
                marker: player1.getMarker()
            },
            {
                name: player2.getName(),
                marker: player2.getMarker()
            }
        ];

    if (players[0].marker === "X") {
        currentPlayer = players[0];
        console.log(`${players[0].name}'s turn`);
    }
    else {
        currentPlayer = players[1];
        console.log(`${players[1].name}'s turn`);
    }

    const getCurrentPlayer = () => currentPlayer;

    const switchPlayerTurn = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
        console.log(`${getCurrentPlayer().name}'s turn`);
    }

    const placeMarker = (index) => {
        const board = Gameboard.getBoard();
        board.splice(index - 1, 1, getCurrentPlayer().marker);
        Gameboard.display();
        switchPlayerTurn();
    }

    return { getCurrentPlayer, placeMarker };
};

const game = Game();