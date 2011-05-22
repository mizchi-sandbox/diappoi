## ge.js ##
# generated by src/core.coffee
class Game
  constructor: (conf) ->
    canvas =  document.getElementById conf.CANVAS_NAME
    @g = canvas.getContext '2d'
    @config = conf
    canvas.width = conf.WINDOW_WIDTH;
    canvas.height = conf.WINDOW_HEIGHT;
    @keys =
        left : 0
        right : 0
        up : 0
        down : 0
    @mouse = x : 0, y : 0
    @scenes =
      # "Opening": new OpeningScene()
      "Field": new FieldScene()
    @curr_scene = @scenes["Field"]

  enter: ->
    next_scene = @curr_scene.enter(@keys,@mouse)
    @curr_scene = @scenes[next_scene]
    @draw(@curr_scene)

  start: (self) ->
    setInterval ->
      self.enter()
    , 1000 / @config.FPS

  getkey: (self,which,to) ->
    switch which
      when 68,39 then self.keys.right = to
      when 65,37 then self.keys.left = to
      when 87,38 then self.keys.up = to
      when 83,40 then self.keys.down = to
      when 32 then self.keys.space = to
      when 17 then self.keys.ctrl = to

  draw: (scene) ->
    @g.clearRect(0,0,@config.WINDOW_WIDTH ,@config.WINDOW_HEIGHT)
    @g.save()
    scene.render(@g)
    @g.restore()

my =
  distance: (x1,y1,x2,y2)->
    xd = Math.pow (x1-x2) ,2
    yd = Math.pow (y1-y2) ,2
    return Math.sqrt xd+yd

  init_cv: (g,color="rgb(255,255,255)",alpha=1)->
    g.beginPath()
    g.strokeStyle = color
    g.fillStyle = color
    g.globalAlpha = alpha

  gen_map:(x,y)->
    map = []
    for i in [0..20]
        map[i] = []
        for j in [0..15]
            if Math.random() > 0.5
                map[i][j] = 0
            else
                map[i][j] = 1
    return map

  draw_line: (g,x1,y1,x2,y2)->
    g.moveTo(x1,y1)
    g.lineTo(x2,y2)
    g.stroke()

  color: (r=255,g=255,b=255,name=null)->
    switch name
        when "red" then return @color(255,0,0)
        when "green" then return @color(0,255,0)
        when "blue" then return @color(0,0,255)
        when "white" then return @color(255,255,255)
        when "black" then return @color(0,0,0)
        when "grey" then return @color(128,128,128)
    return "rgb("+~~(r)+","+~~(g)+","+~~(b)+")"

  draw_cell: (g,x,y,cell,color="grey")->
    g.moveTo(x , y)
    g.lineTo(x+cell , y)
    g.lineTo(x+cell , y+cell)
    g.lineTo(x , y+cell)
    g.lineTo(x , y)
    g.fill()

  render_rest_gage:( g, x , y, w, h ,percent=1) ->
    # frame
    g.moveTo(x-w/2 , y-h/2)
    g.lineTo(x+w/2 , y-h/2)
    g.lineTo(x+w/2 , y+h/2)
    g.lineTo(x-w/2 , y+h/2)
    g.lineTo(x-w/2 , y-h/2)
    g.stroke()

    # rest
    g.beginPath()
    g.moveTo(x-w/2 +1, y-h/2+1)
    g.lineTo(x-w/2+w*percent, y-h/2+1)
    g.lineTo(x-w/2+w*percent, y+h/2-1)
    g.lineTo(x-w/2 +1, y+h/2-1)
    g.lineTo(x-w/2 +1, y-h/2+1)
    g.fill()

# generated by src/char.coffee
class Status
  constructor: (params = {}, @lv = 1) ->
    @MAX_HP = params.hp or 30
    @hp = @MAX_HP
    @MAX_WT = params.wt or 10
    @wt = 0
    @atk = params.atk or 10
    @def = params.def or 1.0
    @res = params.res or 1.0

