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

class Animation extends Sprite
  constructor: (actor,target) ->
    super 0, 0
    @timer = 0

  render:(g,x,y)->
    @timer++

(Anim = {}).prototype =
  Slash: class Slash extends Animation
    constructor: (@amount) ->
      @timer = 0
    render:(g,x,y)->
      if  @timer++ < 12
        g.init Color.i(30,55,55)
        g.drawDiffPath true,[
          [ x-10+@timer*3,y-10+@timer*3]
          [-8 ,-8]
          [ 4 ,0 ]
        ]
        g.init Color.i(255,55,55)
        g.strokeText "#{@amount}",x ,y+6
        return @
      else
        return false

