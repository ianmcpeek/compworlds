function Item(game, world, sheet, x, y, etype) {
    this.pickup = new Howl({urls: ["./sounds/effects/shiny2.mp3"], loop: false});
    this.effects = ["healthup","healthdown", "fireup", "moveup", "slowdown", "damagedown"];
    this.etype = etype;
    this.bounceAnimation 	= new Animation(sheet, 0, 0, 32, 32, 1, 1, true);
    this.ground = y+100;
    Entity.call(this, game, world, x, 600, 16, 3);
}

Item.prototype = new Entity();
Item.prototype.constructor = Item;

Item.prototype.update = function () {
  if(this.collide(this.game.player)) {
    if(this.effects[this.etype] == "healthup") {
        this.game.hud.healthUp(2);
        this.game.addPopup(new Popup(this.x, this.y - 50, this.world, "Brainpower Restored", "green"));
    } else if(this.effects[this.etype] == "healthdown") {
        this.game.hud.healthDown(2);
        this.game.addPopup(new Popup(this.x, this.y - 50, this.world, "Brainpower Decayed", "green"));
    } else if(this.effects[this.etype] == "fireup") {
        this.game.hud.fireup = true;
        this.game.hud.fireTimer = 200;
        this.game.player.throwAnimation.setFireUp();
        this.game.addPopup(new Popup(this.x, this.y - 50, this.world, "More Sandwiches", "red"));
    } else if(this.effects[this.etype] == "moveup") {
        this.game.player.speedTimer = 400;
        this.game.addPopup(new Popup(this.x, this.y - 50, this.world, "Faster Movement", "red"));
    } else if(this.effects[this.etype] == "slowdown") {
      this.game.hud.slowdown = true;
      this.game.hud.slowTimer = 200;
      this.game.addPopup(new Popup(this.x, this.y - 50, this.world, "Sandwiches Slow Enemies", "yellow"));
    } else if(this.effects[this.etype] == "damagedown") {
      this.game.hud.buffTimer = 400;
      this.game.addPopup(new Popup(this.x, this.y - 50, this.world, "Thick Skin", "yellow"));
    }
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

function Popup(x, y, world, message, color) {
  this.x = x - 150;
  this.y = y;
  this.message = message;
  this.color = color;
  this.timer = 50;
  this.world = world;
  this.removeFromWorld = false;
}

Popup.prototype.update = function() {
  if(this.timer > 0) {
    this.timer -= 1;
  } else {
    this.removeFromWorld = true;
  }
}

Popup.prototype.draw = function(ctx) {
  ctx.font="30px Courier New";
  ctx.fillStyle = this.color;
  ctx.fillText(this.message, this.x - this.world.camera.x * 4, this.y);
}