class Sprite
  constructor: (@x=0,@y=0,@scale=10) ->
  render: (g)->
    g.beginPath()
    g.arc(@x,@y, 15 - ms ,0,Math.PI*2,true)
    g.stroke()

  get_distance: (target)->
    xd = Math.pow (@x-target.x) ,2
    yd = Math.pow (@y-target.y) ,2
    return Math.sqrt xd+yd

  getpos_relative:(cam)->
    pos =
      vx : 320 + @x - cam.x
      vy : 240 + @y - cam.y
    return pos

  init_cv: (g,color="rgb(255,255,255)",alpha=1)->
    g.beginPath()
    g.strokeStyle = color
    g.fillStyle = color
    g.globalAlpha = alpha

class Map extends Sprite
  constructor: (@w=10,@h=10,@cell=24) ->
    super 0, 0, @cell
    @_map = @gen_map(@w,@h)

  gen_map:(x,y)->
    map = []
    for i in [0 ... x]
      map[i] = []
      for j in [0 ... y]
        if (i == 0 or i == (x-1) ) or (j == 0 or j == (y-1))
          map[i][j] = 1
        # else if Math.random() > 0.5
        #   map[i][j] = 1
        else
          map[i][j] = 0
    return map

  render: (g,cam)->
    pos = @getpos_relative(cam)
    for i in [0 ... @_map.length]
      for j in [0 ... @_map[i].length]
        if @_map[i][j]
          my.init_cv(g , color = "rgb(0,0,0)",alpha=0.5)
        else
          my.init_cv(g , color = "rgb(250,250,250)",alpha=0.5)
        g.fillRect(
          pos.vx + i * @cell,
          pos.vy + j * @cell,
          @cell , @cell)

  get_point: (x,y)->
    return {x:~~((x+1/2) *  @cell ),y:~~((y+1/2) * @cell) }

  get_randpoint: ()->
    rx = ~~(Math.random()*@w)
    ry = ~~(Math.random()*@h)
    if @_map[rx][ry]
      return @get_randpoint()
    return @get_point(rx,ry )

  collide: (target)->
    x = ~~(target.x / @cell)
    y = ~~(target.y / @cell)
    return @_map x, y

class Battler extends Sprite
  constructor: (@x=0,@y=0,@scale=10) ->
    super @x, @y,@scale
    @status = new Status()
    @state =
      alive : true
      active : false

    @atack_range = 10
    @sight_range = 50
    @targeting = null
    @id = ~~(Math.random() * 100)


  update:(targets, keys , mouse)->
    targets_inrange = @get_targets_in_range(targets,@sight_range)
    target = @set_target(targets_inrange)
    @move(target)
    @act(target)

  act:(target=@targeting)->
    if @targeting
      d = @get_distance(@targeting)
      if d < @atack_range
        if @status.wt < @status.MAX_WT
          @status.wt += 1
        else
          @atack()
          @status.wt = 0
      else
        if @status.wt < @status.MAX_WT
          @status.wt += 1
    else
      @status.wt = 0

  move:(x,y)-> #abstract

  atack: (target=@targeting)->
    target.status.hp -= ~~(@status.atk * ( target.status.def + Math.random()/4 ))
    if target.status.hp <= 0
        target.state.alive = false
        @targeting = null

  set_target:(targets)->
    if targets.length == 0
      @targeting = null
    else if not @targeting and targets.length > 0
      @targeting = targets[0]

  change_target:(targets)->
    # TODO: implement hate control
    if targets.length > 0
      if not @targeting in targets # target go out
        @targeting = targets[0]    #   focus anyone
        return @targeting
      else if targets.length == 1  # one target in range
        @targeting = targets[0]    #   focus that target
        return @targeting
      else if targets.length > 1   # 2 over target
        if @targeting              #   toggle target
          for i in [0...targets.length]
            if targets[i] is @targeting
              if i < targets.length
                @targeting = targets[i+1]
                return @targeting
              else
                @targeting = targets[0]
                return @targeting
        else
          @targeting = targets[0]
          return @targeting
    else                           # no target in range
      @targeting = null
      return @targeting

  get_targets_in_range:(targets, range= @sight_range)->
    buff = []
    for t in targets
      d = @get_distance(t)
      if d < range and t.state.alive
        buff[buff.length] = t
    return buff

  _render_gages:(g,x,y,w,h,rest) ->
    # HP bar
    my.init_cv(g,"rgb(0, 250, 100)")
    my.render_rest_gage(g,x,y+15,w,h,@status.hp/@status.MAX_HP)

    # WT bar
    my.init_cv(g,"rgb(0, 100, e55)")
    my.render_rest_gage(g,x,y+25,w,h,@status.wt/@status.MAX_WT)

