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
    g.fillText(
        "Opening",
        300,200)

class FieldScene extends Scene
  constructor: () ->
    super("Field")
    @map = new Map(32)

    start_point = @map.get_rand_xy()
    # player  =  new Player(start_point.x ,start_point.y, 0)
    player  =  new Player(start_point.x ,start_point.y, 0)

    @objs = [player]
    @set_camera( player )

    @max_object_count = 2
    @fcnt = 0

  enter: (keys,mouse) ->
    obj.update(@objs, @map,keys,mouse) for obj in @objs

    # pop
    if @objs.length < @max_object_count and @fcnt % 24*3 == 0
      group = 0
      if Math.random() > 0.05
        group = 1
      else
        group = 0
      rpo = @map.get_rand_xy()
      @objs.push( new Goblin(rpo.x, rpo.y, group) )
      if Math.random() < 0.3
        @objs[@objs.length-1].state.leader = 1

    else  # check dead
      for i in [0 ... @objs.length]
        if not @objs[i].state.alive
          if @objs[i] is @camera
            start_point = @map.get_rand_xy()
            player  =  new Player(start_point.x ,start_point.y, 0)
            @objs.push(player)
            @set_camera(player)
            @objs.splice(i,1)
          else
            @objs.splice(i,1)
          break
    @fcnt++
    return @name

  set_camera: (obj)->
    @camera = obj

  render: (g)->
    @map.render(g, @camera)
    obj.render(g,@camera) for obj in @objs
    @map.render_after(g, @camera)

    player = @camera

    if player
      # player.render_skill_gage(g)
      my.init_cv(g)
      g.fillText(
          "HP "+player.status.hp+"/"+player.status.MAX_HP,
          15,15)

      # if @player.distination
      #   g.fillText(
      #       " "+@player.distination.x+"/"+@player.distination.y,
      #       15,35)

      # if player.mouse
      #   g.fillText(
      #       "p: "+(player.x+player.mouse.x-320)+"."+(player.y+player.mouse.y-240)
      #       15,25)

    # if @player.targeting
    #   g.fillText(
    #       "p: "+@player.targeting.status.hp+"."+@player.targeting.status.MAX_HP
    #       15,35)
