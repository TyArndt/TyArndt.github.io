class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    // Assets are now loaded in BootScene for better performance
  }

  create(data) {
    // Store event listeners for cleanup
    this.eventListeners = [];
    
    // Reset pause state
    GameState.scenePaused = false;
    
    // Initialize/reset object pools for better performance
    this.towerPool = [];
    this.rootbeerPool = [];
    
    // Clear any existing objects from previous runs
    if (GameState.towers) {
      GameState.towers.clear(true, true);
    }
    if (GameState.rootbeers) {
      GameState.rootbeers.clear(true, true);
    }
    
    const player = data.player || 'Player';

    this.add.text(0, 0, `PLAYER: ${player}`, { font: '15px Arial', color: 'white', backgroundColor: 'black' }).setDepth(1);
    

    // Add background - properly sized and positioned
    this.background = this.add.tileSprite(this.game.config.width / 2, this.game.config.height / 2, 
                                        this.game.config.width, this.game.config.height, 'background');
    
    // Create player
    GameState.player = this.physics.add.sprite(50, 240, 'player').setOrigin(0, 0);
    

    // Create groups
    GameState.towers = this.physics.add.group();
    GameState.rootbeers = this.physics.add.group();

    // Input - store references for cleanup
    const pointerHandler = () => this.jump();
    const spaceHandler = () => this.jump();
    this.input.on('pointerdown', pointerHandler);
    this.input.keyboard.on('keydown-SPACE', spaceHandler);
    this.eventListeners.push(['pointerdown', pointerHandler], ['keydown-SPACE', spaceHandler]);

    // Pause Button - position relative to game width
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

    // Score and deaths
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

    // Collisions
    this.physics.add.collider(GameState.player, GameState.towers, () => {
      GameState.gameOver = true;
      GameState.deaths += 1;
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

  shutdown() {
    // Clean up event listeners to prevent memory leaks
    this.eventListeners.forEach(([event, handler]) => {
      if (event.startsWith('keydown-')) {
        this.input.keyboard.off(event, handler);
      } else {
        this.input.off(event, handler);
      }
    });
    this.eventListeners = [];
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

    const playerBounds = GameState.player.getBounds();
    if (playerBounds.bottom >= this.game.config.height || playerBounds.top <= 0) {
      GameState.gameOver = true;
      GameState.deaths += 1;
    }

    this.background.tilePositionX += 0.7;
    
    // Clean up off-screen objects for pooling (optimized)
    if (this.towerPool.length > 0 || this.rootbeerPool.length > 0) {
      [...this.towerPool, ...this.rootbeerPool].forEach(obj => {
        if (obj && obj.active && obj.x < -100) {
          obj.setActive(false).setVisible(false);
          if (obj.body) {
            obj.body.setVelocityX(0);
          }
        }
      });
    }
  }

  jump() {
    if (GameState.player) {
      GameState.player.setVelocityY(-300);
    }
  }

  getPooledTower() {
    // More efficient pooling - find first inactive object
    for (let i = 0; i < this.towerPool.length; i++) {
      if (!this.towerPool[i].active) {
        return this.towerPool[i];
      }
    }
    return null;
  }
  
  getPooledRootbeer() {
    // More efficient pooling - find first inactive object
    for (let i = 0; i < this.rootbeerPool.length; i++) {
      if (!this.rootbeerPool[i].active) {
        return this.rootbeerPool[i];
      }
    }
    return null;
  }

  resetPooledObject(obj, x, y) {
    // Properly reset all object properties
    obj.setPosition(x, y)
       .setActive(true)
       .setVisible(true)
       .setScale(1)
       .setRotation(0);
    
    // Reset physics body
    if (obj.body) {
      obj.body.setVelocityX(0);
      obj.body.setVelocityY(0);
      obj.body.setAllowGravity(false);
    }
  }

  spawn() {
    const gap = 160;
    const towerY = Phaser.Math.Between(75, 420 - gap);
    const speed = -250 - (GameState.score * 2);
    
    // Try to reuse pooled objects, create new ones if needed
    let upper = this.getPooledTower();
    if (upper) {
      this.resetPooledObject(upper, 350, towerY - gap / 2);
    } else {
      upper = GameState.towers.create(350, towerY - gap / 2, 'tower');
      if (upper) {
        this.towerPool.push(upper);
      } else {
        console.warn('Failed to create upper tower');
        return;
      }
    }
    upper.setOrigin(0, 1);
    
    let lower = this.getPooledTower();
    if (lower) {
      this.resetPooledObject(lower, 350, towerY + gap / 2);
    } else {
      lower = GameState.towers.create(350, towerY + gap / 2, 'tower');
      if (lower) {
        this.towerPool.push(lower);
      } else {
        console.warn('Failed to create lower tower');
        return;
      }
    }
    lower.setOrigin(0, 0);
    
    let rootbeer = this.getPooledRootbeer();
    if (rootbeer) {
      this.resetPooledObject(rootbeer, 382, towerY);
    } else {
      rootbeer = GameState.rootbeers.create(382, towerY, 'rootbeer');
      if (rootbeer) {
        this.rootbeerPool.push(rootbeer);
      } else {
        console.warn('Failed to create rootbeer');
        return;
      }
    }

    // Set velocity and physics for all objects
    [upper, lower, rootbeer].forEach(obj => {
      if (obj && obj.body) {
        obj.body.setVelocityX(speed);
        obj.body.setAllowGravity(false);
      }
    });
  }
}
