
function Enemy(game, world, animation, x, y, radius, stats, isleft) {
    this.animation = animation;
    this.isleft = isleft;
    this.isIdle = false;
    this.enemyTypes = ["pug", "student", "teacher", "miniboss", "boss"];
    this.enemyType = stats.t;
    this.health = stats.h;//later added as parameter
    this.damage = stats.d
    this.ground = y; //used for jump reference
    this.timer = 50;

    this.slowTimer = 0;
    this.speed; //added as parameter later

    Entity.call(this, game, world, x, y, radius, 1);
    this.ctx = game.ctx;

    //if teacher, initialize teacher
    if(this.enemyTypes[this.enemyType] == "teacher") {
      this.teacherInit();
    } else if(this.enemyTypes[this.enemyType] == "miniboss") {
      this.minibossInit();
    } else if(this.enemyTypes[this.enemyType] == "boss") {
      this.bossInit();
    }
    //if miniboss, initialize miniboss
    //if boss, initilize boss
}

Enemy.prototype = new Entity();
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function () {


  if(Entity.prototype.offScreen.call(this)) {
    this.visible = false;
  } else {
    if(this.enemyTypes[this.enemyType] == "pug") {
      this.pugUpdate();
    } else if(this.enemyTypes[this.enemyType] == "student") {
      this.studentUpdate();
    } else if(this.enemyTypes[this.enemyType] == "teacher") {
      this.teacherUpdate();
    } else if(this.enemyTypes[this.enemyType] == "miniboss") {
      this.minibossUpdate();
    } else if(this.enemyTypes[this.enemyType] == "boss") {
      this.bossUpdate();
    }

    if(this.timer > 0) {
      this.timer -= 1;
    } else {
      if(this.collide(this.game.player)) {
        console.log("collided with player");
        this.game.hud.healthDown(this.damage);
        this.timer = 50;
      }
    }
    if(this.health < 1) {
      this.removeFromWorld = true;
      if(this.enemyTypes[this.enemyType] == "miniboss" || this.enemyTypes[this.enemyType] == "boss")
          this.world.unlockScreen();
    }
    Entity.prototype.update.call(this);
    this.visible = true;
  }
}

Enemy.prototype.draw = function (ctx) {
  if(this.enemyTypes[this.enemyType] == "boss") {
    this.bossDraw(ctx);
  } else {
    if(this.visible) {
      if(this.jumping) {
        this.jumpAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.world.camera.x * 4, this.y - this.world.camera.y * 4, this.isleft);
      } else {
          this.animation.drawFrame(this.game.clockTick, ctx, this.x - this.world.camera.x * 4, this.y - this.world.camera.y * 4, this.isleft);
      }
    }
    Entity.prototype.draw.call(this, this.ctx);
  }
}

Enemy.prototype.collide = function (ent) {
  if(this.game.player) {
    //apply radius to x & y to center entity position
    //temp workaround
    var difX = ((this.x - this.world.camera.x * 4) + this.radius) - ((ent.worldX  - this.world.camera.x*4) + ent.radius);
    var difY = ((this.y - this.world.camera.y * 4) + this.radius) - (ent.worldY + ent.radius);
    var dist = Math.sqrt(difX * difX + difY * difY);
    //debugging
    var rad = this.radius + ent.radius
    return dist < this.radius + ent.radius;
  }
    return false;
};

Enemy.prototype.pugUpdate = function() {
  this.x -= 4;
}

Enemy.prototype.studentUpdate = function() {
  //initialize timers
  if(!this.idleTimer && !this.walkTimer) {
    //console.log("student not set");
    this.idleTimer = 30; this.walkTimer = 80;
    this.isleft = !this.isleft;
  }
  if(this.walkTimer > 0) {
    var dir = this.isleft ? -1 : 1;
    this.x += 2*dir;
    this.walkTimer -= 1;
  } else if(this.idleTimer > 0) {
    this.idleTimer -= 1;
  }
}

/* TEACHER FUNCTIONS */

