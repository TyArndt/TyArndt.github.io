const config = {
  type: Phaser.AUTO,
  width: 320,
  height: 480,
  backgroundColor: "#222222",
  parent: "game-container",
  scene: [BootScene, GameScene],
  scale: {
    mode: Phaser.Scale.FIT,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 900 },
      debug: false,
    },
  }
};


const game = new Phaser.Game(config);
var global_scene_paused = false;
var gameover = false;
var score = 0;
var topScore;

let player;
let towers;
let rootbeers;

document.addEventListener('pointerdown', function(event) {
  if( global_scene_paused == true) {
      game.scene.resume('GameScene');
      global_scene_paused = false;
  }
});