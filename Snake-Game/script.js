/* =========================
   DOM REFERENCES
========================= */

const board = document.querySelector('.board');
const startButton = document.querySelector('.btn-start');
const restartButton = document.querySelector('.btn-restart');

const modal = document.querySelector('.modal');
const startGameModal = document.querySelector('.start');
const gameOverModal = document.querySelector('.game-over');

const highScoreDisplay = document.querySelector('#high-score');
const currentScoreDisplay = document.querySelector('#score');
const timeElement = document.querySelector('#time');


/* =========================
   GAME CONSTANTS & STATE
========================= */

const blockSize = 50;
const scoreIncrement = 10;

let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let time = '00:00';

let direction = 'down';
let intervalid = null;
let timerInterval = null;
let gameRunning = false;
let justRestarted = false;


highScoreDisplay.innerText = highScore;


/* =========================
   GRID SETUP
========================= */

const cols = Math.floor(board.clientWidth / blockSize);
const rows = Math.floor(board.clientHeight / blockSize);

const blocks = {};

const snake = [
    { x: 1, y: 3 },
    { x: 1, y: 4 },
    { x: 1, y: 5 }
];

let food;


/* =========================
   CREATE GRID
========================= */

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement('div');
        block.classList.add('block');
        board.appendChild(block);
        blocks[`${row}, ${col}`] = block;
    }
}


/* =========================
   FOOD HELPERS
========================= */

function isOnSnake(pos) {
    return snake.some(seg => seg.x === pos.x && seg.y === pos.y);
}

function spawnFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * rows),
            y: Math.floor(Math.random() * cols)
        };
    } while (isOnSnake(newFood));

    food = newFood;
}


/* =========================
   TIMER
========================= */

function startTimer() {
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        let [min, sec] = time.split(':').map(Number);
        sec++;
        if (sec === 60) {
            min++;
            sec = 0;
        }
        time = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
        timeElement.innerText = time;
    }, 1000);
}


/* =========================
   MAIN GAME LOOP
========================= */

function render() {
    if (justRestarted) {
        justRestarted = false;
        return;
    }
    

    if (!food) return;

    // Clear board visuals
    Object.values(blocks).forEach(b => {
        b.classList.remove('fill', 'food', 'head');
    });

    // Calculate new head
    let head;

    if (direction === 'left') {
        head = { x: snake[0].x, y: snake[0].y - 1 };
    } else if (direction === 'right') {
        head = { x: snake[0].x, y: snake[0].y + 1 };
    } else if (direction === 'down') {
        head = { x: snake[0].x + 1, y: snake[0].y };
    } else if (direction === 'up') {
        head = { x: snake[0].x - 1, y: snake[0].y };
    }

    // Wall collision
    if (
        head.x < 0 || head.x >= rows ||
        head.y < 0 || head.y >= cols
    ) {
        endGame();
        return;
    }

    // Save tail BEFORE move (important)
    const tail = { ...snake[snake.length - 1] };

    // Move snake
    snake.unshift(head);
    snake.pop();

    // Self collision
    if (snake.slice(1).some(seg => seg.x === head.x && seg.y === head.y)) {
        endGame();
        return;
    }

    // Eat food
    if (head.x === food.x && head.y === food.y) {
        snake.push(tail); // correct growth
        spawnFood();

        score += scoreIncrement;
        currentScoreDisplay.innerText = score;

        if (score > highScore) {
            highScore = score;
            highScoreDisplay.innerText = highScore;
            localStorage.setItem('highScore', highScore);
        }
    }

    // Draw snake
    snake.forEach((seg, index) => {
        const block = blocks[`${seg.x}, ${seg.y}`];
    
        if (index === 0) {
            block.classList.add('head'); // 👑 head
        } else {
            block.classList.add('fill'); // body
        }
    });
    

    // Draw food LAST
    blocks[`${food.x}, ${food.y}`].classList.add('food');
}


/* =========================
   GAME CONTROL FUNCTIONS
========================= */

function startGame() {
    if (gameRunning) return;

    gameRunning = true;

    score = 0;
    time = '00:00';
    currentScoreDisplay.innerText = score;
    timeElement.innerText = time;

    spawnFood();

    modal.style.display = 'none';

    intervalid = setInterval(render, 150);
    startTimer();
}

function endGame() {
    clearInterval(intervalid);
    clearInterval(timerInterval);

    intervalid = null;
    timerInterval = null;
    gameRunning = false;

    modal.style.display = 'flex';
    startGameModal.style.display = 'none';
    gameOverModal.style.display = 'flex';
}

function restartGame() {

    clearInterval(intervalid);
    clearInterval(timerInterval);

    intervalid = null;
    timerInterval = null;
    gameRunning = false;

    food = null;
    score = 0;
    time = '00:00';

    currentScoreDisplay.innerText = score;
    timeElement.innerText = time;

    snake.length = 0;
    snake.push(
        { x: 1, y: 3 },
        { x: 1, y: 4 },
        { x: 1, y: 5 }
    );

    direction = 'down';

    Object.values(blocks).forEach(block => {
        block.classList.remove('fill', 'food');
    });
    modal.style.display = 'none';
    startGameModal.style.display = 'none';
    gameOverModal.style.display = 'none';
    justRestarted = true;

}

/* =========================
   EVENT LISTENERS
========================= */

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);

addEventListener('keydown', (event) => {

    // 👉 If game is NOT running → restart + start fresh game
    if (!gameRunning) {
        event.preventDefault();
        restartGame();
        startGame();
        return;
    }

    // 👉 Movement keys (only when game is running)
    if ((event.key === 'ArrowLeft' || event.key === 'a') && direction !== 'right') {
        event.preventDefault();
        direction = 'left';
    }
    else if ((event.key === 'ArrowRight' || event.key === 'd') && direction !== 'left') {
        event.preventDefault();
        direction = 'right';
    }
    else if ((event.key === 'ArrowUp' || event.key === 'w') && direction !== 'down') {
        event.preventDefault();
        direction = 'up';
    }
    else if ((event.key === 'ArrowDown' || event.key === 's') && direction !== 'up') {
        event.preventDefault();
        direction = 'down';
    }
});
