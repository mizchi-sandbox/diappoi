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
    OpeningScene.prototype.render = function() {};
    return OpeningScene;
  })();
  FieldScene = (function() {
    __extends(FieldScene, Scene);
    function FieldScene() {
      var start_point;
      FieldScene.__super__.constructor.call(this, "Field");
      this.map = new Map(32);
      start_point = this.map.get_randpoint();
      this.player = new Player(start_point.x, start_point.y, 0);
      this.objs = [this.player];
      this.max_object_count = 11;
      this.fcnt = 0;
    }
    FieldScene.prototype.enter = function(keys, mouse) {
      var group, i, obj, rpo, _i, _len, _ref, _ref2;
      _ref = this.objs;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        obj = _ref[_i];
        obj.update(this.objs, this.map, keys, mouse);
      }
      if (this.objs.length < this.max_object_count && this.fcnt % 24 * 3 === 0) {
        group = 0;
        if (Math.random() > 0.15) {
          group = 1;
        } else {
          group = 0;
        }
        rpo = this.map.get_randpoint();
        this.objs.push(new Enemy(rpo.x, rpo.y, group));
      } else {
        for (i = 0, _ref2 = this.objs.length; (0 <= _ref2 ? i < _ref2 : i > _ref2); (0 <= _ref2 ? i += 1 : i -= 1)) {
          if (!this.objs[i].state.alive) {
            this.objs.splice(i, 1);
            break;
          }
        }
      }
      this.fcnt++;
      return this.name;
    };
    FieldScene.prototype.render = function(g) {
      var cam, mouse_x, mouse_y, obj, _i, _len, _ref;
      cam = this.player;
      this.map.render(g, cam);
      _ref = this.objs;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        obj = _ref[_i];
        obj.render(g, cam);
      }
      my.init_cv(g);
      g.fillText("HP " + this.player.status.hp + "/" + this.player.status.MAX_HP, 15, 15);
      mouse_x = this.player.x + this.player.mouse.x - 320;
      mouse_y = this.player.y + this.player.mouse.y - 240;
      g.fillText("p: " + (this.player.x + this.player.mouse.x - 320) + "." + (this.player.y + this.player.mouse.y - 240), 15, 25);
      if (this.player.targeting) {
        return g.fillText("p: " + this.player.targeting.status.hp + "." + this.player.targeting.status.MAX_HP, 15, 35);
      }
    };
    return FieldScene;
  })();
}).call(this);
