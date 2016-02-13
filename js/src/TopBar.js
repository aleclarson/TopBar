var Factory, Scene, SceneList, ref;

ref = require("navi"), Scene = ref.Scene, SceneList = ref.SceneList;

Factory = require("factory");

module.exports = Factory("TopBar", {
  kind: Scene,
  optionDefaults: {
    level: 400
  },
  create: function(options) {
    options.id = "TopBar:" + options.id;
    return Scene(options);
  },
  customValues: {
    scenes: {
      get: function() {
        return this._list._scenes;
      }
    },
    sceneIds: {
      get: function() {
        return this.scenes.toJS().map(function(scene) {
          return scene.id;
        });
      }
    }
  },
  initReactiveValues: function() {
    return {
      _list: SceneList()
    };
  },
  initFrozenValues: function(options) {
    return {
      contentsOpacity: NativeValue(1)
    };
  },
  push: function(scene, makeActive) {
    return this._list.push(scene, makeActive);
  },
  pop: function() {
    return this._list.pop();
  },
  remove: function(scene) {
    return this._list.remove(scene);
  },
  getSceneView: function() {
    throw Error("Subclass must override!");
  }
});

//# sourceMappingURL=../../map/src/TopBar.map
