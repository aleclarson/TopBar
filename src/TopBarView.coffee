
{ Component, Style, Children, View, StaticRenderer } = require "component"
{ SceneView } = require "navi"

Immutable = require "immutable"
clampValue = require "clampValue"

TopBar = require "./TopBar"

module.exports = Component "TopBarView",

  propTypes:
    scene: TopBar.Kind
    style: Style
    children: Children

  customValues:

    scene: get: ->
      @props.scene

  initState: ->

    scenes: Reaction.sync =>
      @scene.scenes

  componentDidMount: ->

    @react

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

#
# Rendering
#

  render: ->

    scenes = sync.map @state.scenes.toJS(), (scene, index) =>
      return StaticRenderer
        key: scene.name
        shouldUpdate: no
        render: scene.render

    content = View
      children: scenes
      style: [
        _.Style.Cover
        @props.contentStyle
      ]

    bar = View
      children: [
        @props.children
        scenes
      ]
      style: [
        @styles.bar
        @props.style
      ]

    return SceneView {
      @scene
      children: bar
    }

  styles:

    bar:
      position: "absolute"
      top: 0
      left: 0
      right: 0
      height: 40
      backgroundColor: "#000"
