## ge.js ##
# generated by src/core.coffee
class Game
  constructor: (conf) ->
    my.mes("Welcome to the world!")
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
        space : 0
        one : 0
        two : 0
        three : 0
        four : 0
        five : 0
        six : 0
        seven : 0
        eight : 0
        nine : 0
        zero : 0
    @mouse = x : 0, y : 0
    @scenes =
      "Opening": new OpeningScene()
      "Field": new FieldScene()
    @scene_name = "Opening"
    # @curr_scene = @scenes["Opening"]

  enter: ->
    @scene_name = @scenes[@scene_name].enter(@keys,@mouse)
    @draw(@scenes[@scene_name])

  start: (self) ->
    # setInterval ->
    #   self.enter()
    # , 1000 / @config.FPS
    animationLoop = ->
      self.enter()
      requestAnimationFrame animationLoop
    animationLoop()



  getkey: (self,which,to) ->
    switch which
      when 68,39 then self.keys.right = to
      when 65,37 then self.keys.left = to
      when 87,38 then self.keys.up = to
      when 83,40 then self.keys.down = to
      when 32 then self.keys.space = to
      when 17 then self.keys.ctrl = to
      when 48 then self.keys.zero = to
      when 49 then self.keys.one = to
      when 50 then self.keys.two = to
      when 51 then self.keys.three = to
      when 52 then self.keys.four = to
      when 53 then self.keys.five = to
      when 54 then self.keys.sixe = to
      when 55 then self.keys.seven = to
      when 56 then self.keys.eight = to
      when 57 then self.keys.nine = to

  draw: (scene) ->
    @g.clearRect(0,0,@config.WINDOW_WIDTH ,@config.WINDOW_HEIGHT)
    @g.save()
    scene.render(@g)
    @g.restore()

my =
  mes:(text)->
    elm = $("<li>").text(text)
    $("#message").prepend(elm)
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

  draw_cell: (g,x,y,cell,color="grey")->
    g.moveTo(x , y)
    g.lineTo(x+cell , y)
    g.lineTo(x+cell , y+cell)
    g.lineTo(x , y+cell)
    g.lineTo(x , y)
    g.fill()

  mklist :(list,func)->
    buf = []
    for i in list
      buf.push(i) if func(i)
    return buf

rjoin = (map1,map2)->
  return map1.concat(map2)

sjoin = (map1,map2)->
  if not map1[0].length == map2[0].length
    return false
  y = 0
  buf = []
  for i in [0...map1.length]
    buf[i] = map1[i].concat(map2[i])
    y++
  return buf

randint = (from,to) ->
  if not to?
    to = from
    from = 0
  return ~~( Math.random()*(to-from+1))+from

Color =
  Red : "rgb(255,0,0)"
  Blue : "rgb(0,0,255)"
  Green : "rgb(0,255,0)"
  White : "rgb(255,255,255)"
  Black : "rgb(0,0,0)"
  i : (r,g,b)->
    "rgb(#{r},#{g},#{b})"

init_cv = (g,color="rgb(255,255,255)",alpha=1)->
  g.beginPath()
  g.strokeStyle = color
  g.fillStyle = color
  g.globalAlpha = alpha

# generated by src/sprites.coffee
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

  find_obj:(group_id,targets, range)->
    targets.filter (t)=>
      t.group is group_id and @get_distance(t) < range

  is_targeted:(objs)->
     @ in (i.targeting_obj? for i in objs)

  has_target:()->
    false

  is_following:()->
    false

  is_alive:()->
    false
  is_dead:()->
    not @is_alive()

  find_obj:(group_id,targets, range)->
    targets.filter (t)=>
      t.group is group_id and @get_distance(t) < range and t.is_alive()

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

class ItemObject extends Sprite
  constructor: (@x=0,@y=0,@scale=10) ->
    @group = ObjectGroup.Item
  update:()->

  render: (g,cam)->
    g.init color="rgb(0,0,255)"
    pos = @getpos_relative cam
    g.beginPath()
    g.arc(pos.vx,pos.vy, 15 - ms ,0,Math.PI*2,true)
    g.stroke()

