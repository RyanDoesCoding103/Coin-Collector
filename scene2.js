// const sharedUpdate = require( "./util/sharedUpdate");

class Scene2 extends Phaser.Scene {
      constructor() {
          super({ key: 'Scene2' });
      }
  
      preload() {
          this.load.image('sky', 'assets/sky.png');
          this.load.image('arrow', 'assets/projectile.png');
          this.load.image('ground', 'assets/platform.png');
          this.load.image('lava', 'assets/lavaPlatform.png');
          this.load.image('crumb', 'assets/crumblyPlatform.png');
  
          this.load.image('star', 'assets/theStar.png');
          this.load.image('jumpBoost', 'assets/star.png');
          this.load.image('bomb', 'assets/bomb.png');
          this.load.spritesheet('dude',
              'assets/Soldier1.png',
              { frameWidth: 20, frameHeight: 20, margin: 0, spacing: 80 }
          );
          this.load.spritesheet('attack1',
              'assets/Soldier-Attack01a.png',
              { frameWidth: 100, frameHeight: 100 }
          );
          this.load.spritesheet('walk',
              'assets/Soldier-Walk.png',
              { frameWidth: 100, frameHeight: 100 }
          );
          this.load.spritesheet('idleSprite',
                'assets/Soldier-Idle.png',
                { frameWidth: 100, frameHeight: 100 }
            );
          this.load.spritesheet('hurtSprite',
                    'assets/Soldier-Hurt.png',
                    { frameWidth: 100, frameHeight: 100 }
                );
          this.load.spritesheet('idleOrc',
                  'assets/Orc-Idle.png',
                  { frameWidth: 100, frameHeight: 100 }
              );
          this.load.spritesheet('deadOrc',
                    'assets/Orc-Death.png',
                  { frameWidth: 100, frameHeight: 100 }
                );
          this.load.spritesheet('hurtOrc',
                            'assets/Orc-Hurt.png',
                  { frameWidth: 100, frameHeight: 100 }
                );
          this.load.spritesheet('walkOrc',
                            'assets/Orc-Walk.png',
                  { frameWidth: 100, frameHeight: 100 }
                );
      }
  
