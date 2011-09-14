class Character extends Sprite
  scale : null
  status : {}
  state : null
  following_obj: null
  targeting_obj: null

  constructor: (@x=0,@y=0,@group=ObjectGroup.Enemy ,status={}) ->
    super @x, @y
    @state =
      active : false
    @targeting_obj = null
    @dir = 0
    @cnt = 0
    @id = ~~(Math.random() * 100)
    @animation = []
    @cnt = ~~(Math.random() * 60)
    @distination = [@x,@y]
    @_path = []

  regenerate: ()->
    r = (if @targeting_obj then 2 else 1)
    if @is_alive()
      if @status.hp < @status.MAX_HP
        @status.hp += 1

  update:(objs, cmap, keys, mouse)->
    @cnt += 1
    if @is_alive()
      @check()
      @regenerate() if @cnt%60 == 0
      @search objs
      @move(objs,cmap, keys,mouse)
      @change_skill(keys,objs)
      for name,skill of @skills
        skill.charge @, skill is @selected_skill
      @selected_skill.exec @,objs

  search : (objs)->
    enemies = @find_obj(ObjectGroup.get_against(@),objs,@status.sight_range)
    if @has_target()
      if @targeting_obj.is_dead() or @get_distance(@targeting_obj) > @status.sight_range*1.5
        # ターゲットが死 or 感知外
        Sys::message "#{@name} lost track of #{@targeting_obj.name}"
        @targeting_obj = null
    else if enemies.size() > 0
      # 新たに目視した場合
      @targeting_obj = enemies[0]
      Sys::message "#{@name} find #{@targeting_obj.name}"

  move: (objs ,cmap)->
    # for wait
    if @has_target()
      @set_dir(@targeting_obj.x,@targeting_obj.y)
      return if @get_distance(@targeting_obj) < @selected_skill.range
    else
      return if @cnt%60 < 15

    if @has_target() and @cnt%60 is 0
      @_update_path(cmap)

    if @to
    # 目的地が設定されてる場合
      dp = cmap.get_point(@to[0],@to[1])
      [nx,ny] = @_trace( dp.x , dp.y )
      wide = @status.speed
      if dp.x-wide<nx<dp.x+wide and dp.y-wide<ny<dp.y+wide
        if @_path.length > 0
          @to = @_path.shift()
        else
          @to = null
    else
      if @has_target()
        @_update_path(cmap)
      else
        c = cmap.get_cell(@x,@y)
        @to = [c.x+randint(-1,1),c.y+randint(-1,1)]

    if not cmap.collide( nx,ny )
      @x = nx if nx?
      @y = ny if ny?

    if @x is @_lx_ and @y is @_ly_
      c = cmap.get_cell(@x,@y)
      @to = [c.x+randint(-1,1),c.y+randint(-1,1)]
    @_lx_ = @x
    @_ly_ = @y

  die : (actor)->
    @cnt = 0
    if @group == ObjectGroup.Enemy
      gold = randint(0,100)
      GameData.gold += gold
    Sys::message "#{@name} is killed by #{actor.name}." if actor
    Sys::message "You got #{gold}G." if gold

  add_damage : (actor, amount)->
    before = @is_alive()
    @status.hp -= amount
    @die(actor) if @is_dead() and before
    return @is_alive()

  set_skill :(keys)->
    for k,v of keys
      if v and k in ["zero","one","two","three","four","five","six","seven","eight","nine"]
        @selected_skill = @skills[k]
        break

  _update_path : (cmap)->
    @_path = @_get_path(cmap)
    @to = @_path.shift()

  _get_path:(map)->
    from = map.get_cell( @x ,@y)
    to = map.get_cell( @targeting_obj.x ,@targeting_obj.y)
    return map.search_path( [from.x,from.y] ,[to.x,to.y] )

  _trace: (to_x , to_y)->
    @set_dir(to_x,to_y)
    return [
      @x + ~~(@status.speed * Math.cos(@dir)),
      @y + ~~(@status.speed * Math.sin(@dir))
    ]


  has_target:()->
    if @targeting_obj isnt null then true else false

  is_following:()->
    if @following_obj isnt null then true else false

  is_alive:()->
    return @status.hp > 1

  is_dead:()->
    not @is_alive()

  find_obj:(group_id,targets, range)->
    targets.filter (t)=>
      t.group is group_id and @get_distance(t) < range and t.is_alive()

  set_dir: (x,y)->
    rx = x - @x
    ry = y - @y
    if rx >= 0
      @dir = Math.atan( ry / rx  )
    else
      @dir = Math.PI - Math.atan( ry / - rx  )

  check:()->
    @status.hp = @status.MAX_HP if @status.hp > @status.MAX_HP
    @status.hp = 0 if @status.hp < 0
    if @is_alive()
      if @targeting_obj?.is_dead()
         @targeting_obj = null
    else
      @targeting_obj = null

  shift_target:(targets)->
    if @has_target() and targets.length > 0
      if not @targeting_obj in targets
        @targeting_obj = targets[0]
        return
      else if targets.size() == 1
        @targeting_obj = targets[0]
        return
      if targets.size() > 1
        cur = targets.indexOf @targeting_obj
        if cur+1 >= targets.size()
          cur = 0
        else
          cur += 1
        @targeting_obj = targets[cur]

  add_animation:(animation)->
    @animation.push(animation)