# generated by src/maps.coffee
class Map extends Sprite
  constructor: (@cell=32) ->
    super 0, 0, @cell
    @_map = @load(maps.debug)

  gen_blocked_map : ()->
    map = @gen_map()
    m = base_block
    m = rjoin(m,m)
    m = sjoin(m,m)
    return map

  load : (text)->
    tmap = text.replaceAll(".","0").replaceAll(" ","1").split("\n")
    max = Math.max.apply null,(row.length for row in tmap)
    map = []
    for y in [0...tmap.length]
      map[y]= ((if i < tmap[y].length then parseInt tmap[y][i] else 1) for i in [0 ... max])

    map = @_rotate90(map)
    map = @_set_wall(map)
    return map

  gen_random_map:(x,y)->
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

  get_point: (x,y)->
    return {x:~~((x+1/2) *  @cell ),y:~~((y+1/2) * @cell) }

  get_cell: (x,y)->
    x = ~~(x / @cell)
    y = ~~(y / @cell)
    return {x:x,y:y}

  get_rand_cell_xy : ()->
    rx = ~~(Math.random()*@_map.length)
    ry = ~~(Math.random()*@_map[0].length)
    if @_map[rx][ry]
      return @get_rand_cell_xy()
    return [rx,ry]

  get_rand_xy: ()->
    rx = ~~(Math.random()*@_map.length)
    ry = ~~(Math.random()*@_map[0].length)
    if @_map[rx][ry]
      return @get_rand_xy()
    return @get_point(rx,ry)


  collide: (x,y)->
    x = ~~(x / @cell)
    y = ~~(y / @cell)
    return @_map[x][y]

  search_path: (start,goal)->
    path = []
    Node::start = start
    Node::goal = goal
    open_list = []
    close_list = []

    start_node = new Node(Node::start)
    start_node.fs = start_node.hs
    open_list.push(start_node)

    search_path =[
      [-1,-1], [ 0,-1], [ 1,-1]
      [-1, 0]         , [ 1, 0]
      [-1, 1], [ 0, 1], [ 1, 1]
    ]

    max_depth = 100
    for _ in [1..max_depth]
      return [] if open_list.size() < 1 #探索失敗

      open_list.sort( (a,b)->a.fs-b.fs )
      min_node = open_list[0]
      close_list.push( open_list.shift() )

      if min_node.pos[0] is min_node.goal[0] and min_node.pos[1] is min_node.goal[1]
        path = []
        n = min_node
        while n.parent
          path.push(n.pos)
          n = n.parent
        return path.reverse()

      n_gs = min_node.fs - min_node.hs

      for i in search_path # 8方向探索
        [nx,ny] = [i[0]+min_node.pos[0] , i[1]+min_node.pos[1]]
        if not @_map[nx][ny]
          dist = Math.pow(min_node.pos[0]-nx,2) + Math.pow(min_node.pos[1]-ny,2)

          if obj = open_list.find([nx,ny])
            if obj.fs > n_gs+obj.hs+dist
              obj.fs = n_gs+obj.hs+dist
              obj.parent = min_node
          else if obj = close_list.find([nx,ny])
            if obj.fs > n_gs+obj.hs+dist
                obj.fs = n_gs+obj.hs+dist
                obj.parent = min_node
                open_list.push(obj)
                close_list.remove(obj)
          else
            n = new Node([nx,ny])
            n.fs = n_gs+n.hs+dist
            n.parent = min_node
            open_list.push(n)
    return []

  render: (g,cam)->
    pos = @getpos_relative(cam)
    for i in [0 ... @_map.length]
      for j in [0 ... @_map[i].length]
        if @_map[i][j]

          g.init color=Color.i 30,30,30
          # w = 8
          # x = pos.vx+i*@cell
          # y = pos.vy+j*@cell
          # g.moveTo(x         ,y+@cell)
          # g.lineTo(x+w       ,y+@cell-w)
          # g.lineTo(x+@cell+w ,y+@cell-w)
          # g.lineTo(x+@cell   ,y+@cell)
          # g.lineTo(x         ,y+@cell)
          # g.fill()

          # g.init color="rgb(40,40,40)"
          # g.moveTo(x  ,y+@cell)
          # g.lineTo(x  ,y)
          # g.lineTo(x+w,y-w)
          # g.lineTo(x+w,y-w+@cell)
          # g.lineTo(x  ,y+@cell)
          # g.fill()

  render_after:(g,cam)->
    pos = @getpos_relative(cam)
    for i in [0 ... @_map.length]
      for j in [0 ... @_map[i].length]
        if @_map[i][j]
          g.init Color.i(50,50,50),alpha=1
          x = pos.vx + i * @cell
          y = pos.vy + j * @cell
          if -@cell<x<640 and -@cell<y<480
            g.fillRect(
              x , y ,
              @cell , @cell)

  _rotate90:(map)->
    res = []
    for i in [0...map[0].length]
      res[i] = ( j[i] for j in map)
    res

  _set_wall:(map)->
    x = map.length
    y = map[0].length
    map[0] = (1 for i in [0...map[0].length])
    map[map.length-1] = (1 for i in [0...map[0].length])
    for i in map
      i[0]=1
      i[i.length-1]=1
    map


