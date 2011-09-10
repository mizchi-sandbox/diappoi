class Skill
  constructor: () ->
    @MAX_CT = @CT * 24
    @ct = @MAX_CT

  exec:(actor)->
  charge:(actor,is_selected)->
    if @ct < @MAX_CT
      if is_selected
        @ct += @fg_charge
      else
        @ct += @bg_charge

class Skill_Heal extends Skill
  name : "Heal"
  range : 0
  auto: false
  CT : 1
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

class Skill_Atack extends Skill
  name : "Atack"
  range : 30
  auto: true
  CT : 1
  bg_charge : 0.2
  fg_charge : 1
  damage_rate : 1.0
  random_rate : 0.2

  constructor: (@lv=1) ->
    super()
    @range -= @lv
    @CT -= @lv/10
    @bg_charge += @lv/20
    @fg_charge -= @lv/20
    @damage_rate += @lv/20


  exec:(actor)->
    if actor.has_target()
      target = actor.targeting
      if @ct >= @MAX_CT and actor.get_distance(target) < @range
        amount = @calc_amount(actor,target)
        target.status.hp -= amount
        @ct = 0
        console.log @name
        target.add_animation new Anim::Slash amount
  calc_amount : (actor,target)->
    return ~~(actor.status.atk * target.status.def*@damage_rate*randint(100*(1-@random_rate),100*(1+@random_rate))/100)

class Skill_Smash extends Skill_Atack
  name : "Smash"
  range : 30
  CT : 2
  damage_rate : 2.2
  random_rate : 0.5
  bg_charge : 0.5
  fg_charge : 1

  # calc_amount : (actor,target)->
  #   return ~~(actor.status.atk * ( target.status.def )*@damage_rate*randint(50,150)/100)

class Skill_Meteor extends Skill
  name : "Meteor"
  range : 80
  auto: true
  CT : 4
  bg_charge : 0.5
  fg_charge : 1

  constructor: (@lv=1) ->
    super()

  exec:(actor,objs)->
    if @ct >= @MAX_CT
      targets = actor.find_obj ObjectGroup.get_against(actor), objs , @range
      if targets.length > 0
        console.log targets.length
        for t in targets
          t.status.hp -= 20
          t.add_animation new Anim::Burn
        @ct = 0
        console.log "Meteor!"


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

  exec:(actor,targets,mouse)->
    if @ct >= @MAX_CT
      targets_on_focus = actor.get_targets_in_range(targets=targets , @range)
      if targets_on_focus.length
        console.log targets_on_focus.length
        for t in targets_on_focus
          t.status.hp -= 20
        @ct = 0
        console.log "Meteor!"

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
      # @cnt = 0
      # @max_frame = 24
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
    constructor: () ->
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
