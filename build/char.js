(function() {
  var Battler, Enemy, Map, Player, Sprite, Status;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  };
  Status = (function() {
    function Status(params, lv) {
      if (params == null) {
        params = {};
      }
      this.lv = lv != null ? lv : 1;
      this.MAX_HP = params.hp || 30;
      this.hp = this.MAX_HP;
      this.MAX_WT = params.wt || 10;
      this.wt = 0;
      this.atk = params.atk || 10;
      this.def = params.def || 1.0;
      this.res = params.res || 1.0;
    }
    return Status;
  })();
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
  Battler = (function() {
    __extends(Battler, Sprite);
    function Battler(x, y, scale) {
      this.x = x != null ? x : 0;
      this.y = y != null ? y : 0;
      this.scale = scale != null ? scale : 10;
      Battler.__super__.constructor.call(this, this.x, this.y, this.scale);
      this.status = new Status();
      this.state = {
        alive: true,
        active: false
      };
      this.atack_range = 10;
      this.sight_range = 50;
      this.targeting = null;
      this.id = ~~(Math.random() * 100);
    }
    Battler.prototype.update = function(targets, keys, mouse) {
      var target, targets_inrange;
      targets_inrange = this.get_targets_in_range(targets, this.sight_range);
      target = this.set_target(targets_inrange);
      this.move(target);
      return this.act(target);
    };
    Battler.prototype.act = function(target) {
      var d;
      if (target == null) {
        target = this.targeting;
      }
      if (this.targeting) {
        d = this.get_distance(this.targeting);
        if (d < this.atack_range) {
          if (this.status.wt < this.status.MAX_WT) {
            return this.status.wt += 1;
          } else {
            this.atack();
            return this.status.wt = 0;
          }
        } else {
          if (this.status.wt < this.status.MAX_WT) {
            return this.status.wt += 1;
          }
        }
      } else {
        return this.status.wt = 0;
      }
    };
    Battler.prototype.move = function(x, y) {};
    Battler.prototype.atack = function(target) {
      if (target == null) {
        target = this.targeting;
      }
      target.status.hp -= ~~(this.status.atk * (target.status.def + Math.random() / 4));
      if (target.status.hp <= 0) {
        target.state.alive = false;
        return this.targeting = null;
      }
    };
    Battler.prototype.set_target = function(targets) {
      if (targets.length === 0) {
        return this.targeting = null;
      } else if (!this.targeting && targets.length > 0) {
        return this.targeting = targets[0];
      }
    };
    Battler.prototype.change_target = function(targets) {
      var i, _ref, _ref2, _results;
      if (targets.length > 0) {
        if (_ref = !this.targeting, __indexOf.call(targets, _ref) >= 0) {
          this.targeting = targets[0];
          return this.targeting;
        } else if (targets.length === 1) {
          this.targeting = targets[0];
          return this.targeting;
        } else if (targets.length > 1) {
          if (this.targeting) {
            _results = [];
            for (i = 0, _ref2 = targets.length; (0 <= _ref2 ? i < _ref2 : i > _ref2); (0 <= _ref2 ? i += 1 : i -= 1)) {
              if (targets[i] === this.targeting) {
                if (i < targets.length) {
                  this.targeting = targets[i + 1];
                  return this.targeting;
                } else {
                  this.targeting = targets[0];
                  return this.targeting;
                }
              }
            }
            return _results;
          } else {
            this.targeting = targets[0];
            return this.targeting;
          }
        }
      } else {
        this.targeting = null;
        return this.targeting;
      }
    };
    Battler.prototype.get_targets_in_range = function(targets, range) {
      var buff, d, t, _i, _len;
      if (range == null) {
        range = this.sight_range;
      }
      buff = [];
      for (_i = 0, _len = targets.length; _i < _len; _i++) {
        t = targets[_i];
        d = this.get_distance(t);
        if (d < range && t.state.alive) {
          buff[buff.length] = t;
        }
      }
      return buff;
    };
    Battler.prototype._render_gages = function(g, x, y, w, h, rest) {
      my.init_cv(g, "rgb(0, 250, 100)");
      my.render_rest_gage(g, x, y + 15, w, h, this.status.hp / this.status.MAX_HP);
      my.init_cv(g, "rgb(0, 100, e55)");
      return my.render_rest_gage(g, x, y + 25, w, h, this.status.wt / this.status.MAX_WT);
    };
    return Battler;
  })();
  Player = (function() {
    __extends(Player, Battler);
    function Player(x, y) {
      var status;
      this.x = x;
      this.y = y;
      Player.__super__.constructor.call(this, this.x, this.y);
      status = {
        hp: 120,
        wt: 20,
        atk: 10,
        def: 0.8
      };
      this.status = new Status(status);
      this.speed = 6;
      this.atack_range = 50;
      this.dir = 0;
      this.cnt = 0;
    }
    Player.prototype.update = function(enemies, map, keys, mouse) {
      this.cnt += 1;
      if (this.state.alive) {
        this.set_target(this.get_targets_in_range(enemies, this.sight_range));
        this.move(map, keys, mouse);
        return this.act();
      }
    };
    Player.prototype.move = function(cmap, keys, mouse) {
      var move, nx, ny;
      if (keys.right + keys.left + keys.up + keys.down > 1) {
        move = ~~(this.speed * Math.sqrt(2) / 2);
      } else {
        move = this.speed;
      }
      if (keys.right) {
        nx = this.x + move;
      } else if (keys.left) {
        nx = this.x - move;
      } else {
        nx = this.x;
      }
      if (keys.up) {
        ny = this.y - move;
      } else if (keys.down) {
        ny = this.y + move;
      } else {
        ny = this.y;
      }
      if (!cmap.collide(nx, ny)) {
        this.x = nx;
        return this.y = ny;
      }
    };
    Player.prototype.render = function(g) {
      var beat, ms, roll;
      beat = 20;
      my.init_cv(g, "rgb(0, 0, 162)");
      ms = ~~(new Date() / 100) % beat / beat;
      if (ms > 0.5) {
        ms = 1 - ms;
      }
      g.arc(320, 240, (1.3 - ms) * this.scale, 0, Math.PI * 2, true);
      g.stroke();
      roll = Math.PI * (this.cnt % 20) / 10;
      my.init_cv(g, "rgb(128, 100, 162)");
      g.arc(320, 240, this.scale * 0.5, roll, Math.PI + roll, true);
      g.stroke();
      my.init_cv(g, "rgb(255, 0, 0)");
      g.arc(320, 240, this.atack_range, 0, Math.PI * 2, true);
      g.stroke();
      return this._render_gages(g, 320, 240, 40, 6, this.status.hp / this.status.MAX_HP);
    };
    return Player;
  })();
  Enemy = (function() {
    __extends(Enemy, Battler);
    function Enemy(x, y) {
      var status;
      this.x = x;
      this.y = y;
      Enemy.__super__.constructor.call(this, this.x, this.y, this.scale = 5);
      status = {
        hp: 50,
        wt: 22,
        atk: 10,
        def: 1.0
      };
      this.status = new Status(status);
      this.atack_range = 20;
      this.sight_range = 80;
      this.speed = 6;
      this.dir = 0;
      this.cnt = ~~(Math.random() * 24);
    }
    Enemy.prototype.update = function(players, cmap) {
      this.cnt += 1;
      if (this.state.alive) {
        this.set_target(this.get_targets_in_range(players, this.sight_range));
        this.move(cmap);
        return this.act();
      }
    };
    Enemy.prototype.move = function(cmap) {
      var distance, nx, ny;
      if (this.targeting) {
        distance = this.get_distance(this.targeting);
        if (distance > this.atack_range) {
          this.set_dir(this.targeting.x, this.targeting.y);
          nx = this.x + ~~(this.speed * Math.cos(this.dir));
          ny = this.y + ~~(this.speed * Math.sin(this.dir));
        } else {

        }
      } else {
        if (this.cnt % 24 === 0) {
          this.dir = Math.PI * 2 * Math.random();
        }
        if (this.cnt % 24 < 8) {
          nx = this.x + ~~(this.speed * Math.cos(this.dir));
          ny = this.y + ~~(this.speed * Math.sin(this.dir));
        }
      }
      if (!cmap.collide(nx, ny)) {
        if (nx != null) {
          this.x = nx;
        }
        if (ny != null) {
          return this.y = ny;
        }
      }
    };
    Enemy.prototype.render = function(g, cam) {
      var alpha, beat, color, ms, nx, ny, pos;
      my.init_cv(g);
      pos = this.getpos_relative(cam);
      if (this.state.alive) {
        g.fillStyle = 'rgb(255, 255, 255)';
        beat = 20;
        ms = ~~(new Date() / 100) % beat / beat;
        if (ms > 0.5) {
          ms = 1 - ms;
        }
        g.arc(pos.vx, pos.vy, (1.3 + ms) * this.scale, 0, Math.PI * 2, true);
        g.fill();
        if (this.state.active) {
          my.init_cv(g, color = "rgb(255,0,0)");
          g.arc(pos.vx, pos.vy, this.scale * 0.4, 0, Math.PI * 2, true);
          g.fill();
        }
        my.init_cv(g, color = "rgb(50,50,50)", alpha = 0.3);
        g.arc(pos.vx, pos.vy, this.sight_range, 0, Math.PI * 2, true);
        g.stroke();
        nx = ~~(30 * Math.cos(this.dir));
        ny = ~~(30 * Math.sin(this.dir));
        my.init_cv(g, color = "rgb(255,0,0)");
        g.moveTo(pos.vx, pos.vy);
        g.lineTo(pos.vx + nx, pos.vy + ny);
        g.stroke();
        return this._render_gages(g, pos.vx, pos.vy, 30, 6, this.status.wt / this.status.MAX_WT);
      } else {
        g.fillStyle = 'rgb(55, 55, 55)';
        g.arc(pos.vx, pos.vy, this.scale, 0, Math.PI * 2, true);
        return g.fill();
      }
    };
    return Enemy;
  })();
}).call(this);
