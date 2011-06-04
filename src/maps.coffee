class Map extends Sprite
  constructor: (@cell=32) ->
    super 0, 0, @cell
    # @_map = @gen_map()
    m = @load(maps.debug)

    # m = base_block
    # m = rjoin(m,m)
    # m = sjoin(m,m)

    @_map = m
    @rotate90()
    @set_wall()

  load : (text)->
    tmap = text.replaceAll(".","0").replaceAll(" ","1").split("\n")
    map = []

    max = 0
    for row in tmap
      if max < row.length
        max = row.length

    y = 0
    for row in tmap
      list = []
      for i in row+1
        list[list.length] = parseInt(i)

      while list.length < max
        list.push(1)
      map[y] = list
      y++

    return map


  rotate90:()->
    map = @_map
    res = []
    for i in [0...map[0].length]
      res[i] = ( j[i] for j in map)
    @_map = res


  set_wall:()->
    map = @_map
    x = map.length
    y = map[0].length
    map[0] = (1 for i in [0...map[0].length])
    map[map.length-1] = (1 for i in [0...map[0].length])
    for i in map
      i[0]=1
      i[i.length-1]=1

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

  search_route: (start,goal)->
    path = []

    Node::start = start
    Node::goal = goal
    open_list = []
    close_list = []

    start_node = new Node(Node::start)
    start_node.fs = start_node.hs
    open_list.push(start_node)

    search_to =[
      [-1,-1], [ 0,-1], [ 1,-1]
      [-1, 0]         , [ 1, 0]
      [-1, 1], [ 0, 1], [ 1, 1]
    ]

    max_depth = 20
    c = 0

    while c<max_depth
      if not open_list
        return 1
      open_list.sort( (a,b)->a.fs-b.fs )
      min_node = open_list[0]
      close_list.push( open_list.shift() )

      if min_node.pos[0] == min_node.goal[0] and min_node.pos[1] == min_node.goal[1]
        path = []
        n = min_node
        while n.parent
          path.push(n.pos)
          n = n.parent
        return path.reverse()

      n_gs = min_node.fs - min_node.hs

      for i in search_to
        [nx,ny] = [i[0]+min_node.pos[0] , i[1]+min_node.pos[1]]
        if not @_map[nx][ny]
          dist = Math.pow(min_node.pos[0]-nx,2) + Math.pow(min_node.pos[1]-ny,2)

          if obj = open_list.find([nx,ny])
            if obj.fs > n_gs+obj.hs+dist
              obj.fs = n_gs+obj.hs+dist
              obj.parent = min_node
          else if obj = close_list.find([nx,ny])
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

      c++
    return null
  # is_passed:(from,to)->
  #   if @collide(x,y)
  #     return false
  #   dx = to.x - from.x
  #   dy = to.y - from.y
  #   if
  #   from.x , from.y

  render: (g,cam)->
    pos = @getpos_relative(cam)
    for i in [0 ... @_map.length]
      for j in [0 ... @_map[i].length]
        if @_map[i][j]

          @init_cv(g, color="rgb(30,30,30)")
          w = 8
          x = pos.vx+i*@cell
          y = pos.vy+j*@cell
          g.moveTo(x         ,y+@cell)
          g.lineTo(x+w       ,y+@cell-w)
          g.lineTo(x+@cell+w ,y+@cell-w)
          g.lineTo(x+@cell   ,y+@cell)
          g.lineTo(x         ,y+@cell)
          g.fill()

          @init_cv(g, color="rgb(40,40,40)")
          g.moveTo(x  ,y+@cell)
          g.lineTo(x  ,y)
          g.lineTo(x+w,y-w)
          g.lineTo(x+w,y-w+@cell)
          g.lineTo(x  ,y+@cell)
          g.fill()

        else
          # @init_cv(g , color = "rgb(250,250,250)",alpha=0.5)
          # g.fillRect(
          #   pos.vx + i * @cell,
          #   pos.vy + j * @cell,
          #   @cell , @cell)


  render_after:(g,cam)->
    pos = @getpos_relative(cam)
    for i in [0 ... @_map.length]
      for j in [0 ... @_map[i].length]
        if @_map[i][j]
          my.init_cv(g , color = "rgb(50,50,50)",alpha=1)
          w = 5
          g.fillRect(
            pos.vx + i * @cell+w,
            pos.vy + j * @cell-w,
            @cell , @cell)

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
        .......     ........
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


