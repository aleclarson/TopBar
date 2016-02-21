var Children, Component, Immutable, SceneView, StaticRenderer, Style, TopBar, View, clampValue, ref;

ref = require("component"), Component = ref.Component, Style = ref.Style, Children = ref.Children, View = ref.View, StaticRenderer = ref.StaticRenderer;

SceneView = require("navi").SceneView;

Immutable = require("immutable");

clampValue = require("clampValue");

TopBar = require("./TopBar");

module.exports = Component("TopBarView", {
  propTypes: {
    scene: TopBar.Kind,
    style: Style,
    children: Children
  },
  customValues: {
    scene: {
      get: function() {
        return this.props.scene;
      }
    }
  },
  initState: function() {
    return {
      scenes: Reaction.sync((function(_this) {
        return function() {
          return _this.scene.scenes;
        };
      })(this))
    };
  },
  componentDidMount: function() {
    return this.react({
      needsChange: false,
      willGet: (function(_this) {
        return function() {
          return _this.scene.scenes.size > 0;
        };
      })(this),
      get: (function(_this) {
        return function() {
          var progress, scene;
          scene = _this.scene.activeScene;
          assertType(scene.getProgress, Function, {
            scene: scene,
            topBarView: _this
          });
          progress = scene.getProgress();
          return clampValue(progress, 0, 1);
        };
      })(this),
      didSet: (function(_this) {
        return function(progress) {
          var activeProgress, activeScene, earlierProgress, earlierScene, earlierScenes, hiddenScenes, ref1;
          ref1 = _this.scene, activeScene = ref1.activeScene, earlierScenes = ref1.earlierScenes;
          activeProgress = (progress - 0.5) / 0.5;
          activeProgress = clampValue(activeProgress, 0, 1);
          activeScene.onProgress(activeProgress);
          earlierScene = earlierScenes.get(earlierScenes.size - 1);
          if (earlierScene == null) {
            return;
          }
          earlierProgress = (0.5 - progress) / 0.5;
          earlierProgress = clampValue(earlierProgress, 0, 1);
          earlierScene.onProgress(earlierProgress);
          hiddenScenes = earlierScenes.slice(0, earlierScenes.size - 1);
          return hiddenScenes.forEach(function(scene) {
            return scene.onProgress(0);
          });
        };
      })(this)
    });
  },
  render: function() {
    var bar, content, scenes;
    scenes = sync.map(this.state.scenes.toJS(), (function(_this) {
      return function(scene, index) {
        return StaticRenderer({
          key: scene.name,
          shouldUpdate: false,
          render: scene.render
        });
      };
    })(this));
    content = View({
      children: scenes,
      style: [_.Style.Cover, this.props.contentStyle]
    });
    bar = View({
      children: [this.props.children, scenes],
      style: [this.styles.bar, this.props.style]
    });
    return SceneView({
      scene: this.scene,
      children: bar
    });
  },
  styles: {
    bar: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 40,
      backgroundColor: "#000"
    }
  }
});

//# sourceMappingURL=../../map/src/TopBarView.map
