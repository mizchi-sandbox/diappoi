class Sprite
  constructor: (@x=0,@y=0,@scale=10) ->
  render: (g)->
    g.beginPath()
    g.arc(@x,@y, 15 - ms ,0,Math.PI*2,true)
    g.stroke()

  get_distance: (target)->
    xd = Math.pow (@x-target.x) ,2
    yd = Math.pow (@y-target.y) ,2
    return Math.sqrt xd+yd

  getpos_relative:(cam)->
    pos =
      vx : 320 + @x - cam.x
      vy : 240 + @y - cam.y

  find_obj:(group_id,targets, range)->
    targets.filter (t)=>
      t.group is group_id and @get_distance(t) < range

  is_targeted:(objs)->
     @ in (i.targeting_obj? for i in objs)

  has_target:()->
    false

  is_following:()->
    false

  is_alive:()->
    false
  is_dead:()->
    not @is_alive()

  find_obj:(group_id,targets, range)->
    targets.filter (t)=>
      t.group is group_id and @get_distance(t) < range and t.is_alive()

ObjectGroup =
  Player : 0
  Enemy  : 1
  Item   : 2
  is_battler : (group_id)->
    group_id in [@Player, @Enemy]
  get_against : (obj)->
    switch obj.group
      when @Player
        return @Enemy
      when @Enemy
        return @Player

class ItemObject extends Sprite
  constructor: (@x=0,@y=0,@scale=10) ->
    @group = ObjectGroup.Item
  update:()->

  render: (g,cam)->
    g.init color="rgb(0,0,255)"
    pos = @getpos_relative cam
    g.beginPath()
    g.arc(pos.vx,pos.vy, 15 - ms ,0,Math.PI*2,true)
    g.stroke()

