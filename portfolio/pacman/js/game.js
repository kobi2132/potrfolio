'use strict'
const WALL = '<img src="img/wall.jpg" />';
const FOOD = '<img src="img/food.png" />';
const EMPTY = '';
const SUPERֹֹ_FOOD = '<img src="img/powerfood.png" />';
const CHERRY = '<img src="img/superfood.png" />';


var gBoard;
var gGame = {
    score: 0,
    isOn: false
}
var foodCounter = 0
const foodSupply = 123
var gIntervalSuperFood

function init() {
    console.log('hello')
    gBoard = buildBoard()
    createPacman(gBoard);
    createGhosts(gBoard);
    printMat(gBoard, '.board-container');
    gGame.isOn = true;
    gIntervalSuperFood = setInterval(setSuperFood, 15000)
}

function buildBoard() {
    var SIZE = 15;
    var board = [];
    for (var i = 0; i < SIZE; i++) {
        board.push([]);
        for (var j = 0; j < SIZE; j++) {
            board[i][j] = FOOD;
            if (i === 0 || i === SIZE - 1 ||
                j === 0 || j === SIZE - 1 ||
                (j === 3 && i < 5 && i < SIZE - 2) ||
                (j === 11 && i < 5) ||
                (i === 4 && j > 4 && j < 10) ||
                (j === 3 && i > 9) ||
                (j === 11 && i > 9) ||
                (i === 10 && j > 4 && j < 10) ||
                (j === 4 && i > 5 && i < 9) ||
                (j === 10 && i > 5 && i < 9) ||
                (i === 8 && j > 4 && j < 10) ||
                (i === 6 && j > 4 && j < 7) ||
                (i === 6 && j > 7 && j < 10)) {
                board[i][j] = WALL;
            }
            if ((i === 1 && j === 1) ||
                (i === 1 && j === 13) ||
                (i === 13 && j === 13) ||
                (i === 13 && j === 1)) {
                board[i][j] = SUPERֹֹ_FOOD;
            }
        }
    }
    return board;
}

function setSuperFood() {
    var emptyCells = getEmptyCells(gBoard)
    var randCell = emptyCells[getRandomIntInt(0, emptyCells.length)]
    gBoard[randCell.i][randCell.j] = CHERRY
    renderCell(randCell, CHERRY)

}

function updateScore(diff) {
    gGame.score += diff;
    document.querySelector('h2 span').innerText = gGame.score
}

function gameOver() {
    console.log('Game Over');
    clearInterval(gIntervalSuperFood)
    gGame.isOn = false;
    clearInterval(gIntervalGhosts)
    document.querySelector('.modal').innerHTML = '<h2>GameOver</h2><h3>click here to restart the game</h3>'
    openModal()
}

function victorious() {
    console.log('Victorious');
    gGame.isOn = false;
    clearInterval(gIntervalGhosts)
    document.querySelector('.modal').innerHTML = '<h2>Victorious</h2><h3>click here to restart the game</h3>'
    openModal()
}

function restart() {
    closeModal();
    console.log(gGame)
    gGame.score = 0;
    document.querySelector('h2 span').innerText = gGame.score
    foodCounter = 0
    init();
}

function openModal() {
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'block';
}

function closeModal() {
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'none';
}



