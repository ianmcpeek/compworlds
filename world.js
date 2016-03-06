/*
    Stores all information about the world.
*/
//background code
function Background(game, backgroundImage) {
    this.image = backgroundImage;
    this.radius = 200;
    this.camera = {x: 0, y: 0};
    this.locked = false;
    this.worldEnds = {top: 0, bottom: 0, left: 0, right: 3410};
    this.game = game;
}

Background.prototype.update = function () {
};

Background.prototype.draw = function (ctx) {
  ctx.drawImage(this.image,
               this.camera.x, 1523 - this.camera.y,
               200, 200,
               0, 0,  // source from sheet
               800, 800);

   //check if boss is active
   if(this.locked) {
     var bossHealth = (697 / this.boss.totalHealth) * this.boss.health;
     ctx.lineWidth = 3;
     ctx.strokeRect(50,740,700,50);
     ctx.font="30px Lobster";
     ctx.fillText(this.boss.name, 50,720);
     ctx.fillStyle = "red";
     ctx.fillRect(52, 742, bossHealth, 47);
   }
};

Background.prototype.lockScreen = function(boss) {
  if(!this.locked) {
    this.game.level_song.pause();
    this.game.boss_song.load();
    this.game.boss_song.play();
    this.locked = true;
    this.boss = boss;
  }

};

Background.prototype.unlockScreen = function() {
  if(this.locked) {
    this.game.level_song.play();
    this.game.boss_song.unload();
    this.locked = false;
    this.boss = null;
  }

};

Background.prototype.collideRightWall = function(ent, speed) {
  if(this.locked) {
    return ((ent.x - this.camera.x*4) + ent.radius*2) + speed + 2 > 800;
  }
  return false;
};

Background.prototype.collideLeftWall = function(ent, speed) {
  if(this.locked) {
    return (ent.x - this.camera.x*4) - speed  - 2 < 0;
  }
  return false;
};

function Hud(game, spritesheet, brainz) {
  this.brainImage = new Animation(spritesheet, 0, 0, 64, 64, 0.05, 5);
  this.braincount = brainz;
  this.brainHealth = brainz*4;//add in actual starting health
  this.brainTotalHealth = brainz*4;
  this.game = game;
  this.ctx = game.ctx;

  //powerups
  this.fireup = false;
  this.fireTimer = 0;

  this.slowdown = false;
  this.slowTimer = 0;

  this.damagedown = false;
  this.buffTimer = 0;

  //boss screen
  this.boss = null;
};

Hud.prototype.update = function() {
  //check if dead
  if(this.brainHealth < 1) this.game.gameOverScreen();
  if(this.slowTimer > 0) this.slowTimer -= 1;
  if(this.buffTimer > 0) this.buffTimer -= 1;
};

Hud.prototype.draw = function() {
    //console.log("Brain Health: " + this.brainHealth);
    this.ctx.save();
    this.ctx.font="40px Lobster";
    this.ctx.fillText("Brainpower", 20,60);
    var y = 100;

    var wholeBrainz = Math.floor(this.brainHealth / 4);
    //draw whole brainz
    var brainX = 20;
    for(var i = 0; i < wholeBrainz; i++) {
        this.brainImage.drawStill(this.ctx, 0, 0, brainX, y);
        brainX += 60;
    }
    //draw partial brain if any
    if(this.brainHealth % 4 > 0) {
        this.brainImage.drawStill(this.ctx, 4 - (this.brainHealth % 4), 0, brainX, y);
        brainX += 60;
    }
    //draw empty brainz
    var deadBrainz = Math.floor((this.brainTotalHealth - this.brainHealth)/4);
    for(var i = 0; i < deadBrainz; i++) {
        this.brainImage.drawStill(this.ctx, 4, 0, brainX, y);
        brainX += 60;
    }

    this.ctx.restore();
};

Hud.prototype.healthUp = function(health) {
  this.brainHealth += health;
  if(this.brainHealth > this.brainTotalHealth)
      this.brainHealth = this.brainTotalHealth;
}

Hud.prototype.healthDown = function(health) {
  this.brainHealth -= health;
  if(this.brainHealth < 0)
      this.brainHealth = 0;
}

//powerup timers
Hud.prototype.tickFireTimer = function(health) {
  if(this.fireTimer > 0) {
      //console.log("Fire Timer: " + this.fireTimer);
      this.fireTimer -= 1;
      return true;
  } else return false;
}

Hud.prototype.tickSlowTimer = function(health) {
  if(this.slowTimer > 0) {
      console.log("Slow Timer: " + this.slowTimer);
      this.slowTimer -= 1;
      return true;
  } else return false;
}

Hud.prototype.buffActive = function(health) {
  if(this.buffTimer > 0) return true;
  else return false;
}


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

Platform.prototype.collideBottom = function (ent) {
    var diffY = Math.abs(ent.y  - (this.y + this.height)) <= 5;
    var diffX = ent.worldX + ent.radius < this.x + this.width && ent.worldX + ent.radius > this.x;
    return diffY && diffX;
};

Platform.prototype.collideRight = function (ent) {
  var diffY = ent.worldY + ent.radius < this.y + this.height && ent.worldY + ent.radius > this.y;
  var diffX = ent.worldX < this.x && ent.worldX + ent.radius*2 > this.x;
  return diffY && diffX;
};

Platform.prototype.collideLeft = function (ent) {
  var diffY = ent.worldY + ent.radius < this.y + this.height && ent.worldY + ent.radius > this.y;
  var diffX = ent.worldX < this.x + this.width && ent.worldX + ent.radius*2 > this.x + this.width;
  return diffY && diffX;
};