      create() {
          //CREATE THE GAME WORLD AND CONTROLS
          this.physics.world.setBounds(0, 0, 1600, 1200);
          this.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
          this.a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
          this.s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
          this.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
          var score = 0;
          this.coolDown = 0;
          var scoreText;
          scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
          this.add.image(400, 300, 'sky').setScrollFactor(0);
  
          //SETUP STATIC PLATFORMS
          this.platforms = this.physics.add.staticGroup();
          this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
          this.platforms.create(600, 400, 'ground');
          this.platforms.create(50, 250, 'ground');
          this.platforms.create(750, 220, 'ground');
          this.platforms.create(1100, 400, 'ground');
          this.platforms.create(1300, 250, 'ground');
          this.platforms.create(1400, 500, 'ground');
          this.platforms.create(1100, 900, 'ground');
          this.platforms.create(100, 1175, 'ground');
          this.platforms.create(700, 700, 'ground');
          this.platforms.create(500, 1175, 'ground');
          this.platforms.create(900, 1175, 'ground');
          this.platforms.create(1300, 1175, 'ground');
          this.platforms.create(900, 1000, 'ground');
          this.platforms.create(1400, 1175, 'ground');
  
          //SETUP LAVA PLATFORMS
          this.lavaPlatforms = this.physics.add.group();
          this.lavaPlatforms.create(900, 500, 'lava');
          this.lavaPlatforms.create(500, 300, 'lava');
          this.lavaPlatforms.create(300, 200, 'lava');
          this.lavaPlatforms.create(300, 900, 'lava');
          this.lavaPlatforms.create(400, 800, 'lava');
          this.lavaPlatforms.create(200, 1000, 'lava');
  
              // LAVA BEHAVIORS
          this.lavaPlatforms.children.iterate((child) => {
              child.body.allowGravity = false;
              child.setVelocityX(Phaser.Math.Between(50, 250));
              child.body.setCollideWorldBounds(true);
              child.body.onWorldBounds = true;
          });
          
              //MAKE LAVA PLATFORMS BOUNCE
          this.physics.world.on('worldbounds', (body) => {
              if (this.lavaPlatforms.contains(body.gameObject)) {
                  const child = body.gameObject;
                  if (child.body.position.x > 300) {
                      child.setVelocityX(Phaser.Math.Between(-50, -250));
                  } else {
                      child.setVelocityX(Phaser.Math.Between(50, 250));
                  }
              }
          });
  
          //CRUMBLY PLATFORMS
//           this.crumblyPlatform = this.physics.add.staticGroup();
//           for (let j = 110; j <= 1200; j += 220) {
//               for (let i = 300; i <= 1500; i += 100) {
//                   this.crumblyPlatform.create(i, j, 'crumb')
//               }
//           }
  
          //ORC SETUP
          this.orcs = this.physics.add.group({
            key: 'idleOrc',
            repeat: 10,
            setXY: { x: 500, y: 100, stepX: 300, stepY: 100 }
        });
          this.orcs.children.iterate((orc) => {
                orc.body.setGravityY(300)
                orc.setScale(2);
                orc.body.setSize(20, 20); 
                orc.body.setOffset(40, 40);  
                orc.setBounce(0.2);
                orc.setCollideWorldBounds(true)
                orc.setVelocityX(-200); // Random initial movement
                orc.health = 3
          }); 
          this.physics.add.collider(this.orcs, this.platforms);

          //ORC ANIMATIONS
                this.anims.create({
                    key: 'walkOrc',
                    frames: this.anims.generateFrameNumbers('walkOrc', { start: 0, end: 7 }),
                    frameRate: 10,
                    repeat: -1
                });
                this.anims.create({
                    key: 'deadOrc',
                    frames: this.anims.generateFrameNumbers('deadOrc', { start: 0, end: 3 }),
                    frameRate: 10,
                    repeat: 0
                });
                this.anims.create({
                    key: 'hurtOrc',
                    frames: this.anims.generateFrameNumbers('hurtOrc', { start: 0, end: 3 }),
                    frameRate: 10,
                    repeat: 0
                });
                
          //PLAYER SETUP
          this.player = this.physics.add.sprite(100, 450, 'walk');
          this.player.body.setGravityY(300)
          this.player.setScale(2);
          this.player.body.setSize(20, 20); 
          this.player.body.setOffset(40, 40);  
          this.player.setBounce(0.2);
          this.player.setCollideWorldBounds(true);
          this.cameras.main.startFollow(this.player);
          this.cameras.main.setBounds(0, 0, 1600, 1200);
          // Player health
          this.maxHealth = 100;
          this.playerHealth = 100;
                // Create a health bar background
                this.healthBarBG = this.add.graphics();
                this.healthBarBG.fillStyle(0x000000, 1);  // black
                // x=20, y=20 for example, width=200, height=20
                this.healthBarBG.fillRect(20, 20, 200, 20); 
                this.healthBarBG.setScrollFactor(0); // so it stays in place as the camera moves

                // Create a health bar fill
                this.healthBarFill = this.add.graphics();
                this.healthBarFill.setScrollFactor(0); 
  
              //PLAYER ANIMATIONS
          this.anims.create({
              key: 'left',
              frames: this.anims.generateFrameNumbers('walk', { start: 0, end: 7 }),
              frameRate: 10,
              repeat: -1
          });
          this.anims.create({
              key: 'attack',
              frames: this.anims.generateFrameNumbers('attack1', { start: 0, end: 5 }),
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
              frames: this.anims.generateFrameNumbers('walk', { start: 0, end: 7 }),
              frameRate: 10,
              repeat: -1
          });
          this.anims.create({
              key: 'idle',
              frames: this.anims.generateFrameNumbers('idleSprite', { start: 0, end: 5 }),
              frameRate: 10,
              repeat: -1
          });
          this.anims.create({
              key: 'hurt',
              frames: this.anims.generateFrameNumbers('hurtSprite', { start: 0, end: 3 }),
              frameRate: 10,
              repeat: 0
        });
          
              //PLAYER COLLISIONS w/ PLATFORMS
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
          this.physics.add.collider(this.player, this.platforms);
  
               //PLAYER COLLISION WITH ORC
                this.physics.add.collider(this.player, this.orcs, orcPlayerCollision, null, this)
                function orcPlayerCollision(player, orc) {
                        if (!(orc.anims.currentAnim && 
                           (orc.anims.currentAnim.key === 'hurtOrc') && 
                                orc.anims.isPlaying)) {
                                        console.log(orc.health)
                                        // We hurt the orc
                                        //WORK ON ENEMENY BOUNCING OFF PLAYER
                                orc.health = orc.health-1
                                orc.anims.play('hurtOrc')
                                if(orc.health <= 0) {
                                        orc.anims.play('deadOrc');
                                        orc.on("animationcomplete", ()=>{
                                                this.orcs.remove(orc, true, true)
                                                orc.destroy()
                                        })
                                }

                        }
                        
                         
                        if (this.player.anims.currentAnim && 
                                (player.anims.currentAnim.key === 'attack' || player.anims.currentAnim.key === 'hurt') && 
                                this.player.anims.isPlaying) {
                               
                        } else {
                                // Player takes damage
                                this.playerHealth -= 20; // for example
                                this.updateHealthBar();  // update the bar
                                this.player.anims.play('hurt');
                        
                                // Check if player is dead
                                if (this.playerHealth <= 0) {
                                this.physics.pause();
                                this.player.setTint(0xff0000);
                                this.player.anims.play('turn');
                                this.gameOver = true;
                                }
                        }
                 }       
  
          //STARS
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
          this.physics.add.overlap(this.player, this.stars, collectStar, null, this);
  
              //COLLECTING STARS
          function collectStar(player, star) {
              star.disableBody(true, true);
              score += 1;
              if (score >= 240) {
                  this.scene.start('Scene3', { score: score }); // Go to Scene3 
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
  
          //BOMBS
          this.bombs = this.physics.add.group();
          this.physics.add.collider(this.bombs, this.platforms);
          this.physics.add.collider(this.player, this.bombs, hitBomb, null, this);
          this.physics.add.collider(this.player, this.lavaPlatforms, hitBomb, null, this);
  
              //BOMB COLLISIONS
          function hitBomb(player, bomb) {
              if (this.player.anims.currentAnim && 
                (this.player.anims.currentAnim.key === 'attack' || this.player.anims.currentAnim.key === 'hurt') && 
                this.player.anims.isPlaying) {
                  console.log('The "attack" animation is playing');
              } else {
                  
                // Player takes damage
                this.playerHealth -= 50; // for example
                this.updateHealthBar();  // update the bar
    
                // Check if player is dead
                if (this.playerHealth <= 0) {
                        this.physics.pause();
                        this.player.setTint(0xff0000);
                        this.player.anims.play('turn');
                        this.gameOver = true;
              }
          }
        }
          //PROJECTILES
          this.projectileGroup = this.physics.add.group();
          this.physics.add.collider(this.projectileGroup, this.orcs, orcProjectileCollision, null, this)
          
          //ORC & PROJECTLE COLLISION
          function orcProjectileCollision(projectile, orc){
                projectile.destroy()
                orc.health = orc.health-1
                orc.anims.play('hurtOrc')
                if(orc.health <= 0) {
                        orc.anims.play('deadOrc');
                        orc.on("animationcomplete", ()=>{
                                this.orcs.remove(orc, true, true)
                                orc.destroy()
                        })
                }
          } 
          this.updateHealthBar = function() {
                // Clear existing fill
                this.healthBarFill.clear();
            
                // Calculate percentage
                let healthRatio = this.playerHealth / this.maxHealth;
                if (healthRatio < 0) healthRatio = 0;
            
                // Draw the fill (red)
                this.healthBarFill.fillStyle(0xff0000, 1);
                this.healthBarFill.fillRect(20, 20, 200 * healthRatio, 20);
            };
  
          //JUMP BOOST
          var jumpBoost = this.physics.add.sprite(100, 100, "jumpBoost")
          this.physics.add.collider(jumpBoost, this.platforms);
  
      }
      update() {
          sharedUpdate(this, this.player, this.coolDown, this.orcs)
      }
      fireProjectile() {
          let projectile = this.projectileGroup.create(this.player.x, this.player.y, 'arrow');
          const speed = 600;
          if (this.player.flipX == true) {
              projectile.setVelocityX(-speed)
          } else {
              projectile.setVelocityX(speed)
          }
      }
  }
