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
  size : 10
  is_alive:()->
    @event_in
  is_dead:()->
    not @is_alive()

  constructor: (@x=0,@y=0) ->
    @cnt = 0
    @group = ObjectGroup.Item
    @event_in = true

  update:(objs,map , keys ,mouse,camera)->
    @cnt++
    if camera.get_distance(@) < 30
      if @event_in
        @event(objs,map , keys ,mouse,camera)
        @event_in = false
        @cnt=0

  event : (objs,map , keys ,mouse,camera)->
    console.log "you got item"

  render: (g,cam)->
    pos = @getpos_relative cam
    if @is_alive()
      g.init color="rgb(255,0,255)"
      g.drawArc true ,pos.vx,pos.vy, @size ,0,Math.PI*2,true
    if @is_dead()
      g.init color="rgb(255,0,255)",alpha = 1-@cnt/120
      g.drawArc true ,pos.vx,pos.vy, @size ,0,Math.PI*2,true


class HealObject extends ItemObject
  event : (objs,map , keys ,mouse,player)->
    player.status.hp += 30
    player.check()

  # render: (g,cam)->
  #   g.init color="rgb(0,0,255)"
  #   pos = @getpos_relative cam
  #   g.init Color.White
  #   g.drawArc true ,pos.vx,pos.vy, 10 ,0,Math.PI*2,true


class MoneyObject extends ItemObject
  constructor:(x,y)->
    super(x,y)
    @amount = randint(0,100)
  event : (objs,map , keys ,mouse,player)->
    GameData.gold += @amount
    Sys::message "You got #{@amount}G / #{GameData.gold} "

class TresureObject extends ItemObject
  constructor:(x,y)->
    super(x,y)
    @potential = randint(0,100)
  event : (objs,map , keys ,mouse,player)->
    Sys::message "You got a item#{@potential}"

GameData =
  gold : 0
  items : []

Sys = new Object
Sys.prototype =
  message : (text)->
    if window?
      elm = $("<li>").text(text)
      $("#message").prepend(elm)
    else
      console.log "[Message] #{text}"

  debug: (text)->
    console.log " -*- #{text}"
