class Status
  constructor: (params = {}, @lv = 1) ->
    @MAX_HP = params.hp or 30
    @MAX_WT = params.wt or 10
    @MAX_SP = params.sp or 10
    @atk = params.atk or 10
    @def = params.def or 1.0
    @res = params.res or 1.0
    @regenerate = params.regenerate or 3
    @atack_range = params.atack_range or 50
    @sight_range = params.sight_range or 80
    @speed = params.speed or 6

    @exp = 0
    @hp = @MAX_HP
    @sp = @MAX_SP
    @wt = 0

class Battler extends Sprite
  constructor: (@x=0,@y=0,@group=0,status={}) ->

    super @x, @y,@scale
    if not status
      status =
        hp  : 50
        wt  : 22
        atk : 10
        def : 1.0
        atack_range : 30
        sight_range : 80
        speed : 6
    @status = new Status(status)
    @category = "battler"
    @state =
      alive : true
      active : false
    @scale =10
    @targeting = null
    @dir = 0
    @cnt = 0
    @id = ~~(Math.random() * 100)

    @animation = []

  update:(objs, cmap, keys, mouse)->
    @cnt += 1
    @regenerate()
    @check_state()

    if @state.alive
      @set_target(@get_targets_in_range(objs,@status.sight_range))
      @move(objs,cmap, keys,mouse)
      @act(keys,objs)

  add_animation:(animation)->
    @animation.push(animation)

  render_animation:(g,x, y)->
    for n in [0...@animation.length]
      if not @animation[n].render(g,x,y)
        @animation.splice(n,1)
        @render_animation(g,x,y)
        break

  set_dir: (x,y)->
    rx = x - @x
    ry = y - @y
    if rx >= 0
      @dir = Math.atan( ry / rx  )
    else
      @dir = Math.PI - Math.atan( ry / - rx  )

  check_state:()->
    if @state.poizon
       @status.hp -= 1

    if @status.hp < 1
      @status.hp = 0
      @state.alive = false
      @state.targeting = null

    if @status.hp > @status.MAX_HP
      @status.hp = @status.MAX_HP
      @state.alive = true

    if @targeting
      if not @targeting.state.alive
        @targeting = null

  regenerate: ()->
    if @targeting then r = 2 else r = 1

    if not (@cnt % (24/@status.regenerate*r)) and @state.alive
      if @status.hp < @status.MAX_HP
          @status.hp += 1

  act:(target=@targeting)->
    if @targeting
      d = @get_distance(@targeting)
      if d < @status.atack_range
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
  invoke: (target)->

  atack: ()->
    @targeting.status.hp -= ~~(@status.atk * ( @targeting.status.def + Math.random()/4 ))
    @targeting.add_animation(new Animation_Slash())
    @targeting.check_state()

  set_target:(targets)->
    # if targets.length == 0
    #   @targeting = null
    if targets.length > 0
      if not @targeting or not @targeting.alive
        @targeting = targets[0]
      else
        @targeting


  change_target:(targets=@targeting)->
    # TODO: implement hate control
    if targets.length > 0
      if not @targeting in targets # before target go out
        @targeting = targets[0]    #   focus anyone
      else if targets.length == 1  # one target in range
        @targeting = targets[0]    #   focus that target
      else if targets.length > 1   # over 2 target
        if @targeting              #   toggle target
          for i in [0...targets.length]
            if targets[i] is @targeting
              if targets.length == i+1
                @targeting = targets[0]
              else
                @targeting = targets[i+1]
        else
          @targeting = targets[0]
          return @targeting
    else                           # no target in range
      @targeting = null
      return @targeting

  get_targets_in_range:(targets, range= @status.sight_range)->
    enemies = []
    for t in targets
      if t.group != @group and t.category == "battler"
        enemies.push( t )

    buff = []
    for t in enemies
      d = @get_distance(t)
      if d < range and t.state.alive
        buff[buff.length] = t
    return buff

  get_leader:(targets, range= @status.sight_range)->
    for t in targets
      if t.state.leader and t.group == @group
        if (@get_distance(t) < @status.sight_range)
          return t
    return null

  render_reach_circle:(g,pos)->
      @init_cv(g , color = "rgb(250,50,50)",alpha=0.3)
      g.arc( pos.vx, pos.vy, @status.atack_range ,0,Math.PI*2,true)
      g.stroke()

      @init_cv(g , color = "rgb(50,50,50)",alpha=0.3)
      g.arc( pos.vx, pos.vy, @status.sight_range ,0,Math.PI*2,true)
      g.stroke()

  render_dir_allow:(g,pos)->
      nx = ~~(30 * Math.cos(@dir))
      ny = ~~(30 * Math.sin(@dir))
      my.init_cv(g,color="rgb(255,0,0)")
      g.moveTo( pos.vx , pos.vy )
      g.lineTo(pos.vx+nx , pos.vy+ny)
      g.stroke()

  render_targeting:(g,pos,cam)->
    if @targeting
      @targeting.render_targeted(g,pos)
      @init_cv(g,color="rgb(0,0,255)",alpha=0.5)
      g.moveTo(pos.vx,pos.vy)
      t = @targeting.getpos_relative(cam)
      g.lineTo(t.vx,t.vy)
      g.stroke()

      my.init_cv(g , color = "rgb(255,0,0)",alpha=0.6)
      g.arc(pos.vx, pos.vy , @scale*0.7 ,0,Math.PI*2,true)
      g.fill()

  render_state: (g,pos)->
    @init_cv(g)
    @render_gages(g,pos.vx, pos.vy+15,40 , 6 , @status.hp/@status.MAX_HP)
    @render_gages(g,pos.vx, pos.vy+22,40 , 6 , @status.wt/@status.MAX_WT)

  render_dead: (g,pos)->
    @init_cv(g,color='rgb(55, 55, 55)')
    g.arc(pos.vx,pos.vy, @scale ,0,Math.PI*2,true)
    g.fill()

  render_gages:( g, x , y, w, h ,percent=1) ->
    # my.init_cv(g,"rgb(0, 250, 100)")
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

  render_targeted: (g,pos,color="rgb(255,0,0)")->
    my.init_cv(g)

    beat = 24
    ms = ~~(new Date()/100) % beat / beat
    ms = 1 - ms if ms > 0.5

    @init_cv(g,color=color,alpha=0.7)
    g.moveTo(pos.vx,pos.vy-12+ms*10)
    g.lineTo(pos.vx-6-ms*5,pos.vy-20+ms*10)
    g.lineTo(pos.vx+6+ms*5,pos.vy-20+ms*10)
    g.lineTo(pos.vx,pos.vy-12+ms*10)

    g.fill()

  render: (g,cam)->
    @init_cv(g)
    pos = @getpos_relative(cam)

    if @state.alive
      @render_object(g,pos)
      @render_state(g,pos)
      @render_dir_allow(g,pos)
      @render_reach_circle(g,pos)
      @render_targeting(g,pos,cam)
    else
      @render_dead(g,pos)

    @render_animation(g, pos.vx , pos.vy )


