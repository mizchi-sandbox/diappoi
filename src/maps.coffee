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

  compile:(data)->
    return ""

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

