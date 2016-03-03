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
    this.player = null;
    this.hud = null;
    this.ctx = null;
    this.debug = true;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
}

GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.startInput();
    this.timer = new Timer();
    console.log('game initialized');
}

GameEngine.prototype.titleScreen = function() {
  this.title_song = new Howl({urls: ["./sounds/hotlinebling.mp3"], loop: true});
  this.title_song.play();
  this.ctx.drawImage(AM.getAsset("./img/title.png"),
                 0, 0,  // source from sheet
                 800, 800,
                 0, 0,
                 800, 800);
  this.started = false;

  var that = this;

  this.ctx.canvas.addEventListener("mousedown", function (e) {
      var x = e.x;
      var y = e.y;

      x -= that.ctx.canvas.offsetLeft;
      y -= that.ctx.canvas.offsetTop;

      console.log("x:" + x + " y:" + y);
      //x:401-590 y:485-540
      if(!that.started) {
        that.start(); that.title_song.unload(); that.started = true;
      }
  }, false);
}

GameEngine.prototype.start = function () {
    console.log("starting game");
    //start level song
    this.level_song = new Howl({urls: ["./sounds/codemonkey.mp3"], loop: true});
    this.level_song.play();

    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
}

GameEngine.prototype.startInput = function () {
    console.log('Starting input');
    var that = this;

    this.ctx.canvas.addEventListener("keydown", function (e) {
        if (String.fromCharCode(e.which) === '\'') that.keyright = true;
        else if (String.fromCharCode(e.which) === '%') that.keyleft = true;
        if (String.fromCharCode(e.which) === 'X') that.keyx = true;
        else if(String.fromCharCode(e.which) === ' ') that.space = true;
//        console.log(e);
        e.preventDefault();
    }, false);

    this.ctx.canvas.addEventListener("keyup", function (e) {
        if (String.fromCharCode(e.which) === '\'') that.keyright = false;
        else if (String.fromCharCode(e.which) === '%') that.keyleft = false;

        e.preventDefault();
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

GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
    this.ctx.save();

    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].draw(this.ctx);
    }
    //draw platform outlines
    for (var i = 0; i < this.platforms.length; i++) {
        this.platforms[i].draw(this.ctx);
    }

    if(this.player) this.player.draw(this.ctx);
    if(this.hud) this.hud.draw(this.ctx);

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
}

GameEngine.prototype.loop = function () {
    this.clockTick = this.timer.tick();
    this.update();
    this.draw();
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