class SampleMap extends Map
  max_object_count: 18
  frame_count : 0

  constructor: (@context , @cell=32) ->
    super @cell
    @_map = @load(maps.filed1)

  update:(objs,camera)->
    @_check_death(objs,camera)
    @_pop_monster(objs)

  _check_death: (objs,camera)->
    for i in [0 ... objs.length]
      if not objs[i].is_alive()
        if objs[i] is camera
          start_point = @get_rand_xy()
          player  =  new Player(start_point.x ,start_point.y, 0)
          @context.set_camera player
          objs.push(player)
          objs.splice(i,1)
        else
          objs.splice(i,1)
        break

  _pop_monster: (objs) ->
    # リポップ条件確認
    if objs.length < @max_object_count and @frame_count % 60*3 == 0
      group = (if Math.random() > 0.05 then ObjectGroup.Enemy else ObjectGroup.Player )
      random_point  = @get_rand_xy()
      objs.push( new Goblin(random_point.x, random_point.y, group) )


class Node
  start: [null,null]
  goal: [null,null]
  constructor:(pos)->
    @pos    = pos
    @owner_list  = null
    @parent = null
    @hs     = Math.pow(pos[0]-@goal[0],2)+Math.pow(pos[1]-@goal[1],2)
    @fs     = 0

  is_goal:(self)->
    return @goal == @pos

maps =
  filed1 : """

                                             .........
                                      ................... .
                                 ...........            ......
                              ....                      ..........
                           .....              .....        ...... .......
                   ..........              .........        ............ .....
                   ............          ...... . ....        ............ . ..
               .....    ..    ...        ..  ..........       . ..................
       ..     ......          .........................       . .......   ...... ..
      .....    ...     ..        .......  ...............      ....        ........
    ...... ......    .....         ..................... ..   ....         ........
    .........   ......  ...............  ................... ....            ......
   ...........    ... ... .... .   ..   .. ........ ............             . .....
   ...........    ...... ...       ....................           ......
  ............   .......... .    .......... ...... .. .       ...........
   .. ........ .......   ....   ...... .   ............      .... .......
   . ..............       .... .. .       ..............   ...... ..... ..
    .............          .......       ......       ......... . ...... .
    ..     .... ..         ... .       ....         .........   ...........
   ...       .......   ........       .. .        .... ....  ... ..........
  .. .         ......  .........      .............. ..  .....  ...    .....
  .....         ......................................      ....        ....
   .....       ........    ... ................... ....     ...        ....
     ....   ........        ...........................  .....        .....
     ...........  ..        ........ .............. ... .. .         .....
         ......                 .........................           .. ..
                                  .....................          .......
                                      ...................        ......
                                          .............
"""
  debug : """
                ....
             ...........
           ..............
         .... ........... .
        .......  ..  ........
   .........    ..     ......
   ........   ......    .......
   .........   .....    .......
    .................. ........
        .......................
        ....................
              .............
                 ......
                  ...

"""
base_block = [
  [ 1,1,0,1,1 ]
  [ 1,0,0,1,1 ]
  [ 0,0,0,0,0 ]
  [ 1,0,0,0,1 ]
  [ 1,1,0,1,1 ]
  ]


