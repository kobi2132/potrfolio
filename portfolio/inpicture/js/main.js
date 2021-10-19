var gQuests = [
    { id: 1, opts: ['France', 'Poland'], correctOptIdx: 0 },
    { id: 2, opts: ['Greece', 'Brazil'], correctOptIdx: 1 },
    { id: 3, opts: ['Japan', 'China'], correctOptIdx: 1 },
    { id: 4, opts: ['New York', 'UK'], correctOptIdx: 0 }
]
var gCurrQuestIdx = 0

function initGame() {
    renderQuest()

}

function renderQuest() {
    var strHtml = `<div class="img"><img src="img/${gCurrQuestIdx + 1}.jpg" width="500" height="350"></div>`
    for (var i = 0; i < 2; i++) {
        strHtml += `<div class= "answer" onclick="checkAnswer(${i})" >${gQuests[gCurrQuestIdx].opts[i]}</div>`
    }
    var elQuest = document.querySelector('.gameBack')
    elQuest.innerHTML = strHtml
}

function checkAnswer(optIdx) {
    var strHtml = ``
    var elQuest = document.querySelector('.gameBack')
    if (optIdx === gQuests[gCurrQuestIdx].correctOptIdx) {
        gCurrQuestIdx++
        if (gCurrQuestIdx === 4) {
            strHtml = `<div class="img"><img src="img/win.jpg" width="500" height="350"></div>
            <div class= "finish" onclick="initGame()">YOU ARE A WINNER BABY! <br> Click here to restart the game</div>`
            elQuest.innerHTML = strHtml
            gCurrQuestIdx = 0
        }
        else renderQuest()
    }
}


