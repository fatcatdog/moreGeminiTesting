// --- Game Logic Class ---
// This class encapsulates all the state and mechanics of the Pong game.
class PongGameLogic {
  constructor(canvas, setPlayerScore, setComputerScore) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.setPlayerScore = setPlayerScore;
    this.setComputerScore = setComputerScore;

    // Game constants
    this.PADDLE_HEIGHT = 100;
    this.PADDLE_WIDTH = 10;
    this.BALL_RADIUS = 8;

    // Initialize game state
    this.playerY = this.canvas.height / 2 - this.PADDLE_HEIGHT / 2;
    this.computerY = this.canvas.height / 2 - this.PADDLE_HEIGHT / 2;
    this.ballX = this.canvas.width / 2;
    this.ballY = this.canvas.height / 2;
    this.ballSpeedX = 5;
    this.ballSpeedY = 5;
    
    this.reset();
  }

  // Resets the ball to the center
  resetBall() {
    this.ballX = this.canvas.width / 2;
    this.ballY = this.canvas.height / 2;
    this.ballSpeedX = -this.ballSpeedX; // Change direction
    this.ballSpeedY = 5;
  }

  // Resets the entire game
  reset() {
    this.ballX = this.canvas.width / 2;
    this.ballY = this.canvas.height / 2;
    this.ballSpeedX = Math.random() > 0.5 ? 5 : -5;
    this.ballSpeedY = Math.random() > 0.5 ? 5 : -5;
  }
  
  // Updates the player's paddle position
  updatePlayerPaddle(mouseY) {
      let newPlayerY = mouseY - this.PADDLE_HEIGHT / 2;
      // Keep paddle within canvas bounds
      if (newPlayerY < 0) {
        newPlayerY = 0;
      } else if (newPlayerY > this.canvas.height - this.PADDLE_HEIGHT) {
        newPlayerY = this.canvas.height - this.PADDLE_HEIGHT;
      }
      this.playerY = newPlayerY;
  }

  // The main update function, called on every frame
  update() {
    // 1. Move Ball
    this.ballX += this.ballSpeedX;
    this.ballY += this.ballSpeedY;

    // 2. Computer AI
    const computerCenter = this.computerY + this.PADDLE_HEIGHT / 2;
    if (computerCenter < this.ballY - 35) {
      this.computerY += 6;
    } else if (computerCenter > this.ballY + 35) {
      this.computerY -= 6;
    }
    // Keep computer paddle within bounds
    if (this.computerY < 0) this.computerY = 0;
    if (this.computerY > this.canvas.height - this.PADDLE_HEIGHT) {
        this.computerY = this.canvas.height - this.PADDLE_HEIGHT;
    }

    // 3. Collision Detection
    // Top/Bottom walls
    if (this.ballY < this.BALL_RADIUS || this.ballY > this.canvas.height - this.BALL_RADIUS) {
      this.ballSpeedY = -this.ballSpeedY;
    }

    // Player paddle
    if (this.ballX < this.PADDLE_WIDTH + this.BALL_RADIUS &&
        this.ballY > this.playerY &&
        this.ballY < this.playerY + this.PADDLE_HEIGHT) {
      this.ballSpeedX = -this.ballSpeedX;
      let deltaY = this.ballY - (this.playerY + this.PADDLE_HEIGHT / 2);
      this.ballSpeedY = deltaY * 0.35;
    }

    // Computer paddle
    if (this.ballX > this.canvas.width - this.PADDLE_WIDTH - this.BALL_RADIUS &&
        this.ballY > this.computerY &&
        this.ballY < this.computerY + this.PADDLE_HEIGHT) {
      this.ballSpeedX = -this.ballSpeedX;
    }

    // 4. Scoring
    if (this.ballX < 0) {
      this.setComputerScore(s => s + 1);
      this.resetBall();
    } else if (this.ballX > this.canvas.width) {
      this.setPlayerScore(s => s + 1);
      this.resetBall();
    }
  }

  // Drawing logic
  draw() {
    // Clear canvas
    this.context.fillStyle = '#111827';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw paddles
    this.context.fillStyle = '#06B6D4';
    this.context.fillRect(0, this.playerY, this.PADDLE_WIDTH, this.PADDLE_HEIGHT);
    this.context.fillRect(this.canvas.width - this.PADDLE_WIDTH, this.computerY, this.PADDLE_WIDTH, this.PADDLE_HEIGHT);

    // Draw ball
    this.context.beginPath();
    this.context.arc(this.ballX, this.ballY, this.BALL_RADIUS, 0, Math.PI * 2);
    this.context.fillStyle = '#FFFFFF';
    this.context.fill();

    // Draw net
    this.context.strokeStyle = '#4B5563';
    this.context.lineWidth = 4;
    this.context.setLineDash([10, 10]);
    this.context.beginPath();
    this.context.moveTo(this.canvas.width / 2, 0);
    this.context.lineTo(this.canvas.width / 2, this.canvas.height);
    this.context.stroke();
    this.context.setLineDash([]);
  }
}

export default PongGameLogic;