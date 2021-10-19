'use strict'
const MINE = '<img src="img/mine.png" />';
const FLAG = '<img src="img/flag.png" />';
const EMPTY = ' ';
const PLAY_MODE = '😀';
const WIN_MODE = '🏆';
const LOSE_MODE = '😭';

var gBoard;
var gGame = {
    markedCount: 0,
    shownCount: 0,
    secsPassed: 0,
    isOn: false,
    isLose: false,
    isTimerOn: false
};
var gLevel = {
    size: 4,
    mines: 2
};
var arr = []
var gTimer
function chooseLevel(boardSize, minesNum) {
    gLevel.size = boardSize;
    gLevel.mines = minesNum;
    restartGame();
};

function initGame() {
    gBoard = buildBoard(gLevel.size);
    printMat(gBoard, '.board-container');

}

function buildBoard(size) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board.push([]);
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                isShown: false,
                isMine: false,
                isMarked: false,
                isChecked: false,
                minesAroundCount: 0
            }
        }
    }
    var elMinesCount = document.getElementById(`minesNum`);
    elMinesCount.innerText = gLevel.mines;
    var elPlayMode = document.getElementById(`smily`);
    elPlayMode.innerText = PLAY_MODE;
    var elTimer = document.getElementById(`timer`)
    elTimer.innerText = gGame.secsPassed

    return board;
}

function cellClicked(elCell) {
    var currCell = getCellCoord(elCell.id)
    if (gGame.isLose) return;
    if (gBoard[currCell.i][currCell.j].isShown || gBoard[currCell.i][currCell.j].isMarked) return
    gBoard[currCell.i][currCell.j].isShown = true
    gGame.shownCount++
    elCell.classList.add('selected');
    
    if (gGame.isOn) {
        return cellClickedGame(elCell, currCell.i, currCell.j)
    }
    gGame.isOn = true
    setMines(gLevel.mines);
    setMinesNegsCount(gBoard);
    cellClickedGame(elCell, currCell.i, currCell.j);
}

function cellClickedGame(elCell, i, j) {
    if (gBoard[i][j].isMine) {
        elCell.classList.add('mineSelected')
        return gameOver(false);
    }
    if (!gBoard[i][j].isMine && !gBoard[i][j].isMarked && gBoard[i][j].minesAroundCount === 0) return expandShown(gBoard, i, j);
    elCell.innerText = gBoard[i][j].minesAroundCount;
    checkGameOver()
}

function setMines(minesNum) {
    var emptyCells = getEmptyCells(gBoard)
    emptyCells = shuffle(emptyCells)
    for (var i = 0; i < minesNum; i++) {
        var randCell = emptyCells.pop()
        gBoard[randCell.i][randCell.j].isMine = true
    }
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            var minesCount = countMinesAround(board, i, j)
            board[i][j].minesAroundCount = minesCount
        }
    }
}

function countMinesAround(mat, rowIdx, colIdx) {
    var count = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > mat[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var cell = mat[i][j].isMine;
            if (cell) count++
        }
    }
    return count
}
function checkGameOver() {
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            if (gBoard[i][j].isMarked && gBoard[i][j].isMine) continue;
            if (gBoard[i][j].isMarked && !gBoard[i][j].isMine) return alert('sorry but one of your Flags is in the WRONG SPOT!');
            if (!gBoard[i][j].isShown) return;
        }
    }
    return gameOver(true)
}

function gameOver(isWin) {
    if (isWin) {
        var elPlayMode = document.getElementById(`smily`);
        elPlayMode.innerText = WIN_MODE;
    }
    else {
        gGame.isLose = true
        var elPlayMode = document.getElementById(`smily`);
        elPlayMode.innerText = LOSE_MODE;

        for (var i = 0; i < gLevel.size; i++) {
            for (var j = 0; j < gLevel.size; j++) {
                if (gBoard[i][j].isMine) {
                    renderCell({ i: i, j: j }, MINE);
                    var elCell = document.querySelector(`.cell${i}-${j}`)
                    elCell.classList.add('selected');
                }
            }
        }
    }
    clearInterval(gTimer)
}

function restartGame() {
    gGame.isOn = false;
    gGame.isLose = false;
    gGame.isTimerOn = false;
    gGame.markedCount = 0;
    gGame.shownCount = 0;
    gGame.secsPassed = 0;
    clearInterval(gTimer)
    return initGame()
}

function expandShown(board, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board[0].length - 1 || board[i][j].isShown) continue;
            if (i === rowIdx && j === colIdx) continue;
            board[i][j].isShown = true;
            gGame.shownCount++
            var elCell = document.querySelector(`.cell${i}-${j}`)
            if (board[i][j].minesAroundCount > 0) elCell.innerText = board[i][j].minesAroundCount;
            elCell.classList.add('selected');
            if (board[i][j].minesAroundCount === 0 && arr.includes({ i: i, j: j }) === false && !board[i][j].isChecked) {
                arr.push({ i: i, j: j })
            }
        }
    }
    board[rowIdx][colIdx].isChecked = true
    if (arr.length === 0) return
    var cell = arr.pop()
    var nRowIdx = cell.i
    var nColIdx = cell.j
    expandShown(board, nRowIdx, nColIdx)
}

function mouseClick(event) {
    if (event.button !== 2 && event.button !== 0) return
    if (!gGame.isTimerOn) {
        gGame.isTimerOn = true;
        gTimer = setInterval(function () {
            gGame.secsPassed++
            var elTimer = document.getElementById(`timer`)
            elTimer.innerText = gGame.secsPassed
        }, 1000);
    }
    if (event.button === 2) return setFlag(event);
}

function setFlag(event) {
    if (gGame.isLose) return;
    var cell = event.path[0].id;
    if (cell === '') cell = event.path[1].id;

    var elCell = getCellCoord(cell);
    if (gBoard[elCell.i][elCell.j].isShown) return;

    var elMinesCount = document.getElementById(`minesNum`)
    if (!gBoard[elCell.i][elCell.j].isMarked) {
        if (gLevel.mines - gGame.markedCount === 0) return;
        gBoard[elCell.i][elCell.j].isMarked = true;
        gGame.markedCount++;
        elMinesCount.innerText = gLevel.mines - gGame.markedCount;
        renderCell(elCell, FLAG);
    }
    else {
        gBoard[elCell.i][elCell.j].isMarked = false;
        gGame.markedCount--
        elMinesCount.innerText = gLevel.mines - gGame.markedCount;
        renderCell(elCell, EMPTY);
    }
    if (gLevel.mines - gGame.markedCount === 0) {
        checkGameOver()
    }
}

window.addEventListener('contextmenu', function (e) {
    e.preventDefault();
}, false);