# generated by src/char.coffee
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

  update:(objs, cmap, keys, mouse)->
    @cnt += 1
    if @is_alive()
      @check()
      @regenerate()
      @search objs
      @move(objs,cmap, keys,mouse)
      @change_skill(keys,objs)
      for name,skill of @skills
        skill.charge @, skill is @selected_skill
      @selected_skill.exec @,objs


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

  add_damage : (amount)->
    @status.hp -= amount
    @check()
    return @is_alive()

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

  regenerate: ()->
    r = (if @targeting_obj then 2 else 1)
    if @is_alive()
      if @status.hp < @status.MAX_HP
        @status.hp += 1

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
        console.log "before: #{cur} #{targets.size()}"
        if cur+1 >= targets.size()
          cur = 0
        else
          cur += 1
        @targeting_obj = targets[cur]
        console.log "after: #{cur}"

  add_animation:(animation)->
    @animation.push(animation)

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
      g.drawArc true,pos.vx, pos.vy , @scale*0.7

  render_state: (g,pos)->
    g.init()
    @render_gages(g,pos.vx, pos.vy+15,40 , 6 , @status.hp/@status.MAX_HP)
    g.init()
    @render_gages(g,pos.vx, pos.vy+22,40 , 6 , @selected_skill.ct/@selected_skill.MAX_CT)
    g.init()
    if @has_target()
      text = @selected_skill.name
    else
      text = "wander"
    g.fillText text , pos.vx+23, pos.vy+22

  render_dead: (g,pos)->
    g.init color='rgb(55, 55, 55)'
    g.drawArc true ,pos.vx,pos.vy, @scale

  render_gages:( g, x , y, w, h ,percent=1) ->
    g.init Color.Green
    g.strokeRect x-w/2,y-h/2,w,h

    g.init Color.Green
    g.fillRect x-w/2+1,y-h/2+1,w*percent,h-2

  render_targeted: (g,pos,color="rgb(255,0,0)")->
    beat = 60
    ms = ~~(new Date()/100) % beat / beat
    ms = 1 - ms if ms > 0.5

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
      @render_dir_allow(g,pos)
      @render_reach_circle(g,pos)
      @render_targeting_obj(g,pos,cam)
    else
      @render_dead(g,pos)
    @render_animation(g, pos.vx , pos.vy )

  set_skill :(keys)->
    for k,v of keys
      if v and k in ["zero","one","two","three","four","five","six","seven","eight","nine"]
        @selected_skill = @skills[k]
        console.log "set #{@selected_skill.name}"
        break

  search : (objs)->
    enemies = @find_obj(ObjectGroup.get_against(@),objs,@status.sight_range)
    if @has_target()
      if @targeting_obj.is_dead() or @get_distance(@targeting_obj) > @status.sight_range*1.5
        # ターゲットが死 or 感知外
        my.mes "#{@name} lost track of #{@targeting_obj.name}"
        @targeting_obj = null
    else if enemies.size() > 0
      # 新たに目視した場合
      @targeting_obj = enemies[0]
      my.mes "#{@name} find #{@targeting_obj.name}"

  _update_path : (cmap)->
    @_path = @_get_path(cmap)
    @to = @_path.shift()

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

class Goblin extends Character
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
    super(@x,@y,@group,status)

    @skills =
      one: new Skill_Atack(10)
      two: new Skill_Heal()
    @selected_skill = @skills['one']

  change_skill: (_)->
    if @status.hp < 10
      console.log '#{@name}:warning'
      @selected_skill = @skills['two']
    else
      @selected_skill = @skills['one']

    # @set_skill keys

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

class Player extends Character
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
      one: new Skill_Atack()
      two: new Skill_Smash()
      three: new Skill_Heal()
      four: new Skill_Meteor()
    @selected_skill = @skills['one']
    @state.leader =true
    @mouse =
      x: 0
      y: 0

  change_skill: (keys)->
    @set_skill keys

  update:(objs, cmap, keys, mouse)->
    enemies = @find_obj(ObjectGroup.get_against(@),objs,@status.sight_range)
    if keys.space
      @shift_target(enemies)
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


  render: (g,cam)->
    super(g,cam)
    @render_mouse(g)

  render_skill_gage: (g)->
    c = 0
    for number,skill of @skills
      g.init()
      g.fillText( skill.name ,20+c*50 ,  460)
      @render_gages(g, 40+c*50 , 470,40 , 6 , skill.ct/skill.MAX_CT)
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
    cx = ~~((@x+mouse.x-320)/cmap.cell)
    cy = ~~((@y+mouse.y-240)/cmap.cell)

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

# generated by src/skills.coffee
class Skill
  constructor: (@lv=1) ->
    @_build(@lv)
    @MAX_CT = @CT * 60
    @ct = @MAX_CT

  charge:(actor,is_selected)->
    if @ct < @MAX_CT
      if is_selected
        @ct += @fg_charge
      else
        @ct += @bg_charge
  exec:(actor,objs)->
  _build:(lv)->
  _calc:(actor,target)-> return 1
  _get_targets:(actor,objs)-> return []

