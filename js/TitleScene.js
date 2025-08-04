class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  preload() {this.load.image('title_background', 'images/title_bg.png');}

  create() {
this.title_background = this.add.tileSprite(160, 240, 0, 0, 'title_background');


  this.add.text(100, 345, `Enter Name`, { font: '20px Arial', color: '#FAECCC',backgroundColor: '#381C12',padding: { x: 10, y: 5 } }).setDepth(1)

    // Create DOM input element and store it
    const input = this.add.dom(160, 400, 'input', {
      type: 'text',
      name: 'player',
      fontSize: '20px',
      width: '200px',
      padding: '5px',
      border: '1px solid #888'
    });

    const startButton = this.add.text(160, 440, 'Start Game', {
      font: '20px Arial',
      backgroundColor: '#381C12',
      color: '#FAECCC',
      padding: { x: 10, y: 5 },
    }).setOrigin(0.5).setInteractive();


    // Access the actual HTML element with input.node
    const getplayer = () => input.node.value.trim();


    const startGame = () => {
      const player = getplayer();
      if (player !== '') {
        this.scene.start('GameScene', { player });
      }
    };

    startButton.on('pointerdown', startGame);

    this.input.keyboard.on('keydown-ENTER', startGame);
  


      startButton.on('pointerover', () => {
      startButton.setStyle({ backgroundColor: '#FAECCC',color:'#381C12' }); // highlight
    });

    startButton.on('pointerout', () => {
      startButton.setStyle({ backgroundColor: '#381C12', color:'#FAECCC' }); // reset
    });
}
}
