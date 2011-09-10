#===== String =====
String::replaceAll = (org, dest) ->
  return @split(org).join(dest)

#===== Array =====
Array::find = (pos)->
  for i in @
    if i.pos[0] == pos[0] and i.pos[1] == pos[1]
      return i
  return null
Array::remove = (obj)-> @splice(@indexOf(obj),1)
Array::size = ()-> @.length
Array::first = ()-> @[0]
Array::last = ()-> @[@.length-1]
Array::each = Array::forEach

#===== Object =====
Object::dup = (obj)->
  O = ()->
  O.prototype = obj
  new O

#===== CanvasRenderingContext2D =====
Canvas = CanvasRenderingContext2D
Canvas::init = (color=Color.i(255,255,255),alpha=1)->
  @beginPath()
  @strokeStyle = color
  @fillStyle = color
  @globalAlpha = alpha

Canvas::drawLine = (x,y,dx,dy)->
  @moveTo x,y
  @lineTo x+dx,y+dy
  @stroke()

Canvas::drawPath = (fill,path)->
  [sx,sy] = path.shift()
  @moveTo sx,sy
  while path.size() > 0
    [px,py] = path.shift()
    @lineTo px,py
  @lineTo sx,sy
  if fill then @fill() else @stroke()

Canvas::drawDiffPath = (fill,path)->
  [sx,sy] = path.shift()
  @moveTo sx,sy
  [px,py] = [sx,sy]
  while path.size() > 0
    [dx,dy] = path.shift()
    [px,py] = [px+dx,py+dy]
    @lineTo px,py
  @lineTo sx,sy
  if fill then @fill() else @stroke()

Canvas::drawLine = (x,y,dx,dy)->
  @moveTo x,y
  @lineTo x+dx,y+dy
  @stroke()

Canvas::drawArc = (fill , x,y,size,from=0, to=Math.PI*2,reverse=false)->
  @arc( x, y, size ,from ,to ,reverse)
  if fill then @fill() else @stroke()
