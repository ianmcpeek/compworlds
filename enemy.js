
function Enemy(game, world, animation, x, y, radius, enemyType, isleft) {
    this.animation = animation;
    this.isleft = isleft;
    this.isIdle = false;
    this.isShooting = false;
    this.enemyTypes = ["pug", "student", "teacher", "miniboss"];
    this.enemyType = enemyType;
    this.ground = 700; //temp until a bitmap is used for the map
    this.timer = 50;
    Entity.call(this, game, world, x, y, radius, 1);
    this.ctx = game.ctx;
}

Enemy.prototype = new Entity();
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function () {
  //if(this.x > this.background.center - 400 && this.x < this.background.center + 400) {
    //this.visible = true;
    //console.log("update enemy");
  //} else this.visible = false;
  //this.x -= 2;
  //pug
  if(this.enemyTypes[this.enemyType] == "pug") {
    this.pugUpdate();
  } else if(this.enemyTypes[this.enemyType] == "student") {
    this.studentUpdate();
  }
  //student
  //teacher
  //mini-boss

  if(this.timer > 0) {
    this.timer -= 1;
  } else {
    if(this.collide(this.game.player)) {
      console.log("collided with player");
      this.game.hud.brainHealth -= 1;
      this.timer = 50;
    }
  }
  Entity.prototype.update.call(this);
}

Enemy.prototype.draw = function (ctx) {
  //if(Entity.prototype.onScreen.call(this)) {
      //console.log("draw enemy");
      this.animation.drawFrame(this.game.clockTick, ctx, this.x - this.world.camera.x * 4, this.y - this.world.camera.y * 4, this.isleft);
  //}
  Entity.prototype.draw.call(this, this.ctx);
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
