window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

function GameEngine() {
    this.entities = [];
    this.platforms = [];
    this.popups = [];
    this.player = null;
    this.hud = null;
    this.ctx = null;
    this.debug = false;
    this.gameOver = false;
    this.win = false;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
}

GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.timer = new Timer();
    this.title_song = new Howl({urls: ["./sounds/hotlinebling.mp3"], loop: true, buffer: true});
    this.level_song = new Howl({urls: ["./sounds/codemonkey.mp3"], loop: true, buffer: true});
    this.boss_song = new Howl({urls: ["./sounds/xgon'giveittoyou.mp3"], loop: true, buffer: true});
    this.gameover_song = new Howl({urls: ["./sounds/hello.mp3"], loop: true, buffer: true});
    this.win_song = new Howl({urls: ["./sounds/earnedit.mp3"], loop:true, buffer: true});
    console.log('game initialized');
    this.startInput();
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
}

GameEngine.prototype.titleScreen = function() {
  //this.level_song.stop();
  this.win_song.unload();
  this.gameover_song.unload();
  this.title_song.play();
  this.started = false;

}

GameEngine.prototype.winScreen = function() {
  this.win = true;
  this.level_song.load();
  this.win_song.play();
  this.started = false;
}

GameEngine.prototype.gameOverScreen = function() {
  this.gameOver = true;
  this.boss_song.unload()
  this.level_song.load();
  this.gameover_song.play();
  this.started = false;
}

GameEngine.prototype.start = function () {
    console.log("starting game");

    //start level song
    this.title_song.unload();
    this.gameover_song.load();
    this.win_song.load();
    this.boss_song.load();
    this.level_song.play();
}

GameEngine.prototype.startInput = function () {
    console.log('Starting input');
    var that = this;

    this.ctx.canvas.addEventListener("keydown", function (e) {
        if (String.fromCharCode(e.which) === '\'') that.keyright = that.started? true : false;
        else if (String.fromCharCode(e.which) === '%') that.keyleft = that.started? true : false;
        if (String.fromCharCode(e.which) === 'X') that.keyx = that.started? true : false;
        else if(String.fromCharCode(e.which) === ' ') that.space = that.started? true : false;
//        console.log(e);
        e.preventDefault();
    }, false);

    this.ctx.canvas.addEventListener("keyup", function (e) {
        if (String.fromCharCode(e.which) === '\'') that.keyright = false;
        else if (String.fromCharCode(e.which) === '%') that.keyleft = false;

        e.preventDefault();
    }, false);

    this.ctx.canvas.addEventListener("mousedown", function (e) {
        //x:401-590 y:485-540
        if(!that.started && !that.gameOver && !that.win) {
          that.started = true;
          that.start();
        } else if(!that.started && (that.gameOver || that.win)) {
          that.gameOver = false;
          that.win = false;
          that.titleScreen();
          that.clearAll();
          flipTheTable(that);

        }
    }, false);

    console.log('Input started');
}

GameEngine.prototype.addPlayer = function (player) {
    console.log('added player');
    this.player = player;
}

GameEngine.prototype.addHud = function (hud) {
    console.log('added hud');
    this.hud = hud;
}

GameEngine.prototype.addEntity = function (entity) {
    console.log('added entity');
    this.entities.push(entity);
}

GameEngine.prototype.addPlatform = function (platform) {
    console.log('added platform');
    this.platforms.push(platform);
}

GameEngine.prototype.addPopup = function (popup) {
    this.popups.push(popup);
}

GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
    this.ctx.save();

    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].draw(this.ctx);
    }
    //draw platform outlines
    // for (var i = 0; i < this.platforms.length; i++) {
    //     this.platforms[i].draw(this.ctx);
    // }

    if(this.player) this.player.draw(this.ctx);
    if(this.hud) this.hud.draw(this.ctx);

    for (var i = 0; i < this.popups.length; i++) {
        this.popups[i].draw(this.ctx);
    }

    this.ctx.restore();
}

GameEngine.prototype.update = function () {
    var entitiesCount = this.entities.length;

    if(this.player) this.player.update();
    if(this.hud) this.hud.update();

    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];

        if (!entity.removeFromWorld) {
            entity.update();
        }
    }

    for (var i = this.entities.length - 1; i >= 0; --i) {
        if (this.entities[i].removeFromWorld) {
            this.entities.splice(i, 1);
        }
    }

    for (var i = this.popups.length - 1; i >= 0; --i) {
        if (this.popups[i].removeFromWorld) {
            this.popups.splice(i, 1);
        } else this.popups[i].update();
    }
}

GameEngine.prototype.clearAll = function() {
  for (var i = this.entities.length - 1; i >= 0; --i) {
      this.entities.splice(i, 1);
  }

  for (var i = this.platforms.length - 1; i >= 0; --i) {
      this.platforms.splice(i, 1);
  }

  this.player = null;
  this.hud = null;

  this.popups = [];
}

GameEngine.prototype.loop = function () {
      this.clockTick = this.timer.tick();
      if(!this.gameOver && this.started && !this.win) {
        this.update();
        this.draw();
      } else if(!this.started && !this.gameOver && !this.win) {
        this.ctx.drawImage(AM.getAsset("./img/title.png"),
                       0, 0,  // source from sheet
                       800, 800,
                       0, 0,
                       800, 800);
      } else if(this.win) {
        this.ctx.drawImage(AM.getAsset("./img/level_win.png"),
                       0, 0,  // source from sheet
                       800, 800,
                       0, 0,
                       800, 800);
      }else if(this.gameOver) {
        this.ctx.drawImage(AM.getAsset("./img/gameover.png"),
                       0, 0,  // source from sheet
                       800, 800,
                       0, 0,
                       800, 800);
      }


      // this.keyright = null;
      // this.keyleft = null;
      this.keyx = null;
      this.space = null;
}

function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
}