class DamageHit extends Skill
  range : 30
  auto: true
  CT : 1
  bg_charge : 0.2
  fg_charge : 1
  damage_rate : 1.0
  random_rate : 0.2
  effect : 'Slash'

  exec:(actor,objs)->
    targets = @_get_targets(actor,objs)
    if @ct >= @MAX_CT and targets.size() > 0
      for t in targets
        amount = @_calc actor,t
        t.add_damage(amount)
        t.add_animation new Anim.prototype[@effect] amount
      @ct = 0

class SingleHit extends DamageHit
  effect : 'Slash'
  _get_targets:(actor,objs)->
    if actor.has_target()
      if actor.get_distance(actor.targeting_obj) < @range
        return [ actor.targeting_obj ]
    return []
  _calc : (actor,target)->
    return ~~(actor.status.atk * target.status.def*@damage_rate*randint(100*(1-@random_rate),100*(1+@random_rate))/100)

class AreaHit extends DamageHit
  effect : 'Burn'
  _get_targets:(actor,objs)->
    return actor.find_obj ObjectGroup.get_against(actor), objs , @range
  _calc : (actor,target)->
    return ~~(actor.status.atk * target.status.def*@damage_rate*randint(100*(1-@random_rate),100*(1+@random_rate))/100)

class Skill_Atack extends SingleHit
  name : "Atack"
  range : 60
  CT : 1
  auto: true
  bg_charge : 0.2
  fg_charge : 1
  damage_rate : 1.0
  random_rate : 0.2

  _build:(lv)->
    @range -= lv
    @CT -= lv/40
    @bg_charge += lv/20
    @fg_charge -= lv/20
    @damage_rate += lv/20

class Skill_Smash extends SingleHit
  name : "Smash"
  range : 30
  CT : 2
  damage_rate : 2.2
  random_rate : 0.5
  bg_charge : 0.5
  fg_charge : 1

  _build: (lv) ->
    @range -= lv
    @CT -= lv/10
    @bg_charge += lv/20
    @fg_charge -= lv/20
    @damage_rate += lv/20

class Skill_Meteor extends AreaHit
  name : "Meteor"
  range : 80
  auto: true
  CT : 4
  bg_charge : 0.5
  fg_charge : 1
  effect : 'Burn'

class Skill_Heal extends Skill
  name : "Heal"
  range : 0
  auto: false
  CT : 4
  bg_charge : 0.5
  fg_charge : 1

  constructor: (@lv=1) ->
    super()

  exec:(actor)->
    target = actor
    if @ct >= @MAX_CT
      target.status.hp += 30
      @ct = 0
      console.log "do healing"

class Skill_ThrowBomb extends Skill
  name : "Throw Bomb"
  range : 120
  auto: true
  CT : 4
  bg_charge : 0.5
  fg_charge : 1
  constructor: (@lv=1) ->
    super(@lv)
    @range = 120
    @effect_range = 30

  exec:(actor,objs,mouse)->
    if @ct >= @MAX_CT
      targets = mouse.find_obj(ObjectGroup.get_against(actor), objs ,@range)
      if targets.size()>0
        for t in targets
          t.status.hp -= 20
        @ct = 0

####
class Animation extends Sprite
  constructor: (max) ->
    super 0, 0
    @cnt = 0
    @max_frame = max
  render:(g,x,y)->

(Anim = {}).prototype =
  Slash: class Slash extends Animation
    constructor: (@amount) ->
      super 60
    render:(g,x,y)->
      if 0 <= @cnt++ < @max_frame
        g.init Color.i(30,55,55)
        zangeki = 8
        if @cnt < zangeki
          per = @cnt/zangeki

          g.drawDiffPath true,[
            [ x-5+per*10,y-10+per*20]
            [-8 ,-8]
            [ 4 ,0 ]
          ]

        if @cnt < @max_frame
          per = @cnt/@max_frame
          g.init Color.i(255,55,55) ,1-@cnt/@max_frame
          g.strokeText "#{@amount}",x+10 ,y+20*per
        return @
      else
        return false

  Burn: class Burn extends Animation
    constructor: (@amount) ->
      super 60
    render:(g,x,y)->
      if 0 <= @cnt++ < @max_frame
        if @cnt < @max_frame/2
          g.init Color.i(230,55,55),0.4
          per = @cnt/(@max_frame/2)
          g.drawArc true,x,y, 30*per

        if @cnt < @max_frame
          per = @cnt/@max_frame
          g.init Color.i(255,55,55) ,1-@cnt/@max_frame
          g.strokeText "#{@amount}",x+10 ,y+20*per
        return @
      else
        return false
