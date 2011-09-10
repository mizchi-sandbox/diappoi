class Skill
  constructor: (ct=1, @lv=1) ->
    @MAX_CT = ct * 24
    @ct = @MAX_CT
  do:(actor)->
  charge:(actor,is_selected)->
    if @ct < @MAX_CT
      if is_selected
        @ct += 1
      else
        @ct += 0.5

class Skill_Heal extends Skill
  name : "Heal"
  constructor: (@lv=1) ->
    super(15 , @lv)

  do:(actor)->
    target = actor
    if @ct >= @MAX_CT
      target.status.hp += 30
      @ct = 0
      console.log "do healing"
    else
      # console.log "wait "+((@MAX_CT-@ct)/24)

class Skill_Atack extends Skill
  name : "Atack"
  constructor: (@lv=1) ->
    super(1 , @lv)

  do:(actor)->
    if actor.has_target()
      target = actor.targeting
      if @ct >= @MAX_CT
        amount = ~~(actor.status.atk * ( target.status.def + Math.random()/4 ))
        target.status.hp -= amount
        @ct = 0
        console.log @name
        target.add_animation new Anim::Slash amount

class Skill_Smash extends Skill
  name : "Smash"
  constructor: (@lv=1) ->
    super(8 , @lv)

  do:(actor)->
    target = actor.targeting
    if target
      if @ct >= @MAX_CT
        target.status.hp -= 30
        @ct = 0
        console.log "Smash!"

class Skill_Meteor extends Skill
  name : "Meteor"
  constructor: (@lv=1) ->
    super(20 , @lv)
    @range = 120

  do:(actor,targets)->
    if @ct >= @MAX_CT
      # targets_on_focus = actor.get_targets_in_range(targets=targets , @range)
      targets_on_focus = actor.find_obj(ObjectGroup.get_against(actor), targets , @range)
      if targets_on_focus.length
        console.log targets_on_focus.length
        for t in targets_on_focus
          t.status.hp -= 20
        @ct = 0
        console.log "Meteor!"


class Skill_ThrowBomb extends Skill
  name : "Throw Bomb"
  constructor: (@lv=1) ->
    super(ct=10 , @lv)
    @range = 120
    @effect_range = 30

  do:(actor,targets,mouse)->
    if @ct >= @MAX_CT
      targets_on_focus = actor.get_targets_in_range(targets=targets , @range)
      if targets_on_focus.length
        console.log targets_on_focus.length
        for t in targets_on_focus
          t.status.hp -= 20
        @ct = 0
        console.log "Meteor!"
