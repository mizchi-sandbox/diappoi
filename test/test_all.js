(function() {
  var Animation, Animation_Slash, Battler, Enemy, FieldScene, Game, Map, OpeningScene, Player, Scene, Skill, Skill_Heal, Skill_Meteor, Skill_Smash, Skill_ThrowBomb, Sprite, Status, assert, base_block, keys, maps, mouse, my, rjoin, sjoin, vows;
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
  Game = (function() {
    function Game(conf) {
      var canvas;
      canvas = document.getElementById(conf.CANVAS_NAME);
      this.g = canvas.getContext('2d');
      this.config = conf;
      canvas.width = conf.WINDOW_WIDTH;
      canvas.height = conf.WINDOW_HEIGHT;
      this.keys = {
        left: 0,
        right: 0,
        up: 0,
        down: 0,
        space: 0,
        one: 0,
        two: 0,
        three: 0,
        four: 0,
        five: 0,
        six: 0,
        seven: 0,
        eight: 0,
        nine: 0,
        zero: 0
      };
      this.mouse = {
        x: 0,
        y: 0
      };
      this.scenes = {
        "Field": new FieldScene()
      };
      this.curr_scene = this.scenes["Field"];
    }
    Game.prototype.enter = function() {
      var next_scene;
      next_scene = this.curr_scene.enter(this.keys, this.mouse);
      this.curr_scene = this.scenes[next_scene];
      return this.draw(this.curr_scene);
    };
    Game.prototype.start = function(self) {
      return setInterval(function() {
        return self.enter();
      }, 1000 / this.config.FPS);
    };
    Game.prototype.getkey = function(self, which, to) {
      switch (which) {
        case 68:
        case 39:
          return self.keys.right = to;
        case 65:
        case 37:
          return self.keys.left = to;
        case 87:
        case 38:
          return self.keys.up = to;
        case 83:
        case 40:
          return self.keys.down = to;
        case 32:
          return self.keys.space = to;
        case 17:
          return self.keys.ctrl = to;
        case 48:
          return self.keys.zero = to;
        case 49:
          return self.keys.one = to;
        case 50:
          return self.keys.two = to;
        case 51:
          return self.keys.three = to;
        case 52:
          return self.keys.four = to;
        case 53:
          return self.keys.five = to;
        case 54:
          return self.keys.sixe = to;
        case 55:
          return self.keys.seven = to;
        case 56:
          return self.keys.eight = to;
        case 57:
          return self.keys.nine = to;
      }
    };
    Game.prototype.draw = function(scene) {
      this.g.clearRect(0, 0, this.config.WINDOW_WIDTH, this.config.WINDOW_HEIGHT);
      this.g.save();
      scene.render(this.g);
      return this.g.restore();
    };
    return Game;
  })();
  my = {
    distance: function(x1, y1, x2, y2) {
      var xd, yd;
      xd = Math.pow(x1 - x2, 2);
      yd = Math.pow(y1 - y2, 2);
      return Math.sqrt(xd + yd);
    },
    init_cv: function(g, color, alpha) {
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
    },
    gen_map: function(x, y) {
      var i, j, map;
      map = [];
      for (i = 0; i <= 20; i++) {
        map[i] = [];
        for (j = 0; j <= 15; j++) {
          if (Math.random() > 0.5) {
            map[i][j] = 0;
          } else {
            map[i][j] = 1;
          }
        }
      }
      return map;
    },
    draw_line: function(g, x1, y1, x2, y2) {
      g.moveTo(x1, y1);
      g.lineTo(x2, y2);
      return g.stroke();
    },
    color: function(r, g, b, name) {
      if (r == null) {
        r = 255;
      }
      if (g == null) {
        g = 255;
      }
      if (b == null) {
        b = 255;
      }
      if (name == null) {
        name = null;
      }
      switch (name) {
        case "red":
          return this.color(255, 0, 0);
        case "green":
          return this.color(0, 255, 0);
        case "blue":
          return this.color(0, 0, 255);
        case "white":
          return this.color(255, 255, 255);
        case "black":
          return this.color(0, 0, 0);
        case "grey":
          return this.color(128, 128, 128);
      }
      return "rgb(" + ~~r + "," + ~~g + "," + ~~b + ")";
    },
    draw_cell: function(g, x, y, cell, color) {
      if (color == null) {
        color = "grey";
      }
      g.moveTo(x, y);
      g.lineTo(x + cell, y);
      g.lineTo(x + cell, y + cell);
      g.lineTo(x, y + cell);
      g.lineTo(x, y);
      return g.fill();
    },
    render_rest_gage: function(g, x, y, w, h, percent) {
      if (percent == null) {
        percent = 1;
      }
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
    }
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
  Animation = (function() {
    __extends(Animation, Sprite);
    function Animation(actor, target) {
      Animation.__super__.constructor.call(this, 0, 0);
      this.timer = 0;
    }
    Animation.prototype.render = function(g, x, y) {
      return this.timer++;
    };
    return Animation;
  })();
  Animation_Slash = (function() {
    __extends(Animation_Slash, Animation);
    function Animation_Slash() {
      this.timer = 0;
    }
    Animation_Slash.prototype.render = function(g, x, y) {
      var color, tx, ty;
      if (this.timer < 5) {
        this.init_cv(g, color = "rgb(30,55,55)");
        tx = x - 10 + this.timer * 3;
        ty = y - 10 + this.timer * 3;
        g.moveTo(tx, ty);
        g.lineTo(tx - 8, ty - 8);
        g.lineTo(tx - 4, ty - 8);
        g.lineTo(tx, ty);
        g.fill();
        this.timer++;
        return this;
      } else {
        return false;
      }
    };
    return Animation_Slash;
  })();
  Map = (function() {
    __extends(Map, Sprite);
    function Map(cell) {
      var m;
      this.cell = cell != null ? cell : 32;
      Map.__super__.constructor.call(this, 0, 0, this.cell);
      m = this.load(maps.debug);
      this._map = m;
      this.set_wall();
    }
    Map.prototype.load = function(text) {
      var i, list, map, max, row, tmap, y, _i, _j, _k, _len, _len2, _len3, _ref;
      tmap = text.replaceAll(".", "0").replaceAll(" ", "1").split("\n");
      map = [];
      max = 0;
      for (_i = 0, _len = tmap.length; _i < _len; _i++) {
        row = tmap[_i];
        if (max < row.length) {
          max = row.length;
        }
      }
      y = 0;
      for (_j = 0, _len2 = tmap.length; _j < _len2; _j++) {
        row = tmap[_j];
        list = [];
        _ref = row + 1;
        for (_k = 0, _len3 = _ref.length; _k < _len3; _k++) {
          i = _ref[_k];
          list[list.length] = parseInt(i);
        }
        while (list.length < max) {
          list.push(1);
        }
        map[y] = list;
        y++;
      }
      return map;
    };
    Map.prototype.compile = function(data) {
      return "";
    };
    Map.prototype.set_wall = function() {
      var i, map, x, y, _i, _len;
      map = this._map;
      x = map.length;
      y = map[0].length;
      map[0] = (function() {
        var _ref, _results;
        _results = [];
        for (i = 0, _ref = map[0].length; (0 <= _ref ? i < _ref : i > _ref); (0 <= _ref ? i += 1 : i -= 1)) {
          _results.push(1);
        }
        return _results;
      })();
      map[map.length - 1] = (function() {
        var _ref, _results;
        _results = [];
        for (i = 0, _ref = map[0].length; (0 <= _ref ? i < _ref : i > _ref); (0 <= _ref ? i += 1 : i -= 1)) {
          _results.push(1);
        }
        return _results;
      })();
      for (_i = 0, _len = map.length; _i < _len; _i++) {
        i = map[_i];
        i[0] = 1;
        i[i.length - 1] = 1;
      }
      return map;
    };
    Map.prototype.gen_random_map = function(x, y) {
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
    Map.prototype.get_point = function(x, y) {
      return {
        x: ~~((x + 1 / 2) * this.cell),
        y: ~~((y + 1 / 2) * this.cell)
      };
    };
    Map.prototype.get_randpoint = function() {
      var rx, ry;
      rx = ~~(Math.random() * this._map.length);
      ry = ~~(Math.random() * this._map[0].length);
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
    return Map;
  })();
  maps = {
    filed1: "\n                                           .........\n                                    ................... .\n                               ...........            ......\n                            ....                      ..........\n                         .....              .....        ...... .......\n                 ..........              .........        ............ .....\n                 ............          ...... . ....        ............ . ..\n             .....    ..    ...        ..  ..........       . ..................\n     ..     ......          .........................       . .......   ...... ..\n    .....    ...     ..        .......  ...............      ....        ........\n  ...... ......    .....         ..................... ..   ....         ........\n  .........   ......  ...............  ................... ....            ......\n ...........    ... ... .... .   ..   .. ........ ............             . .....\n ...........    ...... ...       ....................           ......\n............   .......... .    .......... ...... .. .       ...........\n .. ........ .......   ....   ...... .   ............      .... .......\n . ..............       .... .. .       ..............   ...... ..... ..\n  .............          .......       ......       ......... . ...... .\n  ..     .... ..         ... .       ....         .........   ...........\n ...       .......   ........       .. .        .... ....  ... ..........\n.. .         ......  .........      .............. ..  .....  ...    .....\n.....         ......................................      ....        ....\n .....       ........    ... ................... ....     ...        ....\n   ....   ........        ...........................  .....        .....\n   ...........  ..        ........ .............. ... .. .         .....\n       ......                 .........................           .. ..\n                                .....................          .......\n                                    ...................        ......\n                                        .............",
    debug: "             ....\n          ...........\n        ..............\n      .... ........... .\n     .......     ........\n.........    ..     ......\n........   ......    .......\n.........   .....    .......\n .................. ........\n     .......................\n     ....................\n           .............\n              ......\n               .....\n              ....\n              ....\n              ....\n              ....\n              ....\n              ....\n             ....\n             ....\n             ....\n            ....\n            ....\n            ....\n            ....\n            ....\n\n"
  };
  base_block = [[1, 1, 0, 1, 1], [1, 0, 0, 1, 1], [0, 0, 0, 0, 0], [1, 0, 0, 0, 1], [1, 1, 0, 1, 1]];
  rjoin = function(map1, map2) {
    map1;    return map1.concat(map2);
  };
  sjoin = function(map1, map2) {
    var buf, i, y, _ref;
    if (!map1[0].length === map2[0].length) {
      return false;
    }
    y = 0;
    buf = [];
    for (i = 0, _ref = map1.length; (0 <= _ref ? i < _ref : i > _ref); (0 <= _ref ? i += 1 : i -= 1)) {
      buf[i] = map1[i].concat(map2[i]);
      y++;
    }
    return buf;
  };
  String.prototype.replaceAll = function(org, dest) {
    return this.split(org).join(dest);
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
      this.dir = 0;
      this.id = ~~(Math.random() * 100);
      this.animation = [];
    }
    Battler.prototype.add_animation = function(animation) {
      return this.animation[this.animation.length] = animation;
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
      }
      if (this.status.hp > this.status.MAX_HP) {
        this.status.hp = this.status.MAX_HP;
        return this.state.alive = true;
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
      if (targets.length === 0) {
        return this.targeting = null;
      } else if (targets.length > 0) {
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
    Battler.prototype.render_targeted = function(g, cam, color) {
      var alpha, beat, ms, pos;
      if (color == null) {
        color = "rgb(255,0,0)";
      }
      my.init_cv(g);
      pos = this.getpos_relative(cam);
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
      this.binded_skill = {
        one: new Skill_Heal(),
        two: new Skill_Smash(),
        three: new Skill_Meteor()
      };
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
    Player.prototype.render = function(g) {
      var beat, c, color, k, m, ms, roll, v, _ref, _results;
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
      this._render_gages(g, 320, 240, 40, 6, this.status.hp / this.status.MAX_HP);
      if (this.targeting) {
        this.targeting.render_targeted(g, this, color = "rgb(0,0,255)");
      }
      this.render_mouse(g);
      this.render_animation(g, 320, 240);
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
      this.atack_range = 30;
      this.sight_range = 80;
      this.speed = 6;
      this.dir = 0;
      this.cnt = ~~(Math.random() * 24);
    }
    Enemy.prototype.update = function(players, cmap) {
      Enemy.__super__.update.call(this);
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
      var alpha, beat, color, ms, nx, ny, pos, t;
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
        this._render_gages(g, pos.vx, pos.vy, 30, 6, this.status.wt / this.status.MAX_WT);
        if (this.targeting) {
          this.targeting.render_targeted(g, cam);
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
    return Enemy;
  })();
  Skill = (function() {
    function Skill(ct, lv) {
      if (ct == null) {
        ct = 1;
      }
      this.lv = lv != null ? lv : 1;
      this.MAX_CT = ct * 24;
      this.ct = this.MAX_CT;
    }
    Skill.prototype["do"] = function(actor) {};
    Skill.prototype.charge = function(actor) {
      if (this.ct < this.MAX_CT) {
        return this.ct += 1;
      }
    };
    return Skill;
  })();
  Skill_Heal = (function() {
    __extends(Skill_Heal, Skill);
    function Skill_Heal(lv) {
      this.lv = lv != null ? lv : 1;
      Skill_Heal.__super__.constructor.call(this, 15, this.lv);
      this.name = "Heal";
    }
    Skill_Heal.prototype["do"] = function(actor) {
      var target;
      target = actor;
      if (this.ct >= this.MAX_CT) {
        target.status.hp += 30;
        target.check_state();
        this.ct = 0;
        return console.log("do healing");
      } else {
        ;
      }
    };
    return Skill_Heal;
  })();
  Skill_Smash = (function() {
    __extends(Skill_Smash, Skill);
    function Skill_Smash(lv) {
      this.lv = lv != null ? lv : 1;
      Skill_Smash.__super__.constructor.call(this, 8, this.lv);
      this.name = "Smash";
    }
    Skill_Smash.prototype["do"] = function(actor) {
      var target;
      target = actor.targeting;
      if (target) {
        if (this.ct >= this.MAX_CT) {
          target.status.hp -= 30;
          target.check_state();
          this.ct = 0;
          return console.log("Smash!");
        }
      }
    };
    return Skill_Smash;
  })();
  Skill_Meteor = (function() {
    __extends(Skill_Meteor, Skill);
    function Skill_Meteor(lv) {
      this.lv = lv != null ? lv : 1;
      Skill_Meteor.__super__.constructor.call(this, 20, this.lv);
      this.name = "Meteor";
      this.range = 120;
    }
    Skill_Meteor.prototype["do"] = function(actor, targets) {
      var t, targets_on_focus, _i, _len;
      if (this.ct >= this.MAX_CT) {
        targets_on_focus = actor.get_targets_in_range(targets = targets, this.range);
        if (targets_on_focus.length) {
          console.log(targets_on_focus.length);
          for (_i = 0, _len = targets_on_focus.length; _i < _len; _i++) {
            t = targets_on_focus[_i];
            t.status.hp -= 20;
            t.check_state();
          }
          this.ct = 0;
          return console.log("Meteor!");
        }
      }
    };
    return Skill_Meteor;
  })();
  Skill_ThrowBomb = (function() {
    __extends(Skill_ThrowBomb, Skill);
    function Skill_ThrowBomb(lv) {
      var ct;
      this.lv = lv != null ? lv : 1;
      Skill_ThrowBomb.__super__.constructor.call(this, ct = 10, this.lv);
      this.name = "Throw Bomb";
      this.range = 120;
      this.effect_range = 30;
    }
    Skill_ThrowBomb.prototype["do"] = function(actor, targets, mouse) {
      var t, targets_on_focus, _i, _len;
      if (this.ct >= this.MAX_CT) {
        targets_on_focus = actor.get_targets_in_range(targets = targets, this.range);
        if (targets_on_focus.length) {
          console.log(targets_on_focus.length);
          for (_i = 0, _len = targets_on_focus.length; _i < _len; _i++) {
            t = targets_on_focus[_i];
            t.status.hp -= 20;
            t.check_state();
          }
          this.ct = 0;
          return console.log("Meteor!");
        }
      }
    };
    return Skill_ThrowBomb;
  })();
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
      if (this.enemies.length < 1) {
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
      var cam, enemy, mouse_x, mouse_y, _i, _len, _ref;
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
      mouse_x = this.player.x + this.player.mouse.x - 320;
      mouse_y = this.player.y + this.player.mouse.y - 240;
      g.fillText("p: " + (this.player.x + this.player.mouse.x - 320) + "." + (this.player.y + this.player.mouse.y - 240), 15, 25);
      if (this.player.targeting) {
        return g.fillText("p: " + this.player.targeting.status.hp + "." + this.player.targeting.status.MAX_HP, 15, 35);
      }
    };
    return FieldScene;
  })();
  vows = require('vows');
  assert = require('assert');
  keys = {
    left: 0,
    right: 0,
    up: 0,
    down: 0
  };
  mouse = {
    x: 320,
    y: 240
  };
  vows.describe('Game Test').addBatch({
    'combat test': {
      topic: "atack",
      'test': function() {
        var map;
        return map = new Map(32);
      }
    }
  })["export"](module);
}).call(this);
