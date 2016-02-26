
function Boss(game, world, animation, x, y, radius, isleft) {
    this.animation = animation;
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
  if(this.x === 8000) {
    this.x -= 2;
  } else if (this.x === 7000) {
    this.x += 2;
  }

  Entity.prototype.update.call(this);
}

Boss.prototype.draw = function (ctx) {
  //if(Entity.prototype.onScreen.call(this)) {
      //console.log("draw enemy");
      this.animation.drawFrame(this.game.clockTick, ctx, this.x - this.world.camera.x * 4, this.y - this.world.camera.y * 4, this.isleft);
  //}
  Entity.prototype.draw.call(this, this.ctx);
}
