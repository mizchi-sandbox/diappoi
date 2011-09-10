class Skill
  constructor: (@lv=1) ->
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
    super(15 , @lv)

  exec:(actor)->
    target = actor
    if @ct >= @MAX_CT
      target.status.hp += 30
      @ct = 0
      console.log "do healing"
    else
      # console.log "wait "+((@MAX_CT-@ct)/24)

class Skill_Atack extends Skill
  name : "Atack"
  range : 30
  auto: true
  CT : 1
  bg_charge : 0.5
  fg_charge : 1

  constructor: (@lv=1) ->
    super( @lv)

  exec:(actor)->
    if actor.has_target()
      target = actor.targeting
      if @ct >= @MAX_CT and actor.get_distance(target) < @range
        amount = ~~(actor.status.atk * ( target.status.def + Math.random()/4 ))
        target.status.hp -= amount
        @ct = 0
        console.log @name
        target.add_animation new Anim::Slash amount

class Skill_Smash extends Skill
  name : "Smash"
  range : 30
  CT : 4
  auto: false
  bg_charge : 0.5
  fg_charge : 1

  constructor: (@lv=1) ->
    super(8 , @lv)

  exec:(actor)->
    target = actor.targeting
    if target
      if @ct >= @MAX_CT
        target.status.hp -= 30
        @ct = 0
        console.log "Smash!"

class Skill_Meteor extends Skill
  name : "Meteor"
  range : 80
  auto: true
  CT : 4
  bg_charge : 0.5
  fg_charge : 1

  constructor: (@lv=1) ->
    super(20 , @lv)

  exec:(actor,objs)->
    if @ct >= @MAX_CT
      targets = actor.find_obj ObjectGroup.get_against(actor), objs , @range
      if targets.length > 0
        console.log targets.length
        for t in targets
          t.status.hp -= 20
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
    super(ct=10 , @lv)
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
  constructor: (actor,target) ->
    super 0, 0
    @cnt = 0
  render:(g,x,y)->

(Anim = {}).prototype =
  Slash: class Slash extends Animation
    constructor: (@amount) ->
      @cnt = 0
      @max_frame = 24
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

