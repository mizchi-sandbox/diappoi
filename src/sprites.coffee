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