class Player extends Battler
  constructor: (@x,@y) ->
    super(@x,@y)
    status =
      hp : 120
      wt : 20
      atk : 10
      def: 0.8
    @status = new Status(status)
    @speed = 6
    @atack_range = 50
    @dir = 0
    @cnt = 0

  update: (enemies,keys,mouse)->
    @cnt += 1
    if @state.alive
      @set_target(@get_targets_in_range(enemies,@sight_range))
      @move(keys,mouse)
      @act()

  move: (keys)->
    s = keys.right+keys.left+keys.up+keys.down
    if s > 1
      move = ~~(@speed * Math.sqrt(2)/2)
    else
      move = @speed
    if keys.right
      @x += move
    if keys.left
      @x -= move
    if keys.up
      @y -= move
    if keys.down
      @y += move

  render: (g)->
    beat = 20
    my.init_cv(g,"rgb(0, 0, 162)")
    ms = ~~(new Date()/100) % beat / beat
    ms = 1 - ms if ms > 0.5
    g.arc(320,240, ( 1.3 - ms ) * @scale ,0,Math.PI*2,true)
    g.stroke()

    roll = Math.PI * (@cnt % 20) / 10

    my.init_cv(g,"rgb(128, 100, 162)")
    g.arc(320,240, @scale * 0.5,  roll ,Math.PI+roll,true)
    g.stroke()

    my.init_cv(g,"rgb(255, 0, 0)")
    g.arc(320,240, @atack_range ,  0 , Math.PI*2,true)
    g.stroke()
    @_render_gages(g,320,240,40,6,@status.hp/@status.MAX_HP)

class Enemy extends Battler
  constructor: (@x,@y) ->
    super(@x,@y,@scale=5)
    status =
      hp : 50
      wt : 22
      atk : 10
      def: 1.0
    @status = new Status(status)
    @atack_range = 20
    @sight_range = 80

    @speed = 6
    @dir = 0
    @cnt = ~~(Math.random() * 24)

  update: (players)->
    @cnt += 1
    if @state.alive
      @set_target(@get_targets_in_range(players,@sight_range))
      @move()
      @act()

  move: (cmap)->
    if @targeting
      distance = @get_distance(@targeting)
      if distance > @atack_range
        nx = @x - @speed/2 if @x > @targeting.x
        nx = @x + @speed/2 if @x < @targeting.x
        ny = @y + @speed/2 if @y < @targeting.y
        ny = @y - @speed/2 if @y > @targeting.y
        if not @_map.collide( @ )
          @x = nx
          @y = ny

      else # stay here
    else
        if @cnt % 24 ==  0
            @dir = Math.PI * 2 * Math.random()
        if @cnt % 24 < 8
            @x += ~~(@speed * Math.cos(@dir))
            @y += ~~(@speed * Math.sin(@dir))

  render: (g,cam)->
    my.init_cv(g)
    pos = @getpos_relative(cam)
    if @state.alive
        g.fillStyle = 'rgb(255, 255, 255)'
        beat = 20
        ms = ~~(new Date()/100) % beat / beat
        ms = 1 - ms if ms > 0.5
        g.arc( pos.vx, pos.vy, ( 1.3 + ms ) * @scale ,0,Math.PI*2,true)
        g.fill()

        # active circle
        if @state.active
            my.init_cv(g , color = "rgb(255,0,0)")
            g.arc(pos.vx, pos.vy , @scale*0.4 ,0,Math.PI*2,true)
            g.fill()

        # sight circle
        my.init_cv(g , color = "rgb(50,50,50)",alpha=0.3)
        g.arc( pos.vx, pos.vy, @sight_range ,0,Math.PI*2,true)
        g.stroke()

        @_render_gages(g , pos.vx , pos.vy ,30,6,@status.wt/@status.MAX_WT)
    else
        g.fillStyle = 'rgb(55, 55, 55)'
        g.arc(pos.vx,pos.vy, @scale ,0,Math.PI*2,true)
        g.fill()
