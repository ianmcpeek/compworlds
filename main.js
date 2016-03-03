var AM = new AssetManager();

AM.queueDownload("./img/title.png");

AM.queueDownload("./img/castlevania_background.png");
AM.queueDownload("./img/bruno.png");
AM.queueDownload("./img/sammy1.png");
AM.queueDownload("./img/f.png");
AM.queueDownload("./img/brainz.png");
AM.queueDownload("./img/pug.png");

AM.queueDownload("./img/avocado.png");
AM.queueDownload("./img/bacon.png");
AM.queueDownload("./img/beans.png");
AM.queueDownload("./img/bottle.png");
AM.queueDownload("./img/bread.png");
AM.queueDownload("./img/carrot.png");
AM.queueDownload("./img/cheese.png");
AM.queueDownload("./img/ham.png");
AM.queueDownload("./img/ketchup.png");
AM.queueDownload("./img/mayo.png");
AM.queueDownload("./img/mustard.png");
AM.queueDownload("./img/paper.png");
AM.queueDownload("./img/pepper.png");
AM.queueDownload("./img/tomato.png");
AM.queueDownload("./img/student.png");
AM.queueDownload("./img/teacher.png");
AM.queueDownload("./img/mini-boss.png");
//AM.queueDownload("./img/mini-boss2.png");
//AM.queueDownload("./img/mini-boss3.png");
AM.queueDownload("./img/professor_growler.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");
    var gameEngine = new GameEngine();
    gameEngine.init(ctx);

    //set up level
    var background = new Background(gameEngine, AM.getAsset("./img/castlevania_background.png"));
    gameEngine.addEntity(background);
    gameEngine.addPlayer(new Bruno(gameEngine, AM.getAsset("./img/bruno.png"), background));
    gameEngine.addHud(new Hud(gameEngine, AM.getAsset("./img/brainz.png"), 3));

    //enemies
    gameEngine.addEntity(new Enemy(gameEngine, background, new Animation(AM.getAsset("./img/student.png"), 0, 0, 39, 64, 0.2, 6, true), 1000, 700, 20, 1, true));
    gameEngine.addEntity(new Enemy(gameEngine, background, new Animation(AM.getAsset("./img/student.png"), 0, 0, 39, 64, 0.2, 6, true), 1810, 700, 20, 1, true));
    gameEngine.addEntity(new Enemy(gameEngine, background, new Animation(AM.getAsset("./img/student.png"), 0, 0, 39, 64, 0.2, 6, true), 2354, 700, 20, 1, true));
    gameEngine.addEntity(new Enemy(gameEngine, background, new Animation(AM.getAsset("./img/student.png"), 0, 0, 39, 64, 0.2, 6, true), 3652, 700, 20, 1, true));
    gameEngine.addEntity(new Enemy(gameEngine, background, new Animation(AM.getAsset("./img/student.png"), 0, 0, 39, 64, 0.2, 6, true), 6086, 297, 20, 1, true));
    gameEngine.addEntity(new Enemy(gameEngine, background, new Animation(AM.getAsset("./img/student.png"), 0, 0, 39, 64, 0.2, 6, true), 6454, 297, 20, 1, true));

    gameEngine.addEntity(new Enemy(gameEngine, background, new Animation(AM.getAsset("./img/teacher.png"), 0, 0, 90, 105, 0.2, 4, true), 3490, 650, 45, 2, true));
    //this.animation = new Animation(ASSET_MANAGER.getAsset("./img/teacher.png"), 0, 0, 90, 105, 0.2, 4, true, true);

    gameEngine.addEntity(new Enemy(gameEngine, background, new Animation(AM.getAsset("./img/pug.png"), 0, 0, 80, 62, 0.2, 5, true), 2742, 500, 40, 0, false));
    gameEngine.addEntity(new Enemy(gameEngine, background, new Animation(AM.getAsset("./img/pug.png"), 0, 0, 80, 62, 0.2, 5, true), 4054, 500, 40, 0, false));
    gameEngine.addEntity(new Enemy(gameEngine, background, new Animation(AM.getAsset("./img/pug.png"), 0, 0, 80, 62, 0.2, 5, true), 6954, 500, 40, 0, false));

    gameEngine.addEntity(new Enemy(gameEngine, background, new Animation(AM.getAsset("./img/mini-boss.png"), 653, 3.5, 135, 153, 0.31, 5, true), 4586, 600, 76, 3, false));
    gameEngine.addEntity(new Boss(gameEngine, background, AM.getAsset("./img/professor_growler.png"), 7702, 600, 80, true));

    //items
    // gameEngine.addEntity(new Item(gameEngine, background, AM.getAsset("./img/avocado.png"), 0));
    // gameEngine.addEntity(new Item(gameEngine, background, AM.getAsset("./img/bacon.png"), 40));
    gameEngine.addEntity(new Item(gameEngine, background, AM.getAsset("./img/beans.png"), 4958));
    gameEngine.addEntity(new Item(gameEngine, background, AM.getAsset("./img/bottle.png"), 400));
    // gameEngine.addEntity(new Item(gameEngine, background, AM.getAsset("./img/bread.png"), 160));
    gameEngine.addEntity(new Item(gameEngine, background, AM.getAsset("./img/carrot.png"), 6338));
    // gameEngine.addEntity(new Item(gameEngine, background, AM.getAsset("./img/cheese.png"), 250));
    // gameEngine.addEntity(new Item(gameEngine, background, AM.getAsset("./img/ham.png"), 290));
    gameEngine.addEntity(new Item(gameEngine, background, AM.getAsset("./img/ketchup.png"), 3222));
	  // gameEngine.addEntity(new Item(gameEngine, background, AM.getAsset("./img/mayo.png"), 370));
	  // gameEngine.addEntity(new Item(gameEngine, background, AM.getAsset("./img/mustard.png"), 410));
	  // gameEngine.addEntity(new Item(gameEngine, background, AM.getAsset("./img/paper.png"), 450));
	  // gameEngine.addEntity(new Item(gameEngine, background, AM.getAsset("./img/pepper.png"), 490));
	  // gameEngine.addEntity(new Item(gameEngine, background, AM.getAsset("./img/tomato.png"), 530));

    //platforms

    gameEngine.addPlatform(new Platform(gameEngine, background, 0, 760, 11000, 55));
    gameEngine.addPlatform(new Platform(gameEngine, background, 5825, 490, 190, 55));
    gameEngine.addPlatform(new Platform(gameEngine, background, 6085, 361, 630, 55));
    gameEngine.addPlatform(new Platform(gameEngine, background, 6785, 490, 380, 55));
    gameEngine.addPlatform(new Platform(gameEngine, background, 8645, 360, 1080, 55));
    console.log("All Done!");
    gameEngine.titleScreen();
});