class CharacterObject extends Character
  render_animation:(g,x, y)->
    for n in [0...@animation.length]
      if not @animation[n].render(g,x,y)
        @animation.splice(n,1)
        @render_animation(g,x,y)
        break

  render_reach_circle:(g,pos)->
    g.init()
    g.drawArc false, pos.vx, pos.vy, @selected_skill.range
    g.init Color.i(50,50,50),alpha=0.3
    g.drawArc false,pos.vx, pos.vy, @status.sight_range

  render_dir_allow:(g,pos)->
    g.init Color.i(255,0,0)
    g.drawLine pos.vx,pos.vy,~~(30 * Math.cos(@dir)),~~(30 * Math.sin(@dir))

  render_targeting_obj:(g,pos,cam)->
    if @targeting_obj?.is_alive()
      @targeting_obj.render_targeted(g,pos)
      g.init color="rgb(0,0,255)",alpha=0.5
      g.moveTo(pos.vx,pos.vy)
      t = @targeting_obj.getpos_relative(cam)
      g.lineTo(t.vx,t.vy)
      g.stroke()

      g.init color = "rgb(255,0,0)",alpha=0.6
      # g.drawArc true,pos.vx, pos.vy , @scale*0.7

  render_state: (g,pos)->
    g.init()
    @render_gages(g,pos.vx, pos.vy+15,40 , 6 , @status.hp/@status.MAX_HP)
    g.init()
    @render_gages(g,pos.vx, pos.vy+22,40 , 6 , @selected_skill.ct/@selected_skill.MAX_CT)
    # state
    if @has_target()
      text = @selected_skill.name
    else
      text = "wander"
    color = Color.Grey
    if @has_target()
      if @get_distance(@targeting_obj) < @selected_skill.range
        color = Color.i 0,255,0
    g.init color
    g.fillText text , pos.vx-17, pos.vy+35

  render_dead: (g,pos)->
    g.init color='rgb(128, 0, 0)',alpha=1-@cnt/120
    g.drawArc true ,pos.vx,pos.vy, @scale

  render_gages:( g, x , y, w, h ,percent=1) ->
    g.init Color.Green
    g.strokeRect x-w/2,y-h/2,w,h

    g.init Color.Green
    g.fillRect x-w/2+1,y-h/2+1,w*percent,h-2

  render_targeted: (g,pos)->
    beat = 60
    ms = ~~(new Date()/100) % beat / beat
    ms = 1 - ms if ms > 0.5

    if @group is ObjectGroup.Player
      color = Color.i(255,0,0)
    else if @group is ObjectGroup.Enemy
      color = Color.i(0,0,255)
    g.init color,0.7
    g.drawPath true,[
      [pos.vx        , pos.vy-12+ms*10]
      [pos.vx-6-ms*5 , pos.vy-20+ms*10]
      [pos.vx+6+ms*5 , pos.vy-20+ms*10]
      [pos.vx        , pos.vy-12+ms*10]
    ]

  render: (g,cam)->
    g.init()
    pos = @getpos_relative(cam)
    if @is_alive()
      @render_object(g,pos)

      @render_state(g,pos)
      # @render_dir_allow(g,pos)
      # @render_reach_circle(g,pos)
      @render_targeting_obj(g,pos,cam)
    else
      @render_dead(g,pos)
    @render_animation(g, pos.vx , pos.vy )

