
function Boss(game, world, animation, x, y, radius, isleft) {
    this.animation = animation;
    this.isleft = isleft;
    this.isIdle = false;
    this.isShooting = true;
    this.ground = 700; //temp until a bitmap is used for the map
    Enemy.call(this, game, world, x, y, radius, isleft);
    //this.ctx = game.ctx;
}

Boss.prototype = new Enemy();
Boss.prototype.constructor = Boss;

Boss.prototype.update = function () {
  //if(this.x > this.background.center - 400 && this.x < this.background.center + 400) {
    //this.visible = true;
    //console.log("update enemy");
  //} else this.visible = false;
  Enemy.prototype.update.call(this);
    //this.x -= 2;
}

Boss.prototype.draw = function (ctx) {
  //if(Entity.prototype.onScreen.call(this)) {
      //console.log("draw enemy");
      this.animation.drawFrame(this.game.clockTick, ctx, this.x - this.world.camera.x * 4, this.y - this.world.camera.y * 4, this.isleft);
  //}
  Enemy.prototype.draw.call(this, this.ctx);
}
