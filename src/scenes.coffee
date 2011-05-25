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

  render:()->


class FieldScene extends Scene
  constructor: () ->
    super("Field")
    @map = new Map(32)

    start_point = @map.get_randpoint()
    @player  =  new Player(start_point.x ,start_point.y, 0)

    @objs = [@player]
    @max_object_count = 11
    @fcnt = 0

  enter: (keys,mouse) ->
    obj.update(@objs, @map,keys,mouse) for obj in @objs

    if @objs.length < @max_object_count and @fcnt % 24*3 == 0
      group = 0
      if Math.random() > 0.15
        group = 1
      else
        group = 0

      rpo = @map.get_randpoint()
      @objs.push( new Enemy(rpo.x, rpo.y, group) )
    else  # check dead
      for i in [0 ... @objs.length]
        if not @objs[i].state.alive
          @objs.splice(i,1)
          break
    @fcnt++
    return @name

  render: (g)->
    cam = @player
    # cam = @objs[@objs.length-1]

    @map.render(g, cam)
    obj.render(g,cam) for obj in @objs

    my.init_cv(g)
    g.fillText(
        "HP "+@player.status.hp+"/"+@player.status.MAX_HP,
        15,15)

    mouse_x =@player.x+@player.mouse.x-320
    mouse_y =@player.y+@player.mouse.y-240

    g.fillText(
        "p: "+(@player.x+@player.mouse.x-320)+"."+(@player.y+@player.mouse.y-240)
        15,25)

    if @player.targeting
      g.fillText(
          "p: "+@player.targeting.status.hp+"."+@player.targeting.status.MAX_HP
          15,35)

    # e = @enemies[0]
    # g.fillText(
    #     "Enemy Pos :"+e.x+"/"+e.y+":"+~~(e.dir/Math.PI*180)
    #     15,35)



