'use strict'
function printMat(mat, selector) {
  var strHTML = '<table border="0"><tbody>';
  for (var i = 0; i < mat.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < mat[0].length; j++) {
      var tdId = `cell-${i}-${j}`;
      var className = 'cell cell' + i + '-' + j;
      strHTML += '<td id=' + tdId + ' class="' + className + '" onclick="cellClicked(this)" onmousedown ="mouseClick(event)"></td>'
    }
    strHTML += '</tr>'
  }
  strHTML += '</tbody></table>';
  var elContainer = document.querySelector(selector);
  elContainer.innerHTML = strHTML;
}

function getCellCoord(strCellId) {
  var parts = strCellId.split('-')
  var coord = { i: +parts[1], j: +parts[2] };
  return coord;
}

// location such as: {i: 2, j: 7}
function renderCell(location, value) {
  // Select the elCell and set the value
  var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
  elCell.innerHTML = value;
}

function getRandomIntInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getEmptyCells(board) {
  var emptyCells = []
  for (var i = 0; i < board.length; i++)
    for (var j = 0; j < board[0].length; j++) {
      if (board[i][j].isShown === false) {
        emptyCells.push({ i: i, j: j })
      }
    }
  return emptyCells
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  // while (color === '#000000')
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 14)];
  }
  return color;
}

function shuffle(items) {
  var randIdx, keep, i;
  for (i = items.length - 1; i > 0; i--) {
      randIdx = getRandomIntInt(0, items.length - 1);

      keep = items[i];
      items[i] = items[randIdx];
      items[randIdx] = keep;
  }
  return items;
}