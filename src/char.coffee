class Status
  constructor: (params = {}, @lv = 1) ->
    @MAX_HP = params.hp or 30
    @hp = @MAX_HP
    @MAX_WT = params.wt or 10
    @wt = 0
    @MAX_SP = params.sp or 10
    @sp = @MAX_SP

    @exp = 0

    @atk = params.atk or 10
    @def = params.def or 1.0
    @res = params.res or 1.0
    @regenerate = params.regenerate or 3


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
    @dir = 0
    @id = ~~(Math.random() * 100)

    @animation = []

  add_animation:(actor,target,animation)->
    @animation[@animation.length] = animation

  render_animation:(g,cam)->
    for n in [0...@animation.length]
      if not @animation[n].render(g,cam)
        @animation.splice(n,1)
        @render_animation(g,cam)
        break

  update:()->
    @cnt += 1
    @regenerate()
    @check_state()

  check_state:()->
    if @state.poizon
       @status.hp -= 1

    if @status.hp < 1
      @status.hp = 0
      @state.alive = false
      # @state.targeting = null

    if @status.hp > @status.MAX_HP
      @status.hp = @status.MAX_HP
      @state.alive = true

  regenerate: ()->
    if @targeting then r = 2 else r = 1

    if not (@cnt % (24/@status.regenerate*r)) and @state.alive
      if @status.hp < @status.MAX_HP
          @status.hp += 1

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
  invoke: (target)->

  atack: ()->
    @targeting.status.hp -= ~~(@status.atk * ( @targeting.status.def + Math.random()/4 ))
    @targeting.check_state()

  set_target:(targets)->
    if targets.length == 0
      @targeting = null
    # else if not @targeting and targets.length > 0
    else if targets.length > 0
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

  render_targeted: (g,cam,color="rgb(255,0,0)")->
    my.init_cv(g)
    pos = @getpos_relative(cam)

    beat = 24
    ms = ~~(new Date()/100) % beat / beat
    ms = 1 - ms if ms > 0.5

    @init_cv(g,color=color,alpha=0.7)
    g.moveTo(pos.vx,pos.vy-12+ms*10)
    g.lineTo(pos.vx-6-ms*5,pos.vy-20+ms*10)
    g.lineTo(pos.vx+6+ms*5,pos.vy-20+ms*10)
    g.lineTo(pos.vx,pos.vy-12+ms*10)

    g.fill()

class Player extends Battler
  constructor: (@x,@y) ->
    super(@x,@y)
    status =
      hp : 120
      wt : 20
      atk : 10
      def: 0.8
    @status = new Status(status)

    @binded_skill =
      one: new Skill_Heal()
      two: new Skill_Smash()
      three: new Skill_Meteor()

    @cnt = 0
    @speed = 6
    @atack_range = 50

  update: (enemies, map, keys,@mouse)->
    super()
    if @state.alive
      if keys.space
        @change_target()
      @set_target(@get_targets_in_range(enemies,@sight_range))
      @move(map, keys,mouse)
      @act(keys,enemies)

  act: (keys,enemies)->
     super()
     @invoke(keys,enemies)

  invoke: (keys,enemies)->
    list = ["zero","one","two","three","four","five","six","seven","eight","nine"]
    for i in list
      if @binded_skill[i]
        if keys[i]
          @binded_skill[i].do(@,enemies)
        else
          @binded_skill[i].charge()

  set_dir: (x,y)->
    rx = x - 320
    ry = y - 240
    if rx >= 0
      @dir = Math.atan( ry / rx  )
    else
      @dir = Math.PI - Math.atan( ry / - rx  )

  move: (cmap , keys, mouse)->
    @dir = @set_dir(mouse.x , mouse.y)
    if keys.right + keys.left + keys.up + keys.down > 1
      move = ~~(@speed * Math.sqrt(2)/2)
    else
      move = @speed

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
    @targeting.render_targeted(g, @,color="rgb(0,0,255)") if @targeting
    @render_mouse(g)

    c = 0
    for k,v of @binded_skill
      @init_cv(g)
      m = ~~(v.MAX_CT/24)
      g.fillText(v.name ,10+50*c,450 )
      g.fillText((m-~~((v.MAX_CT-v.ct)/24))+"/"+m ,10+50*c,460 )
      c++;

  render_mouse: (g)->
    my.init_cv(g,"rgb(200, 200, 50)")
    g.arc(@mouse.x,@mouse.y,  @scale ,0,Math.PI*2,true)
    g.stroke()

    # nx = ~~(30 * Math.cos(@dir))
    # ny = ~~(30 * Math.sin(@dir))
    # my.init_cv(g,color="rgb(255,0,0)",alpha=0.4)
    # g.moveTo( 320 , 240 )
    # g.arc(320,240, @atack_range , @dir-Math.PI/12, @dir+Math.PI/12,false)
    # g.moveTo( 320 , 240 )
    # g.fill()

class Enemy extends Battler
  constructor: (@x,@y) ->
    super(@x,@y,@scale=5)
    status =
      hp : 50
      wt : 22
      atk : 10
      def: 1.0
    @status = new Status(status)
    @atack_range = 30
    @sight_range = 80

    @speed = 6
    @dir = 0
    @cnt = ~~(Math.random() * 24)

  update: (players, cmap)->
    super()
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
      if @targeting
          my.init_cv(g , color = "rgb(255,0,0)")
          g.arc(pos.vx, pos.vy , @scale*0.7 ,0,Math.PI*2,true)
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
      g.stroke()

      @_render_gages(g , pos.vx , pos.vy ,30,6,@status.wt/@status.MAX_WT)
      if @targeting
        @targeting.render_targeted(g,cam)
        @init_cv(g,color="rgb(0,0,255)",alpha=0.5)
        g.moveTo(pos.vx,pos.vy)
        t = @targeting.getpos_relative(cam)
        g.lineTo(t.vx,t.vy)
        g.stroke()

    else
        g.fillStyle = 'rgb(55, 55, 55)'
        g.arc(pos.vx,pos.vy, @scale ,0,Math.PI*2,true)
        g.fill()