class Goblin extends CharacterObject
  name : "Goblin"
  scale : 1
  constructor: (@x,@y,@group) ->
    @dir = 0
    @status = new Status
      hp  : 50
      atk : 10
      def : 1.0
      sight_range : 120
      speed : 4
    super(@x,@y,@group,@status)

    @skills =
      one: new Skill_Atack(@,3)
      two: new Skill_Heal(@)
    @selected_skill = @skills['one']

  change_skill: (_)->
    if @status.hp < 10
      @selected_skill = @skills['two']
    else
      @selected_skill = @skills['one']

  render_object:(g,pos)->
    if @group == ObjectGroup.Player
      color = Color.White
    else if @group == ObjectGroup.Enemy
      color = Color.i 55,55,55
    g.init color
    beat = 20
    ms = ~~(new Date()/100) % beat / beat
    ms = 1 - ms if ms > 0.5

    g.drawArc(true,pos.vx, pos.vy, ~~(1.3+ms)*@scale)

    g.init Color.Grey
    g.fillText( "#{@name}" ,pos.vx-15, pos.vy-12)

  exec:(actor,objs)->
    super actor,objs
    if actor.has_target()
      actor.targeting_obj.add_animation new Anim.prototype[@effect] amount, @size

class Player extends CharacterObject
  scale : 8
  name : "Player"
  constructor: (@x,@y,@group=ObjectGroup.Player) ->
    super(@x,@y,@group)
    @status = new Status
      hp : 120
      atk : 10
      def: 0.8
      atack_range : 50
      sight_range : 80
      speed : 3

    @skills =
      one: new Skill_Atack(@)
      two: new Skill_Smash(@)
      three: new Skill_Heal(@)
      four: new Skill_Meteor(@)
    @selected_skill = @skills['one']
    @state.leader =true
    @mouse =
      x: 0
      y: 0

  change_skill: (keys)->
    @set_skill keys

  update:(objs, cmap, keys, mouse)->
    enemies = @find_obj(ObjectGroup.get_against(@),objs,@status.sight_range)
    if keys.space and @__last is 0
      @shift_target(enemies)
    @__last = keys.space
    super objs,cmap,keys,mouse

  set_mouse_dir: (x,y)->
    rx = x - 320
    ry = y - 240
    if rx >= 0
      @dir = Math.atan( ry / rx  )
    else
      @dir = Math.PI - Math.atan( ry / - rx  )

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
    beat = 20
    ms = ~~(new Date()/100) % beat / beat
    ms = 1 - ms if ms > 0.5

    if @group == ObjectGroup.Player
      color = Color.White
    else if @group == ObjectGroup.Enemy
      color = Color.i 55,55,55
    g.init color
    g.drawArc true,pos.vx, pos.vy, ( 1.3 - ms ) * @scale
    roll = Math.PI * (@cnt % 20) / 10
    g.init Color.i 128, 100, 162
    g.drawArc true , 320,240, @scale * 0.5

    g.init Color.White
    g.fillText( "#{@name}" ,305 ,  228)

  render: (g,cam)->
    super(g,cam)
    @render_mouse(g)

  render_skill_gage: (g)->
    c = 0
    for number,skill of @skills
      color = Color.Grey
      if @has_target()
        if @get_distance(@targeting_obj) < skill.range
          color = Color.i 0,255,0
      g.init color
      g.fillText( "[#{c+1}]#{skill.name}" ,20+c*50 ,  30)
      @render_gages(g, 40+c*50 , 40,40 , 6 , skill.ct/skill.MAX_CT)
      c++

  render_mouse: (g)->
    if @mouse
      g.init Color.i 200, 200, 50
      g.arc(@mouse.x,@mouse.y,  @scale ,0,Math.PI*2,true)
      g.stroke()

class Mouse extends Sprite
  constructor: (@x=0,@y=0) ->
  render_object: (g,pos)->
  render: (g,cam)->
    # cx = ~~((@x+mouse.x-320)/cmap.cell)
    # cy = ~~((@y+mouse.y-240)/cmap.cell)

ObjectGroup =
  Player : 0
  Enemy  : 1
  Item   : 2
  is_battler : (group_id)->
    group_id in [@Player, @Enemy]
  get_against : (obj)->
    switch obj.group
      when @Player
        return @Enemy
      when @Enemy
        return @Player

class Status
  constructor: (params = {}, @lv = 1) ->
    @params = params
    @build_status(params)
    @hp = @MAX_HP
    @sp = @MAX_SP
    @exp = 0
    @next_lv = @lv * 50

  build_status:(params={},lv=1)->
    @MAX_HP = params.hp or 30
    @MAX_SP = params.sp or 10
    @atk = params.atk or 10
    @mgc = params.mgc or 10
    @def = params.def or 1.0
    @res = params.res or 1.0
    @regenerate = params.regenerate or 3
    @atack_range = params.atack_range or 50
    @sight_range = params.sight_range or 80
    @speed = params.speed or 6

  get_exp:(point)->
    @exp += point
    if @exp >= @next_lv
      @exp = 0
      @lv++
      @build(lv=@lv)
      @set_next_exp()

  set_next_exp:()->
    @next_lv = @lv * 30

  onDamaged : (amount)->
  onHealed : (amount)->

