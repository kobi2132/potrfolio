var WALL = 'WALL';
var FLOOR = 'FLOOR';
var BALL = 'BALL';
var GAMER = 'GAMER';
var GLUE = 'GLUE'

var GAMER_IMG = '<img src="img/gamer.png" />';
var BALL_IMG = '<img src="img/ball.png" />';
var GLUE_IMG = '<img src="img/glue.png" />';

var gBoard;
var gGamerPos;

var gBallsCollected
var gBallsAdded
var isGlued = false
var gIntervalBall = setInterval(setBalls, 4500)
var gIntervalGlue = setInterval(setGlue, 5000)

function initGame() {
	gGamerPos = { i: 2, j: 9 };
	gBallsCollected = 0
	gBallsAdded = 2
	isGlued = false
	gBoard = buildBoard();
	renderBoard(gBoard);
}

function restartGame() {
	var elBalls = document.querySelector('h3 snap')
	elBalls.innerText = gBallsCollected
	document.querySelector('.restart').classList.add('hide')
	initGame()
	var elBalls = document.querySelector('h3 snap')
	elBalls.innerText = gBallsCollected
	gIntervalBall = setInterval(setBalls, 4500)
	gIntervalGlue = setInterval(setGlue, 5000)
}

function buildBoard() {
	// Create the Matrix
	var board = createMat(11, 13)


	// Put FLOOR everywhere and WALL at edges
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			// Put FLOOR in a regular cell
			var cell = { type: FLOOR, gameElement: null };

			// Place Walls at edges
			if (i === 0 || i === board.length - 1 || j === 0 || j === board[0].length - 1) {
				cell.type = WALL;
			}

			// Add created cell to The game board
			board[i][j] = cell;
		}
	}
	var cell = { type: FLOOR, gameElement: null };
	board[0][6] = cell;
	board[10][6] = cell;
	board[5][0] = cell;
	board[5][12] = cell;

	// Place the gamer at selected position
	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

	// Place the Balls (currently randomly chosen positions)
	board[3][8].gameElement = BALL;
	board[7][4].gameElement = BALL;


	// console.log(board);
	return board;
}

function setBalls() {
	var emptyCells = getEmptyCells(gBoard)
	var randCell = emptyCells[getRandomInt(0, emptyCells.length)]
	var cell = gBoard[randCell.i][randCell.j]
	cell.gameElement = BALL;
	renderCell(randCell, BALL_IMG)
	gBallsAdded++
}

function setGlue() {
	var emptyCells = getEmptyCells(gBoard)
	var randCell = emptyCells[getRandomInt(0, emptyCells.length)]
	var cell = gBoard[randCell.i][randCell.j]
	cell.gameElement = GLUE;
	renderCell(randCell, GLUE_IMG)
	setTimeout(renderCell, 3000, randCell, null);
}

function getEmptyCells(board) {
	var emptyCells = []
	for (var i = 0; i < board.length; i++)
		for (var j = 0; j < board[0].length; j++) {
			var cell = board[i][j].gameElement
			if (!cell && board[i][j].type === 'FLOOR') {
				emptyCells.push({ i: i, j: j })
			}
		}
	return emptyCells
}


// Render the board to an HTML table
function renderBoard(board) {

	var strHTML = '';
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n';
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j];

			var cellClass = getClassName({ i: i, j: j })

			// TODO - change to short if statement
			if (currCell.type === FLOOR) cellClass += ' floor';
			else if (currCell.type === WALL) cellClass += ' wall';

			//TODO - Change To template string
			strHTML += '\t<td class="cell ' + cellClass +
				'"  onclick="moveTo(' + i + ',' + j + ')" >\n';

			// TODO - change to switch case statement
			if (currCell.gameElement === GAMER) {
				strHTML += GAMER_IMG;
			} else if (currCell.gameElement === BALL) {
				strHTML += BALL_IMG;
			}

			strHTML += '\t</td>\n';
		}
		strHTML += '</tr>\n';
	}

	// console.log('strHTML is:');
	// console.log(strHTML);
	var elBoard = document.querySelector('.board');
	elBoard.innerHTML = strHTML;
}

function finish() {
	clearInterval(gIntervalBall)
	clearInterval(gIntervalGlue)
	document.querySelector('.restart').classList.remove('hide')
	var elRestart = document.querySelector('.restart')
	elRestart.innerHTML = `YOU ARE THE BEST!<br> CLICK HERE TO RESTART THE GAME <button onclick="restartGame()"> restart</button>`

}

// Move the player to a specific location
function moveTo(i, j) {
	
	if (isGlued) return

	if (i === -1 || i === gBoard.length || j === -1 || j === gBoard[0].length) {
		console.log('hello');
		if (i === -1) {
			i = gBoard.length - 1
		}
		else if (i === gBoard.length) {
			i = 0
		}
		else if (j === -1) {
			j = gBoard[0].length - 1
		}
		else j = 0
	}

	var targetCell = gBoard[i][j];
	if (targetCell.type === WALL) return;

	// Calculate distance to make sure we are moving to a neighbor cell
	var iAbsDiff = Math.abs(i - gGamerPos.i);
	var jAbsDiff = Math.abs(j - gGamerPos.j);

	// If the clicked Cell is one of the four allowed
	if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0) || (i === gBoard.length - 1) || (j === gBoard[0].length - 1) || i === 0 || j === 0 ) {

		if (targetCell.gameElement === BALL) {
			gBallsCollected++
			playSound()
			console.log('Collecting!');
			var elBalls = document.querySelector('h3 snap')
			elBalls.innerText = gBallsCollected
			if (gBallsCollected === gBallsAdded) finish()
		}

		if (targetCell.gameElement === GLUE) {
			isGlued = !isGlued
			setTimeout(function () {
				isGlued = !isGlued
			}, 3000);
		}
		// MOVING from current position
		// Model:
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
		// Dom:
		renderCell(gGamerPos, '');

		// MOVING to selected position
		// Model:
		gGamerPos.i = i;
		gGamerPos.j = j;
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
		// DOM:
		renderCell(gGamerPos, GAMER_IMG);

	} // else console.log('TOO FAR', iAbsDiff, jAbsDiff);

}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
	var cellSelector = '.' + getClassName(location)
	var elCell = document.querySelector(cellSelector);
	elCell.innerHTML = value;
}

// Move the player by keyboard arrows
function handleKey(event) {

	var i = gGamerPos.i;
	var j = gGamerPos.j;


	switch (event.key) {
		case 'ArrowLeft':
			moveTo(i, j - 1);
			break;
		case 'ArrowRight':
			moveTo(i, j + 1);
			break;
		case 'ArrowUp':
			moveTo(i - 1, j);
			break;
		case 'ArrowDown':
			moveTo(i + 1, j);
			break;

	}

}

// Returns the class name for a specific cell
function getClassName(location) {
	var cellClass = 'cell-' + location.i + '-' + location.j;
	return cellClass;
}

function playSound() {
	var sound = new Audio("sound/pop.mp3")
	sound.play()
}
