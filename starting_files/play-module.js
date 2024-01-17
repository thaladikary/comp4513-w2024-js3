/* In this module, create three classes: Play, Act, and Scene. */

class Play {
  constructor() {
    this.acts = [];
  }

  addAct() {
    const newAct = new Act();
    this.acts.push(newAct);
  }

  getActs() {
    return this.acts;
  }
}

class Act {
  constructor() {
    this.scenes = [];
  }
  addScene() {
    const scene = new Scene();
    this.scenes.push(scene);
  }

  getScenes() {
    return this.scenes;
  }

  renderScenes() {}
}

class Scene {
  constructor(speeches) {
    this.speeches = speeches;
  }

  getSpeeches() {
    return this.speeches;
  }
}

export { Play, Act, Scene };
