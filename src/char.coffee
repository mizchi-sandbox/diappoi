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
    @targeting = null
    @id = ~~(Math.random() * 100)
  update:(targets, keys , mouse)->
    targets_inrange = @get_targets_in_range(targets)
    target = @change_target(targets_inrange)
    @act(target)

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

  get_targets_in_range:(targets)->
    buff = []
    for t in targets
      d = @get_distance(t)
      if d < @atack_range and t.state.alive
        buff[buff.length] = t
    return buff

  move:(x,y)->
  act:(target)->
    @atack(target)
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
    status =
      hp : 120
      wt : 20
      atk : 10
      def: 0.8
    @status = new Status(status)
    @speed = 6
    @beat = 20
    @atack_range = 50

    @_rotate = 0
    @_fontsize = 10
    @dir = 0
    @vx = 0
    @vy = 0

  process: (keys,mouse)->
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

    @dir = Math.atan( (320 - mouse.y) / (240 - mouse.x)  )


  render: (g)->
    # baet icon
    my.init_cv(g,"rgb(0, 0, 162)")
    ms = ~~(new Date()/100) % @beat / @beat
    ms = 1 - ms if ms > 0.5
    g.arc(320,240, ( 1.3 - ms ) * @scale ,0,Math.PI*2,true)
    g.stroke()

    @_rotate += Math.PI * 0.1
    my.init_cv(g,"rgb(128, 100, 162)")
    g.arc(320,240, @scale * 0.5,  @_rotate ,Math.PI+@_rotate,true)
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


  process: (player)->
    @cnt += 1
    if @state.alive
        # tracing
        distance = @get_distance(player)
        if distance < @sight_range # in sight
            @state.active = true
        else  # when not in sight
            @state.active = false

        if @state.active
            if distance > @atack_range
                @x -= @speed/2 if @x > player.x
                @x += @speed/2 if @x < player.x
                @y += @speed/2 if @y < player.y
                @y -= @speed/2 if @y > player.y
            else
                @status.wt += 1
                if @status.wt >= @status.MAX_WT
                    @atack(player)
                    @status.wt = 0
        else
            if @cnt % 24 ==  0
                @dir = Math.PI * 2 * Math.random()
            if @cnt % 24 < 8
                @x += @speed * Math.cos(@dir)
                @y += @speed * Math.sin(@dir)
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
