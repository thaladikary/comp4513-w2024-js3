import { Play } from "./play-module.js";

document.addEventListener("DOMContentLoaded", function () {
  const LIST_OF_PLAYS = ["Hamlet", "Julius Caesar"];
  const API_URL =
    "https://www.randyconnolly.com//funwebdev/3rd/api/shakespeare/play.php";
  let queryString = "";

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
  let playerFilterBtn = document.querySelector("#btnHighlight");

  let playHereSection = document.getElementById("playHere");
  // let playHereSection = document.querySelector("#playHere");

  let playerInputFilter = document.querySelector("#txtHighlight");
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

    //SPEECH DIV

    displaySceneInformation(getDataForCurrScene, sceneDiv);

    // playHereSection.appendChild(speechDiv);
    playHereSection.appendChild(sceneDiv);

    playerSearch(getDataForCurrScene, sceneDiv);
  }

  //display  scene information
  function displaySceneInformation(
    sceneData,
    sceneDiv,
    typedInValue,
    foundPlayerMatches
  ) {
    sceneDiv.replaceChildren();
    //SCENE TITLE
    // console.log(foundPlayerMatches);

    let sceneTitleP = document.createElement("p");
    sceneTitleP.appendChild(document.createTextNode(sceneData.title));
    sceneTitleP.className = "title";
    sceneDiv.appendChild(sceneTitleP);

    //SCENE DIRECTION
    let sceneDirectionP = document.createElement("p");
    sceneDirectionP.appendChild(
      document.createTextNode(sceneData.stageDirection)
    );
    sceneDirectionP.className = "direction";
    sceneDiv.appendChild(sceneDirectionP);

    //for spacing
    let blankP = document.createElement("p");
    sceneDiv.appendChild(blankP);

    //if being called by the filter btn listener

    if (foundPlayerMatches) {
      foundPlayerMatches.forEach((speech) => {
        let speechDiv = document.createElement("div");
        let speakerSpan = document.createElement("span");
        let lineP = document.createElement("p");
        let boldtag = document.createElement("b");

        speakerSpan.appendChild(document.createTextNode(speech.speaker));

        boldtag.appendChild(speakerSpan);
        lineP.appendChild(document.createTextNode(speech.lines));

        speechDiv.className = "speechDiv";

        speechDiv.appendChild(boldtag);
        speechDiv.appendChild(lineP);
        sceneDiv.appendChild(speechDiv);
      });
      highlightWords(typedInValue);
    } else {
      sceneData.speeches.forEach((speech) => {
        let speechDiv = document.createElement("div");
        let speakerSpan = document.createElement("span");
        let lineP = document.createElement("p");
        let boldtag = document.createElement("b");

        speakerSpan.appendChild(document.createTextNode(speech.speaker));

        boldtag.appendChild(speakerSpan);
        lineP.appendChild(document.createTextNode(speech.lines));

        speechDiv.className = "speechDiv";

        speechDiv.appendChild(boldtag);
        speechDiv.appendChild(lineP);
        sceneDiv.appendChild(speechDiv);
      });
    }
  }

  function highlightWords(typedInValue) {
    let div = document.querySelectorAll(".speechDiv p");

    div.forEach((paragraph) => {
      let pText = paragraph.textContent;
      const words = pText.split(" ");
      console.log(words);

      const highlightWords = words.map((word) => {
        if (word.toLowerCase() == typedInValue.toLowerCase()) {
          console.log(word);
          return `<b style="background-color: yellow">${word}</b>`;
        } else {
          return word;
        }
      });

      const resultingWords = highlightWords.join(" ");

      paragraph.innerHTML = resultingWords;
    });
  }

  function playerSearch(sceneData, sceneDiv) {
    //to clear array when user is trying to serach for another player
    let foundPlayerMatches = [];

    let foundWordMatches = [];
    playerSelector.addEventListener("click", () => {
      foundPlayerMatches = [];
    });

    playerFilterBtn.addEventListener("click", () => {
      foundPlayerMatches = [];
      foundWordMatches = [];
      sceneData.speeches.forEach((speech) => {
        if (speech.speaker === playerSelector.value) {
          foundPlayerMatches.push(speech);
        }
      });
      let typedInValue = playerInputFilter.value.toLowerCase();

      displaySceneInformation(
        sceneData,
        sceneDiv,
        typedInValue,
        foundPlayerMatches
      );
    });
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
