let bird = document.getElementById("bird");
let gameContainer = document.getElementById("game");
let scoreDisplay = document.getElementById("score");

let birdVelocity = 0;
let gravity = 0.5;
let birdHeight = parseInt(window.getComputedStyle(bird).getPropertyValue("height"));
let birdBottom = parseInt(window.getComputedStyle(bird).getPropertyValue("bottom"));
let isGameOver = false;

let pipes = [];
let score = 0;

let jumpSound = document.getElementById("jumpsound");
let pointSound = document.getElementById("scoresound");
let gameOverSound = document.getElementById("deathsound");

let gameStarted = false; // New flag to check if the game has started

function updateScore() {
    scoreDisplay.textContent = `score: ${score}`;
}

function createPipe() {
    if (!gameStarted) return; // Prevent creating pipes before the game starts
    
    const gapHeight = 150;
    const containerHeight = 500;

    const minPipeHeight = 0;
    const maxPipeHeight = containerHeight - gapHeight - minPipeHeight;

    const topPipeHeight = Math.floor(Math.random() * (maxPipeHeight - minPipeHeight + 1)) + minPipeHeight;
    const bottomPipeHeight = containerHeight - gapHeight - topPipeHeight;

    let pipe1Top = document.createElement("div");
    pipe1Top.classList.add("pipe-top");
    pipe1Top.style.backgroundColor = "green";
    pipe1Top.style.height = `${topPipeHeight}px`;
    pipe1Top.style.width = "50px";
    pipe1Top.style.left = "100%";
    pipe1Top.style.bottom = `${containerHeight - topPipeHeight}px`;
    pipe1Top.style.position = "absolute";
    pipe1Top.style.zIndex = "1";

    let pipe1Bottom = document.createElement("div");
    pipe1Bottom.classList.add("pipe-bottom");
    pipe1Bottom.style.backgroundColor = "green";
    pipe1Bottom.style.height = `${bottomPipeHeight}px`;
    pipe1Bottom.style.width = "50px";
    pipe1Bottom.style.left = "100%";
    pipe1Bottom.style.bottom = "0px";
    pipe1Bottom.style.position = "absolute";
    pipe1Bottom.style.zIndex = "1";

    gameContainer.appendChild(pipe1Top);
    gameContainer.appendChild(pipe1Bottom);

    pipes.push({ pipeTop: pipe1Top, pipeBottom: pipe1Bottom });
}

function movePipes() {
    if (!gameStarted) return; // Prevent moving pipes before the game starts

    pipes.forEach((pipe, index) => {
        let pipe1Left = parseInt(window.getComputedStyle(pipe.pipeTop).getPropertyValue("left"));

        if (pipe1Left <= -50) {
            pipe.pipeTop.remove();
            pipe.pipeBottom.remove();
            pipes.splice(index, 1);
        } else {
            pipe.pipeTop.style.left = `${pipe1Left - 2}px`;
            pipe.pipeBottom.style.left = `${pipe1Left - 2}px`;
        }

        if (pipe1Left < birdHeight && !pipe.scored) {
            score++;
            pipe.scored = true;
            pointSound.play()
            updateScore(); 
        }

        if (checkCollision(pipe)) {
            endGame();
        }
    });
}

function moveBird() {
    if (!gameStarted) return; // Prevent moving bird before the game starts

    birdVelocity -= gravity;
    birdBottom += birdVelocity;

    if (birdBottom <= 0) {
        birdBottom = 0;
        birdVelocity = 0;
        endGame();
    }

    if (birdBottom >= 500) {
        birdBottom = 500;
        birdVelocity = 0;
        endGame();
    }

    bird.style.bottom = `${birdBottom}px`;
}

function birdJump() {
    if (isGameOver) {
        // Reset game if it's over
        resetGame();
    } else if (!gameStarted) {
        // Start the game on the first tap
        gameStarted = true;
        gameLoop(); // Start the game loop
    } else if (birdBottom > 0 && !isGameOver) {
        birdVelocity = 8;
        jumpSound.play();
    }
}

function endGame() {
    isGameOver = true;
    gameOverSound.play();
    alert(`Game Over! Final Score: ${score}`);
}

function resetGame() {
    isGameOver = false;
    gameStarted = false;
    score = 0;
    pipes.forEach(pipe => {
        pipe.pipeTop.remove();
        pipe.pipeBottom.remove();
    });
    pipes = [];
    birdBottom = 250;
    birdVelocity = 0;
    updateScore();
}

function checkCollision(pipe) {
    const birdLeft = parseInt(window.getComputedStyle(bird).getPropertyValue("left"));
    const birdRight = birdLeft + birdHeight;

    const pipeLeft = parseInt(window.getComputedStyle(pipe.pipeTop).getPropertyValue("left"));
    const pipeRight = pipeLeft + 50;
    const gapHeight = 150;
    const containerHeight = 500;
    const birdBottomPos = containerHeight - birdBottom;
    const birdTop = containerHeight - (birdBottom + birdHeight);

    const topPipeHeight = parseInt(window.getComputedStyle(pipe.pipeTop).getPropertyValue("height"));
    const bottomPipeHeight = containerHeight - gapHeight - topPipeHeight;

    if (birdRight >= pipeLeft && birdLeft <= pipeRight) {
        if (birdTop <= topPipeHeight) {
            return true;
        }
    }

    if (birdRight >= pipeLeft && birdLeft <= pipeRight) {
        if (birdBottomPos >= containerHeight - bottomPipeHeight) {
            return true;
        }
    }

    return false;
}

function gameLoop() {
    if (!gameStarted) return;

    moveBird();
    movePipes();

    requestAnimationFrame(gameLoop);
}

document.body.addEventListener("click", birdJump);
document.body.addEventListener("keydown", (event) => {
    if (event.key === " " || event.key === "Spacebar") {
        birdJump();
    }
});

setInterval(() => {
    if (gameStarted && !isGameOver) {
        createPipe();
    }
}, 2000);
