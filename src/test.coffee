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
    topic: "extended array"
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

    # topic: "atack" # 'test': ()->
    #   map = new Map(32)
    #   start = map.get_rand_cell_xy()
    #   goal = map.get_rand_cell_xy()

    #   Node::start = start
    #   Node::goal = goal

    #   open_list = [] # new NodeList()
    #   close_list = [] #new NodeList()

    #   start_node = new Node(start)
    #   start_node.fs = start_node.hs

    #   console.log "start_node"
    #   console.log start_node.fs
    #   open_list.push(start_node)

    #   search_to =[
    #     [-1,-1], [ 0,-1], [ 1,-1]
    #     [-1, 0]         , [ 1, 0]
    #     [-1, 1], [ 0, 1], [ 1, 1]
    #   ]

    #   max_search = 0
    #   while max_search < 1
    #     if not open_list
    #       p "no open node"
    #       return 1
    #     open_list.sort( (a,b)->a.fs-b.fs )
    #     min_node = open_list[0]
    #     ns.splice( min_node,1 )
    #     for i in search_to
    #       [nx,ny] = [i[0]+node.pos[0] , i[1]+cnode.pos[0]]
    #       t = map._map[nx][ny]

    #       if not t
    #         n = new Node([nx,ny])
    #         open_list.push(n)

    #     console.log "#{nx} #{ny} #{t} "
    #     min_fs_node = open_node.get_min_node()
        # max_search++
#====================

      # for i in search_to
      #   [nx,ny] = [i[0]+cnode.pos[0] , i[1]+cnode.pos[0]]
      #   t = map._map[nx][ny]
      #   if not t
      #     n = new Node([nx,ny])
      #     open_list.push(n)
      #   console.log "#{nx} #{ny} #{t} "

      # for i in open_list
      #   console.log i
      # console.log open_list

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
