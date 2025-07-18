class EndScene extends Phaser.Scene {
    constructor() {
      super({ key: 'EndScene' });
    }
  
    preload () {
      // simple background & button graphics
      //this.load.image('titleBG', 'assets/titleBG.png');
      this.load.image('btnStart', 'assets/btnStart.png');
      this.load.image('btnOptions', 'assets/btnOptions.png');
  
      // for the sound on/off icon in the options panel
      this.load.image('iconSoundOn',  'assets/iconSoundOn.png');
      this.load.image('iconSoundOff', 'assets/iconSoundOff.png');
      // for menu sounds
      this.load.audio('musicMenu', 'assets/gameMenu.mp3');
      //Jingle_Lose_00.wav by LittleRobotSoundFactory -- https://freesound.org/s/270329/ -- License: Attribution 4.0
      this.load.audio('lose', 'assets/loseMusic.wav');
    }
  
    create () {
      // 1) Background & title
      //this.add.image(400, 300, 'titleBG').setOrigin(0.5);
      this.lose = this.sound.add('lose', { volume: 0.8 });
      this.lose.play();
      this.musicMenu = this.sound.add('musicMenu', { volume: 0.5, loop: true });
      this.musicMenu.play();
  
      const titleText = this.add.text(400, 120, 'Game Over', {
        fontSize: '49px',
        fill: '#ad0404'
      }).setOrigin(0.5);
  
      // 2) “Start Game” button
      const startBtn = this.add.image(400, 250, 'btnStart').setInteractive();
      startBtn.setScale(0.1)
      startBtn.on('pointerup', () => {
        this.musicMenu.stop();
        this.scene.start('Scene2');          // jump to your first level scene
      });
  
      // 3) “Options” button
      const optBtn = this.add.image(400, 340, 'btnOptions').setInteractive();
      optBtn.setScale(0.1)
      optBtn.on('pointerup', () => {
        this.openOptionsPanel();
      });
  
      // 4) A simple fade-in
      this.cameras.main.fadeIn(700);
    }
  
    /* ---------- helper: mini options panel ---------- */
    openOptionsPanel () {
      // dark overlay
      const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.6)
                               .setInteractive();  // block clicks behind it
  
      // panel background
      const panel = this.add.rectangle(400, 300, 300, 180, 0x333333, 0.9)
                             .setStrokeStyle(2, 0xffffff);
  
      const label = this.add.text(400, 250, 'Sound', {

        fontSize: '24px',
        color: '#ffffff'
      }).setOrigin(0.5);
  
      // sound toggle icon (reflects current global mute state)
      const iconKey = this.sound.mute ? 'iconSoundOff' : 'iconSoundOn';
      const soundBtn = this.add.image(400, 315, iconKey).setInteractive();
      soundBtn.setScale(0.08)
  
      soundBtn.on('pointerup', () => {
        // toggle Phaser’s global mute
        this.sound.mute = !this.sound.mute;
        // swap icon texture
        soundBtn.setTexture(this.sound.mute ? 'iconSoundOff' : 'iconSoundOn');
      });
  
      // close button
      const closeText = this.add.text(400, 375, 'CLOSE', {
        fontSize: '20px',
        backgroundColor: '#555',
        padding: { left: 10, right: 10, top: 5, bottom: 5 }
      }).setOrigin(0.5).setInteractive();
  
      closeText.on('pointerup', () => {
        overlay.destroy(); panel.destroy(); label.destroy();
        soundBtn.destroy(); closeText.destroy();
      });
    }
  }