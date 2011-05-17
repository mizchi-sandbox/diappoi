(function() {
  var Game, conf;
  Game = (function() {
    function Game(conf) {
      var canvas, self;
      canvas = document.getElementById(conf.CANVAS_NAME);
      this.ctx = canvas.getContext('2d');
      canvas.width = conf.WINDOW_WIDTH;
      canvas.height = conf.WINDOW_HEIGHT;
      this.keys = {
        left: 0,
        right: 0,
        up: 0,
        down: 0
      };
      self = this;
      window.document.onkeydown = function(e) {
        return this.getkey(self, e.keyCode, 1);
      };
      window.document.onkeyup = function(e) {
        return this.getkey(self, e.keyCode, 0);
      };
    }
    Game.prototype.getkey = function(self, which, to) {
      switch (which) {
        case 65:
        case 37:
          return self.keys['left'] = to;
        case 68:
        case 39:
          return self.keys['right'] = to;
        case 87:
        case 38:
          return self.keys['up'] = to;
        case 83:
        case 40:
          return self.keys['down'] = to;
        case 32:
          return self.keys['space'] = to;
        case 17:
          return self.keys['ctrl'] = to;
      }
    };
    return Game;
  })();
  conf = {
    WINDOW_WIDTH: 640,
    WINDOW_HEIGHT: 480,
    VIEW_X: 320,
    VIEW_Y: 240,
    CANVAS_NAME: "game"
  };
  window.onload = function() {
    var game;
    return game = new Game(conf);
  };
}).call(this);
