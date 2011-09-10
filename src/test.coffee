vows = require 'vows'
assert = require 'assert'

keys =
   left : 0
   right : 0
   up : 0
   down : 0
mouse =
  x : 320
  y : 240

p = console.log


vows.describe('Game Test').addBatch
  'combat test':
    topic: "astar"
    'test1': ()->
      map = new Map(32)
      s = map.get_rand_cell_xy()
      g = map.get_rand_cell_xy()
      path =  map.search_route( s , g )
      p s
      while path?.length >0
        pos = path.shift()
        dp = map.get_point(pos[0],pos[1])
        p dp

.export module
