     class Scene1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene1' });
    }
  
    create() {
      this.add.text(20, 20, 'Loading...', { fontSize: '32px', color: "#000000" })
  
      setTimeout(() => {
        this.scene.start('Scene2')
      }, 2000)
    }
  }
  