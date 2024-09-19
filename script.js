// Disable right-click and common shortcuts
document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('keydown', (e) => {
  if (e.key === 'F12' || (e.ctrlKey && (e.key === 'i' || e.key === 'u'))) {
    e.preventDefault();
  }
});

// Rest of your game code...

let player = document.getElementById('player');
let game = document.getElementById('game');
let scoreElement = document.getElementById('score');
let gameOverScreen = document.getElementById('game-over-screen');
let finalScoreElement = document.getElementById('final-score');

let startScreen = document.getElementById('start-screen');
let gameContainer = document.getElementById('game-container');

let score = 0;
let gameInterval;
let obstacles = [];
let isGameOver = false;
let difficultyLevel = 1;

// Start the game
document.getElementById('start-btn').addEventListener('click', function() {
  startScreen.classList.add('hidden');
  gameContainer.classList.remove('hidden');
  startGame();
});

// Retry the game
document.getElementById('retry-btn').addEventListener('click', function() {
  gameOverScreen.classList.add('hidden');
  startGame();
});

// Track mouse movement
document.addEventListener('mousemove', function(e) {
  movePlayer(e.clientX);
});

// Track touch movement for mobile
document.addEventListener('touchmove', function(e) {
  e.preventDefault(); // Prevent scrolling
  movePlayer(e.touches[0].clientX);
});

// Function to move the player
function movePlayer(mouseX) {
  if (isGameOver) return;

  let playerWidth = player.clientWidth; // Get player's width

  // Set player position based on mouse X, ensuring it doesn't go out of bounds
  if (mouseX > playerWidth / 2 && mouseX < game.clientWidth - playerWidth / 2) {
    player.style.left = mouseX - playerWidth / 2 + 'px';
  }
}

// Start Game function
function startGame() {
  resetGame();
  isGameOver = false;
  gameInterval = setInterval(updateGame, 1000 / 60); // 60 FPS
  createFloatingObstacles();
}

// Create Floating Obstacles
function createFloatingObstacle() {
  let floatingObstacle = document.createElement('div');
  floatingObstacle.classList.add('floating-obstacle');

  // Define shapes for floating obstacles
  const colors = ['blue', 'purple', 'orange', 'cyan'];
  const size = Math.random() * (40 - 20) + 20; // Random size between 20px and 40px

  floatingObstacle.style.width = size + 'px';
  floatingObstacle.style.height = size + 'px';
  floatingObstacle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
  floatingObstacle.style.left = Math.random() * (window.innerWidth - size) + 'px';
  floatingObstacle.style.top = Math.random() * (window.innerHeight - size) + 'px';

  document.getElementById('floating-obstacles-start').appendChild(floatingObstacle);
}

// Create multiple floating obstacles
function createFloatingObstacles() {
  for (let i = 0; i < 10; i++) {
    createFloatingObstacle();
  }
}

// Update Game Logic
function updateGame() {
  score += 1;
  scoreElement.textContent = score;

  // Increase difficulty every 10 seconds
  if (Math.floor(score / 100) >= difficultyLevel) {
    difficultyLevel++;
  }

  if (Math.random() < 0.02 * difficultyLevel) { // Increase obstacle spawn rate with difficulty
    createObstacle();
  }

  updateObstacles();
  checkCollision();
}

// Create Obstacles
function createObstacle() {
  let obstacle = document.createElement('div');
  obstacle.classList.add('obstacle');

  // Define shapes and their behaviors
  const shapes = [
    { type: 'triangle', color: 'green', size: '60px', behavior: 'spin' },
    { type: 'star', color: 'yellow', size: '40px', behavior: 'zigzag' },
    { type: 'square', color: 'red', size: '50px', behavior: 'normal' },
    { type: 'circle', color: 'blue', size: '50px', behavior: 'fast' },
    { type: 'hexagon', color: 'purple', size: '50px', behavior: 'spin' },
  ];
  
  const shape = shapes[Math.floor(Math.random() * shapes.length)];
  
  obstacle.style.width = shape.size;
  obstacle.style.height = shape.size;
  obstacle.style.backgroundColor = shape.color;
  
  // Adjust border radius based on shape type
  if (shape.type === 'triangle') {
    obstacle.style.borderRadius = '0 0 50% 50%'; // Triangle shape
  } else if (shape.type === 'star') {
    obstacle.style.borderRadius = '20%'; // Star shape
  } else if (shape.type === 'circle') {
    obstacle.style.borderRadius = '50%'; // Circle shape
  } else {
    obstacle.style.borderRadius = '0'; // Square and hexagon shape
  }
  
  obstacle.style.left = Math.random() * (game.clientWidth - parseInt(shape.size)) + 'px';
  obstacle.style.top = '0'; // Start from the top
  obstacle.dataset.behavior = shape.behavior; // Assign behavior to obstacle
  game.appendChild(obstacle);
  obstacles.push(obstacle);
}

// Update Obstacles
function updateObstacles() {
  obstacles.forEach((obstacle, index) => {
    let top = parseInt(window.getComputedStyle(obstacle).top) || 0;
    if (top > game.clientHeight) {
      obstacle.remove();
      obstacles.splice(index, 1);
    } else {
      if (obstacle.dataset.behavior === 'spin') {
        obstacle.style.transform = `rotate(${top * 0.3}deg)`; // Spinning behavior
        obstacle.style.top = top + 6.5 + 'px'; // Move down
      } else if (obstacle.dataset.behavior === 'zigzag') {
        obstacle.style.top = top + 3 + 'px'; // Normal zigzag movement
        obstacle.style.left = Math.sin(top * 0.1) * 10 + (parseInt(obstacle.style.left)) + 'px'; // Zigzag effect
      } else if(obstacle.dataset.behavior === 'fast') {
        obstacle.style.top = top + 10 + 'px'; // Speed for circle
      } else {
        obstacle.style.top = top + 5 + 'px'; // Uniform speed for square and hexagon
      }
    }
  });
}

// Check for Collision
function checkCollision() {
  obstacles.forEach((obstacle) => {
    let playerRect = player.getBoundingClientRect();
    let obstacleRect = obstacle.getBoundingClientRect();

    if (
      playerRect.left < obstacleRect.right &&
      playerRect.right > obstacleRect.left &&
      playerRect.top < obstacleRect.bottom &&
      playerRect.bottom > obstacleRect.top
    ) {
      endGame();
    }
  });
}

// End Game
function endGame() {
  clearInterval(gameInterval);
  isGameOver = true;
  finalScoreElement.textContent = score;
  gameOverScreen.classList.remove('hidden');
}

// Reset Game State
function resetGame() {
  score = 0;
  difficultyLevel = 1; // Reset difficulty level
  scoreElement.textContent = score;
  obstacles.forEach(obstacle => obstacle.remove());
  obstacles = [];
  player.style.left = '50%';
}
