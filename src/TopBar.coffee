
{ Scene, SceneList } = require "navi"

Factory = require "factory"

module.exports = Factory "TopBar",

  kind: Scene

  optionDefaults:
    level: 400

  create: (options) ->
    options.id = "TopBar:" + options.id
    Scene options

  customValues:

    scenes: get: ->
      @_list._scenes

    sceneIds: get: ->
      @scenes.toJS().map (scene) -> scene.id

  initReactiveValues: ->

    _list: SceneList()

  initFrozenValues: (options) ->

    contentsOpacity: NativeValue 1

  push: (scene, makeActive) ->
    @_list.push scene, makeActive

  pop: ->
    @_list.pop()

  remove: (scene) ->
    @_list.remove scene

  getSceneView: ->
    throw Error "Subclass must override!"
