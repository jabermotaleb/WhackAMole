var score = 0;
var timeLeft = 30;
var gameRunning = false;
var moleTimeout = null;
var timerInterval = null;
var currentMole = -1;

function startGame() {
    score = 0;
    timeLeft = 30;
    gameRunning = true;

    document.getElementById('score').textContent = score;
    document.getElementById('timer').textContent = timeLeft;
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('gameOver').style.display = 'none';

    for (var i = 0; i < 9; i++) {
        document.getElementById('mole' + i).classList.remove('visible');
    }

    showMole();

    timerInterval = setInterval(function () {
        timeLeft--;
        document.getElementById('timer').textContent = timeLeft;
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function showMole() {
    if (!gameRunning) return;

    if (currentMole !== -1) {
        document.getElementById('mole' + currentMole).classList.remove('visible');
    }

    var randomHole = Math.floor(Math.random() * 9);
    currentMole = randomHole;
    document.getElementById('mole' + randomHole).classList.add('visible');

    moleTimeout = setTimeout(function () {
        showMole();
    }, 1000);
}

function whack(holeId) {
    if (!gameRunning) return;
    if (holeId !== currentMole) return;

    score++;
    document.getElementById('score').textContent = score;
    document.getElementById('mole' + holeId).classList.remove('visible');
    currentMole = -1;

    clearTimeout(moleTimeout);
    showMole();
}

function endGame() {
    gameRunning = false;
    clearTimeout(moleTimeout);
    clearInterval(timerInterval);

    for (var i = 0; i < 9; i++) {
        document.getElementById('mole' + i).classList.remove('visible');
    }

    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOver').style.display = 'block';
    document.getElementById('startBtn').style.display = 'inline-block';
}
