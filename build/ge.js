(function() {
  var Animation, Animation_Slash, Battler, FieldScene, Game, Goblin, Map, Monster, OpeningScene, Player, Scene, Skill, Skill_Heal, Skill_Meteor, Skill_Smash, Skill_ThrowBomb, Sprite, Status, base_block, conf, maps, my, randint, rjoin, sjoin;
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
    mklist: function(list, func) {
      var buf, i, _i, _len;
      buf = [];
      for (_i = 0, _len = list.length; _i < _len; _i++) {
        i = list[_i];
        if (func(i)) {
          buf.push(i);
        }
      }
      return buf;
    }
  };
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
  Array.prototype.remove = function(n) {
    return this.splice(n, 1);
  };
  randint = function(from, to) {
    if (!(to != null)) {
      to = from;
      from = 0;
    }
    return ~~(Math.random() * (to - from + 1)) + from;
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
      this.rotate90();
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
    Map.prototype.rotate90 = function() {
      var i, j, map, res, _ref;
      map = this._map;
      res = [];
      for (i = 0, _ref = map[0].length; (0 <= _ref ? i < _ref : i > _ref); (0 <= _ref ? i += 1 : i -= 1)) {
        res[i] = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = map.length; _i < _len; _i++) {
            j = map[_i];
            _results.push(j[i]);
          }
          return _results;
        })();
      }
      return this._map = res;
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
    Map.prototype.get_randpoint = function() {
      var rx, ry;
      rx = ~~(Math.random() * this._map.length);
      ry = ~~(Math.random() * this._map[0].length);
      if (this._map[rx][ry]) {
        return this.get_randpoint();
      }
      return [rx, ry];
    };
    Map.prototype.get_cell = function(x, y) {
      x = ~~(x / this.cell);
      y = ~~(y / this.cell);
      return {
        x: x,
        y: y
      };
    };
    Map.prototype.collide = function(x, y) {
      x = ~~(x / this.cell);
      y = ~~(y / this.cell);
      return this._map[x][y];
    };
    Map.prototype.render = function(g, cam) {
      var color, i, j, pos, w, x, y, _ref, _results;
      pos = this.getpos_relative(cam);
      _results = [];
      for (i = 0, _ref = this._map.length; (0 <= _ref ? i < _ref : i > _ref); (0 <= _ref ? i += 1 : i -= 1)) {
        _results.push((function() {
          var _ref, _results;
          _results = [];
          for (j = 0, _ref = this._map[i].length; (0 <= _ref ? j < _ref : j > _ref); (0 <= _ref ? j += 1 : j -= 1)) {
            _results.push(this._map[i][j] ? (this.init_cv(g, color = "rgb(30,30,30)"), w = 8, x = pos.vx + i * this.cell, y = pos.vy + j * this.cell, g.moveTo(x, y + this.cell), g.lineTo(x + w, y + this.cell - w), g.lineTo(x + this.cell + w, y + this.cell - w), g.lineTo(x + this.cell, y + this.cell), g.lineTo(x, y + this.cell), g.fill(), this.init_cv(g, color = "rgb(40,40,40)"), g.moveTo(x, y + this.cell), g.lineTo(x, y), g.lineTo(x + w, y - w), g.lineTo(x + w, y - w + this.cell), g.lineTo(x, y + this.cell), g.fill()) : void 0);
          }
          return _results;
        }).call(this));
      }
      return _results;
    };
    Map.prototype.render_after = function(g, cam) {
      var alpha, color, i, j, pos, w, _ref, _results;
      pos = this.getpos_relative(cam);
      _results = [];
      for (i = 0, _ref = this._map.length; (0 <= _ref ? i < _ref : i > _ref); (0 <= _ref ? i += 1 : i -= 1)) {
        _results.push((function() {
          var _ref, _results;
          _results = [];
          for (j = 0, _ref = this._map[i].length; (0 <= _ref ? j < _ref : j > _ref); (0 <= _ref ? j += 1 : j -= 1)) {
            _results.push(this._map[i][j] ? (my.init_cv(g, color = "rgb(50,50,50)", alpha = 1), w = 5, g.fillRect(pos.vx + i * this.cell + w, pos.vy + j * this.cell - w, this.cell, this.cell)) : void 0);
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
    debug: "             ....\n          ...........\n        ..............\n      .... ........... .\n     .......     ........\n.........    ..     ......\n........   ......    .......\n.........   .....    .......\n .................. ........\n     .......................\n     ....................\n           .............\n              ......\n               ...\n"
  };
  base_block = [[1, 1, 0, 1, 1], [1, 0, 0, 1, 1], [0, 0, 0, 0, 0], [1, 0, 0, 0, 1], [1, 1, 0, 1, 1]];
  Status = (function() {
    function Status(params, lv) {
      if (params == null) {
        params = {};
      }
      this.lv = lv != null ? lv : 1;
      this.MAX_HP = params.hp || 30;
      this.MAX_WT = params.wt || 10;
      this.MAX_SP = params.sp || 10;
      this.atk = params.atk || 10;
      this.def = params.def || 1.0;
      this.res = params.res || 1.0;
      this.regenerate = params.regenerate || 3;
      this.atack_range = params.atack_range || 50;
      this.sight_range = params.sight_range || 80;
      this.speed = params.speed || 6;
      this.exp = 0;
      this.hp = this.MAX_HP;
      this.sp = this.MAX_SP;
      this.wt = 0;
    }
    return Status;
  })();
  Battler = (function() {
    __extends(Battler, Sprite);
    function Battler(x, y, group, status) {
      this.x = x != null ? x : 0;
      this.y = y != null ? y : 0;
      this.group = group != null ? group : 0;
      if (status == null) {
        status = {};
      }
      Battler.__super__.constructor.call(this, this.x, this.y, this.scale);
      if (!status) {
        status = {
          hp: 50,
          wt: 22,
          atk: 10,
          def: 1.0,
          atack_range: 30,
          sight_range: 80,
          speed: 6
        };
      }
      this.status = new Status(status);
      this.category = "battler";
      this.state = {
        alive: true,
        active: false
      };
      this.scale = 10;
      this.targeting = null;
      this.dir = 0;
      this.cnt = 0;
      this.id = ~~(Math.random() * 100);
      this.animation = [];
    }
    Battler.prototype.update = function(objs, cmap, keys, mouse) {
      this.cnt += 1;
      this.regenerate();
      this.check_state();
      if (this.state.alive) {
        this.set_target(this.get_targets_in_range(objs, this.status.sight_range));
        this.move(objs, cmap, keys, mouse);
        return this.act(keys, objs);
      }
    };
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
    Battler.prototype.set_dir = function(x, y) {
      var rx, ry;
      rx = x - this.x;
      ry = y - this.y;
      if (rx >= 0) {
        return this.dir = Math.atan(ry / rx);
      } else {
        return this.dir = Math.PI - Math.atan(ry / -rx);
      }
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
        if (d < this.status.atack_range) {
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
        range = this.status.sight_range;
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
        range = this.status.sight_range;
      }
      for (_i = 0, _len = targets.length; _i < _len; _i++) {
        t = targets[_i];
        if (t.state.leader && t.group === this.group) {
          if (this.get_distance(t) < this.status.sight_range) {
            return t;
          }
        }
      }
      return null;
    };
    Battler.prototype.render_reach_circle = function(g, pos) {
      var alpha, color;
      this.init_cv(g, color = "rgb(250,50,50)", alpha = 0.3);
      g.arc(pos.vx, pos.vy, this.status.atack_range, 0, Math.PI * 2, true);
      g.stroke();
      this.init_cv(g, color = "rgb(50,50,50)", alpha = 0.3);
      g.arc(pos.vx, pos.vy, this.status.sight_range, 0, Math.PI * 2, true);
      return g.stroke();
    };
    Battler.prototype.render_dir_allow = function(g, pos) {
      var color, nx, ny;
      nx = ~~(30 * Math.cos(this.dir));
      ny = ~~(30 * Math.sin(this.dir));
      my.init_cv(g, color = "rgb(255,0,0)");
      g.moveTo(pos.vx, pos.vy);
      g.lineTo(pos.vx + nx, pos.vy + ny);
      return g.stroke();
    };
    Battler.prototype.render_targeting = function(g, pos, cam) {
      var alpha, color, t;
      if (this.targeting) {
        this.targeting.render_targeted(g, pos);
        this.init_cv(g, color = "rgb(0,0,255)", alpha = 0.5);
        g.moveTo(pos.vx, pos.vy);
        t = this.targeting.getpos_relative(cam);
        g.lineTo(t.vx, t.vy);
        g.stroke();
        my.init_cv(g, color = "rgb(255,0,0)", alpha = 0.6);
        g.arc(pos.vx, pos.vy, this.scale * 0.7, 0, Math.PI * 2, true);
        return g.fill();
      }
    };
    Battler.prototype.render_state = function(g, pos) {
      this.init_cv(g);
      this.render_gages(g, pos.vx, pos.vy + 15, 40, 6, this.status.hp / this.status.MAX_HP);
      return this.render_gages(g, pos.vx, pos.vy + 22, 40, 6, this.status.wt / this.status.MAX_WT);
    };
    Battler.prototype.render_dead = function(g, pos) {
      var color;
      this.init_cv(g, color = 'rgb(55, 55, 55)');
      g.arc(pos.vx, pos.vy, this.scale, 0, Math.PI * 2, true);
      return g.fill();
    };
    Battler.prototype.render_gages = function(g, x, y, w, h, percent) {
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
    Battler.prototype.render = function(g, cam) {
      var pos;
      this.init_cv(g);
      pos = this.getpos_relative(cam);
      if (this.state.alive) {
        this.render_object(g, pos);
        this.render_state(g, pos);
        this.render_dir_allow(g, pos);
        this.render_reach_circle(g, pos);
        this.render_targeting(g, pos, cam);
      } else {
        this.render_dead(g, pos);
      }
      return this.render_animation(g, pos.vx, pos.vy);
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
        def: 0.8,
        atack_range: 50,
        sight_range: 80,
        speed: 6
      };
      this.status = new Status(status);
      this.binded_skill = {
        one: new Skill_Heal(),
        two: new Skill_Smash(),
        three: new Skill_Meteor()
      };
      this.state.leader = true;
      this.mosue = {
        x: 0,
        y: 0
      };
    }
    Player.prototype.update = function(objs, cmap, keys, mouse) {
      this.mouse = mouse;
      if (keys.space) {
        this.change_target();
      }
      return Player.__super__.update.call(this, objs, cmap, keys, this.mouse);
    };
    Player.prototype.set_mouse_dir = function(x, y) {
      var rx, ry;
      rx = x - 320;
      ry = y - 240;
      if (rx >= 0) {
        return this.dir = Math.atan(ry / rx);
      } else {
        return this.dir = Math.PI - Math.atan(ry / -rx);
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
    Player.prototype.move = function(objs, cmap, keys, mouse) {
      var move;
      this.dir = this.set_mouse_dir(mouse.x, mouse.y);
      if (keys.right + keys.left + keys.up + keys.down > 1) {
        move = ~~(this.status.speed * Math.sqrt(2) / 2);
      } else {
        move = this.status.speed;
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
    Player.prototype.render_object = function(g, pos) {
      var beat, color, ms, roll;
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
      g.arc(pos.vx, pos.vy, (1.3 - ms) * this.scale, 0, Math.PI * 2, true);
      g.fill();
      roll = Math.PI * (this.cnt % 20) / 10;
      my.init_cv(g, "rgb(128, 100, 162)");
      g.arc(320, 240, this.scale * 0.5, roll, Math.PI + roll, true);
      return g.stroke();
    };
    Player.prototype.render = function(g, cam) {
      Player.__super__.render.call(this, g, cam);
      return this.render_mouse(g);
    };
    Player.prototype.render_skill_gage = function(g) {
      var c, number, skill, _ref, _results;
      c = 0;
      _ref = this.binded_skill;
      _results = [];
      for (number in _ref) {
        skill = _ref[number];
        this.init_cv(g);
        g.fillText(skill.name, 20 + c * 50, 460);
        this.render_gages(g, 40 + c * 50, 470, 40, 6, skill.ct / skill.MAX_CT);
        _results.push(c++);
      }
      return _results;
    };
    Player.prototype.render_mouse = function(g) {
      if (this.mouse) {
        my.init_cv(g, "rgb(200, 200, 50)");
        g.arc(this.mouse.x, this.mouse.y, this.scale, 0, Math.PI * 2, true);
        return g.stroke();
      }
    };
    return Player;
  })();
  Monster = (function() {
    __extends(Monster, Battler);
    function Monster(x, y, group, status) {
      this.x = x;
      this.y = y;
      this.group = group != null ? group : 1;
      if (status == null) {
        status = {};
      }
      Monster.__super__.constructor.call(this, this.x, this.y, this.group, status);
      this.scale = 5;
      this.dir = 0;
      this.cnt = ~~(Math.random() * 24);
    }
    Monster.prototype.update = function(objs, cmap) {
      return Monster.__super__.update.call(this, objs, cmap);
    };
    Monster.prototype.trace = function(to_x, to_y) {
      var nx, ny;
      this.set_dir(to_x, to_y);
      nx = this.x + ~~(this.status.speed * Math.cos(this.dir));
      ny = this.y + ~~(this.status.speed * Math.sin(this.dir));
      return [nx, ny];
    };
    Monster.prototype.wander = function(cmap) {
      var c, d, to_x, to_y, _ref;
      if (this.cnt % 24 === 0) {
        c = cmap.get_cell(this.x, this.y);
        d = cmap.get_point(c.x + randint(-1, 1), c.y + randint(-1, 1));
        this.distination = [d.x, d.y];
        console.log;
      }
      if (this.distination) {
        console.log(this.distination);
        _ref = this.distination, to_x = _ref[0], to_y = _ref[1];
        return this.trace();
      }
      return [this.x, this.y];
    };
    Monster.prototype.move = function(objs, cmap) {
      var destination, distance, leader, nx, ny, _ref, _ref2, _ref3, _ref4;
      leader = this.get_leader(objs);
      destination = null;
      if (this.targeting) {
        distance = this.get_distance(this.targeting);
        if (distance > this.status.atack_range) {
          _ref = this.trace(this.targeting.x, this.targeting.y), nx = _ref[0], ny = _ref[1];
        } else {

        }
      } else if (leader) {
        distance = this.get_distance(leader);
        if (distance > this.status.sight_range / 2) {
          _ref2 = this.trace(leader.x, leader.y), nx = _ref2[0], ny = _ref2[1];
        } else {
          _ref3 = this.wander(cmap), nx = _ref3[0], ny = _ref3[1];
        }
      } else {
        _ref4 = this.wander(cmap), nx = _ref4[0], ny = _ref4[1];
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
    return Monster;
  })();
  Goblin = (function() {
    __extends(Goblin, Monster);
    function Goblin(x, y, group) {
      var status;
      this.x = x;
      this.y = y;
      this.group = group;
      status = {
        hp: 50,
        wt: 30,
        atk: 10,
        def: 1.0
      };
      Goblin.__super__.constructor.call(this, this.x, this.y, this.group, status);
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
    Goblin.prototype.render_object = function(g, pos) {
      var beat, color, ms;
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
      return g.fill();
    };
    return Goblin;
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
      return g.fillText("Opening", 300, 200);
    };
    return OpeningScene;
  })();
  FieldScene = (function() {
    __extends(FieldScene, Scene);
    function FieldScene() {
      var player, start_point;
      FieldScene.__super__.constructor.call(this, "Field");
      this.map = new Map(32);
      start_point = this.map.get_randpoint();
      player = new Player(start_point.x, start_point.y, 0);
      this.objs = [player];
      this.set_camera(player);
      this.max_object_count = 11;
      this.fcnt = 0;
    }
    FieldScene.prototype.enter = function(keys, mouse) {
      var group, i, obj, player, rpo, start_point, _i, _len, _ref, _ref2;
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
        this.objs.push(new Goblin(rpo.x, rpo.y, group));
        if (Math.random() < 0.3) {
          this.objs[this.objs.length - 1].state.leader = 1;
        }
      } else {
        for (i = 0, _ref2 = this.objs.length; (0 <= _ref2 ? i < _ref2 : i > _ref2); (0 <= _ref2 ? i += 1 : i -= 1)) {
          if (!this.objs[i].state.alive) {
            if (this.objs[i] === this.camera) {
              start_point = this.map.get_randpoint();
              player = new Player(start_point.x, start_point.y, 0);
              this.objs.push(player);
              this.set_camera(player);
              this.objs.splice(i, 1);
            } else {
              this.objs.splice(i, 1);
            }
            break;
          }
        }
      }
      this.fcnt++;
      return this.name;
    };
    FieldScene.prototype.set_camera = function(obj) {
      return this.camera = obj;
    };
    FieldScene.prototype.render = function(g) {
      var obj, player, _i, _len, _ref;
      this.map.render(g, this.camera);
      _ref = this.objs;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        obj = _ref[_i];
        obj.render(g, this.camera);
      }
      this.map.render_after(g, this.camera);
      player = this.camera;
      if (player) {
        player.render_skill_gage(g);
        my.init_cv(g);
        return g.fillText("HP " + player.status.hp + "/" + player.status.MAX_HP, 15, 15);
      }
    };
    return FieldScene;
  })();
  conf = {
    WINDOW_WIDTH: 640,
    WINDOW_HEIGHT: 480,
    VIEW_X: 320,
    VIEW_Y: 240,
    CANVAS_NAME: "game",
    FPS: 24
  };
  window.onload = function() {
    var game, gamewindow;
    game = new Game(conf);
    gamewindow = document.getElementById('game');
    gamewindow.onmousemove = function(e) {
      game.mouse.x = e.x - gamewindow.offsetLeft;
      return game.mouse.y = e.y - gamewindow.offsetTop;
    };
    window.document.onkeydown = function(e) {
      return game.getkey(game, e.keyCode, 1);
    };
    window.document.onkeyup = function(e) {
      return game.getkey(game, e.keyCode, 0);
    };
    return game.start(game);
  };
}).call(this);
