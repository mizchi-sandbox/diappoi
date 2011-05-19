conf =
  WINDOW_WIDTH: 640
  WINDOW_HEIGHT: 480
  VIEW_X: 320
  VIEW_Y: 240
  CANVAS_NAME: "game"
  FPS : 24

window.onload = ->
  game = new Game conf

  # device control
  gamewindow = document.getElementById('game')
  gamewindow.onmousemove = (e) ->
    game.mouse.x =  e.x - gamewindow.offsetLeft
    game.mouse.y =  e.y - gamewindow.offsetTop
    # console.log game.mouse.x + ":" + game.mouse.y
  window.document.onkeydown = (e) ->
    game.getkey( game, e.keyCode, 1)
  window.document.onkeyup = (e) ->
    game.getkey( game, e.keyCode, 0)

  # game start
  game.start(game)