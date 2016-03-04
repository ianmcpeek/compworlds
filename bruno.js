
//look for how to find class type
function Sandwich(game, world, spritesheet, x, y, isleft) {
  this.spinAnimation = new Animation(spritesheet, 0, 0, 32, 32, 0.08, 5, true);
  this.isleft = isleft;
  this.ctx = game.ctx;
  Entity.call(this, game, world, x, y+30, 16, 5);
}

Sandwich.prototype = new Entity();

Sandwich.prototype.update = function() {
  //check if went offscreen
  if(Entity.prototype.offScreen.call(this)) {
    this.removeFromWorld = true;
    console.log("off screen sandwich!");
  }
  //check if sandwich hit enemy
  for (var i = 0; i < this.game.entities.length; i++) {
      var ent = this.game.entities[i];
      if (this != ent && this.hit(ent)) {
        ent.health -= 1;
        console.log("enemy hit, health: " + ent.health);
        this.removeFromWorld = true;
      }
  }

  if(this.isleft) {
    this.x -= 6;
  } else {
    this.x += 6;
  }
}

Sandwich.prototype.draw = function() {
    this.spinAnimation.drawFrame(this.game.clockTick, this.ctx, this.x - this.world.camera.x*4, this.y - this.world.camera.y*4, this.isleft);
    Entity.prototype.draw.call(this, this.ctx);
}

Sandwich.prototype.hit = function (ent) {
  if(ent.entityType && ent.entityTypes[ent.entityType] == "enemy") {
    //apply radius to x & y to center entity position
    //temp workaround
    var difX = ((this.x + this.radius) - this.world.camera.x*4) - ((ent.x  - this.world.camera.x*4) + ent.radius);
    var difY = (this.y + this.radius) - (ent.y + ent.radius);
    var dist = Math.sqrt(difX * difX + difY * difY);
    //debugging
    var rad = this.radius + ent.radius
    return dist < this.radius + ent.radius;
  }
    return false;
};

function Bruno(game, spritesheet, world) {
    this.animation = new Animation(spritesheet, 0, 0, 80, 80, 0.08, 9, true);
    this.idleAnimation = new Animation(spritesheet, 0, 8, 80, 80, 0.1, 7, false);
    this.throwAnimation = new Animation(spritesheet, 0, 3, 80, 80, 0.1, 8, false);
    this.jumpAnimation = new Animation(spritesheet, 0, 9, 80, 80, 0.1, 12, false);
    this.fallAnimation = new Animation(spritesheet, 4, 9, 80, 80, 0.1, 7, true);
    this.isleft = false;
    this.isIdle = false;
    this.isThrowing = false;
    this.thrown = false;
    this.idleTimer = 200;
    this.jumping = false;
    this.falling = false;
    this.fallVelocity = 0;
    this.ghost;
    this.worldX = 50;
    this.worldY = 670;
    this.ground = 750;//used for jumping
    this.ctx = game.ctx;

    //used for movement Up (ketchup)
    this.speedTimer = 0;
    this.speed = 4;
    this.worldSpeed = this.speed / 4;

    Entity.call(this, game, world, 50, 670, 40, 0);
}

Bruno.prototype = new Entity();
Bruno.prototype.constructor = Bruno;

Bruno.prototype.draw = function () {
    //the idle animation is on a timer that resets whenever an action is drawn, or the idle animation is done
    if(this.isThrowing) {
      this.throwAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.isleft);
      if(this.jumping) this.jumpAnimation.advanceFrame(this.game.clockTick);
    } else if (this.jumping) {
        this.jumpAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.isleft);
    } else if(this.falling) {
      this.fallAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.isleft);
    } else if(this.isIdle) {
        if(this.idleTimer === 0) {
            this.idleAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.isleft);
            if(this.idleAnimation.isDone()) {this.idleTimer = 200; this.idleAnimation.elapsedTime = 0;}
        } else {
            this.idleTimer -= 1;
            this.idleAnimation.drawStill(this.ctx, this.idleAnimation.startX, this.idleAnimation.startY, this.x, this.y, this.isleft);
        }
    } else {
      this.idleTimer = 200; this.idleAnimation.elapsedTime = 0;
      this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.isleft);
    }
    Entity.prototype.draw.call(this, this.ctx);
}

