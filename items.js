function Item(game, world, sheet, x) {
    this.pickup = new Howl({urls: ["./sounds/effects/shiny2.mp3"], loop: false});
    this.bounceAnimation 	= new Animation(sheet, 0, 0, 32, 32, 1, 1, true);
    this.ground = 700;
    Entity.call(this, game, world, x, 600, 16, 3);
}

Item.prototype = new Entity();
Item.prototype.constructor = Item;

Item.prototype.update = function () {
  if(this.collide(this.game.player)) {
    this.game.hud.healthUp(2);
    this.pickup.play();
    this.removeFromWorld = true;
  }
	var bounceDistance = this.bounceAnimation.elapsedTime / this.bounceAnimation.totalTime;
    var totalHeight = 20;

    var height = totalHeight*(-4 * (bounceDistance * bounceDistance - bounceDistance));
    this.y = this.ground - height;
}

Item.prototype.draw = function (ctx) {
  //if(Entity.prototype.onScreen.call(this)) {
    this.bounceAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.world.camera.x * 4, this.y);
  //}
  Entity.prototype.draw.call(this, this.ctx);
}

Item.prototype.collide = function (ent) {
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
