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

vows.describe('Game Test').addBatch
  'combat test':
    topic: "atack"
    'test': ()->
      p = new Player 320,240
      e = new Enemy Math.random()*640 ,Math.random()*480
      collision_map = my.gen_map(20,15)

      while p.status.hp > 0 and e.state.alive
        p.atack(e)
        e.atack(p)

    topic: "select one target"
    'select one': ()->
      p = new Player(320,240)
      enemies = [new Enemy(320,240) , new Enemy(380,240) ]
      targets_inrange =  p.get_targets_in_range(enemies)
      target =  p.change_target(targets_inrange)
      p.atack(target)

    topic: "select two targets"
    'select two': ()->
      p = new Player(320,240)
      enemies = ( new Enemy( ~~(Math.random()*640),~~(Math.random()*480)) for i in [1..30])
      for i in [0..100]
        targets_inrange =  p.get_targets_in_range(enemies)
        e.process(p) for e in enemies
        p.set_target(targets_inrange)
        # p.change_target(targets_inrange)
        if p.targeting
          console.log(p.targeting.id+ ":" +p.targeting.status.hp)
          p.atack()
        else
          console.log "no"

      # console.log p.targeting.status.hp
      # console.log targets_inrange

    # topic: "battle collide"
    # 'many vs many': ()->
    #   players = [ new Player(320,240) , new Follower(320,240) ]
    #   enemies = (new Enemy 320,240 ) for i in [1..3])

    #   for i in [1..10]
    #     for p in players
    #       p.update(enemies, keys,mouse)
    #       p.move(map)

    #     for e in enemies
    #       e.update(players)
    #       e.move(map)

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