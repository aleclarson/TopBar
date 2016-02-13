var Children, Component, SceneView, Style, TopBar, clampValue, ref;

ref = require("component"), Component = ref.Component, Style = ref.Style, Children = ref.Children;

SceneView = require("navi").SceneView;

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
          return _this.scenes.size > 0;
        };
      })(this),
      get: (function(_this) {
        return function() {
          var progress;
          progress = _this.scenes.last().getProgress();
          return clampValue(progress, 0, 1);
        };
      })(this),
      didSet: (function(_this) {
        return function(progress) {
          var previous, progressAbove, progressBelow, sceneAbove;
          progressAbove = (progress - 0.5) / 0.5;
          sceneAbove = _this.scenes.last();
          sceneAbove.onProgress(clampValue(progressAbove, 0, 1));
          previous = _this.scenes.get(_this.scenes.size - 2);
          if (previous == null) {
            return;
          }
          progressBelow = (0.5 - progress) / 0.5;
          return previous.onProgress(clampValue(progressBelow, 0, 1));
        };
      })(this)
    });
  },
  render: function() {
    var bar, content, scenes;
    log.it("TopBar('" + this.scene.id + "').render()");
    scenes = sync.map(this.state.scenes.toJS(), (function(_this) {
      return function(scene, index) {
        return scene.render({
          key: scene.id,
          scene: scene
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
