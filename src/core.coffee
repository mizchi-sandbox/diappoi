class Game
  constructor: (conf) ->
    Sys::message("Welcome to the world!")
    canvas =  document.getElementById conf.CANVAS_NAME
    @g = canvas.getContext '2d'
    @config = conf
    canvas.width = conf.WINDOW_WIDTH;
    canvas.height = conf.WINDOW_HEIGHT;

    canvas.onmousemove = (e) =>
      @mouse.x =  e.x - canvas.offsetLeft
      @mouse.y =  e.y - canvas.offsetTop
    @mouse = x : 0, y : 0
    window.document.onkeydown = (e) =>
      @getkey( e.keyCode, 2)
    window.document.onkeyup = (e) =>
      @getkey( e.keyCode, 0)
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
    @scenes =
      "Opening": new OpeningScene(@)
      "Field": new FieldScene(@)
      "Menu": new MenuScene(@)
    @scene_name = "Opening"

  enter: ->
    @scene_name = @scenes[@scene_name].enter(@keys,@mouse)
    @draw(@scenes[@scene_name])
    for k,v of @keys
      if @keys[k] is 2
        @keys[k]--

  start: () ->
    animationLoop = =>
      @enter()
      requestAnimationFrame animationLoop
    animationLoop()


  getkey: (which,to) ->
    switch which
      when 68,39 then @keys.right = to
      when 65,37 then @keys.left = to
      when 87,38 then @keys.up = to
      when 83,40 then @keys.down = to
      when 32 then @keys.space = to
      when 17 then @keys.ctrl = to
      when 48 then @keys.zero = to
      when 49 then @keys.one = to
      when 50 then @keys.two = to
      when 51 then @keys.three = to
      when 52 then @keys.four = to
      when 53 then @keys.five = to
      when 54 then @keys.sixe = to
      when 55 then @keys.seven = to
      when 56 then @keys.eight = to
      when 57 then @keys.nine = to
    @keys[String.fromCharCode(which).toLowerCase()] = to

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

