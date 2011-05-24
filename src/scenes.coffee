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
    @map = new Map(40,40, 32)

    start_point = @map.get_point(8,3)
    @player  =  new Player(start_point.x ,start_point.y)
    @enemies = []

  enter: (keys,mouse) ->
    p.update(@enemies ,@map , keys,mouse) for p in [@player]
    e.update([@player], @map) for e in @enemies

    # monster repop
    if @enemies.length < 20  # add monster
      rpo = @map.get_randpoint()
      @enemies[@enemies.length] = new Enemy(rpo.x, rpo.y)
    else  # check dead
      for i in [0 ... @enemies.length]
        if not @enemies[i].state.alive
          @enemies.splice(i,1)
          break

    return @name

  render: (g)->
    cam = @player

    @map.render(g, cam)
    enemy.render(g,cam) for enemy in @enemies
    @player.render(g)


    my.init_cv(g)
    g.fillText(
        "HP "+@player.status.hp+"/"+@player.status.MAX_HP,
        15,15)

    g.fillText(
        "p: "+@player.x+"."+@player.y
        15,25)

    if @player.targeting
      g.fillText(
          "p: "+@player.targeting.status.hp+"."+@player.targeting.status.MAX_HP
          15,35)

    # e = @enemies[0]
    # g.fillText(
    #     "Enemy Pos :"+e.x+"/"+e.y+":"+~~(e.dir/Math.PI*180)
    #     15,35)


