// Create a new Phaser.Game instance
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: true,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);

let bird;
let pipes;
this.state.add('main', mainState); 

function preload() {
  // Load assets
  this.load.image('bird', 'images/bird.png');
  this.load.image('pipe', 'images/pipe.png');
  this.load.image('background', 'images/bg.png');
}

function create() {
  //Add Backgrounds
    this.add.image(0, 0, 'background').setOrigin(0, 0);
              
  
  // Create bird
  bird = this.physics.add.sprite(80, 240, 'bird').setOrigin(0, 0);
   bird.scaleX=.15
   bird.scaleY=.15


  // Create pipes group
  pipes = this.physics.add.group();

  // Set up input
  this.input.on('pointerdown', flapBird);

  // Spawn pipes
  this.time.addEvent({
    delay: 2000,
    callback: spawnPipe,
    callbackScope: this,
    loop: true,
  });

  // Check for collisions
  this.physics.add.collider(bird, pipes, gameOver, null, this);

}

function update() {
  // Flap bird on click
  // if (bird.angle < 20) {
  //   bird.angle += 1;
  // }

  // Check for pipes out of bounds and kill them
  pipes.children.iterate(function (pipe) {
    if (pipe.getBounds().right < 0) {
      //pipe.destroy();
    }
    //console.log(bird.y)
    if (bird.getBounds().bottom >= config.height || bird.getBounds().top <= 0) {
      gameOver();
    }

    

  });
}

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