# generated by src/scenes.coffee
class Scene
  constructor: (@name) ->

  enter: (keys,mouse) ->
    return @name

  render: (g)->
    @player.render(g)
    g.fillText(
        @name,
        300,200)

class OpeningScene extends Scene
  constructor: () ->
    super("Opening")
    @player  =  new Player(320,240)

  enter: (keys,mouse) ->
    if keys.right

      return "Filed"
    return @name

  render: (g)->
    @player.render(g)
    g.fillText(
        "Opening",
        300,200)

class FieldScene extends Scene
  constructor: () ->
    super("Field")
    @map = new Map(20,15, 32)

    start_point = @map.get_point(1,1)
    @player  =  new Player(start_point.x ,start_point.y)
    @enemies = []
    for i in [1 .. 10]
      rpo = @map.get_randpoint()
      @enemies[@enemies.length] = new Enemy(rpo.x, rpo.y)
    # @enemies = (new Enemy(50, 50) for i in [1..1])

  enter: (keys,mouse) ->
    p.update(@enemies ,keys,mouse) for p in [@player]
    e.update([@player]) for e in @enemies
    return @name

  render: (g)->
    cam = @player

    @map.render(g, cam)
    enemy.render(g,cam) for enemy in @enemies
    @player.render(g)


    g.fillText(
        "HP "+@player.status.hp+"/"+@player.status.MAX_HP,
        15,15)

    g.fillText(
        "p: "+@player.x+"."+@player.y
        15,25)
vows = require 'vows'
assert = require 'assert'

keys =
   left : 0
   right : 0
   up : 0
   down : 0
mouse =
  x : 320
  y : 240

vows.describe('Game Test').addBatch
  'combat test':
    topic: "atack"
    'test': ()->
      p = new Player 320,240
      e = new Enemy Math.random()*640 ,Math.random()*480
      collision_map = my.gen_map(20,15)

      while p.status.hp > 0 and e.state.alive
        p.atack(e)
        e.atack(p)

    topic: "select one target"
    'select one': ()->
      p = new Player(320,240)
      enemies = [new Enemy(320,240) , new Enemy(380,240) ]
      targets_inrange =  p.get_targets_in_range(enemies)
      target =  p.change_target(targets_inrange)
      p.atack(target)

    topic: "select two targets"
    'select two': ()->
      p = new Player(320,240)
      enemies = ( new Enemy( ~~(Math.random()*640),~~(Math.random()*480)) for i in [1..30])
      for i in [0..100]
        targets_inrange =  p.get_targets_in_range(enemies)
        e.update([p]) for e in enemies
        p.set_target(targets_inrange)
        # p.change_target(targets_inrange)
        if p.targeting
          # console.log(p.targeting.id+ ":" +p.targeting.status.hp)
          p.atack()
        else
          # console.log "no"

    topic: "select update method"
    'update': ()->
      p = new Player(320,240)
      enemies = ( new Enemy( ~~(Math.random()*640),~~(Math.random()*480)) for i in [1..100])
      for i in [1..10]
        p.update(enemies,keys,mouse)
        e.update([p]) for e in enemies
      console.log p.status
      console.log enemies[0].targeting

    topic: "battle collide"
    'many vs many': ()->
      players = [new Player(320,240) , new Player(320,240) ]
      enemies = (new Enemy 320,240  for i in [1..3])

      for i in [1..100]
        p.update(enemies, keys,mouse) for p in players
        e.update(players) for e in enemies
      console.log p.status
      console.log enemies[0].status

    topic: "map collide"
    'set pos': ()->
      p = new Player 320,240
      e = new Enemy 320,240

    #   players = new Player(320,240)
    #   for i in [1..100]
    #     p.move(map)
    #     p.update(enemies, keys,mouse) for p in players
    #     e.update(players) for e in enemies
    #   console.log p.status
    #   console.log enemies[0].status
    # topic: "scene"
    # 'test2': ()->
    #   player = new Player(320,240)
    #   enemy = new Enemy ~~(Math.random()*640) ,~~(Math.random()*480)

    #   p.update(enemies, keys,mouse)
    #   p.move(map)
    #   p.act(map)
    #   for e in enemies
    #     e.update(players)
    #     e.move(map)
.export module
