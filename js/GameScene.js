class GameScene extends Phaser.Scene {
  
  
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    // Load assets
    this.load.image('player', 'images/player.png');
    this.load.image('tower', 'images/tower.png');
    this.load.image('background', 'images/bg.png');
    this.load.image('beer', 'images/beer.png');
    }


  create() {
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
  
    //Add Backgrounds
    this.background = this.add.tileSprite(800, 240, 1600, 600, 'background')

    // Create player
    player = this.physics.add.sprite(50, 240, 'player').setOrigin(0, 0);
    player.scaleX = .15
    player.scaleY = .15

    // Create tower group
    towers = this.physics.add.group();
    beers = this.physics.add.group();

    // Set up input
    this.input.on('pointerdown', this.Jump);
    this.input.keyboard.on('keydown-SPACE', this.Jump);

    //Pause Stuff
        const PauseButton = this.add.text(250, 450, 'Pause', { font: '15px Arial', color: 'white'})
      .setInteractive()
      .setDepth(1)
      .on('pointerdown', function () {
        global_scene_paused = true
        this.scene.pause()
      }, this);

    // Spawn tower/beer
    this.time.addEvent({
      delay: 1500,
      callback: this.spawn,
      callbackScope: this,
      loop: true,
    });

    //Score Stuff
    this.score = 0
    var scoreText = this.add.text(10, 10, 'SCORE: ' + this.score, { font: '15px Arial', fill: 'white', backgroundColor: 'black'  })
    .setDepth(1);
    
    this.topScore = localStorage.getItem(this.localStorageName) == null ? 0 : localStorage.getItem(this.localStorageName);
    
    var topScoreText = this.add.text(10, 27, 'BEST: ' + this.topScore, { font: '15px Arial', fill: 'white', backgroundColor: 'black'  })
    .setDepth(1);
    
    // Check for collisions, gameover if true
    this.physics.add.collider(player, towers, this.gameOver, null, this);

    this.physics.add.overlap(player, beers, function(){
      beers.remove(beers.getFirst(true),true);
      console.log(this.score)
      this.score += 1
      scoreText.text = 'SCORE: ' + this.score;
    });

  
  }

  update() {
    // Check to see if player is off the screen, if it is restart game
    if (player.getBounds().bottom >= config.height || player.getBounds().top <= 0) {
      this.gameOver(this.score,this.topScore);
    }

    this.background.tilePositionX += 2;

  }

  gameOver() {
    // Handle game over logic (e.g., show score, restart game)
    console.log(this.score, this.topScore)
    localStorage.setItem(localStorageName, Math.max(this.score, this.topScore));
    this.scene.restart();
  }

  Jump() {
    // Make the player jump
    player.setVelocityY(-300);
  }

  spawn() {
    const Gap = 160;
    const TowerY = Phaser.Math.Between(50, 480 - Gap);
    const upperTower = towers.create(320, TowerY - Gap / 2, 'tower').setOrigin(0, 1);
    upperTower.scaleX = .70
    const lowerTower = towers.create(320, TowerY + Gap / 2, 'tower').setOrigin(0, 0);
    lowerTower.scaleX = .70
    const Beer = beers.create(340, TowerY, 'beer')

    // Enable collisions for towers
    this.physics.world.enable([upperTower, lowerTower,Beer]);

    // Set velocity for towers
    upperTower.body.velocity.x = -150;
    lowerTower.body.velocity.x = -150;
    Beer.body.velocity.x = -150;

    upperTower.body.setAllowGravity(false);
    lowerTower.body.setAllowGravity(false);
    Beer.body.setAllowGravity(false);

  }
}