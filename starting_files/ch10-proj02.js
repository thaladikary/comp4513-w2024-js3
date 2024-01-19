import { Play, Act, Scene } from "./play-module.js";

document.addEventListener("DOMContentLoaded", function () {
  const LIST_OF_PLAYS = ["Hamlet", "Julius Caesar"];
  const API_URL =
    "https://www.randyconnolly.com//funwebdev/3rd/api/shakespeare/play.php";
  let queryString = "";
  let playData = [];

  /*
     To get a specific play, add play name via query string, 
	   e.g., url = url + '?name=hamlet';
	 
	 https://www.randyconnolly.com/funwebdev/3rd/api/shakespeare/play.php?name=hamlet
	 https://www.randyconnolly.com/funwebdev/3rd/api/shakespeare/play.php?name=jcaesar
     
   */
  let playSelector = document.querySelector("#playList");
  let actSelector = document.querySelector("#actList");
  let sceneSelector = document.querySelector("#sceneList");
  let playerSelector = document.querySelector("#playerList");

  let playHereSection = document.getElementById("playHere");
  // let playHereSection = document.querySelector("#playHere");
  let actHereArticle = document.querySelector("#actHere");
  populatePlaySelector(LIST_OF_PLAYS);
  document.querySelector("#playList").addEventListener("change", (e) => {
    queryString = e.target.value.toLowerCase();
    if (queryString === "julius caesar") {
      queryString = "jcaesar";
    }
    fetchPlay(queryString, API_URL);
  });

  async function fetchPlay(queryString, url) {
    const reponse = await fetch(url + `?name=${queryString}`);
    const jsonResp = await reponse.json();

    populateActSelector(jsonResp, actSelector);
    populatePlayersSelector(jsonResp);
    listenForActChange(jsonResp); //for changing scene options depending on selected act
  }

  async function renderActInformation(data, selectedAct, selectedScene) {
    let newPlay = new Play(data);
    console.log(newPlay);
    // console.log(data);

    playHereSection.replaceChildren();

    //render title here
    let playTitleH2 = document.createElement("h2");
    playTitleH2.appendChild(document.createTextNode(newPlay.title));
    playHereSection.appendChild(playTitleH2);

    let actTitleH3 = document.createElement("h3");
    //sceneSelector.value --> get current scene
    //actSelector.value --> get current act

    let getDataForCurrAct = newPlay.acts.find(
      (act) => act.name === selectedAct
    );

    let getDataForCurrScene = getDataForCurrAct.scenes.find(
      (scene) => scene.name === selectedScene
    );

    //ACT NAME
    actTitleH3.appendChild(document.createTextNode(getDataForCurrAct.name));
    playHereSection.appendChild(actTitleH3);

    //SCENE NAME
    let sceneNameH4 = document.createElement("h4");
    sceneNameH4.appendChild(document.createTextNode(getDataForCurrScene.name));
    playHereSection.appendChild(sceneNameH4);

    //SCENE DIV

    let sceneDiv = document.createElement("div");

    //SCENE TITLE

    let sceneTitleP = document.createElement("p");
    sceneTitleP.appendChild(document.createTextNode(getDataForCurrScene.title));
    sceneTitleP.className = "title";
    sceneDiv.appendChild(sceneTitleP);

    //SCENE DIRECTION
    let sceneDirectionP = document.createElement("p");
    sceneDirectionP.appendChild(
      document.createTextNode(getDataForCurrScene.stageDirection)
    );
    sceneDirectionP.className = "direction";
    sceneDiv.appendChild(sceneDirectionP);

    //SPEECH DIV

    getDataForCurrScene.speeches.forEach((speech) => {
      let speechDiv = document.createElement("div");
      let speakerSpan = document.createElement("span");
      let lineP = document.createElement("p");

      speakerSpan.appendChild(document.createTextNode(speech.speaker));

      lineP.appendChild(document.createTextNode(speech.lines));

      speechDiv.appendChild(speakerSpan);
      speechDiv.appendChild(lineP);
      sceneDiv.appendChild(speechDiv);
    });

    // playHereSection.appendChild(speechDiv);
    playHereSection.appendChild(sceneDiv);

    console.log(getDataForCurrAct);
    console.log(getDataForCurrScene);
  }

  function listenForActChange(data) {
    const selectedScene = sceneSelector.value;
    populateSceneSelector(data, actSelector.value);
    renderActInformation(data, actSelector.value, sceneSelector.value);

    actSelector.addEventListener("change", (e) => {
      const selectedAct = e.target.value;

      populateSceneSelector(data, actSelector.value); //populate the selector
      renderActInformation(data, actSelector.value, sceneSelector.value); //populate the main section with act info
    });
    sceneSelector.addEventListener("change", (e) => {
      const selectedScene = e.target.value;
      renderActInformation(data, actSelector.value, sceneSelector.value);
    });
  }

  //to populate the act selector options
  function populateActSelector(data, actSelector) {
    removeChildren(actSelector);
    for (const act of data.acts) {
      const option = document.createElement("option");
      option.value = act.name;
      option.textContent = act.name;
      actSelector.appendChild(option);
    }
  }

  //populate scene selector based on what act is currently selected

  function populateSceneSelector(data, selectedAct) {
    removeChildren(sceneSelector);

    //  saech for the currently selected act in the list of acts
    const sceneDataForSelectedAct = data.acts.find(
      (act) => act.name === selectedAct
    );
    for (const scene of sceneDataForSelectedAct.scenes) {
      //create scene option element for each scene in list
      const option = document.createElement("option");
      option.value = scene.name;
      option.textContent = scene.name;
      sceneSelector.appendChild(option);
    }
  }

  function populatePlayersSelector(data) {
    removeChildren(playerSelector);
    for (const player of data.persona) {
      const option = document.createElement("option");
      option.value = player.player;
      option.textContent = player.player;
      playerSelector.appendChild(option);
    }
  }

  function removeChildren(element) {
    //removes existing children so items will not stack
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  function populatePlaySelector(listOfPlays) {
    listOfPlays.forEach((play) => {
      let optionNode = document.createElement("option");
      let textNode = document.createTextNode(play);
      textNode.value = play;
      optionNode.appendChild(textNode);
      playSelector.appendChild(optionNode);
    });
  }
});
