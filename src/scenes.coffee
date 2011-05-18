class Scene
  constructor: (@name) ->

  process: (keys,mouse) ->
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

  process: (keys,mouse) ->
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

  process: (keys,mouse) ->
    @player.process(keys,mouse)
    @player.state.active = false
    # pst = @player.status

    # collision
    for n in [0..(@enemies.length-1)]
      enemy = @enemies[n]
      enemy.process(@player)

      d = my.distance( @player.x,@player.y,enemy.x,enemy.y )
      if d < @player.atack_range and enemy.state.alive
        if @player.status.MAX_WT >  @player.status.wt
          # @player.status.wt += 1
          @player.state.active = true

        else if @player.status.MAX_WT <= @player.status.wt
          @player.status.wt = 0
          @player.atack(enemy)

    if @player.state.active and @player.status.wt < @player.status.MAX_WT
      @player.status.wt += 1
    else
      @player.status.wt = 0
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
