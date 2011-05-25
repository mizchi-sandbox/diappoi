class Skill
  constructor: (ct=1, @lv=1) ->
    @MAX_CT = ct * 24
    @ct = @MAX_CT
  do:(actor)->
  charge:(actor)->
    @ct += 1 if @ct < @MAX_CT

class Skill_Heal extends Skill
  constructor: (@lv=1) ->
    super(15 , @lv)
    @name = "Heal"

  do:(actor)->
    target = actor
    if @ct >= @MAX_CT
      target.status.hp += 30
      target.check_state()
      @ct = 0
      console.log "do healing"
    else
      # console.log "wait "+((@MAX_CT-@ct)/24)

class Skill_Smash extends Skill
  constructor: (@lv=1) ->
    super(8 , @lv)
    @name = "Smash"

  do:(actor)->
    target = actor.targeting
    if target
      if @ct >= @MAX_CT
        target.status.hp -= 30
        target.check_state()
        @ct = 0
        console.log "Smash!"

class Skill_Meteor extends Skill
  constructor: (@lv=1) ->
    super(20 , @lv)
    @name = "Meteor"
    @range = 120

  do:(actor,targets)->
    if @ct >= @MAX_CT
      targets_on_focus = actor.get_targets_in_range(targets=targets , @range)
      if targets_on_focus.length
        console.log targets_on_focus.length
        for t in targets_on_focus
          t.status.hp -= 20
          t.check_state()
        @ct = 0
        console.log "Meteor!"


class Skill_ThrowBomb extends Skill
  constructor: (@lv=1) ->
    super(ct=10 , @lv)
    @name = "Throw Bomb"
    @range = 120
    @effect_range = 30

  do:(actor,targets,mouse)->
    if @ct >= @MAX_CT
      targets_on_focus = actor.get_targets_in_range(targets=targets , @range)
      if targets_on_focus.length
        console.log targets_on_focus.length
        for t in targets_on_focus
          t.status.hp -= 20
          t.check_state()
        @ct = 0
        console.log "Meteor!"
