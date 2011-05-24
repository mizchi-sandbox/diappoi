(function() {
  var Animation, Animation_Slash, Map, Sprite;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Sprite = (function() {
    function Sprite(x, y, scale) {
      this.x = x != null ? x : 0;
      this.y = y != null ? y : 0;
      this.scale = scale != null ? scale : 10;
    }
    Sprite.prototype.render = function(g) {
      g.beginPath();
      g.arc(this.x, this.y, 15 - ms, 0, Math.PI * 2, true);
      return g.stroke();
    };
    Sprite.prototype.get_distance = function(target) {
      var xd, yd;
      xd = Math.pow(this.x - target.x, 2);
      yd = Math.pow(this.y - target.y, 2);
      return Math.sqrt(xd + yd);
    };
    Sprite.prototype.getpos_relative = function(cam) {
      var pos;
      pos = {
        vx: 320 + this.x - cam.x,
        vy: 240 + this.y - cam.y
      };
      return pos;
    };
    Sprite.prototype.init_cv = function(g, color, alpha) {
      if (color == null) {
        color = "rgb(255,255,255)";
      }
      if (alpha == null) {
        alpha = 1;
      }
      g.beginPath();
      g.strokeStyle = color;
      g.fillStyle = color;
      return g.globalAlpha = alpha;
    };
    Sprite.prototype.set_dir = function(x, y) {
      var rx, ry;
      rx = x - this.x;
      ry = y - this.y;
      if (rx >= 0) {
        return this.dir = Math.atan(ry / rx);
      } else {
        return this.dir = Math.PI - Math.atan(ry / -rx);
      }
    };
    return Sprite;
  })();
  Map = (function() {
    __extends(Map, Sprite);
    function Map(w, h, cell) {
      this.w = w != null ? w : 10;
      this.h = h != null ? h : 10;
      this.cell = cell != null ? cell : 24;
      Map.__super__.constructor.call(this, 0, 0, this.cell);
      this._map = this.gen_map(this.w, this.h);
    }
    Map.prototype.gen_map = function(x, y) {
      var i, j, map;
      map = [];
      for (i = 0; (0 <= x ? i < x : i > x); (0 <= x ? i += 1 : i -= 1)) {
        map[i] = [];
        for (j = 0; (0 <= y ? j < y : j > y); (0 <= y ? j += 1 : j -= 1)) {
          if ((i === 0 || i === (x - 1)) || (j === 0 || j === (y - 1))) {
            map[i][j] = 1;
          } else if (Math.random() < 0.2) {
            map[i][j] = 1;
          } else {
            map[i][j] = 0;
          }
        }
      }
      return map;
    };
    Map.prototype.render = function(g, cam) {
      var alpha, color, i, j, pos, _ref, _results;
      pos = this.getpos_relative(cam);
      _results = [];
      for (i = 0, _ref = this._map.length; (0 <= _ref ? i < _ref : i > _ref); (0 <= _ref ? i += 1 : i -= 1)) {
        _results.push((function() {
          var _ref, _results;
          _results = [];
          for (j = 0, _ref = this._map[i].length; (0 <= _ref ? j < _ref : j > _ref); (0 <= _ref ? j += 1 : j -= 1)) {
            if (this._map[i][j]) {
              my.init_cv(g, color = "rgb(0,0,0)", alpha = 0.5);
            } else {
              my.init_cv(g, color = "rgb(250,250,250)", alpha = 0.5);
            }
            _results.push(g.fillRect(pos.vx + i * this.cell, pos.vy + j * this.cell, this.cell, this.cell));
          }
          return _results;
        }).call(this));
      }
      return _results;
    };
    Map.prototype.get_point = function(x, y) {
      return {
        x: ~~((x + 1 / 2) * this.cell),
        y: ~~((y + 1 / 2) * this.cell)
      };
    };
    Map.prototype.get_randpoint = function() {
      var rx, ry;
      rx = ~~(Math.random() * this.w);
      ry = ~~(Math.random() * this.h);
      if (this._map[rx][ry]) {
        return this.get_randpoint();
      }
      return this.get_point(rx, ry);
    };
    Map.prototype.collide = function(x, y) {
      x = ~~(x / this.cell);
      y = ~~(y / this.cell);
      return this._map[x][y];
    };
    return Map;
  })();
  Animation = (function() {
    __extends(Animation, Sprite);
    function Animation(actor, target) {
      Animation.__super__.constructor.call(this, 0, 0, this.cell);
      this.timer = 0;
    }
    Animation.prototype.render = function(g, cam) {
      var pos;
      pos = this.getpos_relative(cam);
      return this.timer++;
    };
    return Animation;
  })();
  Animation_Slash = (function() {
    __extends(Animation_Slash, Animation);
    function Animation_Slash(actor, target) {
      Animation_Slash.__super__.constructor.call(this, 0, 0, this.cell);
      this.timer = 0;
    }
    Animation_Slash.prototype.render = function(g, cam) {
      var pos;
      if (this.timer < 24) {
        pos = this.getpos_relative(cam);
        this.init_cv(g);
        g.arc(pos.vx + 12 - this.timer, pos.vy + 12 - this.timer, 3, 0, Math.PI, false);
        g.fill();
        this.timer++;
        return this;
      } else {
        return false;
      }
    };
    return Animation_Slash;
  })();
}).call(this);
