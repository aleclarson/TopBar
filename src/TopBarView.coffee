
{ Component, Style, Children } = require "component"
{ SceneView } = require "navi"

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
        @scenes.size > 0

      get: =>
        progress = @scenes.last().getProgress()
        clampValue progress, 0, 1

      didSet: (progress) =>

        # TODO Apply easing?

        # Transforms 0.5 -> 0 AND 1 -> 1
        progressAbove = (progress - 0.5) / 0.5

        sceneAbove = @scenes.last()
        sceneAbove.onProgress clampValue progressAbove, 0, 1

        previous = @scenes.get @scenes.size - 2
        return unless previous?

        # Transforms 0.5 -> 0 AND 0 -> 1
        progressBelow = (0.5 - progress) / 0.5

        previous.onProgress clampValue progressBelow, 0, 1

#
# Rendering
#

  render: ->

    log.it "TopBar('#{@scene.id}').render()"

    scenes = sync.map @state.scenes.toJS(), (scene, index) =>
      scene.render { key: scene.id, scene }

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
