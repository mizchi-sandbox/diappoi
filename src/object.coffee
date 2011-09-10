# String 拡張
String::replaceAll = (org, dest) ->
  return @split(org).join(dest)

# Array 拡張
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

#Object 拡張
Object::dup = ()->
  O = ()->
  O.prototype = @
  new O

