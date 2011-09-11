Conf =
  WINDOW_WIDTH: 640
  WINDOW_HEIGHT: 480
  VIEW_X: 320
  VIEW_Y: 240
  CANVAS_NAME: "game"
  FPS : 60

window.requestAnimationFrame = (->
  window.requestAnimationFrame or window.webkitRequestAnimationFrame or window.mozRequestAnimationFrame or window.oRequestAnimationFrame or window.msRequestAnimationFrame or (callback, element) ->
    window.setTimeout callback, 1000 / 60
)()

window.onload = ->
  game = new Game Conf

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

