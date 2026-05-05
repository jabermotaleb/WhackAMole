let score = 0, timeLeft = 30, gameRunning = false;
let moleTimer = null, countdownTimer = null;
let difficulty = 'easy';
let level = 1, whacks = 0;

const diffSettings = {
    easy:   { minTime: 1000, maxTime: 1800, showTime: 900 },
    medium: { minTime: 700,  maxTime: 1300, showTime: 650 },
    hard:   { minTime: 450,  maxTime: 900,  showTime: 450 }
};

function setDiff(d, btn) {
    if (gameRunning) return;
    difficulty = d;
    document.querySelectorAll('#diffBtns .btn').forEach(b => {
        b.classList.remove('active','btn-success','btn-warning','btn-danger');
        b.classList.add(b.dataset.color || 'btn-outline-secondary');
    });
    btn.classList.add('active');
}

function startGame() {
    if (gameRunning) return;
    score = 0; timeLeft = 30; level = 1; whacks = 0;
    gameRunning = true;
    updateDisplay();
    document.getElementById('startBtn').disabled = true;
    document.getElementById('timeDisplay').classList.remove('urgent');
    spawnMole();
    countdownTimer = setInterval(() => {
        timeLeft--;
        document.getElementById('timeDisplay').textContent = timeLeft;
        if (timeLeft <= 10) document.getElementById('timeDisplay').classList.add('urgent');
        if (timeLeft <= 0) endGame();
    }, 1000);
}

function spawnMole() {
    if (!gameRunning) return;
    const settings = diffSettings[difficulty];
    const holes = document.querySelectorAll('.mole');
    const idx = Math.floor(Math.random() * 9);
    const mole = holes[idx];
    const hole = mole.parentElement;

    if (mole.classList.contains('up')) {
        scheduleNext(settings); return;
    }

    mole.textContent = randomMole();
    mole.classList.add('up');
    mole.onclick = (e) => whackMole(e, mole, hole);

    const showTime = settings.showTime - (level * 30);
    setTimeout(() => {
        if (mole.classList.contains('up') && !mole.classList.contains('whacked')) {
            mole.classList.remove('up');
            mole.onclick = null;
        }
    }, Math.max(showTime, 300));

    scheduleNext(settings);
}

function scheduleNext(settings) {
    const delay = Math.random() * (settings.maxTime - settings.minTime) + settings.minTime;
    moleTimer = setTimeout(spawnMole, delay - (level * 20));
}

function randomMole() {
    const moles = ['🐹','🐹','🐹','🐹','💣'];
    return moles[Math.floor(Math.random() * moles.length)];
}

function whackMole(e, mole, hole) {
    if (!gameRunning || !mole.classList.contains('up')) return;

    const isBomb = mole.textContent === '💣';
    mole.onclick = null;
    mole.classList.add('whacked');
    hole.classList.add('hit');

    setTimeout(() => {
        mole.classList.remove('up', 'whacked');
        hole.classList.remove('hit');
    }, 200);

    if (isBomb) {
        score = Math.max(0, score - 5);
        showPop(e, '-5', '#ff6b6b');
    } else {
        const pts = level + 1;
        score += pts;
        whacks++;
        showPop(e, `+${pts}`, '#ffd700');
        if (whacks % 10 === 0) { level++; document.getElementById('levelDisplay').textContent = level; }
    }

    updateDisplay();
}

function showPop(e, text, color) {
    const pop = document.createElement('div');
    pop.className = 'score-pop';
    pop.textContent = text;
    pop.style.color = color;
    pop.style.left = e.clientX + 'px';
    pop.style.top  = e.clientY + 'px';
    document.body.appendChild(pop);
    setTimeout(() => pop.remove(), 700);
}

function updateDisplay() {
    document.getElementById('scoreDisplay').textContent = score;
    document.getElementById('levelDisplay').textContent = level;
}

function endGame() {
    gameRunning = false;
    clearTimeout(moleTimer);
    clearInterval(countdownTimer);
    document.querySelectorAll('.mole').forEach(m => {
        m.classList.remove('up', 'whacked');
        m.onclick = null;
    });
    document.getElementById('startBtn').disabled = false;
    document.getElementById('finalScore').textContent = score + ' pts';
    new bootstrap.Modal(document.getElementById('gameOverModal')).show();
}

function saveScore() {
    const name = document.getElementById('playerName').value.trim() || 'Anonymous';
    fetch('/Game/SaveScore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, score })
    })
    .then(r => r.json())
    .then(scores => {
        const rank = scores.findIndex(s => s.name === name && s.score === score) + 1;
        if (rank > 0) {
            document.getElementById('rankMsg').textContent = `🏆 You ranked #${rank} on the leaderboard!`;
            document.getElementById('rankMsg').style.display = 'block';
        }
        loadLeaderboard(scores);
    });
}

function playAgain() {
    bootstrap.Modal.getInstance(document.getElementById('gameOverModal')).hide();
    setTimeout(startGame, 300);
}

function showLeaderboard() {
    const card = document.getElementById('leaderboardCard');
    card.style.display = card.style.display === 'none' ? 'block' : 'none';
    if (card.style.display === 'block') {
        fetch('/Game/Scores').then(r => r.json()).then(loadLeaderboard);
    }
}

function loadLeaderboard(scores) {
    const tbody = document.getElementById('leaderboardBody');
    const none  = document.getElementById('noScores');
    tbody.innerHTML = '';
    if (!scores || scores.length === 0) {
        none.style.display = 'block'; return;
    }
    none.style.display = 'none';
    const medals = ['🥇','🥈','🥉'];
    scores.forEach((s, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${medals[i] || i+1}</td><td>${s.name}</td><td class="text-warning fw-bold">${s.score}</td><td class="text-muted">${s.date}</td>`;
        tbody.appendChild(tr);
    });
    document.getElementById('leaderboardCard').style.display = 'block';
}
