/* In this module, create three classes: Play, Act, and Scene. */

class Play {
  constructor(play) {
    this.title = play.title;
    this.acts = [];
    this.persona = [];

    play.acts.forEach((act) => {
      this.acts.push(new Act(act));
    });

    play.persona.forEach((person) => {
      this.persona.push(person);
    });
  }
}

class Act {
  constructor(act) {
    this.name = act.name;
    this.scenes = [];

    act.scenes.forEach((scene) => {
      this.scenes.push(new Scene(scene));
    });
  }
}
class Scene {
  constructor(speeches) {
    this.name = speeches.name;
    this.speeches = [];
    this.title = speeches.title;
    this.stageDirection = speeches.stageDirection;

    speeches.speeches.forEach((speech) => {
      this.speeches.push(speech);
    });
  }
}

export { Play, Act, Scene };