# generated by src/scenes.coffee
class Scene
  enter: (keys,mouse) ->
    return @name

  render: (g)->
    @player.render g
    g.fillText(
        @name,
        300,200)

class OpeningScene extends Scene
  name : "Opening"
  constructor: () ->
    @player  =  new Player(320,240)

  enter: (keys,mouse) ->
    if keys.space
      return "Field"
    return @name

  render: (g)->
    g.init()
    g.fillText(
        "Opening",
        300,200)
    g.fillText(
        "Press Space",
        300,240)


class FieldScene extends Scene
  name : "Field"
  _camera : null

  constructor: () ->
    @map = new SampleMap(@,32)
    @mouse = new Mouse()

    # mapの中のランダムな空白にプレーヤーを初期化
    start_point = @map.get_rand_xy()
    player  =  new Player(start_point.x ,start_point.y, 0)
    @objs = [player]
    @set_camera( player )

  enter: (keys,mouse) ->
    near_obj = @objs.filter (e)=> e.get_distance(@_camera) < 400
    obj.update(@objs, @map,keys,mouse) for obj in near_obj
    @map.update @objs,@_camera
    @frame_count++
    return @name

  set_camera: (obj)->
    @_camera = obj

  render: (g)->
    @map.render(g, @_camera)
    obj.render(g,@_camera) for obj in @objs.filter (e)=> e.get_distance(@_camera) < 400
    @map.render_after(g, @_camera)

    player = @_camera

    if player
      player.render_skill_gage(g)
      g.init()
      g.fillText(
          "HP "+player.status.hp+"/"+player.status.MAX_HP,
          15,15)
# generated by src/object.coffee
#===== String =====
String::replaceAll = (org, dest) ->
  return @split(org).join(dest)

#===== Array =====
Array::find = (pos)->
  for i in @
    if i.pos[0] == pos[0] and i.pos[1] == pos[1]
      return i
  return null
Array::remove = (obj)-> @splice(@indexOf(obj),1)
Array::size = ()-> @.length
Array::first = ()-> @[0]
Array::last = ()-> @[@.length-1]
Array::each = Array::forEach

#===== Object =====
# Object::dup = (obj)->
#   O = ()->
#   O.prototype = obj
#   new O

#===== CanvasRenderingContext2D =====
Canvas = CanvasRenderingContext2D
Canvas::init = (color=Color.i(255,255,255),alpha=1)->
  @beginPath()
  @strokeStyle = color
  @fillStyle = color
  @globalAlpha = alpha

Canvas::drawLine = (x,y,dx,dy)->
  @moveTo x,y
  @lineTo x+dx,y+dy
  @stroke()

Canvas::drawPath = (fill,path)->
  [sx,sy] = path.shift()
  @moveTo sx,sy
  while path.size() > 0
    [px,py] = path.shift()
    @lineTo px,py
  @lineTo sx,sy
  if fill then @fill() else @stroke()

Canvas::drawDiffPath = (fill,path)->
  [sx,sy] = path.shift()
  @moveTo sx,sy
  [px,py] = [sx,sy]
  while path.size() > 0
    [dx,dy] = path.shift()
    [px,py] = [px+dx,py+dy]
    @lineTo px,py
  @lineTo sx,sy
  if fill then @fill() else @stroke()

Canvas::drawLine = (x,y,dx,dy)->
  @moveTo x,y
  @lineTo x+dx,y+dy
  @stroke()

Canvas::drawArc = (fill , x,y,size,from=0, to=Math.PI*2,reverse=false)->
  @arc( x, y, size ,from ,to ,reverse)
  if fill then @fill() else @stroke()
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

p = console.log


vows.describe('Game Test').addBatch
  'combat test':
    topic: "astar"
    'test1': ()->
      map = new Map(32)
      s = map.get_rand_cell_xy()
      g = map.get_rand_cell_xy()
      path =  map.search_route( s , g )
      p s
      while path?.length >0
        pos = path.shift()
        dp = map.get_point(pos[0],pos[1])
        p dp

.export module
