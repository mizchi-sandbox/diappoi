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
    return pos

  init_cv: (g,color="rgb(255,255,255)",alpha=1)->
    g.beginPath()
    g.strokeStyle = color
    g.fillStyle = color
    g.globalAlpha = alpha

class ItemObject extends Sprite
  constructor: (@x=0,@y=0,@scale=10) ->
    @group = 0
  update:()->

  render: (g,cam)->
    @init_cv(g,color="rgb(0,0,255)")
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
      if  @timer++ < 5
        @init_cv(g,color="rgb(30,55,55)")
        tx = x-10+@timer*3
        ty = y-10+@timer*3
        g.moveTo( tx ,ty )
        g.lineTo( tx-8 ,ty-8 )
        g.lineTo( tx-4 ,ty-8 )
        g.lineTo( tx ,ty )
        g.fill()
        return @
      else
        return false

