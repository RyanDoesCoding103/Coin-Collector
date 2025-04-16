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
    }
    // ORC MOVEMENT
    orcs.children.iterate((orc) => {
      if (!orc.active){
        return
      }
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
  }
