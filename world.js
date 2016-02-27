/*
    Stores all information about the world.
*/
//background code
function Background(game, backgroundImage) {
    this.image = backgroundImage;
    this.radius = 200;
    this.camera = {x: 0, y: 0};
    this.worldEnds = {top: 0, bottom: 0, left: 0, right: 3410};
}

Background.prototype.update = function () {
};

Background.prototype.draw = function (ctx) {
  ctx.drawImage(this.image,
               this.camera.x, 1523 - this.camera.y,
               200, 200,
               0, 0,  // source from sheet
               800, 800);
};

function Hud(game, spritesheet, brainz) {
  this.brainImage = new Animation(spritesheet, 0, 0, 64, 64, 0.05, 5);
  this.braincount = brainz;
  this.brainHealth = brainz*4;//add in actual starting health
  this.brainTotalHealth = brainz*4;
  this.game = game;
  this.ctx = game.ctx;
};

Hud.prototype.update = function() {
};

Hud.prototype.draw = function() {
    var wholeBrainz = Math.floor(this.brainHealth / 4);
    //draw whole brainz
    var brainX = 20;
    for(var i = 0; i < wholeBrainz; i++) {
        this.brainImage.drawStill(this.ctx, 0, 0, brainX, 20);
        brainX += 60;
    }
    //draw partial brain if any
    if(this.brainHealth % 4 > 0) {
        this.brainImage.drawStill(this.ctx, this.brainHealth % 4, 0, brainX, 20);
        brainX += 60;
    }
    //draw empty brainz
    var deadBrainz = Math.floor((this.brainTotalHealth - this.brainHealth)/4);
    for(var i = 0; i < deadBrainz; i++) {
        this.brainImage.drawStill(this.ctx, 4, 0, brainX, 20);
        brainX += 60;
    }
};


function Platform(game, world, x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.game = game;
  this.world = world;
  //function Entity(game, world, x, y, radius, type)
  Entity.call(game, x, y, width,4);

}


Platform.prototype = new Entity();
Platform.prototype.update = function() {

}

Platform.prototype.draw = function() {
  this.game.ctx.strokeRect(this.x - this.world.camera.x * 4, this.y - this.world.camera.y * 4, this.width, this.height);
}

Platform.prototype.collideTop = function (ent) {
    var diffY = Math.abs(ent.y + ent.radius*2 - this.y) <= 5;
    var diffX = ent.worldX + ent.radius < this.x + this.width && ent.worldX + ent.radius > this.x;
    return diffY && diffX;
};