Enemy.prototype.teacherInit = function() {
  this.jumpTimer = 200;
  this.jumping = false;
  this.jumpAnimation = new Animation(AM.getAsset("./img/teacher.png"), 0, 1, 90, 105, 0.3, 5, false);
}

Enemy.prototype.teacherUpdate = function() {
  //make sure enemy is facing player
  var dir = this.runToPlayer();
  if (dir < 0) this.isleft = true;
  else this.isleft = false;

  if(this.jumpTimer > 0 && !this.jumping) {
    this.jumpTimer -= 1;
    this.x += 1 * dir;
  } else if(!this.jumping) {
    this.jumping = true;
    this.jumpTimer = 200;
  }
  this.jump(300);
}

/* MINIBOSS FUNCTIONS*/
Enemy.prototype.minibossInit = function() {
  this.shootTimer = 100;
  this.jumpTimer = 200;
  this.jumping = false;
  this.jumpAnimation = new Animation(AM.getAsset("./img/mini-boss.png"), 0, 6.85, 125, 149, 0.2, 10, false);
}

Enemy.prototype.minibossUpdate = function() {
  if(this.x + this.radius*2 - this.game.player.worldX < 400)this.world.lockScreen();

  if(this.jumpTimer > 0 && !this.jumping) {
    this.jumpTimer -= 1;
    //determine if direction, miniboss sprite faces left, so this is reversed
    var dir = this.runToPlayer();
    if (dir < 0) this.isleft = false;
    else this.isleft = true;
    //determine whether to stop before running offscreen
    if(this.isleft) {
      if(!this.world.collideRightWall(this, 2)) this.x += 2;
    } else {
      if(!this.world.collideLeftWall(this, 2)) this.x += -2;
    }
  } else if(!this.jumping) {
    this.jumping = true;
    this.jumpTimer = 200;
  }
  this.jump(500);
  if(this.jumping) {
    if(this.isleft) {
      if(!this.world.collideRightWall(this, 6)) this.x += 6;
    } else {
      if(!this.world.collideLeftWall(this, 6)) this.x += -6;
    }
  }

  //determine when to shoot
  if(this.shootTimer > 0 && !this.jumping) {
    this.shootTimer -= 1;
  } else if (!this.jumping){
    this.game.addEntity(new Projectile(this.game, this.world, AM.getAsset("./img/f.png"), this.x, this.y, this.radius, this.damage, !this.isleft));
    this.shootTimer = 150;
  }
}

/* PROFESSOR GROWLER FUNCTIONS */
Enemy.prototype.bossInit = function() {
  this.shootTimer = 100;
  this.shooting = false;
  this.jumpTimer = 200;
  this.jumping = false;
  this.belchSound = new Howl({urls: ["./sounds/effects/belch.mp3"], loop: false});
  this.jumpAnimation = new Animation(AM.getAsset("./img/professor_growler.png"), 0, 2, 160, 160, 1.2, 3, false);
  this.mouthAnimation = new Animation(AM.getAsset("./img/professor_growler.png"), 320, 0, 160, 160, 0.2, 4, false);
}

Enemy.prototype.bossUpdate = function() {
  if(this.x + this.radius*2 - this.game.player.worldX < 400) this.world.lockScreen();

  if(this.jumpTimer > 0 && !this.jumping) {
    this.jumpTimer -= 1;
    //determine if direction, miniboss sprite faces left, so this is reversed
    var dir = this.runToPlayer();
    if (dir < 0) this.isleft = true;
    else this.isleft = false;
    //determine whether to stop before running offscreen
  } else if(!this.jumping && !this.shooting) {
    this.jumping = true;
    this.jumpTimer = 200;
  }
  this.jump(500);
  if(this.jumping) {
    if(!this.isleft) {
      if(!this.world.collideRightWall(this, 6)) this.x += 6;
    } else {
      if(!this.world.collideLeftWall(this, 6)) this.x += -6;
    }
  }

  //determine when to shoot
  if(this.shootTimer > 0 && !this.jumping) {
    this.shootTimer -= 1;
  } else if (!this.jumping){
    this.shooting = true;
    if(this.mouthAnimation.isDone()) {
      this.game.addEntity(new Projectile(this.game, this.world, AM.getAsset("./img/f.png"), this.x, this.y, this.radius, this.damage, this.isleft));
      this.belchSound.play();
      this.shootTimer = 100;
      this.shooting = false;
      this.mouthAnimation.elapsedTime = 0;
    }
  }
}

