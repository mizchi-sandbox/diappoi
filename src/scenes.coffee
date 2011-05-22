class Scene
  constructor: (@name) ->

  enter: (keys,mouse) ->
    return @name

  render: (g)->
    @player.render(g)
    g.fillText(
        @name,
        300,200)

class OpeningScene extends Scene
  constructor: () ->
    super("Opening")
    @player  =  new Player(320,240)

  enter: (keys,mouse) ->
    if keys.right

      return "Filed"
    return @name

  render: (g)->
    @player.render(g)
    g.fillText(
        "Opening",
        300,200)

class FieldScene extends Scene
  constructor: () ->
    super("Field")
    @map = new Map(20,15, 32)

    start_point = @map.get_point(1,1)
    @player  =  new Player(start_point.x ,start_point.y)
    @enemies = []
    for i in [1 .. 10]
      rpo = @map.get_randpoint()
      @enemies[@enemies.length] = new Enemy(rpo.x, rpo.y)
    # @enemies = (new Enemy(50, 50) for i in [1..1])

  enter: (keys,mouse) ->
    p.update(@enemies ,keys,mouse) for p in [@player]
    e.update([@player]) for e in @enemies
    return @name

  render: (g)->
    cam = @player

    @map.render(g, cam)
    enemy.render(g,cam) for enemy in @enemies
    @player.render(g)


    g.fillText(
        "HP "+@player.status.hp+"/"+@player.status.MAX_HP,
        15,15)

    g.fillText(
        "p: "+@player.x+"."+@player.y
        15,25)
