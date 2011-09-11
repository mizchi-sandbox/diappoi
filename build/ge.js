(function() {
  var Anim, Animation, AreaHit, Burn, Canvas, Character, Color, Conf, DamageHit, FieldScene, Game, Goblin, ItemObject, Map, Mouse, Node, ObjectGroup, OpeningScene, Player, SampleMap, Scene, SingleHit, Skill, Skill_Atack, Skill_Heal, Skill_Meteor, Skill_Smash, Skill_ThrowBomb, Slash, Sprite, Status, base_block, init_cv, maps, my, randint, rjoin, sjoin;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Game = (function() {
    function Game(conf) {
      var canvas;
      my.mes("Welcome to the world!");
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
        "Opening": new OpeningScene(),
        "Field": new FieldScene()
      };
      this.scene_name = "Opening";
    }
    Game.prototype.enter = function() {
      this.scene_name = this.scenes[this.scene_name].enter(this.keys, this.mouse);
      return this.draw(this.scenes[this.scene_name]);
    };
    Game.prototype.start = function(self) {
      var animationLoop;
      animationLoop = function() {
        self.enter();
        return requestAnimationFrame(animationLoop);
      };
      return animationLoop();
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
    mes: function(text) {
      var elm;
      elm = $("<li>").text(text);
      return $("#message").prepend(elm);
    },
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
    return map1.concat(map2);
  };
  sjoin = function(map1, map2) {
    var buf, i, y, _ref;
    if (!map1[0].length === map2[0].length) {
      return false;
    }
    y = 0;
    buf = [];
    for (i = 0, _ref = map1.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      buf[i] = map1[i].concat(map2[i]);
      y++;
    }
    return buf;
  };
  randint = function(from, to) {
    if (!(to != null)) {
      to = from;
      from = 0;
    }
    return ~~(Math.random() * (to - from + 1)) + from;
  };
  Color = {
    Red: "rgb(255,0,0)",
    Blue: "rgb(0,0,255)",
    Green: "rgb(0,255,0)",
    White: "rgb(255,255,255)",
    Black: "rgb(0,0,0)",
    i: function(r, g, b) {
      return "rgb(" + r + "," + g + "," + b + ")";
    }
  };
  init_cv = function(g, color, alpha) {
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
      return pos = {
        vx: 320 + this.x - cam.x,
        vy: 240 + this.y - cam.y
      };
    };
    Sprite.prototype.find_obj = function(group_id, targets, range) {
      return targets.filter(__bind(function(t) {
        return t.group === group_id && this.get_distance(t) < range;
      }, this));
    };
    Sprite.prototype.is_targeted = function(objs) {
      var i;
      return __indexOf.call((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = objs.length; _i < _len; _i++) {
          i = objs[_i];
          _results.push(i.targeting_obj != null);
        }
        return _results;
      })(), this) >= 0;
    };
    Sprite.prototype.has_target = function() {
      return false;
    };
    Sprite.prototype.is_following = function() {
      return false;
    };
    Sprite.prototype.is_alive = function() {
      return false;
    };
    Sprite.prototype.is_dead = function() {
      return !this.is_alive();
    };
    Sprite.prototype.find_obj = function(group_id, targets, range) {
      return targets.filter(__bind(function(t) {
        return t.group === group_id && this.get_distance(t) < range && t.is_alive();
      }, this));
    };
    return Sprite;
  })();
  ObjectGroup = {
    Player: 0,
    Enemy: 1,
    Item: 2,
    is_battler: function(group_id) {
      return group_id === this.Player || group_id === this.Enemy;
    },
    get_against: function(obj) {
      switch (obj.group) {
        case this.Player:
          return this.Enemy;
        case this.Enemy:
          return this.Player;
      }
    }
  };
  ItemObject = (function() {
    __extends(ItemObject, Sprite);
    function ItemObject(x, y, scale) {
      this.x = x != null ? x : 0;
      this.y = y != null ? y : 0;
      this.scale = scale != null ? scale : 10;
      this.group = ObjectGroup.Item;
    }
    ItemObject.prototype.update = function() {};
    ItemObject.prototype.render = function(g, cam) {
      var color, pos;
      g.init(color = "rgb(0,0,255)");
      pos = this.getpos_relative(cam);
      g.beginPath();
      g.arc(pos.vx, pos.vy, 15 - ms, 0, Math.PI * 2, true);
      return g.stroke();
    };
    return ItemObject;
  })();
  Map = (function() {
    __extends(Map, Sprite);
    function Map(cell) {
      this.cell = cell != null ? cell : 32;
      Map.__super__.constructor.call(this, 0, 0, this.cell);
      this._map = this.load(maps.debug);
    }
    Map.prototype.gen_blocked_map = function() {
      var m, map;
      map = this.gen_map();
      m = base_block;
      m = rjoin(m, m);
      m = sjoin(m, m);
      return map;
    };
    Map.prototype.load = function(text) {
      var i, map, max, row, tmap, y, _ref;
      tmap = text.replaceAll(".", "0").replaceAll(" ", "1").split("\n");
      max = Math.max.apply(null, (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = tmap.length; _i < _len; _i++) {
          row = tmap[_i];
          _results.push(row.length);
        }
        return _results;
      })());
      map = [];
      for (y = 0, _ref = tmap.length; 0 <= _ref ? y < _ref : y > _ref; 0 <= _ref ? y++ : y--) {
        map[y] = (function() {
          var _results;
          _results = [];
          for (i = 0; 0 <= max ? i < max : i > max; 0 <= max ? i++ : i--) {
            _results.push((i < tmap[y].length ? parseInt(tmap[y][i]) : 1));
          }
          return _results;
        })();
      }
      map = this._rotate90(map);
      map = this._set_wall(map);
      return map;
    };
    Map.prototype.gen_random_map = function(x, y) {
      var i, j, map;
      map = [];
      for (i = 0; 0 <= x ? i < x : i > x; 0 <= x ? i++ : i--) {
        map[i] = [];
        for (j = 0; 0 <= y ? j < y : j > y; 0 <= y ? j++ : j--) {
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
    Map.prototype.get_cell = function(x, y) {
      x = ~~(x / this.cell);
      y = ~~(y / this.cell);
      return {
        x: x,
        y: y
      };
    };
    Map.prototype.get_rand_cell_xy = function() {
      var rx, ry;
      rx = ~~(Math.random() * this._map.length);
      ry = ~~(Math.random() * this._map[0].length);
      if (this._map[rx][ry]) {
        return this.get_rand_cell_xy();
      }
      return [rx, ry];
    };
    Map.prototype.get_rand_xy = function() {
      var rx, ry;
      rx = ~~(Math.random() * this._map.length);
      ry = ~~(Math.random() * this._map[0].length);
      if (this._map[rx][ry]) {
        return this.get_rand_xy();
      }
      return this.get_point(rx, ry);
    };
    Map.prototype.collide = function(x, y) {
      x = ~~(x / this.cell);
      y = ~~(y / this.cell);
      return this._map[x][y];
    };
    Map.prototype.search_path = function(start, goal) {
      var close_list, dist, i, max_depth, min_node, n, n_gs, nx, ny, obj, open_list, path, search_path, start_node, _, _i, _len, _ref;
      path = [];
      Node.prototype.start = start;
      Node.prototype.goal = goal;
      open_list = [];
      close_list = [];
      start_node = new Node(Node.prototype.start);
      start_node.fs = start_node.hs;
      open_list.push(start_node);
      search_path = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
      max_depth = 100;
      for (_ = 1; 1 <= max_depth ? _ <= max_depth : _ >= max_depth; 1 <= max_depth ? _++ : _--) {
        if (open_list.size() < 1) {
          return [];
        }
        open_list.sort(function(a, b) {
          return a.fs - b.fs;
        });
        min_node = open_list[0];
        close_list.push(open_list.shift());
        if (min_node.pos[0] === min_node.goal[0] && min_node.pos[1] === min_node.goal[1]) {
          path = [];
          n = min_node;
          while (n.parent) {
            path.push(n.pos);
            n = n.parent;
          }
          return path.reverse();
        }
        n_gs = min_node.fs - min_node.hs;
        for (_i = 0, _len = search_path.length; _i < _len; _i++) {
          i = search_path[_i];
          _ref = [i[0] + min_node.pos[0], i[1] + min_node.pos[1]], nx = _ref[0], ny = _ref[1];
          if (!this._map[nx][ny]) {
            dist = Math.pow(min_node.pos[0] - nx, 2) + Math.pow(min_node.pos[1] - ny, 2);
            if (obj = open_list.find([nx, ny])) {
              if (obj.fs > n_gs + obj.hs + dist) {
                obj.fs = n_gs + obj.hs + dist;
                obj.parent = min_node;
              }
            } else if (obj = close_list.find([nx, ny])) {
              if (obj.fs > n_gs + obj.hs + dist) {
                obj.fs = n_gs + obj.hs + dist;
                obj.parent = min_node;
                open_list.push(obj);
                close_list.remove(obj);
              }
            } else {
              n = new Node([nx, ny]);
              n.fs = n_gs + n.hs + dist;
              n.parent = min_node;
              open_list.push(n);
            }
          }
        }
      }
      return [];
    };
    Map.prototype.render = function(g, cam) {
      var color, i, j, pos, _ref, _results;
      pos = this.getpos_relative(cam);
      _results = [];
      for (i = 0, _ref = this._map.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        _results.push((function() {
          var _ref2, _results2;
          _results2 = [];
          for (j = 0, _ref2 = this._map[i].length; 0 <= _ref2 ? j < _ref2 : j > _ref2; 0 <= _ref2 ? j++ : j--) {
            _results2.push(this._map[i][j] ? g.init(color = Color.i(30, 30, 30)) : void 0);
          }
          return _results2;
        }).call(this));
      }
      return _results;
    };
    Map.prototype.render_after = function(g, cam) {
      var alpha, i, j, pos, x, y, _ref, _results;
      pos = this.getpos_relative(cam);
      _results = [];
      for (i = 0, _ref = this._map.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        _results.push((function() {
          var _ref2, _results2;
          _results2 = [];
          for (j = 0, _ref2 = this._map[i].length; 0 <= _ref2 ? j < _ref2 : j > _ref2; 0 <= _ref2 ? j++ : j--) {
            _results2.push(this._map[i][j] ? (g.init(Color.i(50, 50, 50), alpha = 1), x = pos.vx + i * this.cell, y = pos.vy + j * this.cell, (-this.cell < x && x < 640) && (-this.cell < y && y < 480) ? g.fillRect(x, y, this.cell, this.cell) : void 0) : void 0);
          }
          return _results2;
        }).call(this));
      }
      return _results;
    };
    Map.prototype._rotate90 = function(map) {
      var i, j, res, _ref;
      res = [];
      for (i = 0, _ref = map[0].length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
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
      return res;
    };
    Map.prototype._set_wall = function(map) {
      var i, x, y, _i, _len;
      x = map.length;
      y = map[0].length;
      map[0] = (function() {
        var _ref, _results;
        _results = [];
        for (i = 0, _ref = map[0].length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
          _results.push(1);
        }
        return _results;
      })();
      map[map.length - 1] = (function() {
        var _ref, _results;
        _results = [];
        for (i = 0, _ref = map[0].length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
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
    return Map;
  })();
  SampleMap = (function() {
    __extends(SampleMap, Map);
    SampleMap.prototype.max_object_count = 18;
    SampleMap.prototype.frame_count = 0;
    function SampleMap(context, cell) {
      this.context = context;
      this.cell = cell != null ? cell : 32;
      SampleMap.__super__.constructor.call(this, this.cell);
      this._map = this.load(maps.filed1);
    }
    SampleMap.prototype.update = function(objs, camera) {
      this._check_death(objs, camera);
      return this._pop_monster(objs);
    };
    SampleMap.prototype._check_death = function(objs, camera) {
      var i, player, start_point, _ref, _results;
      _results = [];
      for (i = 0, _ref = objs.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        if (!objs[i].is_alive()) {
          if (objs[i] === camera) {
            start_point = this.get_rand_xy();
            player = new Player(start_point.x, start_point.y, 0);
            this.context.set_camera(player);
            objs.push(player);
            objs.splice(i, 1);
          } else {
            objs.splice(i, 1);
          }
          break;
        }
      }
      return _results;
    };
    SampleMap.prototype._pop_monster = function(objs) {
      var group, random_point;
      if (objs.length < this.max_object_count && this.frame_count % 60 * 3 === 0) {
        group = (Math.random() > 0.05 ? ObjectGroup.Enemy : ObjectGroup.Player);
        random_point = this.get_rand_xy();
        return objs.push(new Goblin(random_point.x, random_point.y, group));
      }
    };
    return SampleMap;
  })();
  Node = (function() {
    Node.prototype.start = [null, null];
    Node.prototype.goal = [null, null];
    function Node(pos) {
      this.pos = pos;
      this.owner_list = null;
      this.parent = null;
      this.hs = Math.pow(pos[0] - this.goal[0], 2) + Math.pow(pos[1] - this.goal[1], 2);
      this.fs = 0;
    }
    Node.prototype.is_goal = function(self) {
      return this.goal === this.pos;
    };
    return Node;
  })();
  maps = {
    filed1: "\n                                           .........\n                                    ................... .\n                               ...........            ......\n                            ....                      ..........\n                         .....              .....        ...... .......\n                 ..........              .........        ............ .....\n                 ............          ...... . ....        ............ . ..\n             .....    ..    ...        ..  ..........       . ..................\n     ..     ......          .........................       . .......   ...... ..\n    .....    ...     ..        .......  ...............      ....        ........\n  ...... ......    .....         ..................... ..   ....         ........\n  .........   ......  ...............  ................... ....            ......\n ...........    ... ... .... .   ..   .. ........ ............             . .....\n ...........    ...... ...       ....................           ......\n............   .......... .    .......... ...... .. .       ...........\n .. ........ .......   ....   ...... .   ............      .... .......\n . ..............       .... .. .       ..............   ...... ..... ..\n  .............          .......       ......       ......... . ...... .\n  ..     .... ..         ... .       ....         .........   ...........\n ...       .......   ........       .. .        .... ....  ... ..........\n.. .         ......  .........      .............. ..  .....  ...    .....\n.....         ......................................      ....        ....\n .....       ........    ... ................... ....     ...        ....\n   ....   ........        ...........................  .....        .....\n   ...........  ..        ........ .............. ... .. .         .....\n       ......                 .........................           .. ..\n                                .....................          .......\n                                    ...................        ......\n                                        .............",
    debug: "             ....\n          ...........\n        ..............\n      .... ........... .\n     .......  ..  ........\n.........    ..     ......\n........   ......    .......\n.........   .....    .......\n .................. ........\n     .......................\n     ....................\n           .............\n              ......\n               ...\n"
  };
  base_block = [[1, 1, 0, 1, 1], [1, 0, 0, 1, 1], [0, 0, 0, 0, 0], [1, 0, 0, 0, 1], [1, 1, 0, 1, 1]];
  Character = (function() {
    __extends(Character, Sprite);
    Character.prototype.scale = null;
    Character.prototype.status = {};
    Character.prototype.state = null;
    Character.prototype.following_obj = null;
    Character.prototype.targeting_obj = null;
    function Character(x, y, group, status) {
      this.x = x != null ? x : 0;
      this.y = y != null ? y : 0;
      this.group = group != null ? group : ObjectGroup.Enemy;
      if (status == null) {
        status = {};
      }
      Character.__super__.constructor.call(this, this.x, this.y);
      this.state = {
        active: false
      };
      this.targeting_obj = null;
      this.dir = 0;
      this.cnt = 0;
      this.id = ~~(Math.random() * 100);
      this.animation = [];
      this.cnt = ~~(Math.random() * 60);
      this.distination = [this.x, this.y];
      this._path = [];
    }
    Character.prototype.update = function(objs, cmap, keys, mouse) {
      var name, skill, _ref;
      this.cnt += 1;
      if (this.is_alive()) {
        this.check();
        this.regenerate();
        this.search(objs);
        this.move(objs, cmap, keys, mouse);
        this.change_skill(keys, objs);
        _ref = this.skills;
        for (name in _ref) {
          skill = _ref[name];
          skill.charge(this, skill === this.selected_skill);
        }
        return this.selected_skill.exec(this, objs);
      }
    };
    Character.prototype.has_target = function() {
      if (this.targeting_obj !== null) {
        return true;
      } else {
        return false;
      }
    };
    Character.prototype.is_following = function() {
      if (this.following_obj !== null) {
        return true;
      } else {
        return false;
      }
    };
    Character.prototype.is_alive = function() {
      return this.status.hp > 1;
    };
    Character.prototype.is_dead = function() {
      return !this.is_alive();
    };
    Character.prototype.find_obj = function(group_id, targets, range) {
      return targets.filter(__bind(function(t) {
        return t.group === group_id && this.get_distance(t) < range && t.is_alive();
      }, this));
    };
    Character.prototype.add_damage = function(amount) {
      this.status.hp -= amount;
      this.check();
      return this.is_alive();
    };
    Character.prototype.set_dir = function(x, y) {
      var rx, ry;
      rx = x - this.x;
      ry = y - this.y;
      if (rx >= 0) {
        return this.dir = Math.atan(ry / rx);
      } else {
        return this.dir = Math.PI - Math.atan(ry / -rx);
      }
    };
    Character.prototype.check = function() {
      var _ref;
      if (this.status.hp > this.status.MAX_HP) {
        this.status.hp = this.status.MAX_HP;
      }
      if (this.status.hp < 0) {
        this.status.hp = 0;
      }
      if (this.is_alive()) {
        if ((_ref = this.targeting_obj) != null ? _ref.is_dead() : void 0) {
          return this.targeting_obj = null;
        }
      } else {
        return this.targeting_obj = null;
      }
    };
    Character.prototype.regenerate = function() {
      var r;
      r = (this.targeting_obj ? 2 : 1);
      if (this.is_alive()) {
        if (this.status.hp < this.status.MAX_HP) {
          return this.status.hp += 1;
        }
      }
    };
    Character.prototype.shift_target = function(targets) {
      var cur, _ref;
      if (this.has_target() && targets.length > 0) {
        if (_ref = !this.targeting_obj, __indexOf.call(targets, _ref) >= 0) {
          this.targeting_obj = targets[0];
          return;
        } else if (targets.size() === 1) {
          this.targeting_obj = targets[0];
          return;
        }
        if (targets.size() > 1) {
          cur = targets.indexOf(this.targeting_obj);
          console.log("before: " + cur + " " + (targets.size()));
          if (cur + 1 >= targets.size()) {
            cur = 0;
          } else {
            cur += 1;
          }
          this.targeting_obj = targets[cur];
          return console.log("after: " + cur);
        }
      }
    };
    Character.prototype.add_animation = function(animation) {
      return this.animation.push(animation);
    };
    Character.prototype.render_animation = function(g, x, y) {
      var n, _ref, _results;
      _results = [];
      for (n = 0, _ref = this.animation.length; 0 <= _ref ? n < _ref : n > _ref; 0 <= _ref ? n++ : n--) {
        if (!this.animation[n].render(g, x, y)) {
          this.animation.splice(n, 1);
          this.render_animation(g, x, y);
          break;
        }
      }
      return _results;
    };
    Character.prototype.render_reach_circle = function(g, pos) {
      var alpha;
      g.init();
      g.drawArc(false, pos.vx, pos.vy, this.selected_skill.range);
      g.init(Color.i(50, 50, 50), alpha = 0.3);
      return g.drawArc(false, pos.vx, pos.vy, this.status.sight_range);
    };
    Character.prototype.render_dir_allow = function(g, pos) {
      g.init(Color.i(255, 0, 0));
      return g.drawLine(pos.vx, pos.vy, ~~(30 * Math.cos(this.dir)), ~~(30 * Math.sin(this.dir)));
    };
    Character.prototype.render_targeting_obj = function(g, pos, cam) {
      var alpha, color, t, _ref;
      if ((_ref = this.targeting_obj) != null ? _ref.is_alive() : void 0) {
        this.targeting_obj.render_targeted(g, pos);
        g.init(color = "rgb(0,0,255)", alpha = 0.5);
        g.moveTo(pos.vx, pos.vy);
        t = this.targeting_obj.getpos_relative(cam);
        g.lineTo(t.vx, t.vy);
        g.stroke();
        g.init(color = "rgb(255,0,0)", alpha = 0.6);
        return g.drawArc(true, pos.vx, pos.vy, this.scale * 0.7);
      }
    };
    Character.prototype.render_state = function(g, pos) {
      var text;
      g.init();
      this.render_gages(g, pos.vx, pos.vy + 15, 40, 6, this.status.hp / this.status.MAX_HP);
      g.init();
      this.render_gages(g, pos.vx, pos.vy + 22, 40, 6, this.selected_skill.ct / this.selected_skill.MAX_CT);
      g.init();
      if (this.has_target()) {
        text = this.selected_skill.name;
      } else {
        text = "wander";
      }
      return g.fillText(text, pos.vx + 23, pos.vy + 22);
    };
    Character.prototype.render_dead = function(g, pos) {
      var color;
      g.init(color = 'rgb(55, 55, 55)');
      return g.drawArc(true, pos.vx, pos.vy, this.scale);
    };
    Character.prototype.render_gages = function(g, x, y, w, h, percent) {
      if (percent == null) {
        percent = 1;
      }
      g.init(Color.Green);
      g.strokeRect(x - w / 2, y - h / 2, w, h);
      g.init(Color.Green);
      return g.fillRect(x - w / 2 + 1, y - h / 2 + 1, w * percent, h - 2);
    };
    Character.prototype.render_targeted = function(g, pos, color) {
      var beat, ms;
      if (color == null) {
        color = "rgb(255,0,0)";
      }
      beat = 60;
      ms = ~~(new Date() / 100) % beat / beat;
      if (ms > 0.5) {
        ms = 1 - ms;
      }
      g.init(color, 0.7);
      return g.drawPath(true, [[pos.vx, pos.vy - 12 + ms * 10], [pos.vx - 6 - ms * 5, pos.vy - 20 + ms * 10], [pos.vx + 6 + ms * 5, pos.vy - 20 + ms * 10], [pos.vx, pos.vy - 12 + ms * 10]]);
    };
    Character.prototype.render = function(g, cam) {
      var pos;
      g.init();
      pos = this.getpos_relative(cam);
      if (this.is_alive()) {
        this.render_object(g, pos);
        this.render_state(g, pos);
        this.render_dir_allow(g, pos);
        this.render_reach_circle(g, pos);
        this.render_targeting_obj(g, pos, cam);
      } else {
        this.render_dead(g, pos);
      }
      return this.render_animation(g, pos.vx, pos.vy);
    };
    Character.prototype.set_skill = function(keys) {
      var k, v, _results;
      _results = [];
      for (k in keys) {
        v = keys[k];
        if (v && (k === "zero" || k === "one" || k === "two" || k === "three" || k === "four" || k === "five" || k === "six" || k === "seven" || k === "eight" || k === "nine")) {
          this.selected_skill = this.skills[k];
          console.log("set " + this.selected_skill.name);
          break;
        }
      }
      return _results;
    };
    Character.prototype.search = function(objs) {
      var enemies;
      enemies = this.find_obj(ObjectGroup.get_against(this), objs, this.status.sight_range);
      if (this.has_target()) {
        if (this.targeting_obj.is_dead() || this.get_distance(this.targeting_obj) > this.status.sight_range * 1.5) {
          my.mes("" + this.name + " lost track of " + this.targeting_obj.name);
          return this.targeting_obj = null;
        }
      } else if (enemies.size() > 0) {
        this.targeting_obj = enemies[0];
        return my.mes("" + this.name + " find " + this.targeting_obj.name);
      }
    };
    Character.prototype._update_path = function(cmap) {
      this._path = this._get_path(cmap);
      return this.to = this._path.shift();
    };
    Character.prototype.move = function(objs, cmap) {
      var c, dp, nx, ny, wide, _ref;
      if (this.has_target()) {
        this.set_dir(this.targeting_obj.x, this.targeting_obj.y);
        if (this.get_distance(this.targeting_obj) < this.selected_skill.range) {
          return;
        }
      } else {
        if (this.cnt % 60 < 15) {
          return;
        }
      }
      if (this.has_target() && this.cnt % 60 === 0) {
        this._update_path(cmap);
      }
      if (this.to) {
        dp = cmap.get_point(this.to[0], this.to[1]);
        _ref = this._trace(dp.x, dp.y), nx = _ref[0], ny = _ref[1];
        wide = this.status.speed;
        if ((dp.x - wide < nx && nx < dp.x + wide) && (dp.y - wide < ny && ny < dp.y + wide)) {
          if (this._path.length > 0) {
            this.to = this._path.shift();
          } else {
            this.to = null;
          }
        }
      } else {
        if (this.has_target()) {
          this._update_path(cmap);
        } else {
          c = cmap.get_cell(this.x, this.y);
          this.to = [c.x + randint(-1, 1), c.y + randint(-1, 1)];
        }
      }
      if (!cmap.collide(nx, ny)) {
        if (nx != null) {
          this.x = nx;
        }
        if (ny != null) {
          this.y = ny;
        }
      }
      if (this.x === this._lx_ && this.y === this._ly_) {
        c = cmap.get_cell(this.x, this.y);
        this.to = [c.x + randint(-1, 1), c.y + randint(-1, 1)];
      }
      this._lx_ = this.x;
      return this._ly_ = this.y;
    };
    Character.prototype._get_path = function(map) {
      var from, to;
      from = map.get_cell(this.x, this.y);
      to = map.get_cell(this.targeting_obj.x, this.targeting_obj.y);
      return map.search_path([from.x, from.y], [to.x, to.y]);
    };
    Character.prototype._trace = function(to_x, to_y) {
      this.set_dir(to_x, to_y);
      return [this.x + ~~(this.status.speed * Math.cos(this.dir)), this.y + ~~(this.status.speed * Math.sin(this.dir))];
    };
    Character.prototype.update = function(objs, cmap, keys, mouse) {
      var name, skill, _ref;
      this.cnt += 1;
      if (this.is_alive()) {
        this.check();
        if (this.cnt % 60 === 0) {
          this.regenerate();
        }
        this.search(objs);
        this.move(objs, cmap, keys, mouse);
        this.change_skill(keys, objs);
        _ref = this.skills;
        for (name in _ref) {
          skill = _ref[name];
          skill.charge(this, skill === this.selected_skill);
        }
        return this.selected_skill.exec(this, objs);
      }
    };
    return Character;
  })();
  Goblin = (function() {
    __extends(Goblin, Character);
    Goblin.prototype.name = "Goblin";
    Goblin.prototype.scale = 1;
    function Goblin(x, y, group) {
      this.x = x;
      this.y = y;
      this.group = group;
      this.dir = 0;
      this.status = new Status({
        hp: 50,
        atk: 10,
        def: 1.0,
        sight_range: 120,
        speed: 4
      });
      Goblin.__super__.constructor.call(this, this.x, this.y, this.group, status);
      this.skills = {
        one: new Skill_Atack(10),
        two: new Skill_Heal()
      };
      this.selected_skill = this.skills['one'];
    }
    Goblin.prototype.change_skill = function(_) {
      if (this.status.hp < 10) {
        console.log('#{@name}:warning');
        return this.selected_skill = this.skills['two'];
      } else {
        return this.selected_skill = this.skills['one'];
      }
    };
    Goblin.prototype.render_object = function(g, pos) {
      var beat, color, ms;
      if (this.group === ObjectGroup.Player) {
        color = Color.White;
      } else if (this.group === ObjectGroup.Enemy) {
        color = Color.i(55, 55, 55);
      }
      g.init(color);
      beat = 20;
      ms = ~~(new Date() / 100) % beat / beat;
      if (ms > 0.5) {
        ms = 1 - ms;
      }
      return g.drawArc(true, pos.vx, pos.vy, ~~(1.3 + ms) * this.scale);
    };
    return Goblin;
  })();
  Player = (function() {
    __extends(Player, Character);
    Player.prototype.scale = 8;
    Player.prototype.name = "Player";
    function Player(x, y, group) {
      this.x = x;
      this.y = y;
      this.group = group != null ? group : ObjectGroup.Player;
      Player.__super__.constructor.call(this, this.x, this.y, this.group);
      this.status = new Status({
        hp: 120,
        atk: 10,
        def: 0.8,
        atack_range: 50,
        sight_range: 80,
        speed: 3
      });
      this.skills = {
        one: new Skill_Atack(),
        two: new Skill_Smash(),
        three: new Skill_Heal(),
        four: new Skill_Meteor()
      };
      this.selected_skill = this.skills['one'];
      this.state.leader = true;
      this.mouse = {
        x: 0,
        y: 0
      };
    }
    Player.prototype.change_skill = function(keys) {
      return this.set_skill(keys);
    };
    Player.prototype.update = function(objs, cmap, keys, mouse) {
      var enemies;
      enemies = this.find_obj(ObjectGroup.get_against(this), objs, this.status.sight_range);
      if (keys.space) {
        this.shift_target(enemies);
      }
      return Player.__super__.update.call(this, objs, cmap, keys, mouse);
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
      beat = 20;
      ms = ~~(new Date() / 100) % beat / beat;
      if (ms > 0.5) {
        ms = 1 - ms;
      }
      if (this.group === ObjectGroup.Player) {
        color = Color.White;
      } else if (this.group === ObjectGroup.Enemy) {
        color = Color.i(55, 55, 55);
      }
      g.init(color);
      g.drawArc(true, pos.vx, pos.vy, (1.3 - ms) * this.scale);
      roll = Math.PI * (this.cnt % 20) / 10;
      g.init(Color.i(128, 100, 162));
      return g.drawArc(true, 320, 240, this.scale * 0.5);
    };
    Player.prototype.render = function(g, cam) {
      Player.__super__.render.call(this, g, cam);
      return this.render_mouse(g);
    };
    Player.prototype.render_skill_gage = function(g) {
      var c, number, skill, _ref, _results;
      c = 0;
      _ref = this.skills;
      _results = [];
      for (number in _ref) {
        skill = _ref[number];
        g.init();
        g.fillText(skill.name, 20 + c * 50, 460);
        this.render_gages(g, 40 + c * 50, 470, 40, 6, skill.ct / skill.MAX_CT);
        _results.push(c++);
      }
      return _results;
    };
    Player.prototype.render_mouse = function(g) {
      if (this.mouse) {
        g.init(Color.i(200, 200, 50));
        g.arc(this.mouse.x, this.mouse.y, this.scale, 0, Math.PI * 2, true);
        return g.stroke();
      }
    };
    return Player;
  })();
  Mouse = (function() {
    __extends(Mouse, Sprite);
    function Mouse(x, y) {
      this.x = x != null ? x : 0;
      this.y = y != null ? y : 0;
    }
    Mouse.prototype.render_object = function(g, pos) {};
    Mouse.prototype.render = function(g, cam) {
      var cx, cy;
      cx = ~~((this.x + mouse.x - 320) / cmap.cell);
      return cy = ~~((this.y + mouse.y - 240) / cmap.cell);
    };
    return Mouse;
  })();
  ObjectGroup = {
    Player: 0,
    Enemy: 1,
    Item: 2,
    is_battler: function(group_id) {
      return group_id === this.Player || group_id === this.Enemy;
    },
    get_against: function(obj) {
      switch (obj.group) {
        case this.Player:
          return this.Enemy;
        case this.Enemy:
          return this.Player;
      }
    }
  };
  Status = (function() {
    function Status(params, lv) {
      if (params == null) {
        params = {};
      }
      this.lv = lv != null ? lv : 1;
      this.params = params;
      this.build_status(params);
      this.hp = this.MAX_HP;
      this.sp = this.MAX_SP;
      this.exp = 0;
      this.next_lv = this.lv * 50;
    }
    Status.prototype.build_status = function(params, lv) {
      if (params == null) {
        params = {};
      }
      if (lv == null) {
        lv = 1;
      }
      this.MAX_HP = params.hp || 30;
      this.MAX_SP = params.sp || 10;
      this.atk = params.atk || 10;
      this.def = params.def || 1.0;
      this.res = params.res || 1.0;
      this.regenerate = params.regenerate || 3;
      this.atack_range = params.atack_range || 50;
      this.sight_range = params.sight_range || 80;
      return this.speed = params.speed || 6;
    };
    Status.prototype.get_exp = function(point) {
      var lv;
      this.exp += point;
      if (this.exp >= this.next_lv) {
        this.exp = 0;
        this.lv++;
        this.build(lv = this.lv);
        return this.set_next_exp();
      }
    };
    Status.prototype.set_next_exp = function() {
      return this.next_lv = this.lv * 30;
    };
    return Status;
  })();
  Skill = (function() {
    function Skill(lv) {
      this.lv = lv != null ? lv : 1;
      this._build(this.lv);
      this.MAX_CT = this.CT * 60;
      this.ct = this.MAX_CT;
    }
    Skill.prototype.charge = function(actor, is_selected) {
      if (this.ct < this.MAX_CT) {
        if (is_selected) {
          return this.ct += this.fg_charge;
        } else {
          return this.ct += this.bg_charge;
        }
      }
    };
    Skill.prototype.exec = function(actor, objs) {};
    Skill.prototype._build = function(lv) {};
    Skill.prototype._calc = function(actor, target) {
      return 1;
    };
    Skill.prototype._get_targets = function(actor, objs) {
      return [];
    };
    return Skill;
  })();
  DamageHit = (function() {
    __extends(DamageHit, Skill);
    function DamageHit() {
      DamageHit.__super__.constructor.apply(this, arguments);
    }
    DamageHit.prototype.range = 30;
    DamageHit.prototype.auto = true;
    DamageHit.prototype.CT = 1;
    DamageHit.prototype.bg_charge = 0.2;
    DamageHit.prototype.fg_charge = 1;
    DamageHit.prototype.damage_rate = 1.0;
    DamageHit.prototype.random_rate = 0.2;
    DamageHit.prototype.effect = 'Slash';
    DamageHit.prototype.exec = function(actor, objs) {
      var amount, t, targets, _i, _len;
      targets = this._get_targets(actor, objs);
      if (this.ct >= this.MAX_CT && targets.size() > 0) {
        for (_i = 0, _len = targets.length; _i < _len; _i++) {
          t = targets[_i];
          amount = this._calc(actor, t);
          t.add_damage(amount);
          t.add_animation(new Anim.prototype[this.effect](amount));
        }
        return this.ct = 0;
      }
    };
    return DamageHit;
  })();
  SingleHit = (function() {
    __extends(SingleHit, DamageHit);
    function SingleHit() {
      SingleHit.__super__.constructor.apply(this, arguments);
    }
    SingleHit.prototype.effect = 'Slash';
    SingleHit.prototype._get_targets = function(actor, objs) {
      if (actor.has_target()) {
        if (actor.get_distance(actor.targeting_obj) < this.range) {
          return [actor.targeting_obj];
        }
      }
      return [];
    };
    SingleHit.prototype._calc = function(actor, target) {
      return ~~(actor.status.atk * target.status.def * this.damage_rate * randint(100 * (1 - this.random_rate), 100 * (1 + this.random_rate)) / 100);
    };
    return SingleHit;
  })();
  AreaHit = (function() {
    __extends(AreaHit, DamageHit);
    function AreaHit() {
      AreaHit.__super__.constructor.apply(this, arguments);
    }
    AreaHit.prototype.effect = 'Burn';
    AreaHit.prototype._get_targets = function(actor, objs) {
      return actor.find_obj(ObjectGroup.get_against(actor), objs, this.range);
    };
    AreaHit.prototype._calc = function(actor, target) {
      return ~~(actor.status.atk * target.status.def * this.damage_rate * randint(100 * (1 - this.random_rate), 100 * (1 + this.random_rate)) / 100);
    };
    return AreaHit;
  })();
  Skill_Atack = (function() {
    __extends(Skill_Atack, SingleHit);
    function Skill_Atack() {
      Skill_Atack.__super__.constructor.apply(this, arguments);
    }
    Skill_Atack.prototype.name = "Atack";
    Skill_Atack.prototype.range = 60;
    Skill_Atack.prototype.CT = 1;
    Skill_Atack.prototype.auto = true;
    Skill_Atack.prototype.bg_charge = 0.2;
    Skill_Atack.prototype.fg_charge = 1;
    Skill_Atack.prototype.damage_rate = 1.0;
    Skill_Atack.prototype.random_rate = 0.2;
    Skill_Atack.prototype._build = function(lv) {
      this.range -= lv;
      this.CT -= lv / 40;
      this.bg_charge += lv / 20;
      this.fg_charge -= lv / 20;
      return this.damage_rate += lv / 20;
    };
    return Skill_Atack;
  })();
  Skill_Smash = (function() {
    __extends(Skill_Smash, SingleHit);
    function Skill_Smash() {
      Skill_Smash.__super__.constructor.apply(this, arguments);
    }
    Skill_Smash.prototype.name = "Smash";
    Skill_Smash.prototype.range = 30;
    Skill_Smash.prototype.CT = 2;
    Skill_Smash.prototype.damage_rate = 2.2;
    Skill_Smash.prototype.random_rate = 0.5;
    Skill_Smash.prototype.bg_charge = 0.5;
    Skill_Smash.prototype.fg_charge = 1;
    Skill_Smash.prototype._build = function(lv) {
      this.range -= lv;
      this.CT -= lv / 10;
      this.bg_charge += lv / 20;
      this.fg_charge -= lv / 20;
      return this.damage_rate += lv / 20;
    };
    return Skill_Smash;
  })();
  Skill_Meteor = (function() {
    __extends(Skill_Meteor, AreaHit);
    function Skill_Meteor() {
      Skill_Meteor.__super__.constructor.apply(this, arguments);
    }
    Skill_Meteor.prototype.name = "Meteor";
    Skill_Meteor.prototype.range = 80;
    Skill_Meteor.prototype.auto = true;
    Skill_Meteor.prototype.CT = 4;
    Skill_Meteor.prototype.bg_charge = 0.5;
    Skill_Meteor.prototype.fg_charge = 1;
    Skill_Meteor.prototype.effect = 'Burn';
    return Skill_Meteor;
  })();
  Skill_Heal = (function() {
    __extends(Skill_Heal, Skill);
    Skill_Heal.prototype.name = "Heal";
    Skill_Heal.prototype.range = 0;
    Skill_Heal.prototype.auto = false;
    Skill_Heal.prototype.CT = 4;
    Skill_Heal.prototype.bg_charge = 0.5;
    Skill_Heal.prototype.fg_charge = 1;
    function Skill_Heal(lv) {
      this.lv = lv != null ? lv : 1;
      Skill_Heal.__super__.constructor.call(this);
    }
    Skill_Heal.prototype.exec = function(actor) {
      var target;
      target = actor;
      if (this.ct >= this.MAX_CT) {
        target.status.hp += 30;
        this.ct = 0;
        return console.log("do healing");
      }
    };
    return Skill_Heal;
  })();
  Skill_ThrowBomb = (function() {
    __extends(Skill_ThrowBomb, Skill);
    Skill_ThrowBomb.prototype.name = "Throw Bomb";
    Skill_ThrowBomb.prototype.range = 120;
    Skill_ThrowBomb.prototype.auto = true;
    Skill_ThrowBomb.prototype.CT = 4;
    Skill_ThrowBomb.prototype.bg_charge = 0.5;
    Skill_ThrowBomb.prototype.fg_charge = 1;
    function Skill_ThrowBomb(lv) {
      this.lv = lv != null ? lv : 1;
      Skill_ThrowBomb.__super__.constructor.call(this, this.lv);
      this.range = 120;
      this.effect_range = 30;
    }
    Skill_ThrowBomb.prototype.exec = function(actor, objs, mouse) {
      var t, targets, _i, _len;
      if (this.ct >= this.MAX_CT) {
        targets = mouse.find_obj(ObjectGroup.get_against(actor), objs, this.range);
        if (targets.size() > 0) {
          for (_i = 0, _len = targets.length; _i < _len; _i++) {
            t = targets[_i];
            t.status.hp -= 20;
          }
          return this.ct = 0;
        }
      }
    };
    return Skill_ThrowBomb;
  })();
  Animation = (function() {
    __extends(Animation, Sprite);
    function Animation(max) {
      Animation.__super__.constructor.call(this, 0, 0);
      this.cnt = 0;
      this.max_frame = max;
    }
    Animation.prototype.render = function(g, x, y) {};
    return Animation;
  })();
  (Anim = {}).prototype = {
    Slash: Slash = (function() {
      __extends(Slash, Animation);
      function Slash(amount) {
        this.amount = amount;
        Slash.__super__.constructor.call(this, 60);
      }
      Slash.prototype.render = function(g, x, y) {
        var per, zangeki, _ref;
        if ((0 <= (_ref = this.cnt++) && _ref < this.max_frame)) {
          g.init(Color.i(30, 55, 55));
          zangeki = 8;
          if (this.cnt < zangeki) {
            per = this.cnt / zangeki;
            g.drawDiffPath(true, [[x - 5 + per * 10, y - 10 + per * 20], [-8, -8], [4, 0]]);
          }
          if (this.cnt < this.max_frame) {
            per = this.cnt / this.max_frame;
            g.init(Color.i(255, 55, 55), 1 - this.cnt / this.max_frame);
            g.strokeText("" + this.amount, x + 10, y + 20 * per);
          }
          return this;
        } else {
          return false;
        }
      };
      return Slash;
    })(),
    Burn: Burn = (function() {
      __extends(Burn, Animation);
      function Burn(amount) {
        this.amount = amount;
        Burn.__super__.constructor.call(this, 60);
      }
      Burn.prototype.render = function(g, x, y) {
        var per, _ref;
        if ((0 <= (_ref = this.cnt++) && _ref < this.max_frame)) {
          if (this.cnt < this.max_frame / 2) {
            g.init(Color.i(230, 55, 55), 0.4);
            per = this.cnt / (this.max_frame / 2);
            g.drawArc(true, x, y, 30 * per);
          }
          if (this.cnt < this.max_frame) {
            per = this.cnt / this.max_frame;
            g.init(Color.i(255, 55, 55), 1 - this.cnt / this.max_frame);
            g.strokeText("" + this.amount, x + 10, y + 20 * per);
          }
          return this;
        } else {
          return false;
        }
      };
      return Burn;
    })()
  };
  Scene = (function() {
    function Scene() {}
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
    OpeningScene.prototype.name = "Opening";
    function OpeningScene() {
      this.player = new Player(320, 240);
    }
    OpeningScene.prototype.enter = function(keys, mouse) {
      if (keys.space) {
        return "Field";
      }
      return this.name;
    };
    OpeningScene.prototype.render = function(g) {
      g.init();
      g.fillText("Opening", 300, 200);
      return g.fillText("Press Space", 300, 240);
    };
    return OpeningScene;
  })();
  FieldScene = (function() {
    __extends(FieldScene, Scene);
    FieldScene.prototype.name = "Field";
    FieldScene.prototype._camera = null;
    function FieldScene() {
      var player, start_point;
      this.map = new SampleMap(this, 32);
      this.mouse = new Mouse();
      start_point = this.map.get_rand_xy();
      player = new Player(start_point.x, start_point.y, 0);
      this.objs = [player];
      this.set_camera(player);
    }
    FieldScene.prototype.enter = function(keys, mouse) {
      var near_obj, obj, _i, _len;
      near_obj = this.objs.filter(__bind(function(e) {
        return e.get_distance(this._camera) < 400;
      }, this));
      for (_i = 0, _len = near_obj.length; _i < _len; _i++) {
        obj = near_obj[_i];
        obj.update(this.objs, this.map, keys, mouse);
      }
      this.map.update(this.objs, this._camera);
      this.frame_count++;
      return this.name;
    };
    FieldScene.prototype.set_camera = function(obj) {
      return this._camera = obj;
    };
    FieldScene.prototype.render = function(g) {
      var obj, player, _i, _len, _ref;
      this.map.render(g, this._camera);
      _ref = this.objs.filter(__bind(function(e) {
        return e.get_distance(this._camera) < 400;
      }, this));
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        obj = _ref[_i];
        obj.render(g, this._camera);
      }
      this.map.render_after(g, this._camera);
      player = this._camera;
      if (player) {
        player.render_skill_gage(g);
        g.init();
        return g.fillText("HP " + player.status.hp + "/" + player.status.MAX_HP, 15, 15);
      }
    };
    return FieldScene;
  })();
  String.prototype.replaceAll = function(org, dest) {
    return this.split(org).join(dest);
  };
  Array.prototype.find = function(pos) {
    var i, _i, _len;
    for (_i = 0, _len = this.length; _i < _len; _i++) {
      i = this[_i];
      if (i.pos[0] === pos[0] && i.pos[1] === pos[1]) {
        return i;
      }
    }
    return null;
  };
  Array.prototype.remove = function(obj) {
    return this.splice(this.indexOf(obj), 1);
  };
  Array.prototype.size = function() {
    return this.length;
  };
  Array.prototype.first = function() {
    return this[0];
  };
  Array.prototype.last = function() {
    return this[this.length - 1];
  };
  Array.prototype.each = Array.prototype.forEach;
  Canvas = CanvasRenderingContext2D;
  Canvas.prototype.init = function(color, alpha) {
    if (color == null) {
      color = Color.i(255, 255, 255);
    }
    if (alpha == null) {
      alpha = 1;
    }
    this.beginPath();
    this.strokeStyle = color;
    this.fillStyle = color;
    return this.globalAlpha = alpha;
  };
  Canvas.prototype.drawLine = function(x, y, dx, dy) {
    this.moveTo(x, y);
    this.lineTo(x + dx, y + dy);
    return this.stroke();
  };
  Canvas.prototype.drawPath = function(fill, path) {
    var px, py, sx, sy, _ref, _ref2;
    _ref = path.shift(), sx = _ref[0], sy = _ref[1];
    this.moveTo(sx, sy);
    while (path.size() > 0) {
      _ref2 = path.shift(), px = _ref2[0], py = _ref2[1];
      this.lineTo(px, py);
    }
    this.lineTo(sx, sy);
    if (fill) {
      return this.fill();
    } else {
      return this.stroke();
    }
  };
  Canvas.prototype.drawDiffPath = function(fill, path) {
    var dx, dy, px, py, sx, sy, _ref, _ref2, _ref3, _ref4;
    _ref = path.shift(), sx = _ref[0], sy = _ref[1];
    this.moveTo(sx, sy);
    _ref2 = [sx, sy], px = _ref2[0], py = _ref2[1];
    while (path.size() > 0) {
      _ref3 = path.shift(), dx = _ref3[0], dy = _ref3[1];
      _ref4 = [px + dx, py + dy], px = _ref4[0], py = _ref4[1];
      this.lineTo(px, py);
    }
    this.lineTo(sx, sy);
    if (fill) {
      return this.fill();
    } else {
      return this.stroke();
    }
  };
  Canvas.prototype.drawLine = function(x, y, dx, dy) {
    this.moveTo(x, y);
    this.lineTo(x + dx, y + dy);
    return this.stroke();
  };
  Canvas.prototype.drawArc = function(fill, x, y, size, from, to, reverse) {
    if (from == null) {
      from = 0;
    }
    if (to == null) {
      to = Math.PI * 2;
    }
    if (reverse == null) {
      reverse = false;
    }
    this.arc(x, y, size, from, to, reverse);
    if (fill) {
      return this.fill();
    } else {
      return this.stroke();
    }
  };
  Conf = {
    WINDOW_WIDTH: 640,
    WINDOW_HEIGHT: 480,
    VIEW_X: 320,
    VIEW_Y: 240,
    CANVAS_NAME: "game",
    FPS: 60
  };
  window.requestAnimationFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback, element) {
      return window.setTimeout(callback, 1000 / 60);
    };
  })();
  window.onload = function() {
    var game, gamewindow;
    game = new Game(Conf);
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
