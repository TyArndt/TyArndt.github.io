
class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" });
  }

  preload() {
    // Load all game assets here for better performance
    this.load.image('player', 'images/player.png');
    this.load.image('tower', 'images/tower.png');
    this.load.image('background', 'images/bg.png');
    this.load.image('rootbeer', 'images/rootbeer.png');
    this.load.image('title_background', 'images/title_bg.png');
    
    this.load.on('loaderror', (file) => {
      console.warn(`Failed to load asset: ${file.key} from ${file.url}`);
    });
  }

  create() {
    this.scene.start("TitleScene");
  }
}
