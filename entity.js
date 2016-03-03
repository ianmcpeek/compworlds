function Entity(game, world, x, y, radius, type) {
    this.game = game;
    this.world = world;
    this.x = x;
    this.y = y;
    this.worldX = x;
    this.worldY = y;
    this.centered = false;
    this.radius = radius;
    this.entityTypes = ["player", "enemy", "projectile", "item", "platform", "Hprojectile", "boss", "stair"];
    this.entityType = type;
    this.removeFromWorld = false;
}

Entity.prototype.update = function () {
  if(this.health < 1) this.removeFromWorld = true;
};

Entity.prototype.draw = function (ctx) {
    //console.log("am I being drawn?");
    if (this.game.debug) { //&& this.onScreen()) {
      //console.log("draw outline")
        this.game.ctx.strokeStyle = "red";
        if(this.entityTypes[this.entityType] == "player") {
          this.game.ctx.strokeRect(this.x, this.y, this.radius*2, this.radius*2);
        } else {
            this.game.ctx.strokeRect((this.x - this.world.camera.x*4), (this.y - this.world.camera.y*4), this.radius*2, this.radius*2);
        }
    }
};

Entity.prototype.offScreen = function () {
  return false;
  // console.log("ent x: " + this.x - this.world.camera.x*4);
  // console.log("camera x: " + this.world.camera.x + 800);
  // return (this.x - this.world.camera.x*4 > this.world.camera.x + 800 || (this.x + this.radius*2) - this.world.camera.x*4 < this.world.camera.x)
  //     || (this.y  - this.world.camera.y*4> this.world.camera.y + 800 || (this.y + this.radius*2) - this.world.camera.y*4 < this.world.camera.y);
};

//Entity.prototype = new Entity();
//Entity.prototype.constructor = Entity;

// Entity.prototype.collideRight = function () {
//     return this.x + this.radius > 1600;
// };
// Entity.prototype.collideLeft = function () {
//     return this.x - this.radius < 0;
// };
// Entity.prototype.collideBottom = function () {
//     return this.y + this.radius > 1600;
// };
// Entity.prototype.collideTop = function (ent) {
//     return ent.y == this.y  + && ent.x < this.x + this.radius*2 && this.y > this.x;
// };
