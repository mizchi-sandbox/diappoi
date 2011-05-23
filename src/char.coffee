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

  set_dir: (x,y)->
    rx = x - @x
    ry = y - @y
    if rx >= 0
      @dir = Math.atan( ry / rx  )
    else
      @dir = Math.PI - Math.atan( ry / - rx  )

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
        else if Math.random() < 0.2
          map[i][j] = 1
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

  collide: (x,y)->
    x = ~~(x / @cell)
    y = ~~(y / @cell)
    return @_map[x][y]

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

  update: (enemies, map, keys,mouse)->
    @cnt += 1
    if @state.alive
      @set_target(@get_targets_in_range(enemies,@sight_range))
      @move(map, keys,mouse)
      @act()

  move: (cmap , keys, mouse)->
    if keys.right + keys.left + keys.up + keys.down > 1
      move = ~~(@speed * Math.sqrt(2)/2)
    else
      move = @speed

    if keys.right
      nx = @x + move
    else if keys.left
      nx = @x - move
    else
      nx = @x

    if keys.up
      ny = @y - move
    else if keys.down
      ny = @y + move
    else
      ny = @y

    if not cmap.collide( nx,ny )
      @x = nx
      @y = ny


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

  update: (players, cmap)->
    @cnt += 1
    if @state.alive
      @set_target(@get_targets_in_range(players,@sight_range))
      @move(cmap)
      @act()

  move: (cmap)->
    if @targeting
      distance = @get_distance(@targeting)
      if distance > @atack_range
        @set_dir(@targeting.x,@targeting.y)
        nx = @x + ~~(@speed * Math.cos(@dir))
        ny = @y + ~~(@speed * Math.sin(@dir))
      else
        # stay here
    else # move freely
      if @cnt % 24 ==  0
        @dir = Math.PI * 2 * Math.random()
      if @cnt % 24 < 8
        nx = @x + ~~(@speed * Math.cos(@dir))
        ny = @y + ~~(@speed * Math.sin(@dir))

    if not cmap.collide( nx,ny )
      @x = nx if nx?
      @y = ny if ny?



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


        nx = ~~(30 * Math.cos(@dir))
        ny = ~~(30 * Math.sin(@dir))
        my.init_cv(g,color="rgb(255,0,0)")
        g.moveTo( pos.vx , pos.vy )
        g.lineTo(pos.vx+nx , pos.vy+ny)
        # g.lineTo(pos.x+nx, pos.y+ny)
        g.stroke()

        @_render_gages(g , pos.vx , pos.vy ,30,6,@status.wt/@status.MAX_WT)
    else
        g.fillStyle = 'rgb(55, 55, 55)'
        g.arc(pos.vx,pos.vy, @scale ,0,Math.PI*2,true)
        g.fill()
