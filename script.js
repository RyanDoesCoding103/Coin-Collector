

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#f9f9f9",
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 550,
      },
      debug: true,
    },
  },
  scene: [MainMenu, Scene2, Scene3, Scene4, EndScene]
};

const game = new Phaser.Game(config);
