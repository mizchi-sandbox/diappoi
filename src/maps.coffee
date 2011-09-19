class Map extends Sprite
  constructor: (@cell=32) ->
    super 0, 0, @cell
    @_map = @load(maps.debug)

  find:(arr,pos)->
    for i in arr
      if i.pos[0] == pos[0] and i.pos[1] == pos[1]
        return i
    return null

  gen_blocked_map : ()->
    map = @gen_map()
    m = base_block
    m = rjoin(m,m)
    m = sjoin(m,m)
    return map

  load : (text)->
    tmap = text.replaceAll(".","0").replaceAll(" ","1").split("\n")
    max = Math.max.apply null,(row.length for row in tmap)
    map = []
    for y in [0...tmap.length]
      map[y]= ((if i < tmap[y].length then parseInt tmap[y][i] else 1) for i in [0 ... max])

    map = @_rotate90(map)
    map = @_set_wall(map)
    return map

  gen_random_map:(x,y)->
    map = []
    for i in [0 ... x]
      map[i] = []
      for j in [0 ... y]
        if (i == 0 or i == (x-1) ) or (j == 0 or j == (y-1))
          map[i][j] = 1
        else if Math.random() < 0.2
          map[i][j] = 1
        else
          map[i][j] = 0
    return map

  get_point: (x,y)->
    return {x:~~((x+1/2) *  @cell ),y:~~((y+1/2) * @cell) }

  get_cell: (x,y)->
    x = ~~(x / @cell)
    y = ~~(y / @cell)
    return {x:x,y:y}

  get_rand_cell_xy : ()->
    rx = ~~(Math.random()*@_map.length)
    ry = ~~(Math.random()*@_map[0].length)
    if @_map[rx][ry]
      return @get_rand_cell_xy()
    return [rx,ry]

  get_rand_xy: ()->
    rx = ~~(Math.random()*@_map.length)
    ry = ~~(Math.random()*@_map[0].length)
    if @_map[rx][ry]
      return @get_rand_xy()
    return @get_point(rx,ry)


  collide: (x,y)->
    x = ~~(x / @cell)
    y = ~~(y / @cell)
    return @_map[x][y]

  search_path: (start,goal)->
    path = []
    Node::start = start
    Node::goal = goal
    open_list = []
    close_list = []

    start_node = new Node(Node::start)
    start_node.fs = start_node.hs
    open_list.push(start_node)

    search_path =[
      [-1,-1], [ 0,-1], [ 1,-1]
      [-1, 0]         , [ 1, 0]
      [-1, 1], [ 0, 1], [ 1, 1]
    ]

    max_depth = 100
    for _ in [1..max_depth]
      return [] if open_list.size() < 1 #探索失敗

      open_list.sort( (a,b)->a.fs-b.fs )
      min_node = open_list[0]
      close_list.push( open_list.shift() )

      if min_node.pos[0] is min_node.goal[0] and min_node.pos[1] is min_node.goal[1]
        path = []
        n = min_node
        while n.parent
          path.push(n.pos)
          n = n.parent
        return path.reverse()

      n_gs = min_node.fs - min_node.hs

      for i in search_path # 8方向探索
        [nx,ny] = [i[0]+min_node.pos[0] , i[1]+min_node.pos[1]]
        if not @_map[nx][ny]
          dist = Math.pow(min_node.pos[0]-nx,2) + Math.pow(min_node.pos[1]-ny,2)

          if obj = @find(open_list,[nx,ny])
            if obj.fs > n_gs+obj.hs+dist
              obj.fs = n_gs+obj.hs+dist
              obj.parent = min_node
          else if obj = @find(close_list,[nx,ny])
            if obj.fs > n_gs+obj.hs+dist
                obj.fs = n_gs+obj.hs+dist
                obj.parent = min_node
                open_list.push(obj)
                close_list.remove(obj)
          else
            n = new Node([nx,ny])
            n.fs = n_gs+n.hs+dist
            n.parent = min_node
            open_list.push(n)
    return []

  render: (g,cam)->
    pos = @getpos_relative(cam)
    for i in [0 ... @_map.length]
      for j in [0 ... @_map[i].length]
        if @_map[i][j]

          g.init color=Color.i 30,30,30
          # w = 8
          # x = pos.vx+i*@cell
          # y = pos.vy+j*@cell
          # g.moveTo(x         ,y+@cell)
          # g.lineTo(x+w       ,y+@cell-w)
          # g.lineTo(x+@cell+w ,y+@cell-w)
          # g.lineTo(x+@cell   ,y+@cell)
          # g.lineTo(x         ,y+@cell)
          # g.fill()

          # g.init color="rgb(40,40,40)"
          # g.moveTo(x  ,y+@cell)
          # g.lineTo(x  ,y)
          # g.lineTo(x+w,y-w)
          # g.lineTo(x+w,y-w+@cell)
          # g.lineTo(x  ,y+@cell)
          # g.fill()

  render_after:(g,cam)->
    pos = @getpos_relative(cam)
    for i in [0 ... @_map.length]
      for j in [0 ... @_map[i].length]
        if @_map[i][j]
          g.init Color.i(50,50,50),alpha=1
          x = pos.vx + i * @cell
          y = pos.vy + j * @cell
          if -@cell<x<640 and -@cell<y<480
            g.fillRect(
              x , y ,
              @cell , @cell)

  _rotate90:(map)->
    res = []
    for i in [0...map[0].length]
      res[i] = ( j[i] for j in map)
    res

  _set_wall:(map)->
    x = map.length
    y = map[0].length
    map[0] = (1 for i in [0...map[0].length])
    map[map.length-1] = (1 for i in [0...map[0].length])
    for i in map
      i[0]=1
      i[i.length-1]=1
    map


