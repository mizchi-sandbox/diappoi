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

class Battler extends Sprite
  constructor: (@x=0,@y=0,@scale=10) ->
    super @x, @y,@scale
    @status = new Status()
    @state =
      alive : true
      active : false

    @atack_range = 10
    @sight_range = 80
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
    my.init_cv(g,"rgb(0, 100, 255)")
    my.render_rest_gage(g,x,y+25,w,h,@status.wt/@status.MAX_WT)

class Player extends Battler
  constructor: (@x,@y) ->
    super(@x,@y)
    @vx = 0
    @vy = 0
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

  update: (enemies, keys,mouse)->
    @cnt += 1
    @move(keys)
    @set_target(@get_targets_in_range(enemies))
    @act()

  move: (keys)->
    s = keys.right+keys.left+keys.up+keys.down
    if s > 1
      move = @speed * Math.sqrt(2)/2
    else
      move = @speed
    if keys.right
      @x += move
      @vx -= move
    if keys.left
      @x -= move
      @vx += move
    if keys.up
      @y -= move
      @vy += move
    if keys.down
      @y += move
      @vy -= move

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

class Follower extends Player
  constructor: (@x,@y) ->
    super(@x,@y)

  render: (g,player)->
    my.init_cv(g)
    if @state.alive
        g.fillStyle = @_alive_color
        ms = ~~(new Date()/100) % @beat / @beat
        ms = 1 - ms if ms > 0.5
        g.arc(@x + player.vx,@y + player.vy, ( 1.3 - ms ) * @scale ,0,Math.PI*2,true)
        g.fill()

        # active circle
        if @state.active
            my.init_cv(g , color = "rgb(255,0,0)")
            g.arc(@x + player.vx,@y + player.vy, @scale*0.4 ,0,Math.PI*2,true)
            g.fill()

        # sight circle
        my.init_cv(g , color = "rgb(50,50,50)",alpha=0.3)
        g.arc(@x + player.vx,@y + player.vy, @sight_range ,0,Math.PI*2,true)
        g.stroke()

        @_render_gages(g , @x+player.vx , @y+player.vy ,30,6,@status.wt/@status.MAX_WT)
    else
        g.fillStyle = @_dead_color
        g.arc(@x + player.vx,@y + player.vy, @scale ,0,Math.PI*2,true)
        g.fill()

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

    @_fontsize = 10
    @beat = 10
    @_alive_color = 'rgb(255, 255, 255)'
    @_dead_color = 'rgb(55, 55, 55)'
    @cnt = ~~(Math.random() * 24)


  update: (players)->
    @cnt += 1
    if @state.alive
      @set_target(@get_targets_in_range(players,@sight_range))
      @move()
      @act()

  move: ()->
    if @targeting
      distance = @get_distance(@targeting)
      if distance > @atack_range
        @x -= @speed/2 if @x > @targeting.x
        @x += @speed/2 if @x < @targeting.x
        @y += @speed/2 if @y < @targeting.y
        @y -= @speed/2 if @y > @targeting.y
      else # stay here
    else
        if @cnt % 24 ==  0
            @dir = Math.PI * 2 * Math.random()
        if @cnt % 24 < 8
            @x += ~~(@speed * Math.cos(@dir))
            @y += ~~(@speed * Math.sin(@dir))

  render: (g,player)->
    my.init_cv(g)
    if @state.alive
        g.fillStyle = @_alive_color
        ms = ~~(new Date()/100) % @beat / @beat
        ms = 1 - ms if ms > 0.5
        g.arc(@x + player.vx,@y + player.vy, ( 1.3 - ms ) * @scale ,0,Math.PI*2,true)
        g.fill()

        # active circle
        if @state.active
            my.init_cv(g , color = "rgb(255,0,0)")
            g.arc(@x + player.vx,@y + player.vy, @scale*0.4 ,0,Math.PI*2,true)
            g.fill()

        # sight circle
        my.init_cv(g , color = "rgb(50,50,50)",alpha=0.3)
        g.arc(@x + player.vx,@y + player.vy, @sight_range ,0,Math.PI*2,true)
        g.stroke()

        # my.init_cv(g,"rgb(255, 100, 100)")
        # my.render_rest_gage(g , @x+player.vx , @y+player.vy+15 ,30,6,@status.hp/@status.MAX_HP)
        # my.init_cv(g,"rgb(0, 100, 255)")
        @_render_gages(g , @x+player.vx , @y+player.vy ,30,6,@status.wt/@status.MAX_WT)
    else
        g.fillStyle = @_dead_color
        g.arc(@x + player.vx,@y + player.vy, @scale ,0,Math.PI*2,true)
        g.fill()
