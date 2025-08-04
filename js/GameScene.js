class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {}

  create(data) {
    
    const player = data.player || 'Player';

    this.add.text(0, 0, `PLAYER: ${player}`, { font: '15px Arial', color: 'white',backgroundColor: 'black' }).setDepth(1)
    

    // Add background
    this.background = this.add.tileSprite(0, 240, 0, 0, 'background');
    
    // Create player
    GameState.player = this.physics.add.sprite(50, 240, 'player').setOrigin(0, 0);
    

    // Create groups
    GameState.towers = this.physics.add.group();
    GameState.rootbeers = this.physics.add.group();

    // Input
    this.input.on('pointerdown', () => this.jump());
    this.input.keyboard.on('keydown-SPACE', () => this.jump());

    // Pause Button
    this.add.text(250, 450, 'Pause', { font: '15px Arial', color: 'white', backgroundColor: 'black' })
      .setInteractive()
      .setDepth(1)
      .on('pointerdown', () => {
        GameState.scenePaused = true;
        this.scene.pause();
      });

          this.input.keyboard.on('keydown-ESC', () => {
        this.scene.start('TitleScene');
       
    });

    // Score
    GameState.score = 0;
    GameState.topScore = parseInt(localStorage.getItem('score')) || 0;

    this.scoreText = this.add.text(0, 16, 'SCORE: 0', {
      font: '15px Arial',
      fill: 'white',
      backgroundColor: 'black'
    }).setDepth(1);

    this.topScoreText = this.add.text(0, 32, 'BEST: ' + GameState.topScore, {
      font: '15px Arial',
      fill: 'white',
      backgroundColor: 'black'
    }).setDepth(1);

    // Collisions
    this.physics.add.collider(GameState.player, GameState.towers, () => {
      GameState.gameOver = true;
    }, null, this);

    this.physics.add.overlap(GameState.player, GameState.rootbeers, () => {
      const rootbeer = GameState.rootbeers.getFirstAlive();
      if (rootbeer) {
        rootbeer.destroy();
        GameState.score += 1;
        this.scoreText.setText('SCORE: ' + GameState.score);
      }
    });

    // Spawn towers and rootbeer
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
      if (GameState.score > GameState.topScore) {localStorage.setItem('score', GameState.score)};
      this.scene.restart();
    }

    const playerBounds = GameState.player.getBounds();
    if (playerBounds.bottom >= this.game.config.height || playerBounds.top <= 0) {
      GameState.gameOver = true;
    }

    this.background.tilePositionX += .7 ;
  }

  jump() {
    if (GameState.player) {
      GameState.player.setVelocityY(-300);
    }
  }

  spawn() {
    const gap = 160;
    const towerY = Phaser.Math.Between(75, 420 - gap);
    
    const upper = GameState.towers.create(350, towerY - gap / 2, 'tower').setOrigin(0, 1).setScale(1);
    const lower = GameState.towers.create(350, towerY + gap / 2, 'tower').setOrigin(0, 0).setScale(1);
    const rootbeer = GameState.rootbeers.create(382, towerY, 'rootbeer');

    [upper, lower, rootbeer].forEach(obj => {
      obj.body.setVelocityX(-250-(GameState.score*2));
      obj.body.setAllowGravity(false);
    });
  }
}