class SampleMap extends Map
  max_object_count: 18
  frame_count : 0

  constructor: (@context , @cell=32) ->
    super @cell
    @_map = @load(maps.filed1)

  update:(objs,camera)->
    @_sweep(objs,camera)
    @_pop_monster(objs)

  _sweep: (objs,camera)->
    for i in [0 ... objs.length]
      if objs[i].is_dead() and objs[i].cnt > 120
        if objs[i] is camera
          start_point = @get_rand_xy()
          player  =  new Player(@context,start_point.x ,start_point.y, 0)
          @context.set_camera player
          objs.push(player)
          objs.splice(i,1)
        else
          objs.splice(i,1)
        break

  _pop_monster: (objs) ->
    # リポップ条件確認
    if objs.length < @max_object_count and @frame_count % 60*3 == 0
      random_point  = @get_rand_xy()
      if Math.random() < 0.9
        group = (if Math.random() > 0.05 then ObjectGroup.Enemy else ObjectGroup.Player )
        objs.push( new Goblin(random_point.x, random_point.y, group) )
      else
        objs.push( new MoneyObject(random_point.x, random_point.y) )


class Node
  start: [null,null]
  goal: [null,null]
  constructor:(pos)->
    @pos    = pos
    @owner_list  = null
    @parent = null
    @hs     = Math.pow(pos[0]-@goal[0],2)+Math.pow(pos[1]-@goal[1],2)
    @fs     = 0

  is_goal:(self)->
    return @goal == @pos

maps =
  filed1 : """

                                             .........
                                      ................... .
                                 ...........            ......
                              ....                      ..........
                           .....              .....        ...... .......
                   ..........              .........        ............ .....
                   ............          ...... . ....        ............ . ..
               .....    ..    ...        ..  ..........       . ..................
       ..     ......          .........................       . .......   ...... ..
      .....    ...     ..        .......  ...............      ....        ........
    ...... ......    .....         ..................... ..   ....         ........
    .........   ......  ...............  ................... ....            ......
   ...........    ... ... .... .   ..   .. ........ ............             . .....
   ...........    ...... ...       ....................           ......
  ............   .......... .    .......... ...... .. .       ...........
   .. ........ .......   ....   ...... .   ............      .... .......
   . ..............       .... .. .       ..............   ...... ..... ..
    .............          .......       ......       ......... . ...... .
    ..     .... ..         ... .       ....         .........   ...........
   ...       .......   ........       .. .        .... ....  ... ..........
  .. .         ......  .........      .............. ..  .....  ...    .....
  .....         ......................................      ....        ....
   .....       ........    ... ................... ....     ...        ....
     ....   ........        ...........................  .....        .....
     ...........  ..        ........ .............. ... .. .         .....
         ......                 .........................           .. ..
                                  .....................          .......
                                      ...................        ......
                                          .............
"""
  debug : """
                ....
             ...........
           ..............
         .... ........... .
        .......  ..  ........
   .........    ..     ......
   ........   ......    .......
   .........   .....    .......
    .................. ........
        .......................
        ....................
              .............
                 ......
                  ...

"""
base_block = [
  [ 1,1,0,1,1 ]
  [ 1,0,0,1,1 ]
  [ 0,0,0,0,0 ]
  [ 1,0,0,0,1 ]
  [ 1,1,0,1,1 ]
  ]
