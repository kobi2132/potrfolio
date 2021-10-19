'use strict'
var PACMAN = '<img id="pacman" src="img/pacman.png" />';

var gPacman;
function createPacman(board) {
    gPacman = {
        location: {
            i: 9,
            j: 7
        },
        isSuper: false
    }
    board[gPacman.location.i][gPacman.location.j] = PACMAN
}
function movePacman(ev) {

    if (!gGame.isOn) return;
    // console.log('ev', ev);
    var nextLocation = getNextLocation(ev)

    if (!nextLocation) return;
    // console.log('nextLocation', nextLocation);

    var nextCell = gBoard[nextLocation.i][nextLocation.j]
    // console.log('NEXT CELL', nextCell);

    if (nextCell === WALL) return;
    else if (nextCell === GHOST) {
        if (!gPacman.isSuper) {
            gameOver();
            renderCell(gPacman.location, EMPTY)
            return;
        } else {
            removeGhost(nextLocation)
        }
    }
    else if (nextCell === FOOD) {
        updateScore(1);
        foodCounter++
    }
    else if (nextCell === CHERRY) updateScore(10);
    else if (nextCell === SUPERֹֹ_FOOD) {
        updateScore(1)
        gPacman.isSuper = true
        setTimeout(function () {
            gPacman.isSuper = false
            resetGhost()
        }, 5000);
    }


    if (foodCounter === foodSupply) victorious();

    // update the model
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY;

    // update the dom
    renderCell(gPacman.location, EMPTY);

    gPacman.location = nextLocation;

    // update the model
    gBoard[gPacman.location.i][gPacman.location.j] = PACMAN;
    // update the dom
    renderCell(gPacman.location, PACMAN);


}


function getNextLocation(eventKeyboard) {
    var nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j
    }
    switch (eventKeyboard.code) {
        case 'ArrowUp': {
            // document.querySelector("#pacman").style.transform="rotate(270deg)"
            PACMAN = '<img style=transform:rotate(270deg) src="img/pacman.png" />'
            nextLocation.i--;
        } break;
        case 'ArrowDown': {
            PACMAN = '<img style=transform:rotate(90deg) src="img/pacman.png" />'
            nextLocation.i++;
        } break;
        case 'ArrowLeft': {
            PACMAN = '<img style=transform:rotate(180deg) src="img/pacman.png" />'
            nextLocation.j--;
        } break;
        case 'ArrowRight': {
            PACMAN = '<img style=transform:rotate(0deg) src="img/pacman.png" />'
            nextLocation.j++;
        } break;
        default:
            return null;
    }
    return nextLocation;
}