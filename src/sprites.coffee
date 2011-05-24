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


class Animation extends Sprite
  constructor: (actor,target) ->
    super 0, 0, @cell
    @timer = 0

  render:(g,cam)->
    pos = @getpos_relative(cam)
    @timer++


class Animation_Slash extends Animation
  constructor: (actor,target) ->
    super 0, 0, @cell
    @timer = 0

  render:(g,cam)->
    if  @timer < 24
      pos = @getpos_relative(cam)
      @init_cv(g)
      g.arc( pos.vx+12-@timer, pos.vy+12-@timer , 3 , 0, Math.PI, false)
      g.fill()
      @timer++
      return @
    else
      return false