class Player extends Battler
  constructor: (@x,@y,@group=0) ->

    super(@x,@y,@group)
    status =
      hp : 120
      wt : 20
      atk : 10
      def: 0.8
      atack_range : 50
      sight_range : 80
      speed : 6
    @status = new Status(status)

    @binded_skill =
      one: new Skill_Heal()
      two: new Skill_Smash()
      three: new Skill_Meteor()
    @state.leader =true

    @mosue =
      x: 0
      y: 0

  update: (objs, cmap, keys,@mouse)->
    if keys.space
      @change_target()
    super(objs,cmap , keys,@mouse)

  set_mouse_dir: (x,y)->
    rx = x - 320
    ry = y - 240
    if rx >= 0
      @dir = Math.atan( ry / rx  )
    else
      @dir = Math.PI - Math.atan( ry / - rx  )

  act: (keys,enemies)->
     super()
     @invoke(keys,enemies)

  invoke: (keys,enemies)->
    list = ["zero","one","two","three","four","five","six","seven","eight","nine"]
    for i in list
      if @binded_skill[i]
        if keys[i]
          @binded_skill[i].do(@,enemies,@mouse)
        else
          @binded_skill[i].charge()

  move: (objs,cmap, keys, mouse)->
    @dir = @set_mouse_dir(mouse.x , mouse.y)
    if keys.right + keys.left + keys.up + keys.down > 1
      move = ~~(@status.speed * Math.sqrt(2)/2)
    else
      move = @status.speed

    if keys.right
      if cmap.collide( @x+move , @y )
        @x = (~~(@x/cmap.cell)+1)*cmap.cell-1
      else
        @x += move

    if keys.left
      if cmap.collide( @x-move , @y )
        @x = (~~(@x/cmap.cell))*cmap.cell+1
      else
        @x -= move

    if keys.up
      if cmap.collide( @x , @y-move )
        @y = (~~(@y/cmap.cell))*cmap.cell+1
      else
        @y -= move

    if keys.down
      if cmap.collide( @x , @y+move )
        @y = (~~(@y/cmap.cell+1))*cmap.cell-1
      else
        @y += move

  render_object:(g,pos)->
    if @group == 0
      color = "rgb(255,255,255)"
    else if @group == 1
      color = "rgb(55,55,55)"
    @init_cv(g,color=color)
    beat = 20
    ms = ~~(new Date()/100) % beat / beat
    ms = 1 - ms if ms > 0.5
    g.arc( pos.vx, pos.vy, ( 1.3 - ms ) * @scale ,0,Math.PI*2,true)
    g.fill()

    roll = Math.PI * (@cnt % 20) / 10

    my.init_cv(g,"rgb(128, 100, 162)")
    g.arc(320,240, @scale * 0.5,  roll ,Math.PI+roll,true)
    g.stroke()

  render: (g,cam)->
    super(g,cam)
    @render_mouse(g)

  render_skill_gage: (g)->
    c = 0
    for number,skill of @binded_skill
      @init_cv(g)
      g.fillText( skill.name ,20+c*50 ,  460)
      @render_gages(g, 40+c*50 , 470,40 , 6 , skill.ct/skill.MAX_CT)
      c++

  render_mouse: (g)->
    if @mouse
      my.init_cv(g,"rgb(200, 200, 50)")
      g.arc(@mouse.x,@mouse.y,  @scale ,0,Math.PI*2,true)
      g.stroke()

