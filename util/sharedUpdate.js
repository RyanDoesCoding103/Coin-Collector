function sharedUpdate(scene, player, coolDown, orcs, customLogic = () => {}) {
    let cursors = scene.input.keyboard.createCursorKeys();
    var spaceBar = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    if (cursors.left.isDown) {
      player.setVelocityX(-500);
      player.setFlipX(true)
      //add the if statement here
      if (player.anims.currentAnim && (player.anims.currentAnim.key === 'attack' || player.anims.currentAnim.key === 'hurt') && 
        player.anims.isPlaying) {
        console.log('The "attack" animation is playing');
      } else {
        player.anims.play('left', true);
      }
    } else if (cursors.right.isDown) {
      player.setVelocityX(500);
      player.setFlipX(false)
      
      if (player.anims.currentAnim && (player.anims.currentAnim.key === 'attack' || player.anims.currentAnim.key === 'hurt') && 
        player.anims.isPlaying) {
        console.log('The "attack" animation is playing');
      } else {
        player.anims.play('right', true);
      }
  
    } else if (spaceBar.isDown) {
      if (!((player.anims.currentAnim.key === 'attack' || player.anims.currentAnim.key === 'hurt') &&
         player.anims.isPlaying)) {
        player.anims.play('attack', true);
        coolDown = scene.time.now + 1000;
        scene.sfxSword.play();          //  ←  sound trigger
        scene.fireProjectile();
      }
      
    } else {
      player.setVelocityX(0);
      
      if (player.anims.currentAnim &&
        (player.anims.currentAnim.key === 'attack' || player.anims.currentAnim.key === 'hurt') &&
          player.anims.isPlaying) {
        console.log('The "attack" animation is playing');
      } else {
        player.anims.play('idle', true);
      }
  
    }
  
    if (cursors.up.isDown && player.body.touching.down) {
      player.setVelocityY(-600);
      scene.sfxJump.play(); 
    }
    // ORC MOVEMENT
    orcs.children.iterate((orc) => {
      if (!orc.active){
        return
      }
      orc.anims.play('walkOrc', true);
      // Position the bar background
      orc.healthBarBG.x = orc.x - 15;  // shift half the width
      orc.healthBarBG.y = orc.y + orc.healthBarOffsetY;

      // Position the bar fill
      orc.healthBarFill.x = orc.x - 15;
      orc.healthBarFill.y = orc.y + orc.healthBarOffsetY;
      if(orc.body.blocked.left){
        orc.setVelocityX(200)
        orc.setFlipX(false)
      }else if(orc.body.blocked.right){
        orc.setVelocityX(-200)
        orc.setFlipX(true)
      }
    })
    //ELITE ORC
    if (!scene.eliteOrc.active){
      return
    }
    // Position the bar background
    scene.eliteOrc.healthBarBG.x = scene.eliteOrc.x - 15;  // shift half the width
    scene.eliteOrc.healthBarBG.y = scene.eliteOrc.y + scene.eliteOrc.healthBarOffsetY;

    // Position the bar fill
    scene.eliteOrc.healthBarFill.x = scene.eliteOrc.x - 15;
    scene.eliteOrc.healthBarFill.y = scene.eliteOrc.y + scene.eliteOrc.healthBarOffsetY;
        // At the bottom of update():
    const distanceX = scene.player.x - scene.eliteOrc.x;
    // If far from the player, move closer
    if (Math.abs(distanceX) > 10) {
      let speed = 100; // or 200, etc.
      if (distanceX > 0) {
        // Move right
        scene.eliteOrc.setVelocityX(speed);
        scene.eliteOrc.setFlipX(false);
      } else {
        // Move left
        scene.eliteOrc.setVelocityX(-speed);
        scene.eliteOrc.setFlipX(true);
      }
      scene.eliteOrc.anims.play('walkOrc', true);
    } else {
      // close enough, go idle or do an attack
      scene.eliteOrc.setVelocityX(0);
      scene.eliteOrc.anims.play('idleOrc', true);

      // Possibly jump if the player is above the orc
      if (scene.player.y < scene.eliteOrc.y - 50 && scene.eliteOrc.body.blocked.down) {
        scene.eliteOrc.setVelocityY(-400);
      }
    }
    // DRAGON MOVEMENT
    scene.dragons.children.iterate((orc) => {
      if (!orc.active){
        return
      }
      // Position the bar background
      orc.healthBarBG.x = orc.x - 15;  // shift half the width
      orc.healthBarBG.y = orc.y + orc.healthBarOffsetY;

      // Position the bar fill
      orc.healthBarFill.x = orc.x - 15;
      orc.healthBarFill.y = orc.y + orc.healthBarOffsetY;
      // if(orc.body.blocked.left){
      //   orc.setVelocityX(200)
      //   orc.setFlipX(false)
      // }else if(orc.body.blocked.right){
      //   orc.setVelocityX(-200)
      //   orc.setFlipX(true)
      // }
    })
  }
