class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    this.load.image('player', 'images/player.png');
    this.load.image('tower', 'images/tower.png');
    this.load.image('background', 'images/bg.png');
    this.load.image('beer', 'images/rootbeer.png');
  }

  create() {
    // Add background
    this.background = this.add.tileSprite(800, 240, 1600, 700, 'background');

    // Create player
    GameState.player = this.physics.add.sprite(50, 240, 'player').setOrigin(0, 0);
    GameState.player.setScale(0.05);

    // Create groups
    GameState.towers = this.physics.add.group();
    GameState.beers = this.physics.add.group();

    // Input
    this.input.on('pointerdown', () => this.jump());
    this.input.keyboard.on('keydown-SPACE', () => this.jump());

    // Pause Button
    this.add.text(250, 450, 'Pause', { font: '15px Arial', color: 'white' })
      .setInteractive()
      .setDepth(1)
      .on('pointerdown', () => {
        GameState.scenePaused = true;
        this.scene.pause();
      });

    // Score
    GameState.score = 0;
    GameState.topScore = parseInt(localStorage.getItem('score')) || 0;

    this.scoreText = this.add.text(10, 10, 'SCORE: 0', {
      font: '15px Arial',
      fill: 'white',
      backgroundColor: 'black'
    }).setDepth(1);

    this.topScoreText = this.add.text(10, 27, 'BEST: ' + GameState.topScore, {
      font: '15px Arial',
      fill: 'white',
      backgroundColor: 'black'
    }).setDepth(1);

    // Collisions
    this.physics.add.collider(GameState.player, GameState.towers, () => {
      GameState.gameOver = true;
    }, null, this);

    this.physics.add.overlap(GameState.player, GameState.beers, () => {
      const beer = GameState.beers.getFirstAlive();
      if (beer) {
        beer.destroy();
        GameState.score += 1;
        this.scoreText.setText('SCORE: ' + GameState.score);
      }
    });

    // Spawn towers and beer
    this.time.addEvent({
      delay: 1500,
      callback: this.spawn,
      callbackScope: this,
      loop: true,
    });
  }

  update() {
    if (GameState.gameOver) {
      GameState.gameOver = false;
      localStorage.setItem('score', Math.max(GameState.score, GameState.topScore));
      this.scene.restart();
    }

    const playerBounds = GameState.player.getBounds();
    if (playerBounds.bottom >= this.game.config.height || playerBounds.top <= 0) {
      GameState.gameOver = true;
    }

    this.background.tilePositionX += 2;
  }

  jump() {
    if (GameState.player) {
      GameState.player.setVelocityY(-300);
    }
  }

  spawn() {
    const gap = 160;
    const towerY = Phaser.Math.Between(50, 480 - gap);
    
    const upper = GameState.towers.create(320, towerY - gap / 2, 'tower').setOrigin(0, 1).setScale(0.7);
    const lower = GameState.towers.create(320, towerY + gap / 2, 'tower').setOrigin(0, 0).setScale(0.7);
    const beer = GameState.beers.create(340, towerY, 'beer');

    [upper, lower, beer].forEach(obj => {
      obj.body.setVelocityX(-150);
      obj.body.setAllowGravity(false);
    });
  }
}
