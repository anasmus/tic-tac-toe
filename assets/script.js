const displayController = (function () {
    // DOM Elements
    const boardElement = document.querySelector('.board');

    function render(index={i: -1, j: -1}) {
        while (boardElement.firstChild) {
            boardElement.firstChild.remove();
        }
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const cellDiv = document.createElement('div');
                cellDiv.className = 'cell';
                const cellText = document.createElement('span');
                cellText.className = 'cell__text';
                if (i == index.i && j == index.j) cellText.classList.add('animate');
                cellText.innerText = gameBoard[i][j];
                cellDiv.appendChild(cellText);
                cellDiv.index = {i, j};
                cellDiv.addEventListener('click', gameController.userMove);
                boardElement.appendChild(cellDiv);
            }
        }
    }

    return { render };
}());

const gameController = (function() {
    function gameLoop() {
        const winner = checkWinner();
        if (winner) {
            declareWinner(winner);
            return;
        }
        toggleTurn();
        if (bot.isTurn) {
            setTimeout(botMove, 500);
        }
    }
    function toggleTurn() {
        user.isTurn = !user.isTurn;
        bot.isTurn = !bot.isTurn;
    }

    function playMove(player, index) {
        gameBoard[index.i][index.j] = player.symbol;
        displayController.render(index);
        gameLoop();
    }
    
    function userMove(e) {
        if (!user.isTurn) return;
        const selectedCell = e.target;
        if (selectedCell.firstChild.innerText) return;
        const index = selectedCell.index;
        playMove(user, index);
    }
    function botMove() {
        const index = {i: 2, j: 2};
        playMove(bot, index);
    }

    function checkWinner() {
        // checking for vertical and horizontal lines
        for (let i = 0; i < 3; i++) {
            if (gameBoard[i][0] == gameBoard[i][1] && gameBoard[i][1] == gameBoard[i][2] && gameBoard[i][2] !== '')
                return gameBoard[i][0];
            else if (gameBoard[0][i] == gameBoard[1][i] && gameBoard[1][i] == gameBoard[2][i] && gameBoard[2][i] !== '')
                return gameBoard[0][i];
        }
        // checking for diagonal lines
        if (gameBoard[0][0] == gameBoard[1][1] && gameBoard[1][1] == gameBoard[2][2] && gameBoard[2][2] !== '')
            return gameBoard[0][0];
        else if (gameBoard[0][2] == gameBoard[1][1] && gameBoard[1][1] == gameBoard[2][0] && gameBoard[2][0] !== '')
            return gameBoard[0][2];

        // checking for tie
        for (let row of gameBoard) {
            for (let cell of row) {
                if (cell === '') return;
            }
        }
        // means its a tie
        return 'XO';
    }

    function declareWinner(winner) {
        bot.isTurn = false;
        user.isTurn = false;
        const cases = {X: 'You Won!', O: 'You Lose!', XO: 'Its a Tie!'};
        document.querySelector('.modal__heading').innerText = cases[winner];
        setTimeout(() => {
            document.querySelector('.modal').showModal();
        }, 500);
    }

    return { userMove };
}());

function Player(symbol) {
    return {
        symbol,
        isTurn: symbol === 'X'
    }
}
function GameBoard() {
    return [['', '', ''], ['', '', ''], ['', '', '']];
}
function resetGame() {
    document.querySelector('.modal').close();
    user.isTurn = true;
    gameBoard = GameBoard();
    displayController.render();
}

const user = Player('X');
const bot = Player('O');
let gameBoard = GameBoard();
displayController.render();

