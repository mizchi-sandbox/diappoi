class Game
  constructor: (conf) ->
    canvas =  document.getElementById conf.CANVAS_NAME
    @ctx = canvas.getContext '2d'
    @config = conf
    canvas.width = conf.WINDOW_WIDTH;
    canvas.height = conf.WINDOW_HEIGHT;
    @keys = {}
    @scenes = {Opening: new Scene "Opening"}
    @context = "Opening"

  enter: ->
    crr = @scenes[@context]
    console.log crr.process(@keys)
    @draw( )

  getkey: (which,to) ->
    switch which
      when 65,37 then @keys.left = to
      when 68,39 then @keys.right = to
      when 87,38 then @keys.up = to
      when 83,40 then @keys.down = to
      when 32 then @keys.space = to
      when 17 then @keys.ctrl = to
    @enter()
    console.log @scenes[ @context ].process(@keys)


  draw: (scene) ->
    @ctx.clearRect(0,0,@config.WINDOW_WIDTH ,@config.WINDOW_HEIGHT)
    @ctx.save()

    @ctx.beginPath()
    if @keys.left
      @ctx.arc(100,100,30,0,Math.PI*2,true)
    else if @keys.right
      @ctx.arc(200,100,30,0,Math.PI*2,true)
    else
      @ctx.arc(150,100,30,0,Math.PI*2,true)

    @ctx.stroke()
    @ctx.restore()

class Scene
  constructor: (@name) ->

  process: (keys) ->
    return @name

  render: ->
    @ctx.arc(100,100,30,0,Math.PI*2,true)

conf =
  WINDOW_WIDTH: 640
  WINDOW_HEIGHT: 480
  VIEW_X: 320
  VIEW_Y: 240
  CANVAS_NAME: "game"

window.onload = ->
  game = new Game conf
  window.document.onkeydown = (e) ->
    game.getkey( e.keyCode, 1)
  window.document.onkeyup = (e) ->
    game.getkey( e.keyCode, 0)
  setInterval -> console.log(30) 40


