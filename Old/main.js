  // Example: Use the BootScene to configure the game before starting the actual game scene
  
  const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 300 },
        debug: true,
        scene: [BootScene, GameScene] // Add other scenes as needed
      },
    }
  };
  
  const game = new Phaser.Game(config);
  
//let bird;
//let pipes;


function flapBird() {
  // Make the bird jump
  bird.setVelocityY(-200);
}

function spawnPipe() {
  const pipeGap = 160;
  const pipeY = Phaser.Math.Between(50, 430-pipeGap);
  const upperPipe = pipes.create(800, pipeY - pipeGap / 2, 'pipe').setOrigin(0, 1);
  const lowerPipe = pipes.create(800, pipeY + pipeGap / 2, 'pipe').setOrigin(0, 0);

  // Enable collisions for pipes
 this.physics.world.enable([upperPipe, lowerPipe]);

  // Set velocity for pipes
  upperPipe.body.velocity.x = -200;
  lowerPipe.body.velocity.x = -200;

  upperPipe.body.setAllowGravity(false);
  lowerPipe.body.setAllowGravity(false);
 
}
function gameOver() {
  // Handle game over logic (e.g., show score, restart game)
  game.scene.restart();
}
