class Scene
  enter: (keys,mouse) ->
    return @name

  render: (g)->
    @player.render(g)
    g.fillText(
        @name,
        300,200)

class OpeningScene extends Scene
  name : "Opening"
  constructor: () ->
    @player  =  new Player(320,240)

  enter: (keys,mouse) ->
    if keys.space
      return "Field"
    return @name

  render: (g)->
    my.init_cv(g)
    g.fillText(
        "Opening",
        300,200)
    g.fillText(
        "Press Space",
        300,240)


class FieldScene extends Scene
  max_object_count: 4
  frame_count : 0
  name : "Field"

  constructor: () ->
    @map = new Map(32)
    @mouse = new Mouse()

    # mapの中のランダムな空白にプレーヤーを初期化
    start_point = @map.get_rand_xy()
    player  =  new Player(start_point.x ,start_point.y, 0)
    @objs = [player]
    @_set_camera( player )

  enter: (keys,mouse) ->
    # @objs.map (i)-> i.update(@objs,@map,keys,mouse)
    obj.update(@objs, @map,keys,mouse) for obj in @objs
    @_pop_enemy(@objs)
    @frame_count++
    return @name

  _pop_enemy: (objs) ->
    if objs.length < @max_object_count and @frame_count % 24*3 == 0
      group = (if Math.random() > 0.05 then 1 else 0 )
      random_point  = @map.get_rand_xy()
      objs.push( new Goblin(random_point.x, random_point.y, group) )
      if Math.random() < 0.3
        objs[objs.length-1].state.leader = 1
    else
      for i in [0 ... objs.length]
        if not objs[i].state.alive
          if objs[i] is @camera
            start_point = @map.get_rand_xy()
            player  =  new Player(start_point.x ,start_point.y, 0)
            objs.push(player)
            @set_camera(player)
            objs.splice(i,1)
          else
            objs.splice(i,1)
          break
  _set_camera: (obj)->
    @camera = obj

  render: (g)->
    @map.render(g, @camera)
    obj.render(g,@camera) for obj in @objs
    @map.render_after(g, @camera)

    player = @camera

    if player
      player.render_skill_gage(g)
      my.init_cv(g)
      g.fillText(
          "HP "+player.status.hp+"/"+player.status.MAX_HP,
          15,15)
    #
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
