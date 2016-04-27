var Children, Component, Immutable, LayeredChildren, SceneView, Shape, StaticRenderer, Style, TopBar, View, clampValue, ref;

ref = require("component"), Component = ref.Component, Style = ref.Style, Children = ref.Children, View = ref.View, StaticRenderer = ref.StaticRenderer;

SceneView = require("navi").SceneView;

Shape = require("type-utils").Shape;

Immutable = require("immutable");

clampValue = require("clampValue");

TopBar = require("./TopBar");

LayeredChildren = Shape("LayeredChildren", {
  above: Children,
  below: Children
});

module.exports = Component("TopBarView", {
  propTypes: {
    scene: TopBar.Kind,
    style: Style,
    children: LayeredChildren,
    contentStyle: Style
  },
  customValues: {
    scene: {
      get: function() {
        return this.props.scene;
      }
    }
  },
  initValues: function() {
    return {
      scenes: Reaction.sync((function(_this) {
        return function() {
          return _this.scene.scenes;
        };
      })(this)),
      progress: Reaction.sync({
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
      })
    };
  },
  initListeners: function() {
    return this.scenes.didSet((function(_this) {
      return function() {
        return _this.forceUpdate();
      };
    })(this));
  },
  componentDidMount: function() {
    return this.scene.view = this;
  },
  componentWillMount: function() {
    return this.scene.view = null;
  },
  render: function() {
    var bar, content, ref1, ref2, scenes;
    scenes = [];
    this.scenes.value.forEach((function(_this) {
      return function(scene, index) {
        if (scene._element == null) {
          scene._element = scene.render({
            key: scene.__id
          });
        }
        return scenes.push(scene._element);
      };
    })(this));
    content = View({
      style: [_.Style.Cover, this.props.contentStyle],
      children: scenes
    });
    bar = View({
      style: this.props.style,
      children: content
    });
    return SceneView({
      scene: this.scene,
      children: [(ref1 = this.props.children) != null ? ref1.below : void 0, bar, (ref2 = this.props.children) != null ? ref2.above : void 0]
    });
  }
});

//# sourceMappingURL=../../map/src/TopBarView.map
