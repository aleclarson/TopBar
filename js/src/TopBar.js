var Factory, Scene, SceneList, inArray, ref;

ref = require("navi"), Scene = ref.Scene, SceneList = ref.SceneList;

inArray = require("in-array");

Factory = require("factory");

module.exports = Factory("TopBar", {
  kind: Scene,
  optionDefaults: {
    level: 400
  },
  customValues: {
    activeScene: {
      get: function() {
        return this._list.activeScene;
      }
    },
    earlierScenes: {
      get: function() {
        return this._list.earlierScenes;
      }
    },
    scenes: {
      get: function() {
        return this._list._scenes;
      }
    },
    sceneNames: {
      get: function() {
        return this.scenes.toJS().map(function(scene) {
          return scene.name;
        });
      }
    }
  },
  initFrozenValues: function(options) {
    return {
      _list: SceneList(),
      contentsOpacity: NativeValue(1)
    };
  },
  push: function(scene, makeActive) {
    var validTopBars;
    validTopBars = [this, null, void 0];
    assert(inArray(validTopBars, scene.topBar), {
      scene: scene,
      reason: "Scene already belongs to another TopBar!"
    });
    scene.topBar = this;
    return this._list.push(scene, makeActive);
  },
  pop: function() {
    if (this.activeScene == null) {
      return;
    }
    if (!this.activeScene.isPermanent) {
      this.activeScene.topBar = null;
    }
    return this._list.pop();
  },
  remove: function(scene) {
    if (scene.topBar !== this) {
      return;
    }
    if (!this.activeScene.isPermanent) {
      scene.topBar = null;
    }
    return this._list.remove(scene);
  }
});

//# sourceMappingURL=../../map/src/TopBar.map
