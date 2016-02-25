function Item(game, world, sheet, x) {
    this.bounceAnimation 	= new Animation(sheet, 0, 0, 32, 32, 1, 1, true);
    this.ground = 700;
    Entity.call(this, game, world, x, 600, 16, 3);
}

Item.prototype = new Entity();
Item.prototype.constructor = Item;

Item.prototype.update = function () {
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
