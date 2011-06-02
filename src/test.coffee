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

class NodeList extends Array
  constructor:(list)->
    c=0
    for i in list
      @[c] = i
      c++
  get:(n)-> return @[n]

  find:(x,y)->
    l = []
    for t in @
      if t.pos == [x,y]
        l.push(t)
    if l != []
      return l[0]
    else
      return null

  remove_node : (node)->
    @splice( @indexOf(node) ,1 )

class Node
  constructor:(start , goal , x,y)->
    @pos    = [x,y]
    @start = start
    @goal = goal
    @fs     = 0
    @owner_list  = null
    @parent_node = null
    @hs     = Math.pow(x-@goal[0],2)+Math.pow(y-@goal[1],2)

  is_goal:(self)->
    return @goal == @pos

vows.describe('Game Test').addBatch
  'combat test':
    topic: "atack"
    'test': ()->
      map = new Map(32)
      start = map.get_randpoint()
      goal = map.get_randpoint()
      arr = []
      console.log arr

      open_list = []
      close_list = []
      start_node    = new Node(start,goal, start[0],start[1])
      start_node.fs = start_node.hs
      open_list.push(start_node)
      console.log open_list

      search_to =[
        [-1,-1], [ 0,-1], [ 1,-1]
        [-1, 0], [ 0, 0], [ 1, 0]
        [-1, 1], [ 0, 1], [ 1, 1]
      ]
      cnode = start_node

      for i in search_to
        [nx,ny] = [i[0]+cnode.pos[0] , i[1]+cnode.pos[0]]
        t = map._map[nx][ny]
        console.log "#{nx} #{ny} #{t} "


      # while true
      #   if open_list == []
      #     console.log "There is no route until reaching a goal."
      #     return

      #   n = open_list[0]
      #   for i in open_list
      #     if i.fs<n.fs
      #       n = i
      #   console.log open_list.indexOf(n)
      #   open_list.splice(open_list.indexOf(n),1)
      #   close_list.push(n)

        # console.log map._map
    # topic: "select two targets"
    # 'select two': ()->
    #   p = new Player(320,240)
    #   enemies = ( new Enemy( ~~(Math.random()*640),~~(Math.random()*480)) for i in [1..30])
    #   for i in [0..100]
    #     targets_inrange =  p.get_targets_in_range(enemies)
    #     e.update([p]) for e in enemies
    #     p.set_target(targets_inrange)
    #     # p.change_target(targets_inrange)
    #     if p.targeting
    #       # console.log(p.targeting.id+ ":" +p.targeting.status.hp)
    #       p.atack()
    #     else
    #       # console.log "no"

    # topic: "select update method"
    # 'update': ()->
    #   p = new Player(320,240)
    #   enemies = ( new Enemy( ~~(Math.random()*640),~~(Math.random()*480)) for i in [1..100])
    #   for i in [1..10]
    #     p.update(enemies,keys,mouse)
    #     e.update([p]) for e in enemies
    #   console.log p.status
    #   console.log enemies[0].targeting

    # topic: "battle collide"
    # 'many vs many': ()->
    #   players = [new Player(320,240) , new Player(320,240) ]
    #   enemies = (new Enemy 320,240  for i in [1..3])

    #   for i in [1..100]
    #     p.update(enemies, keys,mouse) for p in players
    #     e.update(players) for e in enemies
    #   console.log p.status
    #   console.log enemies[0].status


    #   players = new Player(320,240)
    #   for i in [1..100]
    #     p.move(map)
    #     p.update(enemies, keys,mouse) for p in players
    #     e.update(players) for e in enemies
    #   console.log p.status
    #   console.log enemies[0].status
    # topic: "scene"
    # 'test2': ()->
    #   player = new Player(320,240)
    #   enemy = new Enemy ~~(Math.random()*640) ,~~(Math.random()*480)

    #   p.update(enemies, keys,mouse)
    #   p.move(map)
    #   p.act(map)
    #   for e in enemies
    #     e.update(players)
    #     e.move(map)
.export module