Bruno.prototype.update = function() {

    //refactor into entity so collide can be added to enemies & projectiles

    //collision code
    var collidedTop = false;
    var collidedBottom = false;
    var collidedLeft = false;
    var collidedRight = false;
    for(var i = 0; i < this.game.platforms.length; i++) {
      var platform = this.game.platforms[i];
      if(platform.collideRight(this)) collidedRight = true;
      else if(platform.collideLeft(this)) collidedLeft = true;
      if(platform.collideTop(this)) collidedTop = true;
      else if(platform.collideBottom(this)) collidedBottom = true;
    }

    this.isIdle = true;

    //move right
    if(this.game.keyright && !collidedRight) {
      this.isleft = false;
      this.updateXSpeed(1);
    }
    //move left
    else if(this.game.keyleft && !collidedLeft) {
      this.isleft = true;
      this.updateXSpeed(-1);
    }
    if (this.game.space && !this.isThrowing && !this.falling) {this.jumping = true; this.isIdle = false; console.log("x: " + this.worldX);
  console.log("world camera x: " + this.world.camera.x);}
    else if(this.game.keyx && !this.isThrowing) {
      this.isThrowing = true;
      //this.game.addEntity(new Sandwich(this.game, AM.getAsset("./img/sammy1.png"), this.x, this.y, this.isleft));//game, spritesheet, x, isleft
      this.isIdle = false;}

    if(this.isThrowing) {
        if(this.throwAnimation.currentFrame() === 3 && !this.thrown) {
          this.game.addEntity(new Sandwich(this.game, this.world, AM.getAsset("./img/sammy1.png"), this.worldX, this.worldY, this.isleft));
          this.thrown = true;
        }
        if(this.throwAnimation.isDone()) {
            this.throwAnimation.elapsedTime = 0;
            this.isThrowing = false; this.thrown = false;
        }
    }
    if (this.jumping) {
        if (this.jumpAnimation.isDone()) {
            this.jumpAnimation.elapsedTime = 0;
            this.jumping = false;
        }
        var jumpDistance = this.jumpAnimation.elapsedTime / this.jumpAnimation.totalTime;
        var totalHeight = 300;

        if (jumpDistance < 0.5) {
          //var height = jumpDistance * 2 * totalHeight;
            var height = totalHeight*(-4 * (jumpDistance * jumpDistance - jumpDistance));
            if(collidedBottom) {this.jumpAnimation.elapsedTime = 0; this.jumping = false;}
            else  this.y = (this.ground - this.radius*2) - height; this.worldY = (this.ground - this.radius*2) - height;
        } else {
          //begin descent
          this.falling = true;
          this.fallVelocity = 0.5;
          this.jumping = false; this.jumpAnimation.elapsedTime = 0;
      }
    }

  //falling code
  if(!collidedTop) {
    if(!this.jumping) {
      this.y += this.fallVelocity; this.worldY += this.fallVelocity;
      this.fallVelocity += this.fallVelocity < 4 ? 0.2 : 0;
      this.falling = true;
    }
  }
  else {
    if (!this.jumping)this.ground = this.y + this.radius*2; this.fallVelocity = 0.5; this.falling = false;
  }
}

Bruno.prototype.updateXSpeed = function (dir) {
  var speedUp = 0; // set in relation to world speed
  if (this.speedTimer > 0) {
    speedUp = this.speed / 2;
    this.speedTimer -= 1;
  }
  if(this.isCentered() && !this.world.locked) {
    if(!this.world.locked) this.world.camera.x += (this.worldSpeed + (speedUp))*dir; //ratio of speed to world speed;
    this.worldX += (this.speed + (speedUp))*dir;
  } else {
    this.x += (this.speed + speedUp)*dir;
    this.worldX += (this.speed + speedUp)*dir;;
  }
  this.isIdle = false;
};

Bruno.prototype.isCentered = function() {
  if(this.isleft) {
    return (this.x <= 400 && this.world.camera.x > this.world.worldEnds.left);
  }else {
    return (this.x >= 400 && this.world.camera.x + 800 < this.world.worldEnds.right );
  }
};
