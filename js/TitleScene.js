class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  preload() {}

  create() {
    const centerX = this.game.config.width / 2;
    const centerY = this.game.config.height / 2;
    
    // Store DOM elements for cleanup
    this.domElements = [];

    if (this.textures.exists('title_background')) {
      this.title_background = this.add.tileSprite(centerX, centerY, 0, 0, 'title_background');
    } else {
      this.add.rectangle(centerX, centerY, this.game.config.width, this.game.config.height, 0x222222);
    }

    this.add.text(100, 345, 'Enter Name', { 
      font: '20px Arial', 
      color: '#FAECCC', 
      backgroundColor: '#381C12', 
      padding: { x: 10, y: 5 } 
    }).setDepth(1);

    // Create DOM input element and store it
    const input = this.add.dom(110, 320, 'input', {
      type: 'text',
      name: 'player',
      fontSize: '20px',
      position: 'fixed',
      width: '200px',
      padding: '3px',
      border: '1px solid #888'
    }).setOrigin(0.5);
    
    // Append to the game div
    document.getElementById('game').appendChild(input.node);
     input.node.style.textAlign = 'center';

    

    const startButton = this.add.text(160, 440, 'Start Game', {
      font: '20px Arial',
      backgroundColor: '#381C12',
      color: '#FAECCC',
      padding: { x: 10, y: 5 },
    }).setOrigin(0.5).setInteractive();

    // Access the actual HTML element with input.node
    const getplayer = () => {
      const value = input.node.value.trim();
      // Sanitize input: remove HTML tags and limit length
      return value.replace(/<[^>]*>/g, '').substring(0, 20);
    };

    const startGame = () => {
      const player = getplayer();
      if (player !== '' && player.length >= 2) {
        this.scene.start('GameScene', { player });
      }
    };

    startButton.on('pointerdown', startGame);

    this.input.keyboard.on('keydown-ENTER', startGame);

    startButton.on('pointerover', () => {
      startButton.setStyle({ backgroundColor: '#FAECCC', color: '#381C12' }); // highlight
    });

    startButton.on('pointerout', () => {
      startButton.setStyle({ backgroundColor: '#381C12', color: '#FAECCC' }); // reset
    });
  }
  
  shutdown() {
    if (this.domElements) {
      this.domElements.forEach(element => {
        if (element && element.node) {
          element.removeFromDisplayList();
          element.destroy();
        }
      });
      this.domElements = [];
    }
  }
}