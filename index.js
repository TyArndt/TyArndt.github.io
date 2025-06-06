// Ensure the Phaser game is initialized correctly
const config = {
  type: Phaser.AUTO,
  width: 320,
  height: 480,
  backgroundColor: '#222222',
  parent: 'game-container',
  scene: [BootScene, GameScene], // Ensure your scene names match
  scale: {
    mode: Phaser.Scale.FIT,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 900 },
      debug: false
    }
  }
};

// Initialize the Phaser game instance
const game = new Phaser.Game(config);

// Global game state management
const GameState = {
  scenePaused: false,
  gameOver: false,
  score: 0,
  topScore: 0,
  player: null,
  towers: null,
  beers: null
};

// Event listener to resume the game when clicked (if paused)
document.addEventListener('pointerdown', () => {
  if (GameState.scenePaused === true) {
    game.scene.resume('GameScene');
    GameState.scenePaused = false;
  }
});
