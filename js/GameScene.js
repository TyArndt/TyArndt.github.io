class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {}

  create(data) {
    this.eventListeners = [];
    
    GameState.scenePaused = false;
    
    // Clear any existing objects from previous runs
    if (GameState.towers) {
      GameState.towers.clear(true, true);
    }
    if (GameState.rootbeers) {
      GameState.rootbeers.clear(true, true);
    }
    
    const player = data.player || 'Player';

    this.add.text(0, 0, `PLAYER: ${player}`, { font: '15px Arial', color: 'white', backgroundColor: 'black' }).setDepth(1);
    
    this.background = this.add.tileSprite(this.game.config.width / 2, this.game.config.height / 2, 
                                        this.game.config.width, this.game.config.height, 'background');
    
    // Create player
    GameState.player = this.physics.add.sprite(50, 240, 'player').setOrigin(0, 0);
    

    // Create groups
    GameState.towers = this.physics.add.group();
    GameState.rootbeers = this.physics.add.group();

    const pointerHandler = () => this.jump();
    const spaceHandler = () => this.jump();
    this.input.on('pointerdown', pointerHandler);
    this.input.keyboard.on('keydown-SPACE', spaceHandler);
    this.eventListeners.push(['pointerdown', pointerHandler], ['keydown-SPACE', spaceHandler]);

    this.add.text(this.game.config.width - 80, this.game.config.height - 30, 'Pause', { 
      font: '15px Arial', 
      color: 'white', 
      backgroundColor: 'black',
      padding: { x: 5, y: 2 }
    })
      .setInteractive()
      .setDepth(1)
      .on('pointerdown', () => {
        GameState.scenePaused = true;
        this.scene.pause();
      });

    const escHandler = () => {
      this.scene.start('TitleScene');
    };
    this.input.keyboard.on('keydown-ESC', escHandler);
    this.eventListeners.push(['keydown-ESC', escHandler]);

    GameState.score = 0;
    GameState.topScore = parseInt(localStorage.getItem('score')) || 0;
    GameState.deaths = parseInt(localStorage.getItem('deaths')) || 0;

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
    
    this.deathText = this.add.text(0, 48, 'DEATHS: ' + GameState.deaths, {
      font: '15px Arial',
      fill: 'white',
      backgroundColor: 'black'
    }).setDepth(1);
    
    this.deathText.setText('DEATHS: ' + GameState.deaths);

    // Collisions
    this.physics.add.collider(GameState.player, GameState.towers, () => {
      if (!GameState.gameOver) {
        GameState.gameOver = true;
        GameState.deaths += 1;
        this.deathText.setText('DEATHS: ' + GameState.deaths);
      }
    }, null, this);

    this.physics.add.overlap(GameState.player, GameState.rootbeers, (player, rootbeer) => {
      if (rootbeer && rootbeer.active) {
        rootbeer.setActive(false).setVisible(false);
        rootbeer.body.setVelocityX(0);
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
      if (GameState.score > GameState.topScore) {
        GameState.topScore = GameState.score;
        localStorage.setItem('score', GameState.topScore);
      }
      // Save deaths to localStorage
      localStorage.setItem('deaths', GameState.deaths);     
        this.scene.restart();
    }

    if (GameState.player && GameState.player.active && !GameState.gameOver) {
      try {
        const playerBounds = GameState.player.getBounds();
        if (playerBounds && (playerBounds.bottom >= this.game.config.height || playerBounds.top <= 0)) {
          GameState.gameOver = true;
        }
      } catch (error) {
        console.warn('Error checking player bounds:', error);
        // If bounds check fails, assume player is dead
        GameState.gameOver = true;
        GameState.deaths += 1;
        this.deathText.setText('DEATHS: ' + GameState.deaths);
      }
    }

    this.background.tilePositionX += 0.7;
    

  }

  jump() {
    if (GameState.player) {
      GameState.player.setVelocityY(-300);
    }
  }



  spawn() {
    const gap = 160;
    const towerY = Phaser.Math.Between(75, 420 - gap);
    const speed = -250 - (GameState.score * 2);

    const upper = GameState.towers.create(350, towerY - gap / 2, 'tower').setOrigin(0, 1).setScale(1);
    const lower = GameState.towers.create(350, towerY + gap / 2, 'tower').setOrigin(0, 0).setScale(1);
    const beer = GameState.beers.create(382, towerY, 'beer');

    
    [upper, lower, beer].forEach(obj => {
      obj.body.setVelocityX(-250-(GameState.score*2));
      obj.body.setAllowGravity(false);    
          });
  }
}
