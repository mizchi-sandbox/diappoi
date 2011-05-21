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
    @player  =  new Player(320,240)
    @enemies = (new Enemy(Math.random()*640, Math.random()*480) for i in [1..30])
    @map = my.gen_map(20,15)

  enter: (keys,mouse) ->
    p.update(@enemies ,keys,mouse) for p in [@player]
    e.update([@player]) for e in @enemies
    return @name

  render: (g)->
    enemy.render(g,@player) for enemy in @enemies
    @player.render(g)
    cell = 32
    my.init_cv(g,color="rgb(255,255,255)")
    g.font = "10px "+"mono"
    g.fillText(
        "HP "+@player.status.hp+"/"+@player.status.MAX_HP,
        15,15)

    for i in [0..@map.length-1]
        for j in [0..@map[i].length-1]
            if @map[i][j]
                my.init_cv(g,color="rgb(100,100,100)",alpha=0.3)
            else
                my.init_cv(g,color="rgb(0,0,0)",alpha=0.3)
            my.draw_cell(g,
                @player.vx+i*cell,@player.vy+j*cell,
                cell)