function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
}

Animation.prototype.drawStill = function (ctx, xindex, yindex, x, y, direction) {
        if(direction) {ctx.save(); ctx.scale(-1, 1);
    ctx.drawImage(this.spriteSheet,
                   xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                   this.frameWidth, this.frameHeight,
                   x*-1 - this.frameWidth, y,
                   this.frameWidth,
                   this.frameHeight);
    ctx.restore();
    } else {
        ctx.drawImage(this.spriteSheet,
                   xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                   this.frameWidth, this.frameHeight,
                   x, y,
                   this.frameWidth,
                   this.frameHeight);
    }
}

Animation.prototype.advanceFrame = function(tick) {
  this.elapsedTime += tick;
  if (this.isDone()) {
      if (this.loop) this.elapsedTime = 0;
  }
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, direction) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    // if (frame > 9) { //total fram count
    //     frame = 18 - frame;
    // }

    //if walking
    //if ghost

    //if left

    xindex = frame % this.frames; //number of frames per line
    yindex = this.startY;//Math.floor(frame / 9); //advance to next line if necessary

    //console.log(frame + " " + xindex + " " + yindex);
    if(direction) {ctx.save(); ctx.scale(-1, 1);
    ctx.drawImage(this.spriteSheet,
                   xindex * this.frameWidth + this.startX, yindex * this.frameHeight + this.startY,  // source from sheet
                   this.frameWidth, this.frameHeight,
                   x*-1 - this.frameWidth, y,
                   this.frameWidth,
                   this.frameHeight);
    ctx.restore();
    } else {
        ctx.drawImage(this.spriteSheet,
                   xindex * this.frameWidth + this.startX, yindex * this.frameHeight + this.startY,  // source from sheet
                   this.frameWidth, this.frameHeight,
                   x, y,
                   this.frameWidth,
                   this.frameHeight);
    }
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}
