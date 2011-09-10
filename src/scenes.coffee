class Scene
  enter: (keys,mouse) ->
    return @name

  render: (g)->
    @player.render g
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
    g.init()
    g.fillText(
        "Opening",
        300,200)
    g.fillText(
        "Press Space",
        300,240)


class FieldScene extends Scene
  name : "Field"
  _camera : null

  constructor: () ->
    @map = new SampleMap(@,32)
    @mouse = new Mouse()

    # mapの中のランダムな空白にプレーヤーを初期化
    start_point = @map.get_rand_xy()
    player  =  new Player(start_point.x ,start_point.y, 0)
    @objs = [player]
    @set_camera( player )

  enter: (keys,mouse) ->
    # @objs.map (i)-> i.update(@objs,@map,keys,mouse)
    obj.update(@objs, @map,keys,mouse) for obj in @objs
    @map.update @objs,@_camera
    @frame_count++
    return @name

  set_camera: (obj)->
    @_camera = obj

  render: (g)->
    @map.render(g, @_camera)
    obj.render(g,@_camera) for obj in @objs
    @map.render_after(g, @_camera)

    player = @_camera

    if player
      player.render_skill_gage(g)
      g.init()
      g.fillText(
          "HP "+player.status.hp+"/"+player.status.MAX_HP,
          15,15)
