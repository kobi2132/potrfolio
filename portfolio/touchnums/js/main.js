var gNextNum = 1
var gBoard
var gNums = []


function initGame() {
    gNums = resetNums(5)
    shuffle(gNums)
gBoard = createBoard(5)

renderBoard(gBoard)
}


function createBoard(cellNumbers) {
    var board = [];
    for (var i = 0; i < cellNumbers; i++) {
        board.push([]);
        for (var j = 0; j < cellNumbers; j++) {
            board[i][j] = gNums.pop();
        }
    }
    return board;
}

function renderBoard(board) {
    var strHtml = '';
    
    for (var i = 0; i < board.length; i++) {
        strHtml += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            strHtml += `<td class="boardGame"
            data-i="${i}" data-j="${j}"
            onclick="cellClicked(this,${i},${j})"
            > ${cell} </td>`;
        }
        strHtml += '</tr>'
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHtml;
}




