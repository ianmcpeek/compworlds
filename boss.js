
function Boss(game, world, spritesheet, x, y, radius, isleft) {
    this.animation = new Animation(spritesheet, 0, 0, 160, 160, 0.5, 3, true, true);
    this.jumpAnimation = new Animation(spritesheet, 150, 316, 168, 167, 1.2, 1, false, true);
    this.mouthAnimation = new Animation(spritesheet, 480, 0, 160, 160, 0.3, 3, false, true);
    this.x = x;
    this.isleft = isleft;
    this.isIdle = false;
    this.isShooting = true;
    this.ground = 700; //temp until a bitmap is used for the map
    Entity.call(this, game, world, x, y, radius, 6);
    this.ctx = game.ctx;
}

Boss.prototype = new Entity();
Boss.prototype.constructor = Boss;

Boss.prototype.update = function () {
  if (this.x === 4000) {
    this.x -= 2;
  } else if (this.x === 3000) {
    this.x += 2;
  }

  Entity.prototype.update.call(this);
}

Boss.prototype.draw = function (ctx) {
  this.animation.drawFrame(this.game.clockTick, ctx, this.x - this.world.camera.x * 4, this.y - this.world.camera.y * 4, this.isleft);
  //this.mouthAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.isleft);
  Entity.prototype.draw.call(this, ctx);
}
