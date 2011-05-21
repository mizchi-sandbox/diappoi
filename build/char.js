(function() {
  var Battler, Enemy, Follower, Player, Sprite, Status;
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
    return Sprite;
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
      this.sight_range = 80;
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
      my.init_cv(g, "rgb(0, 100, 255)");
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
      this.vx = 0;
      this.vy = 0;
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
    Player.prototype.update = function(enemies, keys, mouse) {
      this.cnt += 1;
      if (this.state.alive) {
        this.set_target(this.get_targets_in_range(enemies, this.sight_range));
        this.move(keys, mouse);
        return this.act();
      }
    };
    Player.prototype.move = function(keys) {
      var move, s;
      s = keys.right + keys.left + keys.up + keys.down;
      if (s > 1) {
        move = this.speed * Math.sqrt(2) / 2;
      } else {
        move = this.speed;
      }
      if (keys.right) {
        this.x += move;
        this.vx -= move;
      }
      if (keys.left) {
        this.x -= move;
        this.vx += move;
      }
      if (keys.up) {
        this.y -= move;
        this.vy += move;
      }
      if (keys.down) {
        this.y += move;
        return this.vy -= move;
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
  Follower = (function() {
    __extends(Follower, Player);
    function Follower(x, y) {
      this.x = x;
      this.y = y;
      Follower.__super__.constructor.call(this, this.x, this.y);
    }
    Follower.prototype.render = function(g, player) {
      my.init_cv(g, "rgb(255, 0, 0)");
      g.arc(320, 240, this.scale, 0, Math.PI * 2, true);
      return g.stroke();
    };
    return Follower;
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
    Enemy.prototype.update = function(players) {
      this.cnt += 1;
      if (this.state.alive) {
        this.set_target(this.get_targets_in_range(players, this.sight_range));
        this.move();
        return this.act();
      }
    };
    Enemy.prototype.move = function() {
      var distance;
      if (this.targeting) {
        distance = this.get_distance(this.targeting);
        if (distance > this.atack_range) {
          if (this.x > this.targeting.x) {
            this.x -= this.speed / 2;
          }
          if (this.x < this.targeting.x) {
            this.x += this.speed / 2;
          }
          if (this.y < this.targeting.y) {
            this.y += this.speed / 2;
          }
          if (this.y > this.targeting.y) {
            return this.y -= this.speed / 2;
          }
        } else {
          ;
        }
      } else {
        if (this.cnt % 24 === 0) {
          this.dir = Math.PI * 2 * Math.random();
        }
        if (this.cnt % 24 < 8) {
          this.x += ~~(this.speed * Math.cos(this.dir));
          return this.y += ~~(this.speed * Math.sin(this.dir));
        }
      }
    };
    Enemy.prototype.render = function(g, player) {
      var alpha, beat, color, ms;
      my.init_cv(g);
      if (this.state.alive) {
        g.fillStyle = 'rgb(255, 255, 255)';
        beat = 20;
        ms = ~~(new Date() / 100) % beat / beat;
        if (ms > 0.5) {
          ms = 1 - ms;
        }
        g.arc(this.x + player.vx, this.y + player.vy, (1.3 - ms) * this.scale, 0, Math.PI * 2, true);
        g.fill();
        if (this.state.active) {
          my.init_cv(g, color = "rgb(255,0,0)");
          g.arc(this.x + player.vx, this.y + player.vy, this.scale * 0.4, 0, Math.PI * 2, true);
          g.fill();
        }
        my.init_cv(g, color = "rgb(50,50,50)", alpha = 0.3);
        g.arc(this.x + player.vx, this.y + player.vy, this.sight_range, 0, Math.PI * 2, true);
        g.stroke();
        return this._render_gages(g, this.x + player.vx, this.y + player.vy, 30, 6, this.status.wt / this.status.MAX_WT);
      } else {
        g.fillStyle = 'rgb(55, 55, 55)';
        g.arc(this.x + player.vx, this.y + player.vy, this.scale, 0, Math.PI * 2, true);
        return g.fill();
      }
    };
    return Enemy;
  })();
}).call(this);
