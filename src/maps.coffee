class Map extends Sprite
  constructor: (@cell=32) ->
    super 0, 0, @cell
    # @_map = @gen_map()
    m = @load(maps.debug)

    # m = base_block
    # m = rjoin(m,m)
    # m = sjoin(m,m)

    @_map = m
    @set_wall()
    @rotate90()

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

  get_randpoint: ()->
    rx = ~~(Math.random()*@_map.length)
    ry = ~~(Math.random()*@_map[0].length)
    if @_map[rx][ry]
      return @get_randpoint()
    return @get_point(rx,ry )

  collide: (x,y)->
    x = ~~(x / @cell)
    y = ~~(y / @cell)
    return @_map[x][y]

  render: (g,cam)->
    pos = @getpos_relative(cam)
    for i in [0 ... @_map.length]
      for j in [0 ... @_map[i].length]
        if @_map[i][j]
          my.init_cv(g , color = "rgb(0,0,0)",alpha=0.5)
        else
          my.init_cv(g , color = "rgb(250,250,250)",alpha=0.5)
        g.fillRect(
          pos.vx + i * @cell,
          pos.vy + j * @cell,
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

rjoin = (map1,map2)->
  map1
  return map1.concat(map2)

sjoin = (map1,map2)->
  if not map1[0].length == map2[0].length
    return false
  y = 0
  buf = []
  for i in [0...map1.length]
    buf[i] = map1[i].concat(map2[i])
    y++
  return buf

String.prototype.replaceAll = (org, dest) ->
  return @split(org).join(dest)

