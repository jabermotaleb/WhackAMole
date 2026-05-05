var score = 0;
var timeLeft = 30;
var gameRunning = false;
var moleTimeout = null;
var timerInterval = null;
var currentMole = -1;

function startGame() {
    // Reset everything
    score = 0;
    timeLeft = 30;
    gameRunning = true;

    document.getElementById('score').textContent = score;
    document.getElementById('timer').textContent = timeLeft;
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('gameOver').style.display = 'none';

    // Hide all moles
    for (var i = 0; i < 9; i++) {
        document.getElementById('mole' + i).classList.remove('visible');
    }

    // Start showing moles
    showMole();

    // Start countdown
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

    // Hide previous mole
    if (currentMole !== -1) {
        document.getElementById('mole' + currentMole).classList.remove('visible');
    }

    // Pick a random hole
    var randomHole = Math.floor(Math.random() * 9);
    currentMole = randomHole;

    // Show the mole
    document.getElementById('mole' + randomHole).classList.add('visible');

    // Hide it after 1 second and show next one
    moleTimeout = setTimeout(function () {
        showMole();
    }, 1000);
}

function whack(holeId) {
    if (!gameRunning) return;
    if (holeId !== currentMole) return;

    // Add a point
    score++;
    document.getElementById('score').textContent = score;

    // Hide the mole immediately
    document.getElementById('mole' + holeId).classList.remove('visible');
    currentMole = -1;

    // Show next mole right away
    clearTimeout(moleTimeout);
    showMole();
}

function endGame() {
    gameRunning = false;

    clearTimeout(moleTimeout);
    clearInterval(timerInterval);

    // Hide all moles
    for (var i = 0; i < 9; i++) {
        document.getElementById('mole' + i).classList.remove('visible');
    }

    // Show game over
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOver').style.display = 'block';
    document.getElementById('startBtn').style.display = 'inline-block';
}
