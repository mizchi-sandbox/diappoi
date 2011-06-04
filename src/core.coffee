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

    # while 1
    #   next = @scenes[@scene_name].enter(@keys,@mouse)
    #   if next == @scene_name
    #     @scene_name = @scenes[next].enter(@keys,@mouse)
    #     break
    # @draw(@scenes[@scene_name])

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

  mklist :(list,func)->
    buf = []
    for i in list
      buf.push(i) if func(i)
    return buf


rjoin = (map1,map2)->
  map1
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

String::replaceAll = (org, dest) ->
  return @split(org).join(dest)

randint = (from,to) ->
  if not to?
    to = from
    from = 0
  return ~~( Math.random()*(to-from+1))+from

Array::find = (pos)->
  for i in @
    if i.pos[0] == pos[0] and i.pos[1] == pos[1]
      return i
  return null

Array::remove = (obj)->
  @splice(@indexOf(obj),1)
  return @

clone = (obj)->
  F = ()->
  F.prototype = obj
  return new F

