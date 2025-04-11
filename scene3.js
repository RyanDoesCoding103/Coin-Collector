class Scene3 extends Phaser.Scene {
    constructor() {
      super({ key: 'Scene3' });
    }
    init(data) {
      this.score = data.score; // Retrieve the score
      console.log('Score passed from previous scene:', this.score);
    }

     preload() {
      this.load.image('sky2', 'assets/sky2.jpg');
      this.load.image('ground2', 'assets/platform1.png');
      this.load.image('star', 'assets/theStar.png');
      this.load.image('bomb', 'assets/bomb.png');
      this.load.spritesheet('dude',
        'assets/Soldier1.png',
        { frameWidth: 20, frameHeight: 20, margin: 0, spacing: 80 }
      );
    }
   
      create() {
        this.physics.world.setBounds(0, 0, 1600, 1200);
      this.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      this.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      this.add.image(400, 300, 'sky2').setScrollFactor(0);
      var score = this.score;
      this.coolDown = 0;
      var scoreText;
      scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    
      this.platforms = this.physics.add.staticGroup();
    
  
      this.platforms.create(400, 568, 'ground2').setScale(2).refreshBody();
    
      this.platforms.create(600, 400, 'ground2');
    this.platforms.create(50, 250, 'ground2');
    this.platforms.create(750, 220, 'ground2');
    this.platforms.create(1100, 400, 'ground2');
    this.platforms.create(1300, 250, 'ground2');
    this.platforms.create(1400, 500, 'ground2');
    this.platforms.create(1100, 900, 'ground2');
    this.platforms.create(100, 1175, 'ground2');
    this.platforms.create(700, 700, 'ground2');
    this.platforms.create(500, 1175, 'ground2');
    this.platforms.create(900, 1175, 'ground2');
    this.platforms.create(1300, 1175, 'ground2');
    this.platforms.create(900, 1000, 'ground2');
    
    this.lavaPlatforms = this.physics.add.group();
  
    this.lavaPlatforms.create(900, 500, 'lava');
    this.lavaPlatforms.create(500, 300, 'lava');
    this.lavaPlatforms.create(300, 200, 'lava');
    this.lavaPlatforms.create(300, 900, 'lava');
    this.lavaPlatforms.create(400, 800, 'lava');
    this.lavaPlatforms.create(200, 1000, 'lava');
    // Use an arrow function or store `this` in a variable to maintain context 
    this.lavaPlatforms.children.iterate((child) => {
      child.body.allowGravity = false;
      child.setVelocityX(Phaser.Math.Between(50, 250));
      child.body.setCollideWorldBounds(true); 
      child.body.onWorldBounds = true;
    });
    // Listen for world bounds event 
    this.physics.world.on('worldbounds', (body) => {
       // Check if the body belongs to lavaPlatforms group 
       if (this.lavaPlatforms.contains(body.gameObject)) {
         const child = body.gameObject; 
          if (child.body.position.x > 300) {
            child.setVelocityX(Phaser.Math.Between(-50, -250));
          }else{
            child.setVelocityX(Phaser.Math.Between(50, 250));
          }
        } 
    });

      this.player = this.physics.add.sprite(100, 450, 'dude');
      this.crumblyPlatform = this.physics.add.staticGroup();

      for (let j = 110; j <= 1200; j+= 220) {
        for (let i = 300; i <= 1500; i+= 100) {
            this.crumblyPlatform.create(i, j, 'crumb')
        }
      }
    // HW: Add more platforms
    this.physics.add.collider(this.player, this.crumblyPlatform, (player, platform) => {
      this.tweens.add({
        targets: platform, 
        x: platform.x + 10, 
        yoyo: true, 
        repeat: 5, 
        duration: 100
      });
      this.tweens.add({
        targets: platform, 
        alpha: 0,
        duration: 1000,
        onComplete: () => {
          platform.disableBody(true, true)
        }
      });
    }, null, this);
      this.player.setScale(2);
      this.player.setBounce(0.2);
      this.player.setCollideWorldBounds(true);
      this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, 1600, 1200);
    
      this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 9, end: 16 }),
        frameRate: 10,
        repeat: -1
      });
    
      this.anims.create({
        key: 'attack',
        frames: this.anims.generateFrameNumbers('dude', { start: 27, end: 32 }),
        frameRate: 10,
        repeat: 0
      });
    
      this.anims.create({
        key: 'turn',
        frames: this.anims.generateFrameNumbers('dude', { start: 56, end: 60 }),
        frameRate: 10
      });
    
      this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 9, end: 16 }),
        frameRate: 10,
        repeat: -1
      });
      console.log(this.anims.generateFrameNumbers('dude', { start: 0, end: 5 }))
    
      this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1
      });
    
      this.physics.add.collider(this.player, this.platforms);
      this.player.body.setGravityY(300)
      this.stars = this.physics.add.group({
        key: 'star',
        repeat: 21,
        setXY: { x: 12, y: 0, stepX: 70 }
      });
    
      this.stars.children.iterate(function (child) {
    
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        child.setScale(0.2);
      });
    
      this.physics.add.collider(this.stars, this.platforms);
      this.physics.add.overlap(this.player,this.stars, collectStar, null, this);
    
      function collectStar(player, star) {
        star.disableBody(true, true);
        score += 10;
        if (score >= 480) { 
          this.scene.start('Scene4', { score: score }); // Go to Scene4 
        }
        scoreText.setText('Score: ' + score);
        if (this.stars.countActive(true) === 0) {
          this.stars.children.iterate(function (child) {
    
            child.enableBody(true, child.x, 0, true, true);
    
          });
    
          var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    
          var bomb = this.bombs.create(x, 16, 'bomb');
          bomb.setBounce(1);
          bomb.setCollideWorldBounds(true);
          bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    
        }
      }
    
      this.bombs = this.physics.add.group();
    
      this.physics.add.collider(this.bombs, this.platforms);
    
      this.physics.add.collider(this.player, this.bombs, hitBomb, null, this);
      this.physics.add.collider(this.player, this.lavaPlatforms, hitBomb, null, this);
    
      function hitBomb(player, bomb) {
        if (this.player.anims.currentAnim && this.player.anims.currentAnim.key === 'attack' && this.player.anims.isPlaying) {
          console.log('The "attack" animation is playing');
        } else {
          this.physics.pause();
    
          this.player.setTint(0xff0000);
    
          this.player.anims.play('turn');
    
          this.gameOver = true;
        }
      }
    
    }
    update() {
      sharedUpdate(this, this.player, this.coolDown, )
    }
  }
  