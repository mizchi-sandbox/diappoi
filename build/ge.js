(function() {
  var Anim, Animation, Character, Color, FieldScene, Game, Goblin, ItemObject, Map, Mouse, Node, ObjectGroup, OpeningScene, Player, SampleMap, Scene, Skill, Skill_Heal, Skill_Meteor, Skill_Smash, Skill_ThrowBomb, Slash, Sprite, Status, Walker, base_block, clone, conf, maps, my, randint, rjoin, sjoin;
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
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
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
    for (i = 0, _ref = map1.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      buf[i] = map1[i].concat(map2[i]);
      y++;
    }
    return buf;
  };
  String.prototype.replaceAll = function(org, dest) {
    return this.split(org).join(dest);
  };
  randint = function(from, to) {
    if (!(to != null)) {
      to = from;
      from = 0;
    }
    return ~~(Math.random() * (to - from + 1)) + from;
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
    this.splice(this.indexOf(obj), 1);
    return this;
  };
  Array.prototype.size = function() {
    return this.length;
  };
  clone = function(obj) {
    var F;
    F = function() {};
    F.prototype = obj;
    return new F;
  };
  Color = {
    Red: "rgb(255,0,0)",
    Blue: "rgb(0,0,255)",
    Red: "rgb(0,255,0)",
    White: "rgb(255,255,255)",
    Black: "rgb(0,0,0)",
    i: function(r, g, b) {
      return "rgb(" + r + "," + g + "," + b + ")";
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
    return Sprite;
  })();
  ItemObject = (function() {
    __extends(ItemObject, Sprite);
    function ItemObject(x, y, scale) {
      this.x = x != null ? x : 0;
      this.y = y != null ? y : 0;
      this.scale = scale != null ? scale : 10;
      this.group = 0;
    }
    ItemObject.prototype.update = function() {};
    ItemObject.prototype.render = function(g, cam) {
      var color, pos;
      this.init_cv(g, color = "rgb(0,0,255)");
      pos = this.getpos_relative(cam);
      g.beginPath();
      g.arc(pos.vx, pos.vy, 15 - ms, 0, Math.PI * 2, true);
      return g.stroke();
    };
    return ItemObject;
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
  (Anim = {}).prototype = {
    Slash: Slash = (function() {
      __extends(Slash, Animation);
      function Slash(amount) {
        this.amount = amount;
        this.timer = 0;
      }
      Slash.prototype.render = function(g, x, y) {
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
      return Slash;
    })()
  };
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
    Map.prototype.search_min_path = function(start, goal) {
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
      var color, i, j, pos, w, x, y, _ref, _results;
      pos = this.getpos_relative(cam);
      _results = [];
      for (i = 0, _ref = this._map.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        _results.push((function() {
          var _ref2, _results2;
          _results2 = [];
          for (j = 0, _ref2 = this._map[i].length; 0 <= _ref2 ? j < _ref2 : j > _ref2; 0 <= _ref2 ? j++ : j--) {
            _results2.push(this._map[i][j] ? (this.init_cv(g, color = "rgb(30,30,30)"), w = 8, x = pos.vx + i * this.cell, y = pos.vy + j * this.cell, g.moveTo(x, y + this.cell), g.lineTo(x + w, y + this.cell - w), g.lineTo(x + this.cell + w, y + this.cell - w), g.lineTo(x + this.cell, y + this.cell), g.lineTo(x, y + this.cell), g.fill(), this.init_cv(g, color = "rgb(40,40,40)"), g.moveTo(x, y + this.cell), g.lineTo(x, y), g.lineTo(x + w, y - w), g.lineTo(x + w, y - w + this.cell), g.lineTo(x, y + this.cell), g.fill()) : void 0);
          }
          return _results2;
        }).call(this));
      }
      return _results;
    };
    Map.prototype.render_after = function(g, cam) {
      var alpha, color, i, j, pos, w, _ref, _results;
      pos = this.getpos_relative(cam);
      _results = [];
      for (i = 0, _ref = this._map.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        _results.push((function() {
          var _ref2, _results2;
          _results2 = [];
          for (j = 0, _ref2 = this._map[i].length; 0 <= _ref2 ? j < _ref2 : j > _ref2; 0 <= _ref2 ? j++ : j--) {
            _results2.push(this._map[i][j] ? (my.init_cv(g, color = "rgb(50,50,50)", alpha = 1), w = 5, g.fillRect(pos.vx + i * this.cell + w, pos.vy + j * this.cell - w, this.cell, this.cell)) : void 0);
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
    SampleMap.prototype.max_object_count = 4;
    SampleMap.prototype.frame_count = 0;
    function SampleMap(context, cell) {
      this.context = context;
      this.cell = cell != null ? cell : 32;
      SampleMap.__super__.constructor.call(this, this.cell);
      this._map = this.load(maps.debug);
    }
    SampleMap.prototype.update = function(objs, camera) {
      this._check_death(objs, camera);
      return this._pop_enemy(objs);
    };
    SampleMap.prototype._check_death = function(objs, camera) {
      var i, player, start_point, _ref, _results;
      _results = [];
      for (i = 0, _ref = objs.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        if (!objs[i].state.alive) {
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
    SampleMap.prototype._pop_enemy = function(objs) {
      var group, random_point;
      if (objs.length < this.max_object_count && this.frame_count % 24 * 3 === 0) {
        group = (Math.random() > 0.05 ? ObjectGroup.Enemy : ObjectGroup.Player);
        random_point = this.get_rand_xy();
        objs.push(new Goblin(random_point.x, random_point.y, group));
        if (Math.random() < 0.3) {
          return objs[objs.length - 1].state.leader = 1;
        }
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
    function Character(x, y, group, status) {
      this.x = x != null ? x : 0;
      this.y = y != null ? y : 0;
      this.group = group != null ? group : ObjectGroup.Enemy;
      if (status == null) {
        status = {};
      }
      Character.__super__.constructor.call(this, this.x, this.y);
      this.state = {
        alive: true,
        active: false
      };
      this.targeting = null;
      this.dir = 0;
      this.cnt = 0;
      this.id = ~~(Math.random() * 100);
      this.animation = [];
    }
    Character.prototype.has_target = function() {
      if (this.targeting !== null) {
        return true;
      } else {
        return false;
      }
    };
    Character.prototype.is_targeted = function(objs) {
      var i;
      return __indexOf.call((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = objs.length; _i < _len; _i++) {
          i = objs[_i];
          _results.push(i.targeting != null);
        }
        return _results;
      })(), this) >= 0;
    };
    Character.prototype.is_alive = function() {
      if (this.status.hp > 1) {
        return this.state.alive = true;
      } else {
        this.state.hp = 0;
        return this.state.alive = false;
      }
    };
    Character.prototype.is_dead = function() {
      return !this.is_alive();
    };
    Character.prototype.find_obj = function(group_id, targets, range) {
      return targets.filter(__bind(function(t) {
        return t.group === group_id && this.get_distance(t) < range && t.is_alive();
      }, this));
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
    Character.prototype._update_state = function() {
      var _ref;
      if (this.is_alive()) {
        this.regenerate();
        if ((_ref = this.targeting) != null ? _ref.is_dead() : void 0) {
          return this.targeting = null;
        }
      } else {
        return this.targeting = null;
      }
    };
    Character.prototype.regenerate = function() {
      var r;
      r = (this.targeting ? 2 : 1);
      if (!(this.cnt % (24 / this.status.regenerate * r)) && this.state.alive) {
        if (this.status.hp < this.status.MAX_HP) {
          return this.status.hp += 1;
        }
      }
    };
    Character.prototype.act = function(target) {
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
    Character.prototype.atack = function() {
      var amount;
      amount = ~~(this.status.atk * (this.targeting.status.def + Math.random() / 4));
      this.targeting.status.hp -= amount;
      my.mes(this.name + " atack " + this.targeting.name + " " + amount + "damage");
      return this.targeting.add_animation(new Anim.prototype.Slash(amount));
    };
    Character.prototype.select_target = function(targets) {
      var cur, _ref;
      if (this.has_target() && targets.length > 0) {
        if (_ref = !this.targeting, __indexOf.call(targets, _ref) >= 0) {
          this.targeting = targets[0];
          return;
        } else if (targets.size() === 1) {
          this.targeting = targets[0];
          return;
        }
        if (targets.size() > 1) {
          cur = targets.indexOf(this.targeting);
          console.log("before: " + cur + " " + (targets.size()));
          if (cur + 1 >= targets.size()) {
            cur = 0;
          } else {
            cur += 1;
          }
          this.targeting = targets[cur];
          return console.log("after: " + cur);
        }
      }
    };
    Character.prototype.render_reach_circle = function(g, pos) {
      var alpha, color;
      this.init_cv(g, color = "rgb(250,50,50)", alpha = 0.3);
      g.arc(pos.vx, pos.vy, this.status.atack_range, 0, Math.PI * 2, true);
      g.stroke();
      this.init_cv(g, color = "rgb(50,50,50)", alpha = 0.3);
      g.arc(pos.vx, pos.vy, this.status.sight_range, 0, Math.PI * 2, true);
      return g.stroke();
    };
    Character.prototype.render_dir_allow = function(g, pos) {
      var color, nx, ny;
      nx = ~~(30 * Math.cos(this.dir));
      ny = ~~(30 * Math.sin(this.dir));
      my.init_cv(g, color = "rgb(255,0,0)");
      g.moveTo(pos.vx, pos.vy);
      g.lineTo(pos.vx + nx, pos.vy + ny);
      return g.stroke();
    };
    Character.prototype.render_targeting = function(g, pos, cam) {
      var alpha, color, t, _ref;
      if ((_ref = this.targeting) != null ? _ref.is_alive() : void 0) {
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
    Character.prototype.render_state = function(g, pos) {
      this.init_cv(g);
      this.render_gages(g, pos.vx, pos.vy + 15, 40, 6, this.status.hp / this.status.MAX_HP);
      return this.render_gages(g, pos.vx, pos.vy + 22, 40, 6, this.status.wt / this.status.MAX_WT);
    };
    Character.prototype.render_dead = function(g, pos) {
      var color;
      this.init_cv(g, color = 'rgb(55, 55, 55)');
      g.arc(pos.vx, pos.vy, this.scale, 0, Math.PI * 2, true);
      return g.fill();
    };
    Character.prototype.render_gages = function(g, x, y, w, h, percent) {
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
    Character.prototype.render_targeted = function(g, pos, color) {
      var alpha, beat, ms;
      if (color == null) {
        color = "rgb(255,0,0)";
      }
      this.init_cv(g);
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
    Character.prototype.render = function(g, cam) {
      var pos;
      this.init_cv(g);
      pos = this.getpos_relative(cam);
      if (this.state.alive) {
        this.render_object(g, pos);
        this.render_state(g, pos);
        this.render_dir_allow(g, pos);
        this.render_reach_circle(g, pos);
      } else {
        this.render_dead(g, pos);
      }
      return this.render_animation(g, pos.vx, pos.vy);
    };
    return Character;
  })();
  Walker = (function() {
    __extends(Walker, Character);
    Walker.prototype.following = null;
    Walker.prototype.targeting = null;
    function Walker(x, y, group, status) {
      this.x = x;
      this.y = y;
      this.group = group != null ? group : ObjectGroup.Enemy;
      if (status == null) {
        status = {};
      }
      Walker.__super__.constructor.call(this, this.x, this.y, this.group, status);
      this.cnt = ~~(Math.random() * 24);
      this.distination = [this.x, this.y];
      this._path = [];
    }
    Walker.prototype.update = function(objs, cmap, keys, mouse) {
      var enemies;
      this.cnt += 1;
      if (this.is_alive()) {
        this._update_state();
        enemies = this.find_obj(ObjectGroup.get_against(this), objs, this.status.sight_range);
        if (this.has_target()) {
          if (this.targeting.is_dead() || this.get_distance(this.targeting) > this.status.sight_range * 1.5) {
            this.targeting = null;
          }
        } else if (enemies.size() > 0) {
          this.targeting = enemies[0];
          my.mes("" + this.name + " find " + this.targeting.name + ")");
        }
        this.move(objs, cmap, keys, mouse);
        return this.act(keys, objs);
      }
    };
    Walker.prototype.move = function(objs, cmap) {
      var c, dp, nx, ny, wide, _ref;
      if (this.has_target()) {
        if (this.get_distance(this.targeting) < this.status.atack_range) {
          return;
        }
      }
      if (this.has_target() && this.to && !this.cnt % 24) {
        this._path = this._get_path(cmap);
        this.to = this._path.shift();
      } else if (this.to) {
        dp = cmap.get_point(this.to[0], this.to[1]);
        _ref = this._trace(dp.x, dp.y), nx = _ref[0], ny = _ref[1];
        wide = 7;
        if ((dp.x - wide < nx && nx < dp.x + wide) && (dp.y - wide < ny && ny < dp.y + wide)) {
          if (this._path.length > 0) {
            this.to = this._path.shift();
          } else {
            this.to = null;
          }
        }
      } else {
        if (this.targeting) {
          this._path = this._get_path(cmap);
          this.to = this._path.shift();
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
    Walker.prototype._get_path = function(map) {
      var from, to;
      from = map.get_cell(this.x, this.y);
      to = map.get_cell(this.targeting.x, this.targeting.y);
      return map.search_min_path([from.x, from.y], [to.x, to.y]);
    };
    Walker.prototype._trace = function(to_x, to_y) {
      var nx, ny;
      this.set_dir(to_x, to_y);
      nx = this.x + ~~(this.status.speed * Math.cos(this.dir));
      ny = this.y + ~~(this.status.speed * Math.sin(this.dir));
      return [nx, ny];
    };
    return Walker;
  })();
  Goblin = (function() {
    __extends(Goblin, Walker);
    Goblin.prototype.name = "Goblin";
    Goblin.prototype.scale = 1;
    function Goblin(x, y, group) {
      this.x = x;
      this.y = y;
      this.group = group;
      this.dir = 0;
      this.status = new Status({
        hp: 50,
        wt: 30,
        atk: 10,
        def: 1.0,
        sight_range: 120
      });
      Goblin.__super__.constructor.call(this, this.x, this.y, this.group, status);
    }
    Goblin.prototype.render_object = function(g, pos) {
      var beat, color, ms;
      if (this.group === ObjectGroup.Player) {
        color = Color.White;
      } else if (this.group === ObjectGroup.Enemy) {
        color = Color.i(55, 55, 55);
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
  Player = (function() {
    __extends(Player, Walker);
    Player.prototype.scale = 8;
    Player.prototype.name = "Player";
    function Player(x, y, group) {
      this.x = x;
      this.y = y;
      this.group = group != null ? group : ObjectGroup.Player;
      Player.__super__.constructor.call(this, this.x, this.y, this.group);
      this.status = new Status({
        hp: 120,
        wt: 20,
        atk: 10,
        def: 0.8,
        atack_range: 50,
        sight_range: 80,
        speed: 6
      });
      this.binded_skill = {
        one: new Skill_Heal(),
        two: new Skill_Smash(),
        three: new Skill_Meteor()
      };
      this.state.leader = true;
      this.mouse = {
        x: 0,
        y: 0
      };
    }
    Player.prototype.update = function(objs, cmap, keys, mouse) {
      return Player.__super__.update.call(this, objs, cmap, keys, mouse);
    };
    Player.prototype.update = function(objs, cmap, keys, mouse) {
      var enemies;
      this.cnt += 1;
      if (this.is_alive()) {
        this._update_state();
        enemies = this.find_obj(ObjectGroup.get_against(this), objs, this.status.sight_range);
        if (this.has_target()) {
          if (this.targeting.is_dead() || this.get_distance(this.targeting) > this.status.sight_range * 1.5) {
            this.targeting = null;
          }
        } else if (enemies.size() > 0) {
          this.targeting = enemies[0];
          my.mes("" + this.name + " find " + this.targeting.name + ")");
        }
        if (keys.zero) {
          this.select_target(enemies);
        }
        this.move(objs, cmap, keys, mouse);
        return this.act(keys, objs);
      }
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
      beat = 20;
      if (this.group === ObjectGroup.Player) {
        color = Color.White;
      } else if (this.group === ObjectGroup.Enemy) {
        color = Color.i(55, 55, 55);
      }
      this.init_cv(g, color = color);
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
  Mouse = (function() {
    __extends(Mouse, Sprite);
    function Mouse() {
      this.x = 0;
      this.y = 0;
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
      this.wt = 0;
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
      this.MAX_WT = params.wt || 10;
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
      my.init_cv(g);
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
      var obj, _i, _len, _ref;
      _ref = this.objs;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        obj = _ref[_i];
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
      _ref = this.objs;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        obj = _ref[_i];
        obj.render(g, this._camera);
      }
      this.map.render_after(g, this._camera);
      player = this._camera;
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
