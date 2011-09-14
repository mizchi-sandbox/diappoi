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
    topic:
      player:new Player 100,100,ObjectGroup.Player
      goblin:new Goblin 100,100,ObjectGroup.Enemy
      map : new SampleMap()
    'Atack':
      'Attack until Dead':(topic)->
        player = topic.player
        goblin = topic.goblin
        m = topic.map
        while player.is_alive() and goblin.is_alive()
          player.update([player,goblin],m,keys,mouse)
          goblin.update([player,goblin],m)
        assert.isTrue( goblin.is_dead())

      'Shift Target':(topic)->
        goblin2 = new Goblin 100,100,ObjectGroup.Enemy
        goblin2.name += 2
        objs = [topic.player,topic.goblin,goblin2]
        i.update(objs,topic.map,keys,mouse) for i in objs
        before = topic.player.targeting_obj.name
        topic.player.shift_target([topic.goblin,goblin2])
        after = topic.player.targeting_obj.name
        topic.player.shift_target([topic.goblin,goblin2])
        after2 = topic.player.targeting_obj.name
        assert.isTrue (before isnt after)
        assert.isTrue (before is after2)

.export module


