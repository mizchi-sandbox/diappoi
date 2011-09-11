class Skill
  constructor: (@lv=1) ->
    @_build(@lv)
    @MAX_CT = @CT * 24
    @ct = @MAX_CT

  charge:(actor,is_selected)->
    if @ct < @MAX_CT
      if is_selected
        @ct += @fg_charge
      else
        @ct += @bg_charge
  exec:(actor,objs)->
  _build:(lv)->
  _calc:(actor,target)-> return 1
  _get_targets:(actor,objs)-> return []

class DamageHit extends Skill
  range : 30
  auto: true
  CT : 1
  bg_charge : 0.2
  fg_charge : 1
  damage_rate : 1.0
  random_rate : 0.2
  effect : 'Slash'

  exec:(actor,objs)->
    targets = @_get_targets(actor,objs)
    if @ct >= @MAX_CT and targets.size() > 0
      for t in targets
        amount = @_calc actor,t
        t.add_damage(amount)
        t.add_animation new Anim.prototype[@effect] amount
      @ct = 0

class SingleHit extends DamageHit
  effect : 'Slash'
  _get_targets:(actor,objs)->
    if actor.has_target()
      if actor.get_distance(actor.targeting_obj) < @range
        return [ actor.targeting_obj ]
    return []
  _calc : (actor,target)->
    return ~~(actor.status.atk * target.status.def*@damage_rate*randint(100*(1-@random_rate),100*(1+@random_rate))/100)

class AreaHit extends DamageHit
  effect : 'Burn'
  _get_targets:(actor,objs)->
    return actor.find_obj ObjectGroup.get_against(actor), objs , @range
  _calc : (actor,target)->
    return ~~(actor.status.atk * target.status.def*@damage_rate*randint(100*(1-@random_rate),100*(1+@random_rate))/100)

class Skill_Atack extends SingleHit
  name : "Atack"
  range : 60
  CT : 1
  auto: true
  bg_charge : 0.2
  fg_charge : 1
  damage_rate : 1.0
  random_rate : 0.2

  _build:(lv)->
    @range -= lv
    @CT -= lv/40
    @bg_charge += lv/20
    @fg_charge -= lv/20
    @damage_rate += lv/20

class Skill_Smash extends SingleHit
  name : "Smash"
  range : 30
  CT : 2
  damage_rate : 2.2
  random_rate : 0.5
  bg_charge : 0.5
  fg_charge : 1

  _build: (lv) ->
    @range -= lv
    @CT -= lv/10
    @bg_charge += lv/20
    @fg_charge -= lv/20
    @damage_rate += lv/20

class Skill_Meteor extends AreaHit
  name : "Meteor"
  range : 80
  auto: true
  CT : 4
  bg_charge : 0.5
  fg_charge : 1
  effect : 'Burn'

class Skill_Heal extends Skill
  name : "Heal"
  range : 0
  auto: false
  CT : 4
  bg_charge : 0.5
  fg_charge : 1

  constructor: (@lv=1) ->
    super()

  exec:(actor)->
    target = actor
    if @ct >= @MAX_CT
      target.status.hp += 30
      @ct = 0
      console.log "do healing"

class Skill_ThrowBomb extends Skill
  name : "Throw Bomb"
  range : 120
  auto: true
  CT : 4
  bg_charge : 0.5
  fg_charge : 1

  constructor: (@lv=1) ->
    super(@lv)
    @range = 120
    @effect_range = 30

  exec:(actor,objs,mouse)->
    if @ct >= @MAX_CT
      targets = mouse.find_obj(ObjectGroup.get_against(actor), objs ,@range)
      if targets.size()>0
        for t in targets
          t.status.hp -= 20
        @ct = 0

####
class Animation extends Sprite
  constructor: (max) ->
    super 0, 0
    @cnt = 0
    @max_frame = max
  render:(g,x,y)->

(Anim = {}).prototype =
  Slash: class Slash extends Animation
    constructor: (@amount) ->
      super 24
    render:(g,x,y)->
      if 0 <= @cnt++ < @max_frame
        g.init Color.i(30,55,55)
        zangeki = 8
        if @cnt < zangeki
          per = @cnt/zangeki

          g.drawDiffPath true,[
            [ x-5+per*10,y-10+per*20]
            [-8 ,-8]
            [ 4 ,0 ]
          ]

        if @cnt < @max_frame
          per = @cnt/@max_frame
          g.init Color.i(255,55,55) ,1-@cnt/@max_frame
          g.strokeText "#{@amount}",x+10 ,y+20*per
        return @
      else
        return false

  Burn: class Burn extends Animation
    constructor: (@amount) ->
      super 24
    render:(g,x,y)->
      if 0 <= @cnt++ < @max_frame
        if @cnt < @max_frame/2
          g.init Color.i(230,55,55),0.4
          per = @cnt/(@max_frame/2)
          g.drawArc true,x,y, 30*per

        if @cnt < @max_frame
          per = @cnt/@max_frame
          g.init Color.i(255,55,55) ,1-@cnt/@max_frame
          g.strokeText "#{@amount}",x+10 ,y+20*per
        return @
      else
        return false
