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

      while p.status.hp > 0 and e.state.alive
        p.atack(e)
        e.atack(p)
      console.log p.state.alive

    topic: "scene"
    'test2': ()->
      scene = new FieldScene()
      scene.process(keys,mouse)
      console.log scene.name

.export module
