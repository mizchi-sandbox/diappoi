(function() {
  var Battler, Goblin, Monster, Player, Status;
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
      this.MAX_SP = params.sp || 10;
      this.sp = this.MAX_SP;
      this.exp = 0;
      this.atk = params.atk || 10;
      this.def = params.def || 1.0;
      this.res = params.res || 1.0;
      this.regenerate = params.regenerate || 3;
    }
    return Status;
  })();
  Battler = (function() {
    __extends(Battler, Sprite);
    function Battler(x, y, group) {
      this.x = x != null ? x : 0;
      this.y = y != null ? y : 0;
      this.group = group != null ? group : 0;
      Battler.__super__.constructor.call(this, this.x, this.y, this.scale);
      this.status = new Status();
      this.category = "battler";
      this.state = {
        alive: true,
        active: false
      };
      this.scale = 10;
      this.atack_range = 10;
      this.sight_range = 50;
      this.targeting = null;
      this.dir = 0;
      this.id = ~~(Math.random() * 100);
      this.animation = [];
    }
    Battler.prototype.add_animation = function(animation) {
      return this.animation.push(animation);
    };
    Battler.prototype.render_animation = function(g, x, y) {
      var n, _ref, _results;
      _results = [];
      for (n = 0, _ref = this.animation.length; (0 <= _ref ? n < _ref : n > _ref); (0 <= _ref ? n += 1 : n -= 1)) {
        if (!this.animation[n].render(g, x, y)) {
          this.animation.splice(n, 1);
          this.render_animation(g, x, y);
          break;
        }
      }
      return _results;
    };
    Battler.prototype.update = function() {
      this.cnt += 1;
      this.regenerate();
      return this.check_state();
    };
    Battler.prototype.check_state = function() {
      if (this.state.poizon) {
        this.status.hp -= 1;
      }
      if (this.status.hp < 1) {
        this.status.hp = 0;
        this.state.alive = false;
        this.state.targeting = null;
      }
      if (this.status.hp > this.status.MAX_HP) {
        this.status.hp = this.status.MAX_HP;
        this.state.alive = true;
      }
      if (this.targeting) {
        if (!this.targeting.state.alive) {
          return this.targeting = null;
        }
      }
    };
    Battler.prototype.regenerate = function() {
      var r;
      if (this.targeting) {
        r = 2;
      } else {
        r = 1;
      }
      if (!(this.cnt % (24 / this.status.regenerate * r)) && this.state.alive) {
        if (this.status.hp < this.status.MAX_HP) {
          return this.status.hp += 1;
        }
      }
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
    Battler.prototype.invoke = function(target) {};
    Battler.prototype.atack = function() {
      this.targeting.status.hp -= ~~(this.status.atk * (this.targeting.status.def + Math.random() / 4));
      this.targeting.add_animation(new Animation_Slash());
      return this.targeting.check_state();
    };
    Battler.prototype.set_target = function(targets) {
      if (targets.length > 0) {
        if (!this.targeting || !this.targeting.alive) {
          return this.targeting = targets[0];
        } else {
          return this.targeting;
        }
      }
    };
    Battler.prototype.change_target = function(targets) {
      var i, _ref, _ref2, _results;
      if (targets == null) {
        targets = this.targeting;
      }
      if (targets.length > 0) {
        if (_ref = !this.targeting, __indexOf.call(targets, _ref) >= 0) {
          return this.targeting = targets[0];
        } else if (targets.length === 1) {
          return this.targeting = targets[0];
        } else if (targets.length > 1) {
          if (this.targeting) {
            _results = [];
            for (i = 0, _ref2 = targets.length; (0 <= _ref2 ? i < _ref2 : i > _ref2); (0 <= _ref2 ? i += 1 : i -= 1)) {
              _results.push(targets[i] === this.targeting ? targets.length === i + 1 ? this.targeting = targets[0] : this.targeting = targets[i + 1] : void 0);
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
      var buff, d, enemies, t, _i, _j, _len, _len2;
      if (range == null) {
        range = this.sight_range;
      }
      enemies = [];
      for (_i = 0, _len = targets.length; _i < _len; _i++) {
        t = targets[_i];
        if (t.group !== this.group && t.category === "battler") {
          enemies.push(t);
        }
      }
      buff = [];
      for (_j = 0, _len2 = enemies.length; _j < _len2; _j++) {
        t = enemies[_j];
        d = this.get_distance(t);
        if (d < range && t.state.alive) {
          buff[buff.length] = t;
        }
      }
      return buff;
    };
    Battler.prototype.get_leader = function(targets, range) {
      var t, _i, _len;
      if (range == null) {
        range = this.sight_range;
      }
      for (_i = 0, _len = targets.length; _i < _len; _i++) {
        t = targets[_i];
        if (t.state.leader && t.group === this.group) {
          if (this.get_distance(t) < this.sight_range) {
            return t;
          }
        }
      }
      return null;
    };
    Battler.prototype._render_gages = function(g, x, y, w, h, percent) {
      if (percent == null) {
        percent = 1;
      }
      my.init_cv(g, "rgb(0, 250, 100)");
      g.moveTo(x - w / 2, y - h / 2);
      g.lineTo(x + w / 2, y - h / 2);
      g.lineTo(x + w / 2, y + h / 2);
      g.lineTo(x - w / 2, y + h / 2);
      g.lineTo(x - w / 2, y - h / 2);
      g.stroke();
      g.beginPath();
      g.moveTo(x - w / 2 + 1, y - h / 2 + 1);
      g.lineTo(x - w / 2 + w * percent, y - h / 2 + 1);
      g.lineTo(x - w / 2 + w * percent, y + h / 2 - 1);
      g.lineTo(x - w / 2 + 1, y + h / 2 - 1);
      g.lineTo(x - w / 2 + 1, y - h / 2 + 1);
      return g.fill();
    };
    Battler.prototype.render_targeted = function(g, pos, color) {
      var alpha, beat, ms;
      if (color == null) {
        color = "rgb(255,0,0)";
      }
      my.init_cv(g);
      beat = 24;
      ms = ~~(new Date() / 100) % beat / beat;
      if (ms > 0.5) {
        ms = 1 - ms;
      }
      this.init_cv(g, color = color, alpha = 0.7);
      g.moveTo(pos.vx, pos.vy - 12 + ms * 10);
      g.lineTo(pos.vx - 6 - ms * 5, pos.vy - 20 + ms * 10);
      g.lineTo(pos.vx + 6 + ms * 5, pos.vy - 20 + ms * 10);
      g.lineTo(pos.vx, pos.vy - 12 + ms * 10);
      return g.fill();
    };
    return Battler;
  })();
  Player = (function() {
    __extends(Player, Battler);
    function Player(x, y, group) {
      var status;
      this.x = x;
      this.y = y;
      this.group = group != null ? group : 0;
      Player.__super__.constructor.call(this, this.x, this.y, this.group);
      status = {
        hp: 120,
        wt: 20,
        atk: 10,
        def: 0.8
      };
      this.status = new Status(status);
      this.binded_skill = {
        one: new Skill_Heal(),
        two: new Skill_Smash(),
        three: new Skill_Meteor()
      };
      this.state.leader = true;
      this.cnt = 0;
      this.speed = 6;
      this.atack_range = 50;
      this.mosue = {
        x: 0,
        y: 0
      };
    }
    Player.prototype.update = function(enemies, map, keys, mouse) {
      this.mouse = mouse;
      Player.__super__.update.call(this);
      if (this.state.alive) {
        if (keys.space) {
          this.change_target();
        }
        this.set_target(this.get_targets_in_range(enemies, this.sight_range));
        this.move(map, keys, mouse);
        return this.act(keys, enemies);
      }
    };
    Player.prototype.act = function(keys, enemies) {
      Player.__super__.act.call(this);
      return this.invoke(keys, enemies);
    };
    Player.prototype.invoke = function(keys, enemies) {
      var i, list, _i, _len, _results;
      list = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
      _results = [];
      for (_i = 0, _len = list.length; _i < _len; _i++) {
        i = list[_i];
        _results.push(this.binded_skill[i] ? keys[i] ? this.binded_skill[i]["do"](this, enemies, this.mouse) : this.binded_skill[i].charge() : void 0);
      }
      return _results;
    };
    Player.prototype.set_dir = function(x, y) {
      var rx, ry;
      rx = x - 320;
      ry = y - 240;
      if (rx >= 0) {
        return this.dir = Math.atan(ry / rx);
      } else {
        return this.dir = Math.PI - Math.atan(ry / -rx);
      }
    };
    Player.prototype.move = function(cmap, keys, mouse) {
      var move;
      this.dir = this.set_dir(mouse.x, mouse.y);
      if (keys.right + keys.left + keys.up + keys.down > 1) {
        move = ~~(this.speed * Math.sqrt(2) / 2);
      } else {
        move = this.speed;
      }
      if (keys.right) {
        if (cmap.collide(this.x + move, this.y)) {
          this.x = (~~(this.x / cmap.cell) + 1) * cmap.cell - 1;
        } else {
          this.x += move;
        }
      }
      if (keys.left) {
        if (cmap.collide(this.x - move, this.y)) {
          this.x = (~~(this.x / cmap.cell)) * cmap.cell + 1;
        } else {
          this.x -= move;
        }
      }
      if (keys.up) {
        if (cmap.collide(this.x, this.y - move)) {
          this.y = (~~(this.y / cmap.cell)) * cmap.cell + 1;
        } else {
          this.y -= move;
        }
      }
      if (keys.down) {
        if (cmap.collide(this.x, this.y + move)) {
          return this.y = (~~(this.y / cmap.cell + 1)) * cmap.cell - 1;
        } else {
          return this.y += move;
        }
      }
    };
    Player.prototype.render = function(g, cam) {
      var beat, c, color, k, m, ms, pos, roll, v, _ref, _results;
      pos = this.getpos_relative(cam);
      beat = 20;
      my.init_cv(g, "rgb(0, 0, 162)");
      ms = ~~(new Date() / 100) % beat / beat;
      if (ms > 0.5) {
        ms = 1 - ms;
      }
      g.arc(pos.vx, pos.vy, (1.3 - ms) * this.scale, 0, Math.PI * 2, true);
      g.stroke();
      roll = Math.PI * (this.cnt % 20) / 10;
      my.init_cv(g, "rgb(128, 100, 162)");
      g.arc(320, 240, this.scale * 0.5, roll, Math.PI + roll, true);
      g.stroke();
      my.init_cv(g, "rgb(255, 0, 0)");
      g.arc(pos.vx, pos.vy, this.atack_range, 0, Math.PI * 2, true);
      g.stroke();
      this._render_gages(g, pos.vx, pos.vy + 15, 40, 6, this.status.hp / this.status.MAX_HP);
      this._render_gages(g, pos.vx, pos.vy + 22, 40, 6, this.status.wt / this.status.MAX_WT);
      if (this.targeting) {
        this.targeting.render_targeted(g, pos, color = "rgb(0,0,255)");
      }
      if (this.mouse) {
        this.render_mouse(g);
      }
      this.render_animation(g, pos.vx, pos.vy);
      c = 0;
      _ref = this.binded_skill;
      _results = [];
      for (k in _ref) {
        v = _ref[k];
        this.init_cv(g);
        m = ~~(v.MAX_CT / 24);
        g.fillText(v.name, 10 + 50 * c, 450);
        g.fillText((m - ~~((v.MAX_CT - v.ct) / 24)) + "/" + m, 10 + 50 * c, 460);
        _results.push(c++);
      }
      return _results;
    };
    Player.prototype.render_mouse = function(g) {
      my.init_cv(g, "rgb(200, 200, 50)");
      g.arc(this.mouse.x, this.mouse.y, this.scale, 0, Math.PI * 2, true);
      return g.stroke();
    };
    return Player;
  })();
  Monster = (function() {
    __extends(Monster, Battler);
    function Monster(x, y, group) {
      var status;
      this.x = x;
      this.y = y;
      this.group = group != null ? group : 1;
      Monster.__super__.constructor.call(this, this.x, this.y, this.group);
      this.scale = 5;
      status = {
        hp: 50,
        wt: 22,
        atk: 10,
        def: 1.0
      };
      this.status = new Status(status);
      this.atack_range = 30;
      this.sight_range = 80;
      this.speed = 6;
      this.dir = 0;
      this.cnt = ~~(Math.random() * 24);
    }
    Monster.prototype.update = function(objs, cmap) {
      Monster.__super__.update.call(this);
      if (this.state.alive) {
        this.set_target(this.get_targets_in_range(objs, this.sight_range));
        this.move(cmap, objs);
        return this.act();
      }
    };
    Monster.prototype.trace = function(to_x, to_y) {
      var nx, ny;
      this.set_dir(to_x, to_y);
      nx = this.x + ~~(this.speed * Math.cos(this.dir));
      ny = this.y + ~~(this.speed * Math.sin(this.dir));
      return [nx, ny];
    };
    Monster.prototype.move = function(cmap, objs) {
      var destination, distance, leader, nx, ny, _ref, _ref2;
      leader = this.get_leader(objs);
      destination = null;
      if (this.targeting) {
        distance = this.get_distance(this.targeting);
        if (distance > this.atack_range) {
          _ref = this.trace(this.targeting.x, this.targeting.y), nx = _ref[0], ny = _ref[1];
        } else {

        }
      } else if (leader) {
        distance = this.get_distance(leader);
        if (distance > this.sight_range / 2) {
          _ref2 = this.trace(leader.x, leader.y), nx = _ref2[0], ny = _ref2[1];
        } else {
          if (this.cnt % 24 === 0) {
            this.dir = Math.PI * 2 * Math.random();
          } else if (this.cnt % 24 < 3) {
            nx = this.x + ~~(this.speed * Math.cos(this.dir));
            ny = this.y + ~~(this.speed * Math.sin(this.dir));
          }
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
    Monster.prototype.render = function(g, cam) {
      var alpha, beat, color, ms, nx, ny, pos, t;
      my.init_cv(g);
      pos = this.getpos_relative(cam);
      if (this.state.alive) {
        color = "";
        if (this.group === 0) {
          color = "rgb(255,255,255)";
        } else if (this.group === 1) {
          color = "rgb(55,55,55)";
        }
        this.init_cv(g, color = color);
        beat = 20;
        ms = ~~(new Date() / 100) % beat / beat;
        if (ms > 0.5) {
          ms = 1 - ms;
        }
        g.arc(pos.vx, pos.vy, (1.3 + ms) * this.scale, 0, Math.PI * 2, true);
        g.fill();
        if (this.targeting) {
          my.init_cv(g, color = "rgb(255,0,0)");
          g.arc(pos.vx, pos.vy, this.scale * 0.7, 0, Math.PI * 2, true);
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
        this._render_gages(g, pos.vx, pos.vy + 15, 40, 6, this.status.hp / this.status.MAX_HP);
        this._render_gages(g, pos.vx, pos.vy + 22, 40, 6, this.status.wt / this.status.MAX_WT);
        if (this.targeting) {
          this.targeting.render_targeted(g, pos);
          this.init_cv(g, color = "rgb(0,0,255)", alpha = 0.5);
          g.moveTo(pos.vx, pos.vy);
          t = this.targeting.getpos_relative(cam);
          g.lineTo(t.vx, t.vy);
          g.stroke();
        }
      } else {
        g.fillStyle = 'rgb(55, 55, 55)';
        g.arc(pos.vx, pos.vy, this.scale, 0, Math.PI * 2, true);
        g.fill();
      }
      return this.render_animation(g, pos.vx, pos.vy);
    };
    return Monster;
  })();
  Goblin = (function() {
    __extends(Goblin, Monster);
    function Goblin(x, y, group) {
      this.x = x;
      this.y = y;
      this.group = group != null ? group : 1;
      Goblin.__super__.constructor.call(this, this.x, this.y, this.group);
    }
    Goblin.prototype.update = function(objs, cmap) {
      return Goblin.__super__.update.call(this, objs, cmap);
    };
    Goblin.prototype.move = function(cmap, objs) {
      return Goblin.__super__.move.call(this, cmap, objs);
    };
    Goblin.prototype.render = function(g, cam) {
      return Goblin.__super__.render.call(this, g, cam);
    };
    return Goblin;
  })();
}).call(this);