class Monster extends Battler
  constructor: (@x,@y,@group=1,status={}) ->
    super(@x,@y,@group,status)
    @scale = 5
    @dir = 0
    @cnt = ~~(Math.random() * 24)
    @distination = [@x,@y]

  update: (objs, cmap)->
    super(objs, cmap)

  trace: (to_x , to_y)->
    @set_dir(to_x,to_y)
    nx = @x + ~~(@status.speed * Math.cos(@dir))
    ny = @y + ~~(@status.speed * Math.sin(@dir))
    return [nx ,ny]

  wander:(cmap)->
    wide = 32/4
    if @x-wide<@distination[0]<@x+wide and @y-wide<@distination[1]<@y+wide
      c = cmap.get_cell(@x,@y)
      d = cmap.get_point( c.x+randint(-2,2) ,c.y+randint(-2,2) )
      if not cmap.collide( d.x ,d.y )
        console.log d
        @distination = [d.x,d.y]

    # @dir = Math.PI * 2 * Math.random()

    if @distination # @cnt % 24 < 8
      console.log @distination
      [to_x , to_y] = @distination
      return @trace(to_x,to_y)
    return [@x,@y]
    # return [nx ,ny]             #

  move: (objs ,cmap)->
    # if target exist , trace
    leader =  @get_leader(objs)
    destination = null

    if @targeting
      # target 発見時
      distance = @get_distance(@targeting)
      if distance > @status.atack_range
        [nx,ny] = @trace( @targeting.x , @targeting.y )
      else

    else if leader
      distance = @get_distance(leader)
      # リーダー 発見時
      if distance > @status.sight_range/2
        [nx,ny] = @trace( leader.x , leader.y )
      else
        [nx,ny] = @wander(cmap)
    else
      [nx,ny] = @wander(cmap)

    if not cmap.collide( nx,ny )
      @x = nx if nx?
      @y = ny if ny?

    # set distination if it cant move
    if @x == @_lx and @y == @_ly
      @distination = [@x,@y]

    @_lx = @x
    @_ly = @y
  # set_distination:(x,y)->
  #   c = cmap.get_cell(@x,@y)
  #   d = cmap.get_point(x,y)
  #   if not cmap.collide( d.x ,d.y )
  #     @distination = [d.x,d.y]

class Goblin extends Monster
  constructor: (@x,@y,@group) ->
    status =
      hp  : 50
      wt  : 30
      atk : 10
      def : 1.0
    super(@x,@y,@group,status)

  update: (objs, cmap)->
    super(objs,cmap)

  move: (cmap,objs)->
    super(cmap,objs)

  render: (g,cam)->
    super(g,cam)

  render_object:(g,pos)->
    if @group == 0
      color = "rgb(255,255,255)"
    else if @group == 1
      color = "rgb(55,55,55)"
    @init_cv(g,color=color)
    beat = 20
    ms = ~~(new Date()/100) % beat / beat
    ms = 1 - ms if ms > 0.5
    g.arc( pos.vx, pos.vy, ( 1.3 + ms ) * @scale ,0,Math.PI*2,true)
    g.fill()