Enemy.prototype.bossDraw = function(ctx) {
  if(this.visible) {
    if(this.jumping) {
      this.jumpAnimation.drawStill(this.ctx, 1, 2, this.x - this.world.camera.x*4, this.y - this.world.camera.y*4, this.isleft);
      this.jumpAnimation.advanceFrame(this.game.clockTick);
    } else if(this.shooting) {
      this.mouthAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.world.camera.x * 4, this.y - this.world.camera.y * 4, this.isleft);
    } else {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x - this.world.camera.x * 4, this.y - this.world.camera.y * 4, this.isleft);
    }
  }
  Entity.prototype.draw.call(this, this.ctx);
}

/* PROJECTILE & RELATED FUNCTIONS */
function Projectile(game, world, spritesheet, x, y, radius, damage, isleft) {
  this.animation = new Animation(spritesheet, 0, 0, 64, 64, 0.08, 1, true);
  this.isleft = isleft;
  this.ctx = game.ctx;
  this.damage = damage;
  Entity.call(this, game, world, x, y+radius, 16, 2);
}

Projectile.prototype = new Entity();

Projectile.prototype.update = function() {
  //check if went offscreen
  if(Entity.prototype.offScreen.call(this)) {
    this.removeFromWorld = true;
    console.log("off screen projectile!");
  }
  //check if projectile hit player
  if (this.hit(this.game.player)) {
    this.game.hud.healthDown(this.damage);
    this.removeFromWorld = true;
  }

  if(this.isleft) {
    this.x -= 6;
  } else {
    this.x += 6;
  }
}

Projectile.prototype.draw = function() {
  //ctx, xindex, yindex, x, y, direction
    this.animation.drawStill(this.ctx, 0, 0, this.x - this.world.camera.x*4, this.y - this.world.camera.y*4, false);
    Entity.prototype.draw.call(this, this.ctx);
}

Projectile.prototype.hit = function (ent) {
  if(ent.entityTypes[ent.entityType] == "player") {
    //apply radius to x & y to center entity position
    //temp workaround
    var difX = ((this.x + this.radius) - this.world.camera.x*4) - ((ent.worldX  - this.world.camera.x*4) + ent.radius);
    var difY = (this.y + this.radius) - (ent.worldY + ent.radius);
    var dist = Math.sqrt(difX * difX + difY * difY);
    //debugging
    var rad = this.radius + ent.radius
    return dist < this.radius + ent.radius;
  }
    return false;
};

/* GENERAL FUNCTIONS */

//account for either direction
Enemy.prototype.updateXSpeed = function () {
  var speedDown = 0;
  if (this.slowTimer > 0) {
    speedDown = this.speed / 2;
    this.slowTimer -= 1;
  }
  this.x += this.speed - speedDown ;
}

Enemy.prototype.jump = function (totalHeight) {
  if(this.jumping) {
    if (this.jumpAnimation.isDone()) {
        this.jumpAnimation.elapsedTime = 0;
        this.jumping = false;
    }
    var jumpDistance = this.jumpAnimation.elapsedTime / this.jumpAnimation.totalTime;

    if (jumpDistance > 0.5)
        jumpDistance = 1 - jumpDistance;

    //var height = jumpDistance * 2 * totalHeight;
    var height = totalHeight*(-4 * (jumpDistance * jumpDistance - jumpDistance));
    this.y = this.ground - height;
  }
}

Enemy.prototype.runToPlayer = function() {
  if(this.game.player.worldX < this.x) return -1;
  else return 1;
}
