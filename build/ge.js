(function() {
  var Battler, Enemy, FieldScene, Follower, Game, OpeningScene, Player, Scene, Sprite, Status, conf, my;
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
        down: 0
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
      next_scene = this.curr_scene.process(this.keys, this.mouse);
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
      this.targeting = null;
      this.id = ~~(Math.random() * 100);
    }
    Battler.prototype.update = function(targets, keys, mouse) {
      var target, targets_inrange;
      targets_inrange = this.get_targets_in_range(targets);
      target = this.change_target(targets_inrange);
      return this.act(target);
    };
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
    Battler.prototype.get_targets_in_range = function(targets) {
      var buff, d, t, _i, _len;
      buff = [];
      for (_i = 0, _len = targets.length; _i < _len; _i++) {
        t = targets[_i];
        d = this.get_distance(t);
        if (d < this.atack_range && t.state.alive) {
          buff[buff.length] = t;
        }
      }
      return buff;
    };
    Battler.prototype.move = function(x, y) {};
    Battler.prototype.act = function(target) {
      return this.atack(target);
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
      status = {
        hp: 120,
        wt: 20,
        atk: 10,
        def: 0.8
      };
      this.status = new Status(status);
      this.speed = 6;
      this.beat = 20;
      this.atack_range = 50;
      this._rotate = 0;
      this._fontsize = 10;
      this.dir = 0;
      this.vx = 0;
      this.vy = 0;
    }
    Player.prototype.process = function(keys, mouse) {
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
        this.vy -= move;
      }
      return this.dir = Math.atan((320 - mouse.y) / (240 - mouse.x));
    };
    Player.prototype.render = function(g) {
      var ms;
      my.init_cv(g, "rgb(0, 0, 162)");
      ms = ~~(new Date() / 100) % this.beat / this.beat;
      if (ms > 0.5) {
        ms = 1 - ms;
      }
      g.arc(320, 240, (1.3 - ms) * this.scale, 0, Math.PI * 2, true);
      g.stroke();
      this._rotate += Math.PI * 0.1;
      my.init_cv(g, "rgb(128, 100, 162)");
      g.arc(320, 240, this.scale * 0.5, this._rotate, Math.PI + this._rotate, true);
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
      var alpha, color, ms;
      my.init_cv(g);
      if (this.state.alive) {
        g.fillStyle = this._alive_color;
        ms = ~~(new Date() / 100) % this.beat / this.beat;
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
        g.fillStyle = this._dead_color;
        g.arc(this.x + player.vx, this.y + player.vy, this.scale, 0, Math.PI * 2, true);
        return g.fill();
      }
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
      this._fontsize = 10;
      this.beat = 10;
      this._alive_color = 'rgb(255, 255, 255)';
      this._dead_color = 'rgb(55, 55, 55)';
      this.cnt = ~~(Math.random() * 24);
    }
    Enemy.prototype.process = function(player) {
      var distance;
      this.cnt += 1;
      if (this.state.alive) {
        distance = this.get_distance(player);
        if (distance < this.sight_range) {
          this.state.active = true;
        } else {
          this.state.active = false;
        }
        if (this.state.active) {
          if (distance > this.atack_range) {
            if (this.x > player.x) {
              this.x -= this.speed / 2;
            }
            if (this.x < player.x) {
              this.x += this.speed / 2;
            }
            if (this.y < player.y) {
              this.y += this.speed / 2;
            }
            if (this.y > player.y) {
              return this.y -= this.speed / 2;
            }
          } else {
            this.status.wt += 1;
            if (this.status.wt >= this.status.MAX_WT) {
              this.atack(player);
              return this.status.wt = 0;
            }
          }
        } else {
          if (this.cnt % 24 === 0) {
            this.dir = Math.PI * 2 * Math.random();
          }
          if (this.cnt % 24 < 8) {
            this.x += this.speed * Math.cos(this.dir);
            return this.y += this.speed * Math.sin(this.dir);
          }
        }
      }
    };
    Enemy.prototype.render = function(g, player) {
      var alpha, color, ms;
      my.init_cv(g);
      if (this.state.alive) {
        g.fillStyle = this._alive_color;
        ms = ~~(new Date() / 100) % this.beat / this.beat;
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
        g.fillStyle = this._dead_color;
        g.arc(this.x + player.vx, this.y + player.vy, this.scale, 0, Math.PI * 2, true);
        return g.fill();
      }
    };
    return Enemy;
  })();
  Scene = (function() {
    function Scene(name) {
      this.name = name;
    }
    Scene.prototype.process = function(keys, mouse) {
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
    OpeningScene.prototype.process = function(keys, mouse) {
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
      var i;
      FieldScene.__super__.constructor.call(this, "Field");
      this.player = new Player(320, 240);
      this.enemies = (function() {
        var _results;
        _results = [];
        for (i = 1; i <= 30; i++) {
          _results.push(new Enemy(Math.random() * 640, Math.random() * 480));
        }
        return _results;
      })();
      this.map = my.gen_map(20, 15);
    }
    FieldScene.prototype.process = function(keys, mouse) {
      var d, enemy, n, _ref;
      this.player.process(keys, mouse);
      this.player.state.active = false;
      for (n = 0, _ref = this.enemies.length - 1; (0 <= _ref ? n <= _ref : n >= _ref); (0 <= _ref ? n += 1 : n -= 1)) {
        enemy = this.enemies[n];
        enemy.process(this.player);
        d = my.distance(this.player.x, this.player.y, enemy.x, enemy.y);
        if (d < this.player.atack_range && enemy.state.alive) {
          if (this.player.status.MAX_WT > this.player.status.wt) {
            this.player.state.active = true;
          } else if (this.player.status.MAX_WT <= this.player.status.wt) {
            this.player.status.wt = 0;
            this.player.atack(enemy);
          }
        }
      }
      if (this.player.state.active && this.player.status.wt < this.player.status.MAX_WT) {
        this.player.status.wt += 1;
      } else {
        this.player.status.wt = 0;
      }
      return this.name;
    };
    FieldScene.prototype.render = function(g) {
      var alpha, cell, color, enemy, i, j, _i, _len, _ref, _ref2, _results;
      _ref = this.enemies;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        enemy = _ref[_i];
        enemy.render(g, this.player);
      }
      this.player.render(g);
      cell = 32;
      my.init_cv(g, color = "rgb(255,255,255)");
      g.font = "10px " + "mono";
      g.fillText("HP " + this.player.status.hp + "/" + this.player.status.MAX_HP, 15, 15);
      _results = [];
      for (i = 0, _ref2 = this.map.length - 1; (0 <= _ref2 ? i <= _ref2 : i >= _ref2); (0 <= _ref2 ? i += 1 : i -= 1)) {
        _results.push((function() {
          var _ref, _results;
          _results = [];
          for (j = 0, _ref = this.map[i].length - 1; (0 <= _ref ? j <= _ref : j >= _ref); (0 <= _ref ? j += 1 : j -= 1)) {
            if (this.map[i][j]) {
              my.init_cv(g, color = "rgb(100,100,100)", alpha = 0.3);
            } else {
              my.init_cv(g, color = "rgb(0,0,0)", alpha = 0.3);
            }
            _results.push(my.draw_cell(g, this.player.vx + i * cell, this.player.vy + j * cell, cell));
          }
          return _results;
        }).call(this));
      }
      return _results;
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