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
    Scene.prototype.enter = function(keys, mouse) {
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
    OpeningScene.prototype.enter = function(keys, mouse) {
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
      var start_point;
      FieldScene.__super__.constructor.call(this, "Field");
      this.map = new Map(40, 40, 32);
      start_point = this.map.get_point(8, 3);
      this.player = new Player(start_point.x, start_point.y);
      this.enemies = [];
    }
    FieldScene.prototype.enter = function(keys, mouse) {
      var e, i, p, rpo, _i, _j, _len, _len2, _ref, _ref2, _ref3;
      _ref = [this.player];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        p = _ref[_i];
        p.update(this.enemies, this.map, keys, mouse);
      }
      _ref2 = this.enemies;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        e = _ref2[_j];
        e.update([this.player], this.map);
      }
      if (this.enemies.length < 20) {
        rpo = this.map.get_randpoint();
        this.enemies[this.enemies.length] = new Enemy(rpo.x, rpo.y);
      } else {
        for (i = 0, _ref3 = this.enemies.length; (0 <= _ref3 ? i < _ref3 : i > _ref3); (0 <= _ref3 ? i += 1 : i -= 1)) {
          if (!this.enemies[i].state.alive) {
            this.enemies.splice(i, 1);
            break;
          }
        }
      }
      return this.name;
    };
    FieldScene.prototype.render = function(g) {
      var cam, enemy, _i, _len, _ref;
      cam = this.player;
      this.map.render(g, cam);
      _ref = this.enemies;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        enemy = _ref[_i];
        enemy.render(g, cam);
      }
      this.player.render(g);
      my.init_cv(g);
      g.fillText("HP " + this.player.status.hp + "/" + this.player.status.MAX_HP, 15, 15);
      g.fillText("p: " + this.player.x + "." + this.player.y, 15, 25);
      if (this.player.targeting) {
        return g.fillText("p: " + this.player.targeting.status.hp + "." + this.player.targeting.status.MAX_HP, 15, 35);
      }
    };
    return FieldScene;
  })();
}).call(this);
