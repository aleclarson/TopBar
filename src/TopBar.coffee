
{ Scene, SceneList } = require "navi"

inArray = require "in-array"
Factory = require "factory"

module.exports = Factory "TopBar",

  kind: Scene

  optionDefaults:
    level: 400

  customValues:

    activeScene: get: ->
      @_list.activeScene

    scenes: get: ->
      @_list.scenes

    sceneIds: get: ->
      @_list.sceneIds

    earlierScenes: get: ->
      @_list.earlierScenes

    earlierSceneIds: get: ->
      @_list.earlierSceneIds

  initFrozenValues: (options) ->

    _list: SceneList
      getName: => @__id

  push: (scene, makeActive) ->

    validTopBars = [ this, null, undefined ]
    assert (inArray validTopBars, scene.topBar), { scene, reason: "Scene already belongs to another TopBar!" }

    scene.topBar = this
    @_list.push scene, makeActive

  pop: ->

    return unless @activeScene?

    unless @activeScene.isPermanent
      @activeScene.topBar = null

    @_list.pop()

  remove: (scene) ->

    return unless scene.topBar is this

    unless @activeScene.isPermanent
      scene.topBar = null

    @_list.remove scene
