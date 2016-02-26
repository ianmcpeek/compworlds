var AM = new AssetManager();

AM.queueDownload("./img/castlevania_background.png");
AM.queueDownload("./img/bruno.png");
AM.queueDownload("./img/sammy1.png");
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
AM.queueDownload("./img/mini-boss.png");
AM.queueDownload("./img/mini-boss2.png");
AM.queueDownload("./img/mini-boss3.png");
AM.queueDownload("./img/professor_growler.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();
    //set up level
    var background = new Background(gameEngine, AM.getAsset("./img/castlevania_background.png"));
    gameEngine.addEntity(background);
    gameEngine.addEntity(new Bruno(gameEngine, AM.getAsset("./img/bruno.png"), background));
    gameEngine.addEntity(new Hud(gameEngine, AM.getAsset("./img/brainz.png"), 3));

    //enemies
    gameEngine.addEntity(new Enemy(gameEngine, background, new Animation(AM.getAsset("./img/pug.png"), 0, 0, 80, 62, 0.2, 5, true), 300, 700, 40, false));
    gameEngine.addEntity(new Enemy(gameEngine, background, new Animation(AM.getAsset("./img/student.png"), 0, 0, 39, 64, 0.2, 6, true), 1000, 700, 20, true));
    gameEngine.addEntity(new Enemy(gameEngine, background, new Animation(AM.getAsset("./img/mini-boss.png"), 653, 3.5, 135, 153, 0.31, 5, true), 1400, 600, 76, false));
    gameEngine.addEntity(new Enemy(gameEngine, background, new Animation(AM.getAsset("./img/mini-boss2.png"), 653, 3.5, 135, 153, 0.31, 5, true), 3600, 600, 76, false));
    gameEngine.addEntity(new Enemy(gameEngine, background, new Animation(AM.getAsset("./img/mini-boss3.png"), 653, 3.5, 135, 153, 0.31, 5, true), 5000, 600, 76, false));
    gameEngine.addEntity(new Boss(gameEngine, background, new Animation(AM.getAsset("./img/professor_growler.png"), 0, 0, 160, 160, 0.5, 3, true), 8000, 600, 80, true));

    //items
    gameEngine.addEntity(new Item(gameEngine, background, AM.getAsset("./img/avocado.png"), 0));
    gameEngine.addEntity(new Item(gameEngine, background, AM.getAsset("./img/bacon.png"), 40));
    gameEngine.addEntity(new Item(gameEngine, background, AM.getAsset("./img/beans.png"), 80));
    gameEngine.addEntity(new Item(gameEngine, background, AM.getAsset("./img/bottle.png"), 120));
    gameEngine.addEntity(new Item(gameEngine, background, AM.getAsset("./img/bread.png"), 160));
    gameEngine.addEntity(new Item(gameEngine, background, AM.getAsset("./img/carrot.png"), 210));
    gameEngine.addEntity(new Item(gameEngine, background, AM.getAsset("./img/cheese.png"), 250));
    gameEngine.addEntity(new Item(gameEngine, background, AM.getAsset("./img/ham.png"), 290));
    gameEngine.addEntity(new Item(gameEngine, background, AM.getAsset("./img/ketchup.png"), 330));
	  gameEngine.addEntity(new Item(gameEngine, background, AM.getAsset("./img/mayo.png"), 370));
	  gameEngine.addEntity(new Item(gameEngine, background, AM.getAsset("./img/mustard.png"), 410));
	  gameEngine.addEntity(new Item(gameEngine, background, AM.getAsset("./img/paper.png"), 450));
	  gameEngine.addEntity(new Item(gameEngine, background, AM.getAsset("./img/pepper.png"), 490));
	  gameEngine.addEntity(new Item(gameEngine, background, AM.getAsset("./img/tomato.png"), 530));

    //platforms
    //x:401-590 y:485-540
    gameEngine.addEntity(new Platform(gameEngine, background, 5825, 485, 190, 55));
    console.log("All Done!");
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
