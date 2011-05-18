(function() {
  var FieldScene, OpeningScene, Scene;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Scene = (function() {
    function Scene(name) {
      this.name = name;
    }
    Scene.prototype.process = function(keys, mouse) {
      return this.name;
    };
    Scene.prototype.render = function(g) {
      this.player.render(g);
      return g.fillText(this.name, 300, 200);
    };
    return Scene;
  })();
  OpeningScene = (function() {
    __extends(OpeningScene, Scene);
    function OpeningScene() {
      OpeningScene.__super__.constructor.call(this, "Opening");
      this.player = new Player(320, 240);
    }
    OpeningScene.prototype.process = function(keys, mouse) {
      if (keys.right) {
        return "Filed";
      }
      return this.name;
    };
    OpeningScene.prototype.render = function(g) {
      this.player.render(g);
      return g.fillText("Opening", 300, 200);
    };
    return OpeningScene;
  })();
  FieldScene = (function() {
    __extends(FieldScene, Scene);
    function FieldScene() {
      var i;
      FieldScene.__super__.constructor.call(this, "Field");
      this.player = new Player(320, 240);
      this.enemies = (function() {
        var _results;
        _results = [];
        for (i = 1; i <= 30; i++) {
          _results.push(new Enemy(Math.random() * 640, Math.random() * 480));
        }
        return _results;
      })();
      this.map = my.gen_map(20, 15);
    }
    FieldScene.prototype.process = function(keys, mouse) {
      var d, enemy, n, _ref;
      this.player.process(keys, mouse);
      this.player.state.active = false;
      for (n = 0, _ref = this.enemies.length - 1; (0 <= _ref ? n <= _ref : n >= _ref); (0 <= _ref ? n += 1 : n -= 1)) {
        enemy = this.enemies[n];
        enemy.process(this.player);
        d = my.distance(this.player.x, this.player.y, enemy.x, enemy.y);
        if (d < this.player.atack_range && enemy.state.alive) {
          if (this.player.status.MAX_WT > this.player.status.wt) {
            this.player.state.active = true;
          } else if (this.player.status.MAX_WT <= this.player.status.wt) {
            this.player.status.wt = 0;
            this.player.atack(enemy);
          }
        }
      }
      if (this.player.state.active && this.player.status.wt < this.player.status.MAX_WT) {
        this.player.status.wt += 1;
      } else {
        this.player.status.wt = 0;
      }
      return this.name;
    };
    FieldScene.prototype.render = function(g) {
      var alpha, cell, color, enemy, i, j, _i, _len, _ref, _ref2, _results;
      _ref = this.enemies;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        enemy = _ref[_i];
        enemy.render(g, this.player);
      }
      this.player.render(g);
      cell = 32;
      my.init_cv(g, color = "rgb(255,255,255)");
      g.font = "10px " + "mono";
      g.fillText("HP " + this.player.status.hp + "/" + this.player.status.MAX_HP, 15, 15);
      _results = [];
      for (i = 0, _ref2 = this.map.length - 1; (0 <= _ref2 ? i <= _ref2 : i >= _ref2); (0 <= _ref2 ? i += 1 : i -= 1)) {
        _results.push((function() {
          var _ref, _results;
          _results = [];
          for (j = 0, _ref = this.map[i].length - 1; (0 <= _ref ? j <= _ref : j >= _ref); (0 <= _ref ? j += 1 : j -= 1)) {
            if (this.map[i][j]) {
              my.init_cv(g, color = "rgb(100,100,100)", alpha = 0.3);
            } else {
              my.init_cv(g, color = "rgb(0,0,0)", alpha = 0.3);
            }
            _results.push(my.draw_cell(g, this.player.vx + i * cell, this.player.vy + j * cell, cell));
          }
          return _results;
        }).call(this));
      }
      return _results;
    };
    return FieldScene;
  })();
}).call(this);
