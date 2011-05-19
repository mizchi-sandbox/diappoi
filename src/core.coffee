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
    @mouse = x : 0, y : 0
    @scenes =
      # "Opening": new OpeningScene()
      "Field": new FieldScene()
    @curr_scene = @scenes["Field"]

  enter: ->
    next_scene = @curr_scene.process(@keys,@mouse)
    @curr_scene = @scenes[next_scene]
    @draw(@curr_scene)

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

  render_rest_gage:( g, x , y, w, h ,percent=1) ->
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
