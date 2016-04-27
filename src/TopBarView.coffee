
{ Component, Style, Children, View, StaticRenderer } = require "component"
{ SceneView } = require "navi"
{ Shape } = require "type-utils"

Immutable = require "immutable"
clampValue = require "clampValue"

TopBar = require "./TopBar"

LayeredChildren = Shape "LayeredChildren", { above: Children, below: Children }

module.exports = Component "TopBarView",

  propTypes:
    scene: TopBar.Kind
    style: Style
    children: LayeredChildren
    contentStyle: Style

  customValues:

    scene: get: ->
      @props.scene

  initValues: ->

    scenes: Reaction.sync =>
      @scene.scenes

    progress: Reaction.sync

      needsChange: no

      willGet: =>
        @scene.scenes.size > 0

      get: =>
        scene = @scene.activeScene
        assertType scene.getProgress, Function, { scene, topBarView: this }
        progress = scene.getProgress()
        clampValue progress, 0, 1

      didSet: (progress) =>

        { activeScene, earlierScenes } = @scene

        # TODO Apply easing to progress?
        #      Or leave that to individual scenes?

        # Transforms 0.5 -> 0 AND 1 -> 1
        activeProgress = (progress - 0.5) / 0.5
        activeProgress = clampValue activeProgress, 0, 1
        activeScene.onProgress activeProgress

        earlierScene = earlierScenes.get earlierScenes.size - 1
        return unless earlierScene?

        # Transforms 0.5 -> 0 AND 0 -> 1
        earlierProgress = (0.5 - progress) / 0.5
        earlierProgress = clampValue earlierProgress, 0, 1
        earlierScene.onProgress earlierProgress

        hiddenScenes = earlierScenes.slice 0, earlierScenes.size - 1
        hiddenScenes.forEach (scene) ->
          scene.onProgress 0

  initListeners: ->

    @scenes.didSet =>
      @forceUpdate()

  componentDidMount: ->
    @scene.view = this

  componentWillMount: ->
    @scene.view = null

#
# Rendering
#

  render: ->

    scenes = []
    @scenes.value.forEach (scene, index) =>
      scene._element ?= scene.render { key: scene.__id }
      scenes.push scene._element

    content = View
      style: [ _.Style.Cover, @props.contentStyle ]
      children: scenes

    bar = View
      style: @props.style
      children: content

    return SceneView {
      @scene
      children: [
        @props.children?.below
        bar
        @props.children?.above
      ]
    }
